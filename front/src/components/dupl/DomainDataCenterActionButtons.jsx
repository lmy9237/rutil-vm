import React, { useMemo } from "react";
import ActionButtonGroup from "../button/ActionButtonGroup";
import useGlobal from "../../hooks/useGlobal";
import useUIState from "../../hooks/useUIState";

const DomainDataCenterActionButtons = ({
  actionType = "default",
}) => {
  // 데이터센터-도메인: 연결(도메인), 분리, 활성, 유지보수
  // 도메인-데이터센터: 연결(데이터센터), 분리, 활성, 유지보수
  const { setActiveModal } = useUIState();
  const { domainsSelected } = useGlobal()

  const domain1st = useMemo(() => [...domainsSelected][0], [domainsSelected])

  const isActive = domain1st?.status === "ACTIVE";
  const isMaintenance = domain1st?.status === "MAINTENANCE";
  const isLocked = domain1st?.status === "LOCKED";

  const basicActions = [
    { type: "attach", onBtnClick: () => setActiveModal("domain:attach"), label: "연결", }, // 연결 disabled 조건 구하기 disabled: domainsSelected.length === 0 데이터센터가 없을때
    { type: "detach", onBtnClick: () => setActiveModal("domain:detach"), label: "분리", disabled: domainsSelected.length === 0 || isLocked || isActive, },
    { type: "activate", onBtnClick: () => setActiveModal("domain:activate"), label: "활성", disabled: domainsSelected.length === 0 || isLocked || isActive, },
    { type: "maintenance", onBtnClick: () => setActiveModal("domain:maintenance"), label: "유지보수", disabled: domainsSelected.length === 0 || isLocked || isMaintenance, },
  ];
 
  return (
    <>
      <ActionButtonGroup
        actionType={actionType}
        actions={basicActions}
      >
      </ActionButtonGroup>
   </>
  );
};

export default DomainDataCenterActionButtons;
