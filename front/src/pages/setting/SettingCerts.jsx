import React, { useCallback } from "react";
import useUIState                         from "@/hooks/useUIState";
import useGlobal                          from "@/hooks/useGlobal";
import useSearch                          from "@/hooks/useSearch";
import SelectedIdView                     from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink             from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                          from "@/components/button/SearchBox";
import TablesOuter                        from "@/components/table/TablesOuter";
import TableRowClick                      from "@/components/table/TableRowClick";
import TableColumnsInfo                   from "@/components/table/TableColumnsInfo";
import SettingCertActionButtons           from "@/components/dupl/SettingCertActionButtons";
import SettingCertRenewalPolicies from "./SettingCertRenewalPolicies";
import {
  useAllCerts
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";


/**
 * @name SettingCerts
 * @description 관리 > 인증서
 *
 * @returns {JSX.Element} SettingCerts
 */
const SettingCerts = () => {
  const { activeModal, setActiveModal } = useUIState();
  const {
    certsSelected, setCertsSelected
  } = useGlobal();
    
  const {
    data: certs = [],
    isLoading: isCertsLoading,
    isError: isCertsError,
    isSuccess: isCertsSuccess,
    refetch: refetchCerts,
    isRefetching: isCertsRefetching,
  } = useAllCerts((e) => ({ ...e, }));

  const transformedData = [...certs].map((e) => ({
    ...e,
    notAfter: e.notAfter ?? Localization.kr.NOT_ASSOCIATED,
    dday: (e.daysRemaining > 0) ? `${e.daysRemaining} 일 남음` : Localization.kr.NOT_ASSOCIATED
  }))
  
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchCerts} />
        <SettingCertActionButtons />
      </div>
      <TablesOuter target={"cert"}
        columns={TableColumnsInfo.SETTING_CERTIFICATES}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        data={filteredData}
        onRowClick={(row) => setCertsSelected(row)}
        /*onClickableColumnClick={(row) => handleNameClick(row.id)}*/
        isLoading={isCertsLoading} isRefetching={isCertsRefetching} isError={isCertsError} isSuccess={isCertsSuccess}
      />
      <SelectedIdView items={certsSelected} />
      <br/>
      <SettingCertRenewalPolicies />
    </>
  );
}

export default SettingCerts