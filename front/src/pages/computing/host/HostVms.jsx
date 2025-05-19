import React from "react";
import useGlobal from "../../../hooks/useGlobal";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VmDupl from "../../../components/dupl/VmDupl";
import { useVmsFromHost } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name HostVms
 * @description 호스트에 종속 된 가상머신 목록
 * (/computing/hosts/<hostId>/vms)
 *
 * @param {string} hostId 호스트 ID
 * @returns
 */
const HostVms = ({
  hostId
}) => {
  const { hostsSelected } = useGlobal()
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    refetch: refetchVms,
  } = useVmsFromHost(hostId, (e) => ({ ...e }));

  return (
    <>
      <VmDupl columns={TableColumnsInfo.VMS_FROM_HOST}
        vms={vms}
        refetch={refetchVms}
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
      />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.HOST}>${hostsSelected[0]?.name}`}
        path={`hosts-virtual_machines;name=${hostsSelected[0]?.name}`} 
      />
    </>
  );
};

export default HostVms;
