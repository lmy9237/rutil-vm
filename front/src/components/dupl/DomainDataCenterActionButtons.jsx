import React, { useMemo } from "react";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import { ActionButtons }      from "@/components/button/ActionButtons";
import Localization           from "@/utils/Localization";

/**
 * @name DomainDataCenterActionButtons
 * @description 도메인에 종속 된 데이터센터 관련 액션버튼
 * 
 * @returns {JSX.Element} DomainDataCenterActionButtons
 * 
 * @see ActionButtons
 **/
const DomainDataCenterActionButtons = ({
  actionType="default",
}) => {
  // 데이터센터-도메인: 연결(도메인), 분리, 활성, 유지보수
  // 도메인-데이터센터: 연결(데이터센터), 분리, 활성, 유지보수
  const { setActiveModal } = useUIState();
  const { domainsSelected, datacentersSelected } = useGlobal()
  
  const selectedDomain1st = [...domainsSelected][0] ?? null
  const selectedDc1st = [...datacentersSelected][0] ?? null

  const isActive = (
    selectedDc1st?.domainStatus === "active" || 
    selectedDomain1st?.status === "active"
  );
  const isNoneOperation = (
    selectedDc1st?.domainStatus === "not_operational" ||
    selectedDomain1st?.status === "not_operational"
  );
  const isMaintenance = (
    selectedDc1st?.domainStatus === "maintenance" ||
    selectedDomain1st?.status === "maintenance"
  );
  const isPreparingForMaintenance = (
    selectedDc1st?.domainStatus === "preparing_for_maintenance" ||
    selectedDomain1st?.status === "preparing_for_maintenance"
  );
  const isLocked = (
    selectedDc1st?.domainStatus === "locked" || 
    selectedDomain1st?.status === "locked"
  );
  const isUnattached = (
    /* selectedDc1st?.domainStatus === "unattached" || 
    selectedDc1st?.domainStatus === "unknown" ||
    selectedDomain1st?.status === "unattached" || 
    selectedDomain1st?.status === "unknown"  */
    true
  ); // TODO: 알 수 없는 상태로 돼 있을 떄, 붙이기가 되는지 의문

  const basicActions = [
    { type: "attach",      onClick: () => setActiveModal("domaindatacenter:attach"),      label: Localization.kr.ATTACH,      /* disabled: !isUnattached */ }, // 연결 disabled 조건 구하기 disabled: domainsSelected.length === 0 데이터센터가 없을때
    { type: "detach",      onClick: () => setActiveModal("domaindatacenter:detach"),      label: Localization.kr.DETACH,      disabled: datacentersSelected.length === 0 || isLocked || isActive || !isMaintenance || isPreparingForMaintenance, },
    { type: "activate",    onClick: () => setActiveModal("domaindatacenter:activate"),    label: Localization.kr.ACTIVATE,    disabled: datacentersSelected.length === 0 || isLocked || isActive || (!isMaintenance && !isPreparingForMaintenance), },
    { type: "maintenance", onClick: () => setActiveModal("domaindatacenter:maintenance"), label: Localization.kr.MAINTENANCE, disabled: datacentersSelected.length === 0 || isLocked || isMaintenance || isPreparingForMaintenance, },
  ];
 
  return (
    <>
      <ActionButtons actionType={actionType}
        actions={basicActions}
      />
    </>
  );
};

export default DomainDataCenterActionButtons;
