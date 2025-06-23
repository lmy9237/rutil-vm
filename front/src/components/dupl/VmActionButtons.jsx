import { useRef, useState, useMemo } from "react";
import { useNavigate }          from "react-router-dom";
import CONSTANT                 from "@/Constants";
import { useValidationToast }   from "@/hooks/useSimpleToast";
import useUIState               from "@/hooks/useUIState";
import useGlobal                from "@/hooks/useGlobal";
import useClickOutside          from "@/hooks/useClickOutside";
import { openNewTab }           from "@/navigation";
import { 
  useRemoteViewerConnectionFileFromVm, 
  useSnapshotsFromVM,
} from "@/api/RQHook";
import {
  ActionButtons, 
  ActionButton
} from "@/components/button/ActionButtons";
import {
  rvi16ChevronUp,
  rvi16ChevronDown
} from "@/components/icons/RutilVmIcons";
import Localization             from "@/utils/Localization";
import Logger                   from "@/utils/Logger";

/**
 * @name VmActionButtons
 * @description 가상머신 관련 액션버튼
 * 
 * @returns {JSX.Element} VmActionButtons
 * 
 * @see ActionButtons
 */
const VmActionButtons = ({ 
  actionType="default"
}) => {
  const navigate = useNavigate();
  const { validationToast } = useValidationToast();
  const { setActiveModal, setContextMenu } = useUIState()
  const { vmsSelected } = useGlobal()
  const isContextMenu = actionType === "context";
  
  const [mgmtDropdownActive, setMgmtDropdownActive] = useState(false);
  const toggleMgmtDropdown = () => setMgmtDropdownActive((prev) => !prev);
  const [consoleDropdownActive, setConsoleDropdownActive] = useState(false);
  const toggleConsoleDropdown = () => setConsoleDropdownActive((prev) => !prev);

  const mgmtDropdownRef = useRef(null);
  useClickOutside(mgmtDropdownRef, (e) => setMgmtDropdownActive(false))
  const consoleDropdownRef = useRef(null);
  useClickOutside(consoleDropdownRef, (e) => setConsoleDropdownActive(false))

  const selected1st = [...vmsSelected][0] ?? null

  const isUp = selected1st?.running ?? false;
  const isDown = selected1st?.notRunning ?? false;
  const isMaintenance = selected1st?.status?.toUpperCase() === "MAINTENANCE";
  const isPause = selected1st?.status?.toUpperCase() === "paused" || selected1st?.status?.toUpperCase() === "suspended"; 
  const isTemplate = selected1st?.upOrPaused;
  const isVmQualified2Migrate = selected1st?.qualified2Migrate || (
    selected1st?.status?.toUpperCase() === "up" || 
    selected1st?.status?.toUpperCase() === "powering_up" || 
    selected1st?.status?.toUpperCase() === "reboot_in_progress"
  ) || false;
  const isVmQualified4ConsoleConnect = selected1st?.qualified4ConsoleConnect ?? true;
  const hasDeleteProtectedVm = vmsSelected.some(vm => vm?.deleteProtected === true); // 삭제방지 조건

  const allUp = vmsSelected.length > 0 && vmsSelected.every(vm => vm.running ?? false);
  const allDown = vmsSelected.length > 0 && vmsSelected.every(vm => vm.notRunning ?? false);
  const allPause = vmsSelected.length > 0 && vmsSelected.every(vm => vm.status?.toUpperCase() === "suspended");
  const allDownOrSuspended = vmsSelected.length > 0 && vmsSelected.every(vm => 
    vm.status?.toUpperCase() === "down" || vm.status?.toUpperCase() === "suspended"
  );
  const allOkay2PowerDown = vmsSelected.length > 0 && vmsSelected.every(vm =>
    vm?.qualified4PowerDown
  );
  const ollOkay2Migrate = vmsSelected.every(vm => 
    vm?.qualified2Migrate || (
      vm?.status?.toUpperCase() === "up" || 
      vm?.status?.toUpperCase() === "powering_up" || 
      vm?.status?.toUpperCase() === "reboot_in_progress"
    )
  )
  
  const { mutate: downloadRemoteViewerConnectionFileFromVm } = useRemoteViewerConnectionFileFromVm()
  const downloadRemoteViewerConnectionFile = (e) => {
    Logger.debug(`VmActionButtons > downloadRemoteViewerConnectionFile ... `)
    e.preventDefault();
    downloadRemoteViewerConnectionFileFromVm(selected1st?.id)
  }

  // 스냅샷 미리보기 있으면 가상머신 시작 취소
  const { data: snapshots = [] } = useSnapshotsFromVM(selected1st?.id, (e) => ({ ...e }));
  const hasPreviewSnapshot = useMemo(() => {
    return snapshots.some(s => s.status?.toUpperCase() === "in_preview");
  }, [snapshots]);
  const hasLockedSnapshot = useMemo(() => {
    return snapshots.some(s => s.status?.toUpperCase() === "locked");
  }, [snapshots]);

  const manageActions = [
    // { type: "import", label: Localization.kr.IMPORT, },
    { type: "copy",       onClick: () => setActiveModal("vm:copy"), label: `${Localization.kr.VM} 복제`, disabled: vmsSelected.length !== 1 || allPause },
    //{ type: "remove",     onClick: () => setActiveModal("vm:remove"), label: Localization.kr.REMOVE, disabled: vmsSelected.length === 0 || !isDown },
    { type: "remove",     onClick: () => setActiveModal("vm:remove"), label: Localization.kr.REMOVE, disabled: vmsSelected.length === 0 || !isDown || hasDeleteProtectedVm },
    { type: "templates",  onClick: () => {},                    label: `${Localization.kr.TEMPLATE} ${Localization.kr.CREATE}`, disabled: isUp || vmsSelected.length !== 1 || isTemplate },
    { type: "ova",        onClick: () => {},                    label: `ova로 ${Localization.kr.EXPORT}`, disabled: vmsSelected.length !== 1 || !isDown },
  ];

  const consoleActions = [
    { type: "novnc",          onClick: () => openNewTab("console", selected1st?.id), label: "noVNC",           disabled: !allUp }, 
    { type: "remoteviewer",   onClick: (e) => downloadRemoteViewerConnectionFile(e), label: "네이티브 클라이언트", disabled: !allUp },
  ]
  
  const basicActions = [
    { type: "create",     onClick: () => setActiveModal("vm:create"),      label: Localization.kr.CREATE,                                  disabled: isContextMenu && vmsSelected.length > 0 },
    { type: "update",     onClick: () => setActiveModal("vm:update"),      label: Localization.kr.UPDATE,                                  disabled: vmsSelected.length !== 1 },
    { 
      type: "start", 
      onClick: () => {
        // TODO: API 아직 덜됨
        // const hasBootableDisk = selected1st?.diskAttachmentVos?.some(d => d.bootable);
        // if (!hasBootableDisk || hasPreviewSnapshot) {
        //   validationToast.fail("부팅 가능한 디스크가 최소 1개는 있어야 합니다.");
        //   return;
        // }
        setActiveModal("vm:start");
      }, 
      label: Localization.kr.START, 
      disabled: !(isDown || isPause || isMaintenance) 
    },
    { type: "pause",      onClick: () => setActiveModal("vm:pause"),       label: Localization.kr.PAUSE,                                   disabled: !allUp },
    { type: "reboot",     onClick: () => setActiveModal("vm:reboot"),      label: Localization.kr.REBOOT,                                  disabled: !allUp },
    { type: "reset",      onClick: () => setActiveModal("vm:reset"),       label: Localization.kr.RESET,                                   disabled: !allUp },
    { type: "shutdown",   onClick: () => setActiveModal("vm:shutdown"),    label: Localization.kr.END,                                     disabled: vmsSelected.length === 0 || !allOkay2PowerDown},
    { type: "powerOff",   onClick: () => setActiveModal("vm:powerOff"),    label: Localization.kr.POWER_OFF,                               disabled: vmsSelected.length === 0 || !allOkay2PowerDown},
    { type: "console",    onClick: () => openNewTab("console", selected1st?.id), label: Localization.kr.CONSOLE,                           disabled: vmsSelected.length === 0 || !isVmQualified4ConsoleConnect, subactions: consoleActions},
    { type: "migration",  onClick: () => setActiveModal("vm:migration"),   label: Localization.kr.MIGRATION,                               disabled: vmsSelected.length === 0 || !ollOkay2Migrate },
    { type: "snapshot",   onClick: () => setActiveModal("vm:snapshot"),    label: `${Localization.kr.SNAPSHOT} ${Localization.kr.CREATE}`, disabled: vmsSelected.length === 0 || hasLockedSnapshot },
    { type: "template",   onClick: () => navigate("/computing/templates"), label: Localization.kr.TEMPLATE },
  ].filter(action => !(isContextMenu && action.type === "template"));

  return (
    <ActionButtons 
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
          <div id="dropdown-container-console"
            ref={consoleDropdownRef}
            className="dropdown-container"
          >
            <ActionButton
              iconDef={
                consoleDropdownActive 
                  ? rvi16ChevronUp(isVmQualified4ConsoleConnect ? CONSTANT.color.down : CONSTANT.color.black)
                  : rvi16ChevronDown(isVmQualified4ConsoleConnect ? CONSTANT.color.down : CONSTANT.color.black)
              }
              label={Localization.kr.CONSOLE}
              disabled={!allUp}
              onClick={toggleConsoleDropdown}
            />
            {consoleDropdownActive && (
              <div id="dropdown-menu-console"
                className="right-click-menu-box context-menu-item dropdown-menu"
              >
                {consoleActions.map(({ 
                  type,
                  label,
                  disabled,
                  onClick
                }) => (
                  <button key={type}
                    disabled={disabled}
                    onClick={(e) => {
                      setConsoleDropdownActive(false); 
                      onClick(e); 
                    }}
                    className="btn-right-click dropdown-item"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div id="dropdown-container-mgmt"
            ref={mgmtDropdownRef} 
            className="dropdown-container"
          >
            <ActionButton
              iconDef={mgmtDropdownActive ? rvi16ChevronUp(CONSTANT.color.black) : rvi16ChevronDown(CONSTANT.color.black)}
              label={Localization.kr.MANAGEMENT}
              onClick={toggleMgmtDropdown}
            />
            {mgmtDropdownActive && (
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
    </ActionButtons>
  );
};

export default VmActionButtons;
