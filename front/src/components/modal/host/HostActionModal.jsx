import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import BaseModal from "../BaseModal";
import {
  useDeactivateHost,
  useActivateHost,
  useRestartHost,
  useEnrollHostCertificate,
  useRefreshHost,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name HostActionModal
 * @description ...
 * 
 * @param {boolean} isOpen ...
 * @returns 
 */
const HostActionModal = ({ 
  isOpen, 
  onClose,
  action
}) => {  
  // const { closeModal } = useUIState()
  const { label = "", hook } = ACTIONS[action] || {};
  const { hostsSelected } = useGlobal()

  const { mutate } = hook ? hook(onClose, onClose) : { mutate: null };

  const { ids, names } = useMemo(() => {
    return {
      ids: [...hostsSelected].map((host) => host?.id),
      names: [...hostsSelected].map((host) => host?.name ?? ""),
    };
  }, [hostsSelected]);

  const handleSubmit = useCallback(() => {
    if (!mutate) return toast.error(`알 수 없는 액션: ${action}`);
    if (!ids.length) return toast.error("ID가 없습니다.");

    ids.forEach((id) => mutate(id));
  }, [mutate, ids]);

  return (
    <BaseModal targetName={Localization.kr.HOST} submitTitle={label}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleSubmit}
      promptText={`${names.join(", ")} 를(을) ${label} 하시겠습니까?`}
      contentStyle={{ width: "630px" }} 
      shouldWarn={true}
    />
  );
};

export default HostActionModal;

const ACTIONS = {
  "host:deactivate": { label: Localization.kr.MAINTENANCE, hook: useDeactivateHost },
  "host:activate": { label: Localization.kr.ACTIVATE, hook: useActivateHost },
  "host:restart": { label: Localization.kr.RESTART, hook: useRestartHost },
  "host:refresh": { label: Localization.kr.REFRESH, hook: useRefreshHost },
  "host:enrollCert": { label: "인증서 등록", hook: useEnrollHostCertificate },
  "host:haOn": { label: "HA 활성화" },
  "host:haOff": { label: "HA 비활성화" },
};