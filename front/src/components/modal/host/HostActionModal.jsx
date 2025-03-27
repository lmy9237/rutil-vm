import { useMemo } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import {
  useDeactivateHost,
  useActivateHost,
  useRestartHost,
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
  const { mutate: deactivateHost } = useDeactivateHost();
  const { mutate: activateHost } = useActivateHost();
  const { mutate: restartHost } = useRestartHost();
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
      // reinstall: '다시 설치',
      // register: '인증서 등록',
      // haon: 'HA 활성화',
      // haoff: 'HA 비활성화',
    };
    return labels[action] || "";
  };

  const handleAction = (actionFn) => {
    ids.forEach((hostId, index) => {
      actionFn(hostId, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) {
            onClose();
            toast.success(`호스트 ${getContentLabel(action)} 완료`);
          }
        },
        onError: (error) => {
          console.error(`${getContentLabel(action)} 오류:`, error);
        },
      });
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
      // reinstall: rein,
      // register: rebootVM,
      // haon: resetVM,
      // haoff: resetVM,
    };

    const actionFn = actionMap[action];
    if (actionFn) {
      handleAction(actionFn);
    } else {
      console.error(`알 수 없는 액션: ${action}`);
    }
  };

  return (
    
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={Localization.kr.HOST}
      submitTitle={getContentLabel(action)}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "630px" }} 
    >
      <div className="disk-delete-box">
        <div>
          <FontAwesomeIcon style={{ marginRight: "0.3rem" }} icon={faExclamationTriangle} />
          <span>
            {names.join(", ")} 를(을) {getContentLabel(action)} 하시겠습니까?
          </span>
        </div>
      </div>
    </BaseModal>
  );
};

export default HostActionModal;
