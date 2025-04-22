import React, { useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import TablesOuter from "../../../components/table/TablesOuter";
import TableRowClick from "../../../components/table/TableRowClick";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import SearchBox from "../../../components/button/SearchBox";
import { useAllVMsFromDomain } from "../../../api/RQHook";
import { checkZeroSizeToGiB } from "../../../util";
import { useNavigate } from "react-router-dom";
import Logger from "../../../utils/Logger";

/**
 * @name DomainVms
 * @description 도메인에 종속 된 VM정보
 * 
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainVms
 * 
 * @see DomainGetVms
 */
const DomainVms = ({ domainId }) => {
  const navigate = useNavigate();
  const { domainsSelected } = useGlobal()

  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    refetch: refetchVms,
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
    creationTime: vm?.creationTime
  })), [vms]);

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  const handleRefresh = useCallback(() =>  {
    Logger.debug(`DomainVms > handleRefresh ... `)
    if (!refetchVms) return;
    refetchVms()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  Logger.debug("DomainVms ...")
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        {/* <EventActionButtons /> */}
      </div>

      <TablesOuter target={"unknown"} 
        columns={TableColumnsInfo.VMS_FROM_STORAGE_DOMAIN}
        data={filteredData}
        multiSelect={true}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        /*onRowClick={(selectedRows) => {setEventsSelected(selectedRows)}}*/
        refetch={refetchVms}
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
      />
    </div>
  );
};

export default DomainVms;
