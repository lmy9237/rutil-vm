import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BaseModal from "../components/modal/BaseModal";
import Logger from "./Logger";

const DeleteModal = ({
  isOpen=false, 
  onClose, 
  label, 
  data, 
  api, 
  navigation
}) => {
  const navigate = useNavigate();
  const { mutate: deleteApi } = api;

  const location = useLocation(); // 삭제했을때 세부페이지면 그전으로 돌아가기
  const hasUUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(location.pathname);

  const { ids, names } = useMemo(() => {
    if (!data) return { ids: [], names: [] };

    const dataArray = Array.isArray(data) ? data : [data];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => {
        return item?.name || item?.alias || item?.description /* 디스크일 때 */
      }),
    };
  }, [data]);

  const handleFormSubmit = () => {
    if (!ids.length) {
      Logger.error(`삭제할 ${label} ID가 없습니다.`);
      return;
    }

    ids.forEach((id, index) => {
      deleteApi(id, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) {
            onClose();
            toast.success(`${label} 삭제 완료`);
            hasUUID ? navigate(-1) : navigate(navigation);
          }
        },
        onError: (error) => {
          toast.success(`${label} 삭제 완료 ${error.message}`);
        },
      });
    });
  };

  Logger.debug("DeleteModal ...")
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={label}
      shouldWarn={true}
      submitTitle={"삭제"}
      promptText={`${JSON.stringify(names.join(", "), null, 2)} 를(을) 삭제하시겠습니까?`}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "660px", height: "200px" }}
    />
  );
};

export default DeleteModal;
