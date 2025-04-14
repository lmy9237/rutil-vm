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

/**
 * @name HostActionModal
 * @description ...
 * 
 * @param {boolean} isOpen ...
 * @returns 
 */
const HostActionModal = ({ isOpen, action, onClose, data }) => {
  const onSuccess = (index) => {
    if (ids.length === 1 || index === ids.length - 1) {
      onClose();
      toast.success(`호스트 ${getContentLabel(action)} 완료`);
    }
  };

  const { mutate: deactivateHost } = useDeactivateHost(onSuccess, () => onClose());
  const { mutate: activateHost } = useActivateHost(onSuccess, () => onClose());
  const { mutate: restartHost } = useRestartHost(onSuccess, () => onClose());
  const { mutate: enrollHostCertificate } = useEnrollHostCertificate(onSuccess, () => onClose());
  const { mutate: refreshHost } = useRefreshHost(onSuccess, () => onClose());
//const { mutate: stopHost } = useStopHost();

  const { ids, names } = useMemo(() => {
    if (!data) return { ids: [], names: [] };

    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name || "undefined"),
    };
  }, [data]);

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

  const handleAction = (actionFn) => {
    ids.forEach((hostId, index) => {
      actionFn(hostId);
    });
  };

  const handleFormSubmit = () => {
    if (!ids.length) {
      console.error("ID가 없습니다.");
      return;
    }

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
    if (actionFn) {
      handleAction(actionFn);
    } else {
      console.error(`알 수 없는 액션: ${action}`);
    }
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
