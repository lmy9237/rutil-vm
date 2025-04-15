import React, { useState } from "react";
import ActionButtonGroup from "../button/ActionButtonGroup";
import { rvi16ChevronDown, rvi16ChevronUp } from "../icons/RutilVmIcons";
import ActionButton from "../button/ActionButton";
import Localization from "../../utils/Localization";
import useUIState from "../../hooks/useUIState";
import Logger from "../../utils/Logger";
import useGlobal from "../../hooks/useGlobal";

const HostActionButtons = ({
  actionType = "default",
  status,
}) => {
  const { setActiveModal, setContextMenu } = useUIState()
  const { hostsSelected, setHostSelected } = useGlobal()
  const isContextMenu = actionType === "context";

  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = () => setActiveDropdown((prev) => (prev ? null : "manage"));

  const isUp = status === "UP";
  const nonOperational = status === "NON_OPERATIONAL";
  const isMaintenance = status === "MAINTENANCE";

  const basicActions = [
    { type: "create", onBtnClick: () => setActiveModal("host:create"), label: Localization.kr.CREATE, disabled: hostsSelected.length > 0, },
    { type: "update", onBtnClick: () => setActiveModal("host:update"), label: Localization.kr.UPDATE, disabled: hostsSelected.length !== 1, },
    { type: "remove", onBtnClick: () => setActiveModal("host:remove"), label: Localization.kr.REMOVE, disabled: hostsSelected.length === 0 || !isMaintenance, },
  ];

  const manageActions = [
    { type: "deactivate", onBtnClick: () => setActiveModal("host:deactivate"), label: "유지보수", disabled: !isUp },
    { type: "activate", onBtnClick: () => setActiveModal("host:activate"), label: "활성", disabled: hostsSelected.length === 0 || !isMaintenance || isUp },
    { type: "restart", onBtnClick: () => setActiveModal("host:restart"), label: "재시작", disabled: hostsSelected.length === 0 || isUp },
    { type: "refresh", onBtnClick: () => setActiveModal("host:refresh"), label: "기능을 새로고침", disabled: hostsSelected.length === 0 || !isUp },
    { type: "commitNetHost", onBtnClick: () => setActiveModal("host:commitNetHost"), label: "호스트 재부팅 확인", disabled: hostsSelected.length === 0 || isUp },
    { type: "enrollCert", onBtnClick: () => setActiveModal("host:enrollCert"), label: "인증서 등록", disabled: hostsSelected.length === 0 },
    { type: "haOn", onBtnClick: () => setActiveModal("host:haOn"), label: "글로벌 HA 유지 관리를 활성화", disabled: hostsSelected.length === 0 || !isUp || !isMaintenance, },
    { type: "haOff", onBtnClick: () => setActiveModal("host:haOff"), label: "글로벌 HA 유지 관리를 비활성화", disabled: hostsSelected.length === 0 || !isUp },
  ];

  Logger.debug(`HostActionButtons ... `)
  return (
    <ActionButtonGroup
      actionType={actionType}
      actions={basicActions}
    >
      {isContextMenu ? (
        manageActions.map(({ type, label, disabled }) => (
          <button
            key={type}
            disabled={disabled}
            onClick={() => setContextMenu(type)}
            className="btn-right-click dropdown-item"
          >
            {label}
          </button>
        ))
      ) : (
        <div className="dropdown-container">
          <ActionButton
            iconDef={activeDropdown ? rvi16ChevronUp : rvi16ChevronDown}
            label={Localization.kr.MANAGEMENT}
            onClick={toggleDropdown}
          />
          {activeDropdown && (
            <div className="right-click-menu-box context-menu-item dropdown-menu">
              {manageActions.map(({ type, label, disabled }) => (
                <button
                  key={type}
                  disabled={disabled}
                  onClick={() => setContextMenu(type)}
                  className="btn-right-click dropdown-item"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </ActionButtonGroup>
  );
  
};

export default HostActionButtons;
