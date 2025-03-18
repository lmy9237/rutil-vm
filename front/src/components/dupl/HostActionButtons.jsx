import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import ActionButtonGroup from "../button/ActionButtonGroup";
import { rvi16ChevronDown, rvi16ChevronUp } from "../icons/RutilVmIcons";
import ActionButton from "../button/ActionButton";

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
  const isMaintenance = status === "MAINTENANCE";

  const basicActions = [
    { type: "create", label: "생성", disabled: false, onBtnClick: () => openModal("create")  },
    { type: "edit", label: "편집", disabled: isEditDisabled , onBtnClick: () => openModal("edit") },
    { type: "delete", label: "삭제", disabled: isDeleteDisabled, onBtnClick: () => openModal("delete")  },
  ];

  const manageActions = [
    { type: "deactivate", label: "유지보수", disabled: !isUp },
    { type: "activate", label: "활성", disabled: !isMaintenance },
    { type: "restart", label: "재시작", disabled: isEditDisabled || !isUp },
    { type: "reInstall", label: "다시 설치", disabled: isEditDisabled || isUp },
    { type: "register", label: "인증서 등록", disabled: isEditDisabled || isUp, },
    { type: "haOn", label: "글로벌 HA 유지 관리를 활성화", disabled: isEditDisabled || !isUp, },
    { type: "haOff", label: "글로벌 HA 유지 관리를 비활성화", disabled: isEditDisabled || !isUp, },
  ];

  return (
    <ActionButtonGroup
      actionType={actionType}
      actions={basicActions}
    >
      {!isContextMenu && (
        <div ref={dropdownRef} className="dropdown-container">
          <ActionButton onClick={toggleDropdown} label="관리" iconDef={activeDropdown ? rvi16ChevronUp : rvi16ChevronDown} />
          {activeDropdown && (
            <div className="dropdown-menu">
              {manageActions.map(({ type, label, disabled }) => (
                <button
                  key={type}
                  onClick={() => openModal(type)}
                  disabled={disabled}
                  className="dropdown-item"
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
