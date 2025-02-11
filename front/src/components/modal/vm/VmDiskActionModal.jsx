import { useState, useEffect } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import {
  useActivateDiskFromVm,
  useDeactivateDiskFromVm,
} from "../../../api/RQHook";

/**
 * @name VmDiskActionModal
 * @description
 * 
 * @param {boolean} isOpen ...
 * @param {function} action ...
 * @param {function} onClose ...
 * 
 * @returns 
 */
const VmDiskActionModal = ({ isOpen, action, onClose, vm, data }) => {
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
      deactivate: "비활성화",
      activate: "활성화",
    };
    return labels[action] || "";
  };

  const handleAction = (actionFn) => {
    ids.forEach((diskAttachId, index) => {
      console.log(`vmID: ${vm?.id}, diskId: ${diskAttachId}}`);
      actionFn(
        { vmId: vm?.id, diskAttachmentId: diskAttachId }, // 수정된 부분
        {
          onSuccess: () => {
            if (ids.length === 1 || index === ids.length - 1) {
              toast.success(`디스크 ${getContentLabel(action)} 완료`);
              onClose();
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
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={getContentLabel(action)}
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="storage-delete-popup modal">
        <div className="popup-header">
          <h1>가상머신 디스크 {getContentLabel(action)}</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

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

        <div className="edit-footer">
          <button style={{ display: "none" }}></button>
          <button onClick={handleFormSubmit}>OK</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default VmDiskActionModal;
