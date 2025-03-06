import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import BaseModal from "../BaseModal";
import { warnButton, xButton } from '../../Icon';
import { useDeleteDisk } from '../../../api/RQHook';

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

  console.log("...")
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"디스크"}
      submitTitle={"삭제"}
      onSubmit={handleDelete}
      contentStyle={{ width: "600px", height: "190px" }}
    >
      <div className="popup-content-outer">
        <div className="disk-delete-box">
          <div>
            { warnButton() }
            <span> {aliass.join(', ')} 를(을) 삭제하시겠습니까? </span>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default DiskDeleteModal;

