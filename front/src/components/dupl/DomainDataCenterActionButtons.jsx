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
  const { datacentersSelected } = useGlobal()

  const selected1st = [...datacentersSelected][0] ?? null

  const isActive = selected1st?.domainStatus === "active";
  const isNoneOperation = selected1st?.domainStatus === "not_operational";
  const isMaintenance = selected1st?.domainStatus === "maintenance";
  const isPreparingForMaintenance = selected1st?.domainStatus === "preparing_for_maintenance";
  const isLocked = selected1st?.domainStatus === "locked";
  const isUnattached = selected1st?.domainStatus === "unattached";

  const basicActions = [
    { type: "attach",      onClick: () => setActiveModal("domaindatacenter:attach"),      label: Localization.kr.ATTACH,      disabled: !isUnattached }, // 연결 disabled 조건 구하기 disabled: domainsSelected.length === 0 데이터센터가 없을때
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
