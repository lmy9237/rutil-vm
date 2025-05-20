import { useCallback } from "react";
import toast from "react-hot-toast";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import SelectedIdView from "../../../components/common/SelectedIdView";
import SearchBox from "../../../components/button/SearchBox";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from "../../../components/table/TablesOuter";
import { useApplicationsFromVM } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name VmApplications
 * @description 가상머신에 종속 된 애플리케이션 정보
 *
 * @prop {string} vmId 가상머신 ID
 * @returns {JSX.Element} VmApplications
 */
const VmApplications = ({
  vmId
}) => {
  const {
    vmsSelected, setVmsSelected, 
    applicationsSelected, setApplicationsSelected
  } = useGlobal()
  const {
    data: applications = [],
    isLoading: isApplicationsLoading,
    isError: isApplicationsError,
    isSuccess: isApplicationsSuccess,
    refetch: refetchApplications,
    isRefetching: isApplicationsRefetching,
  } = useApplicationsFromVM(vmId, (e) => ({ ...e }));

  const transformedData = [...applications]?.map((e) => ({
    ...e
  }))
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  const handleRefresh = useCallback(() => {
    Logger.debug(`VmApplications > handleRefresh ... `)
    if (!refetchApplications) return;
    refetchApplications()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-2 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery}  onRefresh={handleRefresh}/>
        {/* <HostActionButtons actionType = "default"/> */}
      </div>
      <TablesOuter target={"application"}
        columns={TableColumnsInfo.APPLICATIONS_FROM_VM}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        multiSelect={true}
        onRowClick={(selectedRows) => setApplicationsSelected(selectedRows)}
        /* onClickableColumnClick={(row) => handleNameClick(row.id)} */
        isLoading={isApplicationsLoading} isRefetching={isApplicationsRefetching} isError={isApplicationsError} isSuccess={isApplicationsSuccess}
      />
      <SelectedIdView items={applicationsSelected}/>
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.VM}>${vmsSelected[0]?.name}`}
        path={`vms-applications;name=${vmsSelected[0]?.name}`} 
      />
    </>
  );
};

export default VmApplications;
