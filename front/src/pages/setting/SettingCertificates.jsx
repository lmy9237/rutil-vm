import { useState } from "react"
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import TablesOuter from "../../components/table/TablesOuter";
import { useAllCerts } from "../../api/RQHook";
import SettingCertificatesRenewalPolicies from "./SettingCertificatesRenewalPolicies";
/**
 * @name SettingCertificates
 * @description 관리 > 인증서
 *
 * @returns {JSX.Element} SettingCertificates
 */
const SettingCertificates = () => {
  const [selectedCerts, setSelectedCerts] = useState([]);
  const selectedCertIds = (Array.isArray(selectedCerts) ? selectedCerts : [])
    .map((userSession) => userSession.id)
    .join(", ");
    
    const {
      data: certs = [],
      isLoading: isCertsLoading,
      isError: isCertsError,
      isSuccess: isCertsSuccess,
      refetch: refetchCerts
    } = useAllCerts((e) => {
      console.log(`SettingCertificates ... ${JSON.stringify(e)}`);
      return {
        ...e,
        notAfter: e.notAfter ?? 'N/A',
        dday: (e.daysRemaining > 0) ? `${e.daysRemaining} 일 남음` : 'N/A'
      };
    });

    console.log("...");
    return (
      <>
        {/* <SettingUserSessionsActionButtons
          openModal={openModal}
          isEditDisabled={setSelectedCerts.length !== 1}
          status={status}
        /> */}
        <span>ID = {selectedCerts?.id || ""}</span>
        <TablesOuter
          isLoading={isCertsLoading}
          isError={isCertsError}
          isSuccess={isCertsSuccess}
          columns={TableColumnsInfo.SETTING_CERTIFICATES}
          data={certs}
          onRowClick={(row) => {
            console.log(
              `SettingCertificates > onRowClick ... row: ${JSON.stringify(row)}`
            );
            setSelectedCerts(row);
          }}
          showSearchBox={true} // 검색 박스 표시 여부 제어
        />
  
        {/* 모달창 renderModals() */}
        <br/>
        <SettingCertificatesRenewalPolicies />
      </>
    );
}

export default SettingCertificates