import { useCallback } from "react";
import useGlobal                        from "@/hooks/useGlobal";
import useSearch                        from "@/hooks/useSearch";
import { LoadingFetch }                 from "@/components/common/Loading";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                        from "@/components/button/SearchBox";
import TablesOuter                      from "@/components/table/TablesOuter";
import TableRowClick                    from "@/components/table/TableRowClick";
import TableColumnsInfo                 from "@/components/table/TableColumnsInfo";
import {
  useAllVmsFromVnicProfiles
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

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
  } = useGlobal();

  const {
    data: vms=[],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    refetch: refetchVms,
    isRefetching: isVmsRefetching,
  } = useAllVmsFromVnicProfiles(vnicProfileId, (e) => ({ ...e }));

  const transformedData = [...vms].map((vm) => ({
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
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          isLoading={isVmsLoading} isRefetching={isVmsRefetching} refetch={refetchVms}
        />
        <LoadingFetch isLoading={isVmsLoading} isRefetching={isVmsRefetching} />
      </div>
      <TablesOuter target={"vm"}
        columns={TableColumnsInfo.VMS_FROM_VNIC_PROFILE}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
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
