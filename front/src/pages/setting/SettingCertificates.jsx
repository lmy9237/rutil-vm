import React, { useCallback } from "react";
import toast from "react-hot-toast";
import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";
import useSearch from "../../hooks/useSearch";
import SearchBox from "../../components/button/SearchBox"; // ✅ 검색창 추가
import SelectedIdView from "../../components/common/SelectedIdView";
import TablesOuter from "../../components/table/TablesOuter";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import SettingCertificatesRenewalPolicies from "./SettingCertificatesRenewalPolicies";
import { useAllCerts } from "../../api/RQHook";
import Logger from "../../utils/Logger";
import Localization from "../../utils/Localization";


/**
 * @name SettingCertificates
 * @description 관리 > 인증서
 *
 * @returns {JSX.Element} SettingCertificates
 */
const SettingCertificates = () => {
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
  } = useAllCerts((e) => ({
      ...e,
  }));

  const transformedData = [...certs].map((e) => ({
    ...e,
    notAfter: e.notAfter ?? Localization.kr.NOT_ASSOCIATED,
    dday: (e.daysRemaining > 0) ? `${e.daysRemaining} 일 남음` : Localization.kr.NOT_ASSOCIATED
  }))
  
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  const handleRefresh = useCallback(() => {
    Logger.debug(`VmDupl > handleRefresh ... `)
    if (!refetchCerts) return;
    refetchCerts()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        {/* <SettingUserSessionsActionButtons /> */}
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
      <SettingCertificatesRenewalPolicies />
    </>
  );
}

export default SettingCertificates