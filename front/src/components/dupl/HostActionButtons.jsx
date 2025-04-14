import React, { useEffect, useRef, useState } from "react";
import ActionButtonGroup from "../button/ActionButtonGroup";
import { rvi16ChevronDown, rvi16ChevronUp } from "../icons/RutilVmIcons";
import ActionButton from "../button/ActionButton";
import Localization from "../../utils/Localization";

const HostActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  status,
  selectedHosts,
  isContextMenu,
  actionType = "default"
}) => {
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
  const nonOperational = status === "NON_OPERATIONAL";
  const isMaintenance = status === "MAINTENANCE";

  const basicActions = [
    { type: "create", label: Localization.kr.CREATE, disabled: false, onBtnClick: () => openModal("create")  },
    { type: "edit", label: Localization.kr.UPDATE, disabled: isEditDisabled, onBtnClick: () => openModal("edit") },
    { type: "delete", label: Localization.kr.REMOVE, disabled: isDeleteDisabled || !isMaintenance, onBtnClick: () => openModal("delete")  },
  ];

  const manageActions = [
    { type: "deactivate", label: "유지보수", disabled: !isUp },
    { type: "activate", label: "활성", disabled: isUp },
    { type: "restart", label: "재시작", disabled: isEditDisabled || isUp },
    { type: "refresh", label: "기능을 새로고침", disabled: isEditDisabled || !isUp },
    { type: "commitNetHost", label: "호스트 재부팅 확인", disabled: isEditDisabled || isUp },
    { type: "enrollCert", label: "인증서 등록", disabled: isEditDisabled },
    { type: "haOn", label: "글로벌 HA 유지 관리를 활성화", disabled: isEditDisabled || !isUp || !isMaintenance, },
    { type: "haOff", label: "글로벌 HA 유지 관리를 비활성화", disabled: isEditDisabled || !isUp },
  ];

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
            onClick={() => openModal(type)}
            className="btn-right-click dropdown-item"
          >
            {label}
          </button>
        ))
      ) : (
        <div ref={dropdownRef} className="dropdown-container">
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
                  onClick={() => openModal(type)}
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
