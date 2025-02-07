import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useDeleteDisk } from '../../../../api/RQHook';
import toast from 'react-hot-toast';

const DiskDeleteModal = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();
  const [ids, setIds] = useState([]);
  const [alias, setAlias] = useState([]);
  const { mutate: deleteDisk } = useDeleteDisk();

  useEffect(() => {
    if (Array.isArray(data)) {
      const ids = data.map((item) => item.id);
      const alias = data.map((item) => item.alias); // name이 없는 경우 처리
      setIds(ids);
      setAlias(alias);
    } else if (data) {
      setIds([data.id]);
      setAlias([data.alias]);
    }
  }, [data]);

  const handleFormSubmit = () => {
    if (!ids.length) {
      console.error('삭제할 디스크 ID가 없습니다.');
      return;
    }
  
    ids.forEach((diskId, index) => {
      deleteDisk(diskId, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) { // 마지막 디스크 삭제 후 이동
            onClose(); // Modal 닫기
            toast.success('디스크 삭제 완료');
            navigate('/storages/disks');
          }
        },
        onError: (error) => {
          toast.success('디스크 삭제 오류:', error.message);
          // console.error(`디스크 삭제 오류:`, error);
        },
      });
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="storage-delete-popup modal">
        <div className="popup-header">
          <h1>디스크 삭제</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="disk-delete-box">
          <div>
            <FontAwesomeIcon style={{ marginRight: '0.3rem' }} icon={faExclamationTriangle} />
            <span> {alias.join(', ')} 를(을) 삭제하시겠습니까? </span>
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

export default DiskDeleteModal;

