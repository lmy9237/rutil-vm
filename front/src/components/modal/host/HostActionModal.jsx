import { useCallback, useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import {
  useDeactivateHost,
  useActivateHost,
  useRestartHost,
  useEnrollHostCertificate,
  useRefreshHost,
  useActivateGlobalHaHost,
  useDeactivateGlobalHaHost,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

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
  const { validationToast } = useValidationToast();
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

  const validateForm = () => {
    Logger.debug(`HostActionModal > validateForm ...`)
    if (!mutate) return `알 수 없는 액션: ${action}`;
    if (!ids.length) return "ID가 없습니다.";
    return null;
  }

  const handleSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    Logger.debug(`HostActionModal > handleSubmit ...`)
    ids.forEach((id) => mutate(id));
  };

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
  "host:enrollCert": { label: `${Localization.kr.CERTIFICATE} ${Localization.kr.ENROLL}`, hook: useEnrollHostCertificate },
  "host:haOn": { label: "글로벌 HA 유지관리 활성화", hook: useActivateGlobalHaHost },
  "host:haOff": { label: "글로벌 HA 유지관리 비활성화", hook: useDeactivateGlobalHaHost },
};