import SelectedIdView from "../../components/common/SelectedIdView";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import TablesOuter from "../../components/table/TablesOuter";
import { useAllCerts } from "../../api/RQHook";
import SettingCertificatesRenewalPolicies from "./SettingCertificatesRenewalPolicies";
import Logger from "../../utils/Logger";
import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";

/**
 * @name SettingCertificates
 * @description 관리 > 인증서
 *
 * @returns {JSX.Element} SettingCertificates
 */
const SettingCertificates = () => {
  const { activeModal, setActiveModal } = useUIState();
  const { certsSelected, setCertsSelected } = useGlobal();
    
  const {
    data: certs = [],
    isLoading: isCertsLoading,
    isError: isCertsError,
    isSuccess: isCertsSuccess,
    refetch: refetchCerts
  } = useAllCerts((e) => ({
      ...e,
  }));

  const transformedData = [...certs].map((e) => ({
    ...e,
    notAfter: e.notAfter ?? 'N/A',
    dday: (e.daysRemaining > 0) ? `${e.daysRemaining} 일 남음` : 'N/A'
  }))

  Logger.debug("SettingCertificates ...");
  return (
    <>
      {/* <SettingUserSessionsActionButtons
        isEditDisabled={certsSelected.length !== 1}
        status={status}
      /> */}
      <TablesOuter
        isLoading={isCertsLoading}
        isError={isCertsError}
        isSuccess={isCertsSuccess}
        columns={TableColumnsInfo.SETTING_CERTIFICATES}
        data={transformedData}
        onRowClick={(row) => setCertsSelected(row)}
        showSearchBox={true} // 검색 박스 표시 여부 제어
      />
      <SelectedIdView items={certsSelected} />

      {/* 모달창 renderModals() */}
      <br/>
      <SettingCertificatesRenewalPolicies />
    </>
  );
}

export default SettingCertificates