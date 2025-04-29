import { useCallback } from "react";
import toast from "react-hot-toast";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import SelectedIdView from "../../../components/common/SelectedIdView";
import SearchBox from "../../../components/button/SearchBox";
import { useAllVmsFromVnicProfiles } from "../../../api/RQHook";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import Logger from "../../../utils/Logger";

/**
 * @name VnicProfileVms
 * @description vNic프로필에 종속 된 가상머신 목록
 *
 * @prop {string} vnicProfileId vNic프로필 ID
 * @returns {JSX.Element} VnicProfileVms
 */
const VnicProfileVms = ({
  vnicProfileId
}) => {
  const { vmsSelected, setVmsSelected } = useGlobal()
  const {
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    data: vms = [],
    refetch: refetchVms,
  } = useAllVmsFromVnicProfiles(vnicProfileId, (e) => ({ ...e }));

  const transformedData = vms.map((vm) => ({
    ...vm,
    _name: (
      <TableRowClick type="vm" id={vm?.id}>
        {vm?.name}
      </TableRowClick>
    ),
  }))

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  const handleRefresh = useCallback(() =>  {
    Logger.debug(`VnicProfileVms > handleRefresh ... `)
    if (!refetchVms) return;
    refetchVms()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        {/*  */}
      </div>
      <TablesOuter target={"vm"}
        columns={TableColumnsInfo.VMS_FROM_VNIC_PROFILE}
        data={filteredData} // ✅ 검색 필터링된 데이터 사용
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        multiSelect={true}
        onRowClick={(selectedRows) => setVmsSelected(selectedRows)}
        shouldHighlight1stCol={true}
        refetch={refetchVms}
        isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
      />
      <SelectedIdView items={vmsSelected} />
    </>
  );
};

export default VnicProfileVms;
