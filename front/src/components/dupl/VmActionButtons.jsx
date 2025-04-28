import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";
import useClickOutside from "../../hooks/useClickOutside";
import { openNewTab } from "../../navigation";
import { rvi16ChevronUp, rvi16ChevronDown } from "../icons/RutilVmIcons";
import ActionButton from "../button/ActionButton";
import ActionButtonGroup from "../button/ActionButtonGroup";
import Localization from "../../utils/Localization";

const VmActionButtons = ({ 
  actionType = "default"
}) => {
  const navigate = useNavigate();
  const { setActiveModal, setContextMenu } = useUIState()
  const { vmsSelected } = useGlobal()
  const isContextMenu = actionType === "context";
  
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = () => setActiveDropdown((prev) => (prev ? null : "manage"));

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, (e) => setActiveDropdown(null))

  const selected1st = [...vmsSelected][0] ?? null

  const isUp = selected1st?.status === "UP";
  const isDown = selected1st?.status === "DOWN";
  const isMaintenance = selected1st?.status === "MAINTENANCE";
  const isPause = selected1st?.status === "PAUSE";
  const isPoweringDown = selected1st?.status === "POWERING_DOWN";
  const isPoweringUp = selected1st?.status === "POWERING_UP";
  const isTemplate = selected1st?.status === "SUSPENDED" || selected1st?.status === "UP";

  const allUp = vmsSelected.length > 0 && vmsSelected.every(vm => vm.status === "UP");
  const allDown = vmsSelected.length > 0 && vmsSelected.every(vm => vm.status === "DOWN");
  const allPause = vmsSelected.length > 0 && vmsSelected.every(vm => vm.status === "SUSPENDED");
  const allDownOrSuspended = vmsSelected.length > 0 && vmsSelected.every(vm => 
    vm.status === "DOWN" || vm.status === "SUSPENDED"
  );
  const allOkay2PowerDown = vmsSelected.length > 0 && vmsSelected.some(vm => vm?.status === "UP" || vm?.status === "POWERING_DOWN");
  
  const basicActions = [
    { type: "create",     onBtnClick: () => setActiveModal("vm:create"), label: Localization.kr.CREATE, disabled: isContextMenu && vmsSelected.length > 0 },
    { type: "update",     onBtnClick: () => setActiveModal("vm:update"), label: Localization.kr.UPDATE, disabled: vmsSelected.length !== 1 },
    { type: "start",      onBtnClick: () => setActiveModal("vm:start"), label: Localization.kr.START, disabled: !(allDown || allPause) },
    // { type: "start",      onBtnClick: () => setActiveModal("vm:start"), label: Localization.kr.START, disabled: !allDownOrSuspended },
    { type: "pause",      onBtnClick: () => setActiveModal("vm:pause"), label: Localization.kr.PAUSE, disabled: !allUp },
    { type: "reboot",     onBtnClick: () => setActiveModal("vm:reboot"), label: Localization.kr.REBOOT, disabled: !allUp },
    { type: "reset",      onBtnClick: () => setActiveModal("vm:reset"), label: Localization.kr.RESET, disabled: !allUp },
    { type: "shutdown",   onBtnClick: () => setActiveModal("vm:shutdown"), label: Localization.kr.END, disabled: vmsSelected.length === 0 || !allUp },
    { type: "powerOff",   onBtnClick: () => setActiveModal("vm:powerOff"), label: Localization.kr.POWER_OFF, disabled: vmsSelected.length === 0 || !allOkay2PowerDown  },
    { type: "console",    onBtnClick: () => openNewTab("console", selected1st?.id), label: Localization.kr.CONSOLE, disabled: !allUp },
    { type: "migration",  onBtnClick: () => setActiveModal("vm:migration"), label: Localization.kr.MIGRATION, disabled: !allUp },
    { type: "snapshot",   onBtnClick: () => setActiveModal("vm:snapshot"), label: `${Localization.kr.SNAPSHOT} ${Localization.kr.CREATE}`}
  ];

  const manageActions = [
    // { type: "import", label: Localization.kr.IMPORT, },
    { type: "copy", onBtnClick: () => setActiveModal("vm:copy"), label: `${Localization.kr.VM} 복제`, disabled: vmsSelected.length !== 1 || !isPause },
    { type: "remove", onBtnClick: () => setActiveModal("vm:remove"), label: Localization.kr.REMOVE, disabled: vmsSelected.length === 0 || !isDown },
    { type: "templates", label: `${Localization.kr.TEMPLATE} ${Localization.kr.CREATE}`, disabled: isUp || vmsSelected.length !== 1 || isTemplate },
    { type: "ova", label: "ova로 내보내기", disabled: vmsSelected.length !== 1 || !isDown },
  ];

  return (
    <ActionButtonGroup 
      actionType={actionType}
      actions={basicActions}
    >
      {isContextMenu ? (
        manageActions.map(({ type, label, disabled }) => (
          <button key={type}
            className="btn-right-click dropdown-item"
            disabled={disabled}
            onClick={() => setActiveModal(`vm:${type}`)}
          >
            {label}
          </button>
        ))
      ) : (
        <>
          <ActionButton actionType={actionType}
            label={Localization.kr.TEMPLATE}
            onClick={() => navigate("/computing/templates")}
          />
          <div ref={dropdownRef} className="dropdown-container">
            <ActionButton
              iconDef={activeDropdown ? rvi16ChevronUp : rvi16ChevronDown}
              label={Localization.kr.MANAGEMENT}
              onClick={toggleDropdown}
            />
            {activeDropdown && (
              <div className="right-click-menu-box context-menu-item dropdown-menu">
                {manageActions.map(({ type, label, disabled }) => (
                  <button key={type}
                    disabled={disabled}
                    onClick={() => setActiveModal(`vm:${type}`)}
                    className="btn-right-click dropdown-item"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </ActionButtonGroup>
  );
};

export default VmActionButtons;
