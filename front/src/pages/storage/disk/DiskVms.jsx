import React from "react";
import { useAllVmsFromDisk } from "../../../api/RQHook";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import TablesOuter from "../../../components/table/TablesOuter";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";

/**
 * @name DiskVms
 * @description 디스크에 종속 된 가상머신 목록
 * (/storages/disks/<diskId>/vms)
 *
 * @param {string} diskId 디스크ID
 * @returns
 */
const DiskVms = ({ diskId }) => {
  const { 
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
  } = useAllVmsFromDisk(diskId, (e) => ({ 
    ...e
  }));

  const transformedData = vms.map((vm) => ({
    ...vm,
    icon: status2Icon(vm?.status),
    _name: (
      <TableRowClick type="vm" id={vm?.id}>
        {vm?.name}
      </TableRowClick>
    ),
    host: (
      <TableRowClick type="host" id={vm?.hostVo?.id}>
        {vm?.hostVo?.name}
      </TableRowClick>
    ),
    ipv4: vm?.ipv4 + " " + vm?.ipv6,
  }));

  Logger.debug("...")
  return (
    <>
      <TablesOuter
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
        columns={TableColumnsInfo.VMS_FROM_DISK}
        data={transformedData} // ✅ 검색 필터링된 데이터 사용
        shouldHighlight1stCol={true}
      />
    </>
  );
};

export default DiskVms;
