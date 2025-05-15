import { useMemo } from "react";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import BaseModal from "../BaseModal";
import {
  useStartVM,
  usePauseVM,
  usePowerOffVM,
  useShutdownVM,
  useRebootVM,
  useResetVM,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

const ACTIONS = {
  "vm:start": { label: Localization.kr.START, hook: useStartVM },
  "vm:pause": { label: Localization.kr.PAUSE, hook: usePauseVM },
  "vm:reboot": { label: Localization.kr.REBOOT, hook: useRebootVM },
  "vm:reset": { label: Localization.kr.RESET, hook: useResetVM },
  "vm:shutdown": { label: Localization.kr.END, hook: useShutdownVM },
  "vm:powerOff": { label: Localization.kr.POWER_OFF, hook: usePowerOffVM },
};

const VmActionModal = ({
  isOpen,
  data,
  onClose
}) => {  
  const { activeModal } = useUIState()
  const { label = "", hook } = ACTIONS[activeModal()] || {};
  const { mutate } = hook ? hook(onClose, onClose) : { mutate: null };

  const { ids, names } = useMemo(() => {
    const list = [...data];
    return {
      ids: list.map((item) => item.id),
      names: list.map((item) => item.name || "undefined"),
    };
  }, [data]);

  const handleSubmit = () => {
    if (!mutate) return toast.error(`알 수 없는 액션: ${activeModal()}`);
    if (!ids.length) return toast.error("ID가 없습니다.");

    ids.forEach((id) => mutate(id));
  };

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={label}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleSubmit}
      promptText={`${names.join(", ")} 를(을) ${label} 하시겠습니까?`}
      contentStyle={{ width: "650px" }}
      shouldWarn={true}
    />
  );
};

export default VmActionModal;
