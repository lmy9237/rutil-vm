import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useDeleteSnapshot } from "../../../api/RQHook";

/**
 * @name VmSnapshotDeleteModal
 * @description ...
 * 
 * @param {boolean} isOpen ...
 * @returns 
 */
const VmSnapshotDeleteModal = ({ isOpen, onClose, data, vmId }) => {
  const [ids, setIds] = useState([]);
  const [names, setNames] = useState([]);
  const { mutateAsync: deleteSnapshot } = useDeleteSnapshot(); // 비동기 처리 지원

  useEffect(() => {
    if (Array.isArray(data)) {
      setIds(data.map((item) => item.id));
      setNames(data.map((item) => item.name || "Unnamed Snapshot"));
    } else if (data) {
      setIds([data.id]);
      setNames([data.name || "Unnamed Snapshot"]);
    }
  }, [data]);

  const handleFormSubmit = async () => {
    if (!ids.length) {
      console.error("삭제할 스냅샷 ID가 없습니다.");
      return;
    }

    console.log("Attempting to delete snapshots sequentially:", ids);

    for (const snapshotId of ids) {
      try {
        await deleteSnapshot({ vmId, snapshotId }); // 순차적으로 삭제
        console.log(`Snapshot ${snapshotId} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting snapshot ${snapshotId}:`, error);
        // 실패한 경우 추가 처리 가능 (예: 특정 ID 기록)
      }
    }

    console.log("All snapshot deletion attempts completed.");
    onClose(); // 삭제 완료 후 모달 닫기
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"스냅샷"}
      submitTitle={"삭제"}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="storage-delete-popup"> */}
      <div className="disk-delete-box">
        <div>
          <FontAwesomeIcon
            style={{ marginRight: "0.3rem" }}
            icon={faExclamationTriangle}
          />
          <span> {names.join(", ")} 를(을) 삭제하시겠습니까? </span>
        </div>
      </div>
    </BaseModal>
  );
};

export default VmSnapshotDeleteModal;
