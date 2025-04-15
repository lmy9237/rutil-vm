import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUIState from "../../hooks/useUIState";
import { rvi16ChevronUp, rvi16ChevronDown } from "../icons/RutilVmIcons";
import ActionButton from "../button/ActionButton";
import ActionButtonGroup from "../button/ActionButtonGroup";
import { openNewTab } from "../../navigation";
import Localization from "../../utils/Localization";
import useClickOutside from "../../hooks/useClickOutside";
import useGlobal from "../../hooks/useGlobal";

const VmActionButtons = ({
  actionType = "default",
}) => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal } = useUIState()
  const { vmsSelected, setVmsSelect4d } = useGlobal()

  const isContextMenu = actionType === "context";

  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, (e) => setActiveDropdown(null))
  const toggleDropdown = () => setActiveDropdown((prev) => (prev ? null : "manage"));

  const vmSelected1st = (!Array.isArray(vmsSelected) ? [] : vmsSelected)[0] ?? null

  const isUp = vmSelected1st?.status === "UP";
  const isDown = vmSelected1st?.status === "DOWN";
  const isMaintenance = vmSelected1st?.status === "MAINTENANCE";
  const isPause = vmSelected1st?.status === "PAUSE";
  const isPoweringDown = vmSelected1st?.status === "POWERING_DOWN";
  const isPoweringUp = vmSelected1st?.status === "POWERING_UP";
  const isTemplate = vmSelected1st?.status === "SUSPENDED" || vmSelected1st?.status === "UP";
  const basicActions = [
    { type: "create", onBtnClick: () => setActiveModal("vm:create"), label: Localization.kr.CREATE, disabled: vmsSelected.length > 0 },
    { type: "update", onBtnClick: () => setActiveModal("vm:update"), label: Localization.kr.UPDATE, disabled: vmsSelected.length !== 1 },
    { type: "start", onBtnClick: () => setActiveModal("vm:start"), label: Localization.kr.START, disabled: vmsSelected.length === 0 || (isUp && !isMaintenance) },
    { type: "pause", onBtnClick: () => setActiveModal("vm:pause"), label: Localization.kr.PAUSE, disabled: vmsSelected.length === 0 || !isUp }, 
    { type: "reboot", onBtnClick: () => setActiveModal("vm:reboot"), label: "재부팅", disabled: vmsSelected.length === 0 || !isUp },
    { type: "reset", onBtnClick: () => setActiveModal("vm:reset"), label: "재설정", disabled: vmsSelected.length === 0 || !isUp }, // 가상머신의 시스템을 변경했을때 바뀐 설정을 적용하려면 재설정으로만 적용이 가능함
    { type: "shutdown", onBtnClick: () => setActiveModal("vm:shutdown"), label: "종료", disabled: vmsSelected.length === 0 || !isUp },
    { type: "powerOff", onBtnClick: () => setActiveModal("vm:powerOff"), label: "전원끔", disabled: vmsSelected.length === 0 || !(isUp || isPoweringUp) }, 
    { type: "console", onBtnClick: () => openNewTab("console", vmSelected1st?.id), label: "콘솔", disabled: vmsSelected.length === 0 || !isUp },
    { type: "snapshot", onBtnClick: () => setActiveModal("vm:snapshot"), label: "스냅샷 생성", disabled: vmsSelected.length !== 1  },
    { type: "migration", onBtnClick: () => setActiveModal("vm:migration"), label: "마이그레이션", disabled: vmsSelected.length === 0 || !isUp },
  ];

  const manageActions = [
    // { type: "import", label: Localization.kr.IMPORT, },
    { type: "copy", onBtnClick: () => setActiveModal("vm:copy"), label: `${Localization.kr.VM} 복제`, disabled: vmsSelected.length !== 1 || !isPause },
    { type: "remove", onBtnClick: () => setActiveModal("vm:remove"), label: Localization.kr.REMOVE, disabled: vmsSelected.length === 0 || !isDown },
    { type: "templates", label: `${Localization.kr.TEMPLATE} ${Localization.kr.CREATE}`, disabled: isUp || vmsSelected.length !== 1 || isTemplate },
    { type: "ova", label: "ova로 내보내기", disabled: vmsSelected.length !== 1 || !isDown },
  ];

  return (
    <ActionButtonGroup actionType={actionType}
      actions={basicActions}
    >
    {isContextMenu ? (
      manageActions.map(({ type, label, disabled }) => (
        <button key={type}
          className="btn-right-click dropdown-item"
          disabled={disabled}
          onClick={() => setActiveModal(type)}
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
                  className="btn-right-click dropdown-item"
                  onClick={() => setActiveModal(`vm:${type}`)}
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
