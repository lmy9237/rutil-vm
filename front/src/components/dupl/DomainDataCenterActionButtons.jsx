import React, { useMemo } from "react";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import { ActionButtons } from "@/components/button/ActionButtons";
import Localization from "@/utils/Localization";
import { useAllDataCentersFromDomain } from "@/api/RQHook";

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
  const { domainsSelected } = useGlobal()

  const selected1st = useMemo(() => [...domainsSelected][0] ?? null, [domainsSelected])

  const {data: datacenters = []} = useAllDataCentersFromDomain(selected1st?.id, (e) => ({ ...e }));

  const isActive = selected1st?.status === "ACTIVE";
  const isMaintenance = selected1st?.status === "MAINTENANCE";
  const isLocked = selected1st?.status === "LOCKED";
  const isUNATTACHED = selected1st?.status === "UNATTACHED";

  const basicActions = [
    { type: "attach",      onClick: () => setActiveModal("domain:attach"), label: Localization.kr.ATTACH, disabled: !isUNATTACHED }, // 연결 disabled 조건 구하기 disabled: domainsSelected.length === 0 데이터센터가 없을때
    { type: "detach",      onClick: () => setActiveModal("domain:detach"), label: Localization.kr.DETACH, disabled: domainsSelected.length === 0 || isLocked || isActive || !isMaintenance, },
    { type: "activate",    onClick: () => setActiveModal("domain:activate"), label: Localization.kr.ACTIVATE, disabled: domainsSelected.length === 0 || isLocked || isActive || !isMaintenance, },
    { type: "maintenance", onClick: () => setActiveModal("domain:maintenance"), label: Localization.kr.MAINTENANCE, disabled: domainsSelected.length === 0 || isLocked || isMaintenance, },
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
