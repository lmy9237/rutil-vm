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

const VmActionModal = ({ isOpen, action, data, onClose }) => {  
  const getContentLabel = () => {
    const labels = {
      start: "실행",
      pause: "일시중지",
      reboot: "재부팅",
      reset: "재설정",
      shutdown: "종료",
      powerOff: "전원을 Off",
    };
    return labels[action] || "";
  };

  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.VM} ${getContentLabel(action)} 완료`);
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
    Logger.debug("VmActionModal > handleFormSubmit ... ");
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

    const actionFn = actionMap[action];
    if (!actionFn) { return toast.error(`알 수 없는 액션: ${action}`) }
    handleAction(actionFn);
  };

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={getContentLabel(action)}
      isOpen={isOpen} onClose={onClose}      
      onSubmit={handleFormSubmit}
      promptText={`${names.join(", ")} 를(을) ${getContentLabel(action)}하시겠습니까?`}
      contentStyle={{ width: "650px"}} 
      shouldWarn={true}
    >
    </BaseModal>
  );
};

export default VmActionModal;
