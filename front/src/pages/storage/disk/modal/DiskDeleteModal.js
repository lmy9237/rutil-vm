import React, { useMemo } from 'react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { warnButton, xButton } from '../../../../utils/Icon';
import { useDeleteDisk } from '../../../../api/RQHook';

const DiskDeleteModal = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();
  const { mutate: deleteDisk } = useDeleteDisk();
  
  const { ids, aliass } = useMemo(() => {
    if (!data) return { ids: [], aliass: [] };
    
    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      aliass: dataArray.map((item) => item.alias || 'undefined'),
    };
  }, [data]);

  const handleDelete = () => {
    if (!ids.length) return console.error('삭제할 디스크 ID가 없습니다.');    
  
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
        },
      });
    });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="Modal" overlayClassName="Overlay" shouldCloseOnOverlayClick={false} >
      <div className="storage-delete-popup modal">
        <div className="popup-header">
          <h1>디스크 삭제</h1>
          <button onClick={onClose}>{ xButton() }</button>
        </div>

        <div className="disk-delete-box">
          <div>
            { warnButton() }
            <span> {aliass.join(', ')} 를(을) 삭제하시겠습니까? </span>
          </div>
        </div>

        <div className="edit-footer">
          <button style={{ display: 'none' }}></button>
          <button onClick={handleDelete}>OK</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default DiskDeleteModal;

