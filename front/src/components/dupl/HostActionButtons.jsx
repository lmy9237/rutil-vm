import React, { useMemo, useRef, useState } from "react";
import CONSTANT from "@/Constants";
import useUIState from "@/hooks/useUIState";
import useGlobal from "@/hooks/useGlobal";
import useClickOutside from "@/hooks/useClickOutside";
import { ActionButton, ActionButtons } from "@/components/button/ActionButtons";
import { rvi16ChevronDown, rvi16ChevronUp } from "@/components/icons/RutilVmIcons";
import Localization from "@/utils/Localization";
import Logger from "@/utils/Logger";

/**
 * @name HostActionButtons
 * @description 호스트 관련 액션버튼
 * 
 * @returns {JSX.Element} HostActionButtons
 * 
 * @see ActionButtons
 */
const HostActionButtons = ({ 
  actionType="default"
}) => {
  const { setActiveModal } = useUIState()
  const { hostsSelected } = useGlobal()
  const isContextMenu = actionType === "context";

  const activeDropdownRef = useRef()
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = () => setActiveDropdown((prev) => (prev ? null : "manage"));
  useClickOutside(activeDropdownRef, (e) => { setActiveDropdown(null) })

  const selected1st = [...hostsSelected][0] ?? null

  const isUp = selected1st?.status?.toUpperCase() === "UP";
  const isNonOperational = selected1st?.status?.toUpperCase() === "NON_OPERATIONAL";
  const isMaintenance = selected1st?.status?.toUpperCase() === "MAINTENANCE";
  const isInstalling = selected1st?.status?.toUpperCase() === "INSTALLING";
  const isReboot = selected1st?.status?.toUpperCase() === "REBOOT";
  const isGlobalMaintenance = selected1st?.globalMaintenance === true
  const isHostedConfigured = selected1st?.hostedConfigured === true

  const basicActions = useMemo(() => [
    { type: "create",        onClick: () => setActiveModal("host:create"), label: Localization.kr.CREATE, disabled: isContextMenu && hostsSelected.length > 0, },
    { type: "update",        onClick: () => setActiveModal("host:update"), label: Localization.kr.UPDATE, disabled: hostsSelected.length !== 1 || isInstalling || isReboot, },
    { type: "remove",        onClick: () => setActiveModal("host:remove"), label: Localization.kr.REMOVE, disabled: hostsSelected.length === 0 || !isMaintenance || isInstalling },
  ], [actionType, hostsSelected]);

  const manageActions = useMemo(() => [
    { type: "deactivate",    onClick: () => setActiveModal("host:deactivate"),    label: Localization.kr.MAINTENANCE,          disabled: hostsSelected.length === 0 || isInstalling || isMaintenance },
    { type: "activate",      onClick: () => setActiveModal("host:activate"),      label: Localization.kr.ACTIVATE,             disabled: hostsSelected.length === 0 || !isMaintenance || isUp || isInstalling },
    { type: "restart",       onClick: () => setActiveModal("host:restart"),       label: Localization.kr.RESTART,              disabled: hostsSelected.length === 0 || isUp || isInstalling },
    { type: "refresh",       onClick: () => setActiveModal("host:refresh"),       label: Localization.kr.REFRESH_CAPABILITIES, disabled: hostsSelected.length === 0 || !isUp || isInstalling  },
    { type: "commitNetHost", onClick: () => setActiveModal("host:commitNetHost"), label: `${Localization.kr.HOST} ${Localization.kr.REBOOT} ${Localization.kr.STATUS} 확인`, disabled: hostsSelected.length !== 1 || isUp || isInstalling  },
    { type: "reinstall",     onClick: () => setActiveModal("host:reinstall"),     label: Localization.kr.REINSTALL, disabled: hostsSelected.length !== 1 || isUp || isInstalling || !isMaintenance },
    { type: "enrollCert",    onClick: () => setActiveModal("host:enrollCert"),    label: `${Localization.kr.CERTIFICATE} ${Localization.kr.ENROLL}`, disabled: hostsSelected.length === 0 || isInstalling || !isMaintenance  },
    { type: "haOn",          onClick: () => setActiveModal("host:haOn"),          label: "글로벌 HA 유지 관리를 활성화",            disabled: hostsSelected.length === 0 || !isHostedConfigured || /*!isMaintenance ||*/ isGlobalMaintenance, },
    { type: "haOff",         onClick: () => setActiveModal("host:haOff"),         label: "글로벌 HA 유지 관리를 비활성화",          disabled: hostsSelected.length === 0 || !isHostedConfigured || /*!isMaintenance ||*/ !isGlobalMaintenance },
  ], [actionType, hostsSelected]);
  const isMgmtDisabled = manageActions.every(a => a.disabled);
  
  return (
    <ActionButtons actionType={actionType} 
      actions={basicActions}
    >
      {isContextMenu ? (
        manageActions.map(({ type, onClick, label, disabled }) => (
          <button key={type}
            className="btn-right-click dropdown-item"
            disabled={disabled}
            onClick={onClick}
          >
            {label}
          </button>
        ))
      ) : (
        <div className="dropdown-container">
          <ActionButton
            iconDef={
              activeDropdown
                ? rvi16ChevronUp(isMgmtDisabled ? CONSTANT.color.down : CONSTANT.color.black)
                : rvi16ChevronDown(isMgmtDisabled ? CONSTANT.color.down : CONSTANT.color.black)
            }
            label={Localization.kr.MANAGEMENT}
            disabled={isMgmtDisabled}
            onClick={() => {
              if (isMgmtDisabled) return;
              toggleDropdown();
            }}
          />

          {activeDropdown && (
            <div className="right-click-menu-box context-menu-item dropdown-menu"
              ref={activeDropdownRef}
            >
              {manageActions.map(({ type, onClick, label, disabled }) => (
                <button key={type}
                  disabled={disabled}
                  className="btn-right-click dropdown-item"
                  onClick={onClick}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </ActionButtons>
  );
  
};

export default HostActionButtons;
