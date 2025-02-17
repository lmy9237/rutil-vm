import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useDeleteDiskFromVM } from "../../../api/RQHook";

/**
 * @name VmDiskDeleteModal
 * @description ...
 * 
 * @param {boolean} isOpen ..
 * @returns
 * @deprecated
 */
const VmDiskDeleteModal = ({ isOpen, onClose, vmId, data }) => {
  const { mutate: deleteDisk } = useDeleteDiskFromVM();

  const [ids, setIds] = useState([]);
  const [alias, setAlias] = useState([]);
  const [detachOnlyList, setDetachOnlyList] = useState([]); // 디스크 완전삭제

  useEffect(() => {
    if (Array.isArray(data)) {
      const ids = data.map((item) => item.diskImageVo.id);
      const alias = data.map((item) => item.diskImageVo.alias);
      setIds(ids);
      setAlias(alias);
      setDetachOnlyList(Array(data.length).fill(true)); // 초기값 true
    } else if (data) {
      setIds([data?.id]);
      setAlias([data?.alias]);
      setDetachOnlyList([true]);
    }
  }, [data]);

  const handleFormSubmit = () => {
    if (!ids.length) {
      console.error("삭제할 디스크 ID가 없습니다.");
      return;
    }

    ids.forEach((diskAttachmentId, index) => {
      deleteDisk(
        { vmId, diskAttachmentId, detachOnly: !detachOnlyList[index] },
        {
          onSuccess: () => {
            if (ids.length === 1 || index === ids.length - 1) {
              toast.success("가상머신 디스크 삭제 완료");
              onClose();
            }
          },
          onError: (error) => {
            toast.error(`가상머신 디스크 삭제 오류:`, error);
          },
        }
      );
    });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"가상머신 디스크"}
      submitTitle={"삭제"}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="storage-delete-popup modal"> */}
      <div className="disk-delete-box">
        {ids.map((diskId, index) => (
          <div
            key={diskId}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <FontAwesomeIcon
              style={{ marginRight: "0.3rem" }}
              icon={faExclamationTriangle}
            />
            <span> {alias[index]} 를(을) 삭제하시겠습니까? </span>
            <label style={{ marginLeft: "0.5rem" }}>
              <input
                type="checkbox"
                checked={detachOnlyList[index]}
                onChange={() =>
                  setDetachOnlyList((prev) => {
                    const newList = [...prev];
                    newList[index] = !newList[index]; // 값 반전
                    return newList;
                  })
                }
              />
              완전 삭제
            </label>
          </div>
        ))}
      </div>
    </BaseModal>
  );
};

export default VmDiskDeleteModal;
