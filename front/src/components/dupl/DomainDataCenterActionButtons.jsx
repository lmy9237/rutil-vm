import React from "react";
import ActionButtonGroup from "../button/ActionButtonGroup";

const DomainDataCenterActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  status,
  isContextMenu = false,
  actionType = "default",
}) => {
  // 데이터센터-도메인: 연결(도메인), 분리, 활성, 유지보수
  // 도메인-데이터센터: 연결(데이터센터), 분리, 활성, 유지보수

  const isUp = status === "UP";
  const isActive = status === "ACTIVE";
  const isMaintenance = status === "MAINTENANCE";

  const basicActions = [
    { type: "attach", label: "연결", disabled: isUp, onBtnClick: () => openModal("attach") }, // 연결 disabled 조건 구하기
    { type: "detach", label: "분리", disabled: isEditDisabled || isActive, onBtnClick: () => openModal("detach") },
    { type: "activate", label: "활성", disabled: isDeleteDisabled || isActive, onBtnClick: () => openModal("activate") },
    { type: "maintenance", label: "유지보수", disabled: isDeleteDisabled || isMaintenance, onBtnClick: () => openModal("maintenance") },
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
