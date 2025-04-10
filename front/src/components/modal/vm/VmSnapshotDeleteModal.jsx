import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useDeleteSnapshot } from "../../../api/RQHook";
import { useMemo } from "react";
import toast from "react-hot-toast";

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
    <BaseModal targetName={"스냅샷"} submitTitle={"삭제"}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleDelete}
      contentStyle={{ width: "600px" }}
    >
      <div className="disk-delete-box">
        <FontAwesomeIcon style={{ marginRight: "0.3rem" }}icon={faExclamationTriangle}/>
        <span> {descriptions.join(", ")} 를(을) 삭제하시겠습니까? </span>
      </div>
     
    </BaseModal>
  );
};

export default VmSnapshotDeleteModal;
