import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import {
  useDeactivateHost,
  useActivateHost,
  useRestartHost,
  useEnrollHostCertificate,
  useRefreshHost,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import useGlobal from "../../../hooks/useGlobal";

/**
 * @name HostActionModal
 * @description ...
 * 
 * @param {boolean} isOpen ...
 * @returns 
 */

const ACTIONS = {
  "host:deactivate": { label: "유지보수", hook: useDeactivateHost },
  "host:activate": { label: "활성화", hook: useActivateHost },
  "host:restart": { label: "재시작", hook: useRestartHost },
  "host:refresh": { label: "새로고침", hook: useRefreshHost },
  "host:enrollCert": { label: "인증서 등록", hook: useEnrollHostCertificate },
  // "host:haOn": { label: "HA 활성화", hook:  },
  // "host:haOff": { label: "HA 비활성화", hook:  },
};

const HostActionModal = ({ 
  isOpen,
  action, 
  onClose
}) => {  
  const { label = "", hook } = ACTIONS[action] || {};
  const { hostsSelected } = useGlobal()
  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.HOST} ${label} 완료`);
  };

  const { mutate } = hook ? hook(onSuccess, onClose) : { mutate: null };

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
      promptText={`${names.join(", ")} 를(을) ${label}하시겠습니까?`}
      contentStyle={{ width: "630px" }} 
      shouldWarn={true}
    />
  );
};

export default HostActionModal;
/*
import { useMemo } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import {
  useDeactivateHost,
  useActivateHost,
  useRestartHost,
  useEnrollHostCertificate,
  useRefreshHost,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
*/
/**
 * @name HostActionModal
 * @description ...
 * 
 * @param {boolean} isOpen ...
 * @returns 
 */
/*
const HostActionModal = ({ isOpen, action, onClose, data }) => {  
  const getContentLabel = () => {
    const labels = {
      deactivate: "유지보수",
      activate: "활성화",
      restart: "재시작",
      // stop: '중지',
      refresh: '새로고침',
      enrollCert: '인증서 등록',
      haOn: 'HA 활성화',
      haOff: 'HA 비활성화',
    };
    return labels[action] || "";
  };

  const onSuccess = () => {
    onClose();
    toast.success(`${getContentLabel(action)} 완료`);
  };
  const { mutate: deactivateHost } = useDeactivateHost(onSuccess, () => onClose());
  const { mutate: activateHost } = useActivateHost(onSuccess, () => onClose());
  const { mutate: restartHost } = useRestartHost(onSuccess, () => onClose());
  const { mutate: enrollHostCertificate } = useEnrollHostCertificate(onSuccess, () => onClose());
  const { mutate: refreshHost } = useRefreshHost(onSuccess, () => onClose());

  const { ids, names } = useMemo(() => {
    if (!data) return { ids: [], names: [] };

    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name || "undefined"),
    };
  }, [data]);

  const handleAction = (actionFn) => {
    ids.forEach((hostId) => {
      actionFn(hostId);
    });
  };

  const handleFormSubmit = () => {
    if (!ids.length) { return toast.error("ID가 없습니다.") }

    const actionMap = {
      deactivate: deactivateHost,
      activate: activateHost,
      restart: restartHost,
      // stop: stopHost,
      refresh: refreshHost,
      enrollCert: enrollHostCertificate,
      // haOn: resetVM,
      // haOff: resetVM,
    };

    const actionFn = actionMap[action];
    if (!actionFn) { return toast.error(`알 수 없는 액션: ${action}`) }
    handleAction(actionFn);
  };

  return (
    <BaseModal targetName={Localization.kr.HOST} submitTitle={getContentLabel(action)}
      isOpen={isOpen} onClose={onClose}      
      onSubmit={handleFormSubmit}
      promptText={`${names.join(", ")} 를(을) ${getContentLabel(action)}하시겠습니까?`}
      contentStyle={{ width: "630px" }} 
      shouldWarn={true}
    >
    </BaseModal>
  );
};

export default HostActionModal;
*/