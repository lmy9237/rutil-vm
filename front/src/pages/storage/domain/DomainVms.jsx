import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import {
  useAllVMsFromDomain
} from "@/api/RQHook";
import { checkZeroSizeToGiB } from "@/util";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import { status2Icon } from "@/components/icons/RutilVmIcons";

/**
 * @name DomainVms
 * @description 도메인에 종속 된 VM정보
 * /storages/domains/<DOMAIN_ID>/vms
 * 
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainVms
 * 
 * @see DomainGetVms
 */
const DomainVms = ({ domainId }) => {
  const navigate = useNavigate();
  const {
    vmsSelected, setVmsSelected,
    domainsSelected,
  } = useGlobal()

  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    refetch: refetchVms,
    isRetching, isVmsRefetching,
  } = useAllVMsFromDomain(domainId ?? domainsSelected[0]?.id, (e) => ({ ...e, }));

  const transformedData = useMemo(() => [...vms].map((vm) => ({
    _name: (
      <TableRowClick type="vm" id={vm?.id}>
        {vm?.name}
      </TableRowClick>
    ),
    virtualSize: checkZeroSizeToGiB(vm?.memoryGuaranteed),
    actualSize: checkZeroSizeToGiB(vm?.memorySize),
    disk: (
      <span 
        onClick={() => navigate(`/computing/vms/${vm?.id}/disks`)} 
        style={{ color: 'rgb(9, 83, 153)' }}
      > {vm?.diskAttachmentVos?.length} 
      </span>
    ),
    snapshot: (
      <span 
        onClick={() => navigate(`/computing/vms/${vm?.id}/snapshots`)} 
        style={{ color: 'rgb(9, 83, 153)' }}
      > {vm?.snapshotVos?.length} 
      </span>
    ),
    creationTime: vm?.creationTime,
    icon: (
      <div className="f-center" style={{ gap: "4px" }}>
        {status2Icon(vm?.status)}
        {/* {vm?.isInitialized === true ? "" : "VW"} */}
        {vm?.nextRun === true && status2Icon("NEXT_RUN")}
        {vm?.runOnce === true && vm?.status==="up" ? "Run" : ""}
        {(vm?.statusDetail === "noerr" || vm?.statusDetail === "none") ? "" : vm?.statusDetail}
      </div>
    ),
  })), [vms]);

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={isVmsRefetching} />
      {/* <EventActionButtons /> */}
      <TablesOuter target={"vm"} 
        columns={TableColumnsInfo.VMS_FROM_STORAGE_DOMAIN}
        data={filteredData}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        multiSelect={true}
        onRowClick={(selectedRows) => {setVmsSelected(selectedRows)}}
        refetch={refetchVms} isRefetching={isVmsRefetching}
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
      />
      <SelectedIdView items={vmsSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.DOMAIN}>${Localization.kr.DOMAIN}>${domainsSelected[0]?.name}`}
        path={`storage-virtual_machines;name=${domainsSelected[0]?.name}`}
      />
    </>
  );
};

export default DomainVms;
