import React, { useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BaseModal from "../BaseModal";
import { warnButton, xButton } from "../../Icon";
import { useDeleteDataCenter } from "../../../api/RQHook";

const DataCenterDeleteModal = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();
  const {
    mutate: deleteDataCenter
  } = useDeleteDataCenter();

  const { ids, names } = useMemo(() => {
    if (!data) return { ids: [], names: [] };

    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name),
    };
  }, [data]);

  const handleDelete = () => {
    if (!ids.length) {
      const msgWarn = "삭제할 데이터센터 ID가 없습니다."
      console.warn(msgWarn)
      return toast.warn(msgWarn);
    }

    ids.forEach((datacenterId, index) => {
      deleteDataCenter(datacenterId, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) {
            onClose();
            toast.success("데이터센터 삭제 완료");
            navigate("/computing/rutil-manager/datacenters");
          }
        },
        onError: (error) => {
          toast.success("데이터센터 삭제 오류:", error.message);
        },
      });
    });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"데이터센터"}
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

export default DataCenterDeleteModal;
