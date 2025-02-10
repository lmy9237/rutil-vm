import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useAttachDomain } from '../../../../api/RQHook';
import toast from 'react-hot-toast';

// 도메인 - 데이터센터 연결
const DomainAttachModal = ({ isOpen, action, data, datacenterId, onClose }) => {
  // action으로 type 전달
  const { mutate: attachDomain } = useAttachDomain();
  
  const [id, setId] = useState([]);
  const [name, setName] = useState([]);
  
  useEffect(() => {
    setId([data.id]);
    setName([data.name]);    
  }, [data]);

  const getContentLabel = () => {
    const labels = {
      attach: '연결',
      detach: '분리',
      activate: '활성',
      maintenance: '유지보수'
    };
    return labels[action] || '';
  };

  const handleFormSubmit = () => {
    if (!ids.length) return toast.error('실행할 도메인이 없습니다.');
    
    ids.forEach((domainId, index) => {
      attachDomain({ domainId, dataCenterId: datacenterId },{
        onSuccess: () => {
          onClose(); // 모든 작업 완료 후 모달 닫기
          toast.success(`도메인 ${getContentLabel()} 완료`);
        },
        onError: (error) => {
          onClose(); // 일부 실패해도 모달 닫기
          toast.error(`일부 도메인 ${getContentLabel()} 실패`);
        },
      });
    });
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={`${action}`}
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="storage-delete-popup modal">
        <div className="popup-header">
          <h1> 스토리지 도메인 {getContentLabel(action)}</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="disk-delete-box">
          <div>
            <FontAwesomeIcon style={{ marginRight: '0.3rem' }} icon={faExclamationTriangle} />
            <span> {names.join(', ')} 를(을) {getContentLabel(action)} 하시겠습니까?</span>
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

export default DomainAttachModal;
