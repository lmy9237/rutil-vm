import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { rvi16ChevronUp, rvi16ChevronDown } from "../icons/RutilVmIcons";
import ActionButton from "../button/ActionButton";
import ActionButtonGroup from "../button/ActionButtonGroup";
import { openNewTab } from "../../navigation";
import Localization from "../../utils/Localization";

const VmActionButtons = ({
  vmId="",
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  status,
  actionType = 'default',
  isContextMenu 
}) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // 관리버튼 이벤트
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () =>
    setActiveDropdown((prev) => (prev ? null : "manage"));

  const isUp = status === "UP";
  const isMaintenance = status === "MAINTENANCE";
  const isPause = status === "PAUSE";
  const isTemplate = status === "SUSPENDED" || status === "UP";
  const basicActions = [
    { 
      type: "create", label: "생성", disabled: false
      , onBtnClick: () => openModal("create")
    }, {
      type: "edit", label: "편집", disabled: isEditDisabled
      , onBtnClick: () => openModal("edit") 
    }, { 
      type: "start", label: "실행", disabled: isDeleteDisabled || (isUp && !isMaintenance)
      , onBtnClick: () => openModal("start")
    }, {
      type: "pause", label: "일시중지", disabled: !isUp || isDeleteDisabled
      , onBtnClick: () => openModal("pause") },
    { 
      type: "reboot", label: "재부팅", disabled: !isUp || isDeleteDisabled
      , onBtnClick: () => openModal("reboot") 
    }, { 
      type: "reset", label: "재설정", disabled: !isUp
      , onBtnClick: () => openModal("reset")
    }, { 
      type: "shutdown", label: "종료", disabled: !isUp
      , onBtnClick: () => openModal("shutdown") 
    }, {
      type: "powerOff", label: "전원끔", disabled: !isUp
      , onBtnClick: () => openModal("powerOff")
    }, { 
      type: "console", label: "콘솔", disabled: !isUp
      , onBtnClick: () => openNewTab("console", vmId)
    }, {
      type: "snapshot", label: "스냅샷 생성", disabled: isEditDisabled
      , onBtnClick: () => openModal("snapshot") 
    }, {
      type: "migration", label: "마이그레이션"
      , onBtnClick: () => openModal("migration")
    },
  ];

  const manageActions = [
    { type: "import", label: "가져오기" },
    { type: "copyVm", label: `${Localization.kr.VM} 복제`, disabled: isEditDisabled || !isPause },
    { type: "delete", label: "삭제", disabled: isDeleteDisabled || isMaintenance },
    { type: "templates", label: "템플릿 생성", disabled: isEditDisabled || isTemplate },
    { type: "ova", label: "ova로 내보내기", disabled: isEditDisabled },
  ];

  return (
    <ActionButtonGroup
      actionType={actionType}
      actions={basicActions}
    >
      {!isContextMenu && (
        <>
          <ActionButton actionType={actionType}
            label={"템플릿"}
            onClick={() => navigate("/computing/templates")}
          />
          <div ref={dropdownRef} className="dropdown-container ">
            <ActionButton iconDef={activeDropdown ? rvi16ChevronUp : rvi16ChevronDown} 
              label={Localization.kr.MANAGEMENT}
              onClick={toggleDropdown}
            />
            {activeDropdown && (
              <div className="right-click-menu-box context-menu-item dropdown-menu">
                {manageActions.map(({ type, label, disabled }) => (
                  <button key={type}
                    disabled={disabled}
                    className="btn-right-click dropdown-item"
                    onClick={() => openModal(type)}
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
