import React from "react";
import { useNavigate } from "react-router-dom";
import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";
import ActionButtonGroup from "../button/ActionButtonGroup";
import ActionButton from "../button/ActionButton";
import Localization from "../../utils/Localization";
import Logger from "../../utils/Logger";

const DomainActionButtons = ({
  actionType = "default",
  status,
}) => {
  // 도메인 생성, 도메인 가져오기, 도메인 관리(편집), 삭제, connection, lun 새로고침, 파괴, 마스터 스토리지 도메인으로 선택
  const navigate = useNavigate();
  const { setActiveModal } = useUIState();
  const { domainsSelected } = useGlobal()
  const isContextMenu = actionType === "context";

  const isUp = status === "UP";
  const isActive = status === "ACTIVE";
  const isMaintenance = status === "MAINTENANCE";
  const isLocked = status === "LOCKED";
  const isUnknown = status === "UNKNOWN";

  const basicActions = [
    { type: "create", onBtnClick: () => setActiveModal("domain:create"), label: Localization.kr.CREATE, disabled: domainsSelected.length > 0},
    { type: "import", onBtnClick: () => setActiveModal("domain:import"), label: Localization.kr.IMPORT, disabled: domainsSelected.length > 0 || isMaintenance, },
    { type: "update", onBtnClick: () => setActiveModal("domain:update"), label: Localization.kr.UPDATE, disabled: domainsSelected.length !== 1 || isMaintenance, },
    { type: "remove", onBtnClick: () => setActiveModal("domain:remove"), label: Localization.kr.REMOVE, disabled: domainsSelected.length === 0 || isLocked || isMaintenance || !isUnknown,  },
    { type: "destory", onBtnClick: () => setActiveModal("domain:destroy"), label: Localization.kr.DESTROY, disabled: domainsSelected.length === 0 || isLocked || isMaintenance,  },
  ];

  const dcActions = [
    { type: "attach", onBtnClick: () => setActiveModal("domain:attach"), label: "연결", disabled: domainsSelected.length === 0 || isUp, }, // 연결 disabled 조건 구하기
    { type: "detach", onBtnClick: () => setActiveModal("domain:detach"), label: "분리", disabled: domainsSelected.length === 0 || isLocked || isActive, },
    { type: "activate", onBtnClick: () => setActiveModal("domain:activate"), label: "활성", disabled: domainsSelected.length === 0 || isLocked || isActive, },
    { type: "maintenance", onBtnClick: () => setActiveModal("domain:maintenance"), label: "유지보수", disabled: domainsSelected.length === 0 || isLocked || isMaintenance, },
  ];

  Logger.debug(`...`)
  return (
    <>
      <ActionButtonGroup
        actionType={actionType}
        actions={basicActions}
      >
        {!isContextMenu && (
          <ActionButton label={Localization.kr.DISK} onClick={() => navigate("/storages/disks")} actionType={actionType} />
        )}
      </ActionButtonGroup>
   </>
  );
};

export default DomainActionButtons;
