import { useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BaseModal from "../BaseModal";
import { warnButton } from "../../Icon";
import { useDeleteCluster } from "../../../api/RQHook";

const ClusterDeleteModal = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();
  const { 
    mutate: deleteCluster
  } = useDeleteCluster();

  const { ids, names } = useMemo(() => {
    if (!data) return { ids: [], names: [] };

    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name || "undefined"),
    };
  }, [data]);

  const handleDelete = () => {
    if (ids.length === 0) {
      const msgErr = "삭제할 클러스터 ID가 없습니다.";
      console.error(msgErr);
      return toast.error(msgErr);
    }

    ids.forEach((clusterId, index) => {
      deleteCluster(clusterId, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) {
            // 마지막 클러스터 삭제 후 이동
            onClose();
            toast.success("클러스터 삭제 성공");
            // navigate('/computing/rutil-manager/clusters');
          }
        },
        onError: (error) => {
          toast.error(`클러스터 삭제 오류:`, error);
        },
      });
    });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"클러스터"}
      submitTitle={"삭제"}
      onSubmit={handleDelete}
    >
      {/* <div className="storage-delete-popup"> */}
      <div className="disk-delete-box">
        <div>
          {warnButton()}
          <span> {names.join(", ")} 를(을) 삭제하시겠습니까? </span>
        </div>
      </div>
    </BaseModal>
  );
};

export default ClusterDeleteModal;
