import BaseModal from "../BaseModal";
import { useDeleteSnapshot } from "../../../api/RQHook";
import { useMemo } from "react";
import toast from "react-hot-toast";
import Localization from "../../../utils/Localization";

/**
 * @name VmSnapshotDeleteModal
 * @description ...
 * 
 * @param {boolean} isOpen ...
 * @returns 
 */
const VmSnapshotDeleteModal = ({ isOpen, onClose, data, vmId }) => {
  const onSuccess = () => {
    toast.success(`스냅샷 삭제 완료`);
    onClose();
  };
  const { mutate: deleteSnapshot } = useDeleteSnapshot(onSuccess, () => onClose()); 

  const { ids, descriptions } = useMemo(() => {
    if (!data) return { ids: [], descriptions: [] };
    
    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      descriptions: dataArray.map((item) => item.description || 'undefined'),
    };
  }, [data]);
  
  const handleDelete = () => {
    if (!ids.length) return console.error('삭제할 스냅샷 ID가 없습니다.');    
  
    ids.forEach((snapshotId) => {
      deleteSnapshot({vmId, snapshotId});
    });
  };

  return (
    <BaseModal targetName={Localization.kr.SNAPSHOT} submitTitle={Localization.kr.REMOVE}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleDelete}
      promptText={`${descriptions.join(", ")} 를(을) ${Localization.kr.REMOVE}하시겠습니까?`}
      contentStyle={{ width: "600px" }}
      shouldWarn={true}
    >     
    </BaseModal>
  );
};

export default VmSnapshotDeleteModal;
