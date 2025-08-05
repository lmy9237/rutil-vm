import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useGlobal                        from "@/hooks/useGlobal";
import useSearch                        from "@/hooks/useSearch";
import { LoadingFetch }                 from "@/components/common/Loading";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                        from "@/components/button/SearchBox";
import TableRowClick                    from "@/components/table/TableRowClick";
import TablesOuter                      from "@/components/table/TablesOuter";
import TableColumnsInfo                 from "@/components/table/TableColumnsInfo";
import SettingProvidersActionButtons    from "@/components/dupl/SettingProvidersActionButtons";
import {
  useAllProviders
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

/**
 * @name SettingProviders
 * @description 관리 > 공급자
 * 
 * @returns 
 */
const SettingProviders = () => {
  const {providersSelected, setProvidersSelected} = useGlobal();
  const navigate = useNavigate();
  const handleNameClick = useCallback((id) => {
    navigate(`/settings/provider/${id}`);
  }, [navigate])
  
  const { 
    data: providers = [],
    isLoading: isProvidersLoading, 
    isError: isProvidersError,
    isSuccess: isProvidersSuccess,
    refetch: refetchProviders,
    isRefetching: isProvidersRefetching,
  } = useAllProviders((e) => ({ ...e  }));
  
  const transformedData = [...providers].map((e) => ({
    ...e,
    _name: (
      <TableRowClick type="provider" id={e?.id}>
        {e?.name}
      </TableRowClick>
    ),
    description: e?.description,
    type: e?.providerType,
    providerUrl: e?.url
  }))

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
          isLoading={isProvidersLoading} isRefetching={isProvidersRefetching} refetch={refetchProviders}
        />
        <LoadingFetch isLoading={isProvidersLoading} isRefetching={isProvidersRefetching} />
        <SettingProvidersActionButtons />
      </div>
      <TablesOuter target={"provider"}
        columns={TableColumnsInfo.PROVIDER}
        data={transformedData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
        /*shouldHighlight1stCol={true}*/
        onRowClick={(selectedRows) => {setProvidersSelected(selectedRows)}}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isProvidersLoading} isRefetching={isProvidersRefetching} isError={isProvidersError} isSuccess={isProvidersSuccess}
      />
      <SelectedIdView items={providersSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.MANAGEMENT}>${Localization.kr.PROVIDER}`}
        path={`providers`}
      />
    </>
  );
};
  
export default SettingProviders;
