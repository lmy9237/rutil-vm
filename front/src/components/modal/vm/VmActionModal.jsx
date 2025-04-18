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
import Localization from "../../../utils/Localization";

const ACTIONS = {
  "vm:start": { label: "실행", hook: useStartVM },
  "vm:pause": { label: "일시중지", hook: usePauseVM },
  "vm:reboot": { label: "재부팅", hook: useRebootVM },
  "vm:reset": { label: "재설정", hook: useResetVM },
  "vm:shutdown": { label: "종료", hook: useShutdownVM },
  "vm:powerOff": { label: "전원을 Off", hook: usePowerOffVM },
};

const VmActionModal = ({ isOpen, action, data, onClose }) => {
  const { label = "", hook } = ACTIONS[action] || {};
  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.VM} ${label} 완료`);
  };

  const { mutate } = hook ? hook(onSuccess, onClose) : { mutate: null };

  const { ids, names } = useMemo(() => {
    const list = Array.isArray(data) ? data : data ? [data] : [];
    return {
      ids: list.map((item) => item.id),
      names: list.map((item) => item.name || "undefined"),
    };
  }, [data]);

  const handleSubmit = () => {
    if (!mutate) return toast.error(`알 수 없는 액션: ${action}`);
    if (!ids.length) return toast.error("ID가 없습니다.");

    ids.forEach((id) => mutate(id));
  };

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={label}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleSubmit}
      promptText={`${names.join(", ")} 를(을) ${label}하시겠습니까?`}
      contentStyle={{ width: "650px" }}
      shouldWarn={true}
    />
  );
};

export default VmActionModal;
