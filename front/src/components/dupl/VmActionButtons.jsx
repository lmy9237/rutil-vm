import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const VmActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  status,
  actionType,
  type = 'default',
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
  const wrapperClass = type === 'context' ? 'right-click-menu-box' : 'header-right-btns';
  const basicActions = [
    { type: "create", label: "생성", disabled: false },
    { type: "edit", label: "편집", disabled: isEditDisabled },
    { type: "start", label: "실행", disabled: isDeleteDisabled || isUp },
    { type: "pause", label: "일시중지", disabled: !isUp || isDeleteDisabled },
    { type: "reboot", label: "재부팅", disabled: !isUp || isDeleteDisabled },
    { type: "reset", label: "재설정", disabled: !isUp },
    { type: "shutdown", label: "종료", disabled: !isUp },
    { type: "powerOff", label: "전원끔", disabled: !isUp },
    { type: "snapshot", label: "스냅샷 생성", disabled: isEditDisabled },
    { type: "migration", label: "마이그레이션", disabled: !isPause },
  ];

  const manageActions = [
    { type: "import", label: "가져오기" },
    { type: "copyVm", label: "가상머신 복제", disabled: isEditDisabled || !isPause },
    { type: "delete", label: "삭제", disabled: isDeleteDisabled || isMaintenance },
    { type: "templates", label: "템플릿 생성", disabled: isEditDisabled || isTemplate },
    { type: "ova", label: "ova로 내보내기", disabled: isEditDisabled },
  ];

  return (
    <div className={wrapperClass}>
      {basicActions.map(({ type, label, disabled }) => (
        <button key={type} onClick={() => openModal(type)} disabled={disabled}  className='right-click-menu-btn'>
          {label}
        </button>
      ))}
  

      {!isContextMenu && ( 
        <>
          <button onClick={() => navigate("/computing/templates")}>템플릿</button>
          <div ref={dropdownRef} className="dropdown-container">
            <button onClick={toggleDropdown} className="manage-button mr-0" >
              관리
              <FontAwesomeIcon
                icon={activeDropdown ? faChevronUp : faChevronDown}
              />
            </button>
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
        </>
      )}
        
    </div>
  );
};

export default VmActionButtons;
