import React from "react";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import { useAllProviders } from "@/api/RQHook";
import Logger                 from "@/utils/Logger";
import SettingProvidersActionButtons from "@/components/dupl/SettingProvidersActionButtons";

/**
 * @name SettingProviders
 * @description 관리 > 공급자
 * 
 * @returns 
 */
const SettingProviders = () => {
  const {
    providersSelected, setProvidersSelected
  } = useGlobal();
  
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
    name: e?.name,
    description: e?.description,
    type: e?.providerType,
    providerUrl: e?.url
  }))

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData, TableColumnsInfo.PROVIDER);

  return (
    <>
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchProviders} />
        <SettingProvidersActionButtons />
      </div>
      <TablesOuter target={"provider"}
        columns={TableColumnsInfo.PROVIDER}
        data={transformedData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
        multiSelect={true}
        /*shouldHighlight1stCol={true}*/
        onRowClick={(selectedRows) => {setProvidersSelected(selectedRows)}}
        isLoading={isProvidersLoading} isRefetching={isProvidersRefetching} isError={isProvidersError} isSuccess={isProvidersSuccess}
      />
      <SelectedIdView items={providersSelected} />
    </>
  );
};
  
export default SettingProviders;
