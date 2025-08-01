import { useRef, useState, useMemo } from "react";
import { useNavigate }          from "react-router-dom";
import CONSTANT                 from "@/Constants";
import useUIState               from "@/hooks/useUIState";
import useGlobal                from "@/hooks/useGlobal";
import useClickOutside          from "@/hooks/useClickOutside";
import { openNewTab }           from "@/navigation";
import { 
  useRemoteViewerConnectionFileFromVm, 
  useAllSnapshotsFromVm,
  useVm,
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
 * @description 가상머신 관련 액션버튼 (주석처리 삭제예정)
 * 
 * @returns {JSX.Element} VmActionButtons
 * 
 * @see ActionButtons
 */
const VmActionButtons = ({ 
  actionType="default"
}) => {
  const navigate = useNavigate();
  const { setActiveModal, setContextMenu } = useUIState()
  const { vmsSelected } = useGlobal()
  const isContextMenu = actionType === "context";
  
  const selected1st = [...vmsSelected][0] ?? null

  const { data: vm } = useVm(selected1st?.id);

  const [mgmtDropdownActive, setMgmtDropdownActive] = useState(false);
  const toggleMgmtDropdown = () => setMgmtDropdownActive((prev) => !prev);
  const [consoleDropdownActive, setConsoleDropdownActive] = useState(false);
  const toggleConsoleDropdown = () => setConsoleDropdownActive((prev) => !prev);

  const mgmtDropdownRef = useRef(null);
  useClickOutside(mgmtDropdownRef, (e) => setMgmtDropdownActive(false))
  const consoleDropdownRef = useRef(null);
  useClickOutside(consoleDropdownRef, (e) => setConsoleDropdownActive(false))


  const isUp = selected1st?.status?.toUpperCase() === "UP";
  const isDown = selected1st?.status?.toUpperCase() === "DOWN";
  const isMaintenance = selected1st?.status?.toUpperCase() === "MAINTENANCE";
  const isRebootable = vmsSelected.length > 0 && vmsSelected.every(vm => { 
    const status = vm?.status?.toUpperCase();
    return status === "UP" || status === "POWERING_UP";
  });
  const isConsoleEnabled = vmsSelected.length > 0 && vmsSelected.some(vm => {
    const status = vm?.status?.toUpperCase();
    return !["PAUSED", "SUSPENDED", "DOWN"].includes(status);
  });
  const isPause = selected1st?.status?.toUpperCase() === "PAUSED" || 
    selected1st?.status?.toUpperCase() === "SUSPENDED"; 
  const isTemplate = selected1st?.upOrPaused;
  const isVmQualified2Migrate = selected1st?.qualified2Migrate || (
    selected1st?.status?.toUpperCase() === "UP" || 
    selected1st?.status?.toUpperCase() === "POWERING_UP" || 
    selected1st?.status?.toUpperCase() === "REBOOT_IN_PROGRESS"
  ) || false;
  const isVmQualified4ConsoleConnect = selected1st?.qualified4ConsoleConnect || false;
  const hasDeleteProtectedVm = vmsSelected.some(vm => vm?.deleteProtected === true); // 삭제방지 조건
  const hasUpVm = vmsSelected.some(vm => vm?.status?.toUpperCase() === "UP");  // 하나라도 up일 경우 / down일경우
  const hasDown = vmsSelected.some(vm => vm?.status?.toUpperCase() === "DOWN");
  const allUp = vmsSelected.length > 0 && vmsSelected.every(vm => vm?.status?.toUpperCase() === "UP");
  const allOkay2PowerDown = vmsSelected.length > 0 && vmsSelected.every(vm => {
    const status = vm.status?.toLowerCase();
    return (
      vm?.qualified4PowerDown ||
      status === "DOWN" ||
      status === "SUSPENDED" ||
      status === "REBOOT_IN_PROGRESS"
    );
  });
  const allOkay2Migrate = vmsSelected.every(vm => 
    vm?.qualified2Migrate || (
      vm?.status?.toUpperCase() === "UP" || 
      vm?.status?.toUpperCase() === "POWERING_UP" || 
      vm?.status?.toUpperCase() === "REBOOT_IN_PROGRESS"
    )
  )
  
  const allSameHost = vmsSelected.length > 0 && vmsSelected.every(vm => 
    vm?.hostVo?.id && vm?.hostVo?.id === vmsSelected[0]?.hostVo?.id
  );
  // const isMigrateEnabled = vmsSelected.length > 0 && allUp && allSameHost;

  const { mutate: downloadRemoteViewerConnectionFileFromVm } = useRemoteViewerConnectionFileFromVm()
  const downloadRemoteViewerConnectionFile = (e) => {
    Logger.debug(`VmActionButtons > downloadRemoteViewerConnectionFile ... `)
    e.preventDefault();
    downloadRemoteViewerConnectionFileFromVm(selected1st?.id)
  }

  // 스냅샷 미리보기 있으면 가상머신 시작 취소
  const { data: snapshots = [] } = useAllSnapshotsFromVm(selected1st?.id, (e) => ({ ...e }));
  const hasPreviewSnapshot = useMemo(() => {
    return snapshots.some(s => s.status?.toUpperCase() === "in_preview");
  }, [snapshots]);
  const hasLockedSnapshot = useMemo(() => { 
    return snapshots.some(s => s.status?.toUpperCase() === "locked");
  }, [snapshots]);

  const manageActions = [
    { type: "import",     onClick: () => setActiveModal("vm:copy"),           label: Localization.kr.IMPORT, },
    { type: "copy",       onClick: () => setActiveModal("vm:copy"),           label: `${Localization.kr.VM} 복제`,    disabled:true   }, //   disabled: vmsSelected.length !== 1 || allPause 
    { type: "updateCdrom",   onClick: () => setActiveModal("vm:updateCdrom"), label: Localization.kr.UPDATE_CDROM,   disabled: vmsSelected.length !== 1 || !isUp || !allOkay2Migrate },
    { type: "remove",     onClick: () => setActiveModal("vm:remove"),         label: Localization.kr.REMOVE,         disabled: vmsSelected.length === 0 || !isDown || hasDeleteProtectedVm  },
    //{ type: "templates",  onClick: () => {},                                label: `${Localization.kr.TEMPLATE} ${Localization.kr.CREATE}`, disabled: isUp || vmsSelected.length !== 1 || isTemplate },
    { type: "templates",  onClick: () => {},                                  label: `${Localization.kr.TEMPLATE} ${Localization.kr.CREATE}`, disabled: vmsSelected.length === 0 || hasUpVm },
    { type: "ova",        onClick: () => {},                                  label: `ova로 ${Localization.kr.EXPORT}`,  disabled: vmsSelected.length === 0 || isPause },
  ];

  const consoleActions = [
    { type: "novnc",          onClick: () => openNewTab("console", selected1st?.id), label: "웹콘솔 (noVNC)",          disabled: !isVmQualified4ConsoleConnect }, 
    { type: "remoteviewer",   onClick: (e) => downloadRemoteViewerConnectionFile(e), label: "네이티브 클라이언트",        disabled: !isVmQualified4ConsoleConnect },
  ]
  
  const basicActions = [
    { type: "create",     onClick: () => setActiveModal("vm:create"),      label: Localization.kr.CREATE,                                  disabled: isContextMenu && vmsSelected.length > 0 },
    { type: "update",     onClick: () => setActiveModal("vm:update"),      label: Localization.kr.UPDATE,                                  disabled: vmsSelected.length !== 1 },
    { 
      type: "start", 
      onClick: () => {
        // TODO: API 아직 덜됨
        /*
        const hasBootableDisk = selected1st?.diskAttachmentVos?.some(d => d.bootable);
        if (!hasBootableDisk || hasPreviewSnapshot) {
          validationToast.fail("부팅 가능한 디스크가 최소 1개는 있어야 합니다.");
          return;
        }
        */
        setActiveModal("vm:start");
      }, 
      label: Localization.kr.START, 
      disabled: hasUpVm || !(isDown || isPause || isMaintenance) 
    },
    /* { type: "startOnce",  onClick: () => setActiveModal("vm:startOnce"),   label: `한번 ${Localization.kr.START}`,                          disabled: vmsSelected.length !== 1 || !(isDown || isPause || isMaintenance)  }, */
    { type: "pause",      onClick: () => setActiveModal("vm:pause"),       label: Localization.kr.PAUSE,                                   disabled: !allUp },
    { type: "reboot",     onClick: () => setActiveModal("vm:reboot"), label: Localization.kr.REBOOT, disabled: vmsSelected.length === 0  || !isRebootable },
    { type: "reset",      onClick: () => setActiveModal("vm:reset"),  label: Localization.kr.RESET,  disabled: vmsSelected.length === 0  ||!isRebootable },
    { type: "shutdown",   onClick: () => setActiveModal("vm:shutdown"),    label: Localization.kr.END,                      disabled: vmsSelected.length === 0 || isDown},
    { type: "powerOff",   onClick: () => setActiveModal("vm:powerOff"),    label: Localization.kr.POWER_OFF,                disabled: vmsSelected.length === 0 || isDown},
    //{ type: "console",  onClick: () => openNewTab("console", selected1st?.id), label: Localization.kr.CONSOLE,            disabled: vmsSelected.length === 0 || !isVmQualified4ConsoleConnect, subactions: consoleActions},
    { type: "console",    onClick: () => openNewTab("console", selected1st?.id), label: Localization.kr.CONSOLE,            disabled: vmsSelected.length === 0 || isDown}, 
    { 
      type: "migration",  
      onClick: () => setActiveModal("vm:migration"),   
      label: Localization.kr.MIGRATION,                               
      disabled: isDown || vmsSelected.length !== 1
    },
    // { 
    //   type: "migration2",  
    //   onClick: () => setActiveModal("vm:migration2"),   
    //   label: `${Localization.kr.MIGRATION}2`,                               
    //   disabled: !isMigrateEnabled
    // },
    { type: "snapshot",   onClick: () => setActiveModal("vm:snapshot"),    label: `${Localization.kr.SNAPSHOT} ${Localization.kr.CREATE}`, disabled: vmsSelected.length !==1 || hasLockedSnapshot },
    { type: "template",   onClick: () => navigate("/computing/templates"), label: Localization.kr.TEMPLATE },
  ].filter(action => !(isContextMenu && action.type === "template"));

  return (
    <ActionButtons 
      actionType={actionType}
      actions={isContextMenu ? basicActions.slice(1) : basicActions}
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
                  ? rvi16ChevronUp(allUp ? CONSTANT.color.black : CONSTANT.color.down)
                  : rvi16ChevronDown(allUp ? CONSTANT.color.black : CONSTANT.color.down)
              }
              label={Localization.kr.CONSOLE}
              disabled={vmsSelected.length === 0} // || !isVmQualified4ConsoleConnect
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
