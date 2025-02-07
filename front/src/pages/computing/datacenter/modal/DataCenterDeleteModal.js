import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useDeleteDataCenter } from '../../../../api/RQHook';

const DataCenterDeleteModal = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();
  const [ids, setIds] = useState([]);
  const [names, setNames] = useState([]);
  const { mutate: deleteDataCenter } = useDeleteDataCenter();

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

  const handleFormSubmit = () => {
    if (!ids.length) {
      toast.error('삭제할 데이터센터 ID가 없습니다.');
      return;
    }
  
    ids.forEach((datacenterId, index) => {
      deleteDataCenter(datacenterId, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) { // 마지막 데이터센터 삭제 후 이동
            onClose(); // Modal 닫기
            toast.success("데이터센터 삭제 완료")
            navigate('/computing/rutil-manager/datacenters');
          }
        },
        onError: (error) => {
          toast.error(`데이터센터 삭제 오류:`, error);
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
          <h1>데이터센터 삭제</h1>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="disk-delete-box">
          <div>
            <FontAwesomeIcon style={{ marginRight: '0.3rem' }} icon={faExclamationTriangle} />
            <span> {names.join(', ')} 를(을) 삭제하시겠습니까? </span>
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

export default DataCenterDeleteModal;
