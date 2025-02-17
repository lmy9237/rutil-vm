import { useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BaseModal from "../BaseModal";
import { useDeleteHost } from "../../../api/RQHook";
import { warnButton } from "../../Icon";

/**
 * @name HostDeleteModal
 * @description ...
 *
 * @param {boolean} isOpen ...
 * @returns
 */
const HostDeleteModal = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();
  const { mutate: deleteHost } = useDeleteHost();

  const { ids, names } = useMemo(() => {
    if (!data) return { ids: [], names: [] };

    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name || "undefined"),
    };
  }, [data]);

  const handleDelete = () => {
    console.log("HostDeleteModal > handleDelete ... ");
    if (!ids.length) {
      toast.error("삭제할 호스트 ID가 없습니다.");
      return;
    }

    ids.forEach((hostId, index) => {
      deleteHost(hostId, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) {
            // 마지막 호스트 삭제 후 이동
            onClose(); // Modal 닫기
            toast.success("호스트 삭제 성공");
            // navigate('/computing/rutil-manager/hosts');
          }
        },
        onError: (error) => {
          toast.error(`호스트 삭제 오류:`, error);
        },
      });
    });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"호스트"}
      submitTitle={"삭제"}
      onSubmit={handleDelete}
    >
      {/* <div className="storage-delete-popup modal"> */}
      <div className="disk-delete-box">
        <div>
          {warnButton()}
          <span> {names.join(", ")} 를(을) 삭제하시겠습니까? </span>
        </div>
      </div>
    </BaseModal>
  );
};

export default HostDeleteModal;
