import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import {
  useDeactivateHost,
  useActivateHost, 
  useRestartHost
} from '../../../../api/RQHook';
import toast from 'react-hot-toast';

const HostActionModal = ({ isOpen, action, onClose, data }) => {
  const { mutate: deactivateHost } = useDeactivateHost();
  const { mutate: activateHost } = useActivateHost();
  const { mutate: restartHost } = useRestartHost();
  // const { mutate: stopHost } = useStopHost();

  const { ids, names } = useMemo(() => {
    if (!data) return { ids: [], names: [] };
    
    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name || 'undefined'),
    };
  }, [data]);

  const getContentLabel = () => {
    const labels = {
      deactivate: '유지보수',
      activate: '활성화',
      restart: '재시작',
      // stop: '중지',
      // reinstall: '다시 설치',
      // register: '인증서 등록',
      // haon: 'HA 활성화',
      // haoff: 'HA 비활성화',
    };
    return labels[action] || '';
  };

  const handleAction = (actionFn) => {
    ids.forEach((hostId, index) => {
      actionFn(hostId, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) {
            toast.success(`호스트 ${getContentLabel(action)} 완료`);
            onClose();
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
          <h1>호스트 {getContentLabel(action)}</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="disk-delete-box">
          <div>
            <FontAwesomeIcon style={{ marginRight: '0.3rem' }} icon={faExclamationTriangle} />
            <span> {names.join(', ')} 를(을) {getContentLabel(action)} 하시겠습니까? </span>
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

export default HostActionModal;
