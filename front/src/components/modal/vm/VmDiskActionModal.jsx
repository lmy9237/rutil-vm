import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import {
  useActivateDiskFromVm,
  useDeactivateDiskFromVm,
} from "../../../api/RQHook";
import Logger from "../../../utils/Logger";
import Localization from "../../../utils/Localization";

/**
 * @name VmDiskActionModal
 * @description
 * 
 * @prop {boolean} isOpen ...
 * @prop {function} action ...
 * @prop {function} onClose ...
 * 
 * @returns 
 */
const VmDiskActionModal = ({ isOpen, action, onClose, vmId, data }) => {
  const { mutate: activateDisk } = useActivateDiskFromVm();
  const { mutate: deactivateDisk } = useDeactivateDiskFromVm();

  const [ids, setIds] = useState([]);
  const [aliasList, setAliasList] = useState([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const ids = data.map((item) => item.id);
      const names = data.map((item) => item?.diskImageVo?.alias); // name이 없는 경우 처리
      setIds(ids);
      setAliasList(names);
    } else if (data) {
      setIds([data?.id]);
      setAliasList([data?.diskImageVo?.alias]);
    }
  }, [data]);

  const getContentLabel = () => {
    const labels = {
      deactivate: Localization.kr.DEACTIVATE,
      activate: Localization.kr.ACTIVATE,
    };
    return labels[action] || "";
  };

  const handleAction = (actionFn) => {
    ids.forEach((diskAttachId, index) => {
      Logger.debug(`vmID: ${vmId}, diskId: ${diskAttachId}}`);
      actionFn(
        { vmId: vmId, diskAttachmentId: diskAttachId }, // 수정된 부분
        {
          onSuccess: () => {
            if (ids.length === 1 || index === ids.length - 1) {
              onClose();
              toast.success(`디스크 ${getContentLabel(action)} 완료`);
            }
          },
          onError: (error) => {
            console.error(`${getContentLabel(action)} 오류:`, error);
          },
        }
      );
    });
  };

  const handleFormSubmit = () => {
    if (!ids.length) {
      console.error("ID가 없습니다.");
      return;
    }

    const actionMap = {
      deactivate: deactivateDisk,
      activate: activateDisk,
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
      targetName={"가상머신 디스크"}
      submitTitle={getContentLabel(action)}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="storage-delete-popup modal"> */}
      <div className="disk-delete-box">
        <div>
          <FontAwesomeIcon
            style={{ marginRight: "0.3rem" }}
            icon={faExclamationTriangle}
          />
          <span>
            {" "}
            {aliasList.join(", ")} 를(을) {getContentLabel(action)}{" "}
            하시겠습니까?{" "}
          </span>
        </div>
      </div>
    </BaseModal>
  );
};

export default VmDiskActionModal;
