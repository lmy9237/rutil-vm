import { useState } from "react"
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import TablesOuter from "../../components/table/TablesOuter";
import { useAllCerts } from "../../api/RQHook";
import SettingCertificatesRenewalPolicies from "./SettingCertificatesRenewalPolicies";
import Logger from "../../utils/Logger";
import SelectedIdView from "../../components/common/SelectedIdView";

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
    } = useAllCerts((e) => ({
        ...e,
    }));

    const transformedData = (!Array.isArray(certs) ? [] : certs).map((e) => ({
      ...e,
      notAfter: e.notAfter ?? 'N/A',
      dday: (e.daysRemaining > 0) ? `${e.daysRemaining} 일 남음` : 'N/A'
    }))

    Logger.debug("SettingCertificates ...");
    return (
      <>
        {/* <SettingUserSessionsActionButtons
          openModal={openModal}
          isEditDisabled={setSelectedCerts.length !== 1}
          status={status}
        /> */}
        <TablesOuter
          isLoading={isCertsLoading}
          isError={isCertsError}
          isSuccess={isCertsSuccess}
          columns={TableColumnsInfo.SETTING_CERTIFICATES}
          data={transformedData}
          onRowClick={(row) => {
            Logger.debug(`SettingCertificates > onRowClick ... row: ${JSON.stringify(row)}`);
            setSelectedCerts(row);
          }}
          showSearchBox={true} // 검색 박스 표시 여부 제어
        />
        <SelectedIdView items={selectedCerts} />
  
        {/* 모달창 renderModals() */}
        <br/>
        <SettingCertificatesRenewalPolicies />
      </>
    );
}

export default SettingCertificates