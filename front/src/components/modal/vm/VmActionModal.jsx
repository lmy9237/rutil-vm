import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import {
  useStartVM, 
  usePauseVM, 
  usePowerOffVM,
  useShutdownVM,
  useRebootVM,
  useResetVM,
  selectedVms
} from '../../../api/RQHook';

const VmActionModal = ({ isOpen, action, data, onClose }) => {
  const { mutate: startVM } = useStartVM();
  const { mutate: pauseVM } = usePauseVM(); // 일시중지
  const { mutate: shutdownVM } = useShutdownVM(); // 종료
  const { mutate: powerOffVM } = usePowerOffVM(); // 전원끔
  const { mutate: rebootVM } = useRebootVM();
  const { mutate: resetVM } = useResetVM();

  const navigate = useNavigate();

  const [ids, setIds] = useState([]);
  const [names, setNames] = useState([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      const ids = data.map((item) => item.id);
      const names = data.map((item) => item.name); // name이 없는 경우 처리
      setIds(ids);
      setNames(names);
    } else if (data) {
      setIds([data.id]);
      setNames([data.name]);
    }
  }, [data]);

  const getContentLabel = () => {
    const labels = {
      start: '실행',
      pause: '일시중지',
      reboot: '재부팅',
      reset: '재설정',
      shutdown: '종료',
      powerOff: '전원을 Off',
    };
    return labels[action] || '';
  };

  const handleAction = (actionFn) => {
    ids.forEach((vmId, index) => {
      actionFn(vmId, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) {
            toast.success(`가상머신 ${getContentLabel(action)} 완료`);
            onClose();
            navigate('/computing/vms');
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
      console.error('ID가 없습니다.');
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
          <h1>가상머신 {getContentLabel(action)}</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="disk-delete-box">
          <div>
            <FontAwesomeIcon style={{ marginRight: '0.3rem' }} icon={faExclamationTriangle} />
            <span> {names.join(', ')} 를(을) {getContentLabel(action)}하시겠습니까? </span>
          </div>
        </div>

        <div className="edit-footer">
          <button style={{ display: 'none' }}></button>
          <button onClick={handleFormSubmit}>OK</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default VmActionModal;
