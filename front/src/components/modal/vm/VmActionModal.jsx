import { useMemo } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import {
  useStartVM,
  usePauseVM,
  usePowerOffVM,
  useShutdownVM,
  useRebootVM,
  useResetVM,
} from "../../../api/RQHook";
import Logger from "../../../utils/Logger";
import Localization from "../../../utils/Localization";
import useUIState from "../../../hooks/useUIState";

const VmactiveModal = ({
  isOpen,
  data,
  onClose
}) => {  
  const { activeModal } = useUIState()
  const getContentLabel = () => {
    const labels = {
      "vm:start": "실행",
      "vm:pause": "일시중지",
      "vm:reboot": "재부팅",
      "vm:reset": "재설정",
      "vm:shutdown": "종료",
      "vm:powerOff": "전원을 Off",
    };
    return labels[activeModal()] || "";
  };

  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.VM} ${getContentLabel(activeModal())} 완료`);
  };
  const { mutate: startVM } = useStartVM(onSuccess, () => onClose());
  const { mutate: pauseVM } = usePauseVM(onSuccess, () => onClose()); // 일시중지
  const { mutate: shutdownVM } = useShutdownVM(onSuccess, () => onClose()); // 종료
  const { mutate: powerOffVM } = usePowerOffVM(onSuccess, () => onClose()); // 전원끔
  const { mutate: rebootVM } = useRebootVM(onSuccess, () => onClose());
  const { mutate: resetVM } = useResetVM(onSuccess, () => onClose());

  const { ids, names } = useMemo(() => {
    if (!data) return { ids: [], names: [] };
    
    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name || 'undefined'),
    };
  }, [data]);

  const handleAction = (actionFn) => {
    ids.forEach((vmId) => {
      actionFn(vmId);
    });
  };

  const handleFormSubmit = () => {
    Logger.debug("VmactiveModal > handleFormSubmit ... ");
    if (!ids.length) {
      const msgErr = "ID가 없습니다."
      toast.error(msgErr);
      return;
    }

    const actionMap = {
      start: startVM,
      pause: pauseVM,
      reboot: rebootVM,
      reset: resetVM,
      shutdown: shutdownVM,
      powerOff: powerOffVM,
    };

    const actionFn = actionMap[activeModal()];
    if (!actionFn) { return toast.error(`알 수 없는 액션: ${activeModal()}`) }
    handleAction(actionFn);
  };

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={getContentLabel(activeModal())}
      isOpen={isOpen} onClose={onClose}      
      onSubmit={handleFormSubmit}
      promptText={`${names.join(", ")} 를(을) ${getContentLabel(activeModal())}하시겠습니까?`}
      contentStyle={{ width: "650px"}} 
      shouldWarn={true}
    >
    </BaseModal>
  );
};

export default VmactiveModal;
