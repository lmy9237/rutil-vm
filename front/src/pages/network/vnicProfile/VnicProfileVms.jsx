import { useCallback } from "react";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import {
  useAllVmsFromVnicProfiles
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";

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
  const {
    vnicProfilesSelected,
    datacentersSelected,
    networksSelected,
    vmsSelected, setVmsSelected,
  } = useGlobal()
  const {
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    data: vms = [],
    refetch: refetchVms,
    isRefetching: isVmsRefetching,
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

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchVms} />
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
        isLoading={isVmsLoading} isRefetching={isVmsRefetching} isError={isVmsError} isSuccess={isVmsSuccess}
      />
      <SelectedIdView items={vmsSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.NETWORK}>${Localization.kr.VNIC_PROFILE}>${vnicProfilesSelected[0]?.name}`}
        path={`vnicProfiles-virtual_machines;name=${vnicProfilesSelected[0]?.name};dataCenter=${datacentersSelected[0]?.name};network=${networksSelected[0]?.name}`}
      />
    </>
  );
};

export default VnicProfileVms;
