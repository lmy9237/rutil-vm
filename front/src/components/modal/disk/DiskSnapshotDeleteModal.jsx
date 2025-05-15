import { useMemo } from "react";
import useUIState from "../../../hooks/useUIState";
import BaseModal from "../BaseModal";
import { useDeleteSnapshot } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name DiskSnapshotDeleteModal 디스크 스냅샷 삭제 모달
 * @description ...
 * 
 * @param {boolean} isOpen ...
 * @returns {JSX.Element} DiskSnapshotDeleteModal
 * 
 * NOTE: 삭제처리를 직접 하지 않음으로 기능 배제
 */
const DiskSnapshotDeleteModal = ({ 
  isOpen,
  onClose,
  data, 
  vmId
}) => {
  // const { closeModal } = useUIState()
  const {
    mutate: deleteSnapshot
  } = useDeleteSnapshot(onClose, onClose); 

  const { ids, descriptions } = useMemo(() => {
    if (!data) return { ids: [], descriptions: [] };
    
    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      descriptions: dataArray.map((item) => `스냅샷 ${item?.vmSnapshot?.description || ''} 에서 디스크 ${item?.alias}` || 'undefined'),
    };
  }, [data]);
  
  const handleDelete = () => {
    Logger.debug(`DiskSnapshotDeleteModal > handleDelete ... `)
    if (!ids.length)
      return console.error('삭제할 스냅샷 ID가 없습니다.');    
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
    />
  );
};

export default DiskSnapshotDeleteModal;
