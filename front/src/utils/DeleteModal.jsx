import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BaseModal from "../components/modal/BaseModal";
import Logger from "./Logger";
import { RVI16, rvi16ChevronRight } from "../components/icons/RutilVmIcons";
import Localization from "./Localization";

const DeleteModal = ({
  isOpen=false, 
  onClose, 
  label="", 
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

    const dataArray = !Array.isArray(data) ? [data] : data;
    return {
      ids: dataArray.map((item) => item?.id || item?.username),
      names: dataArray.map((item) => item?.name || item?.alias || item?.description || item?.username),
    };
  }, [data]);

  const handleFormSubmit = () => {
    if (!ids.length) {
      Logger.error(`${Localization.kr.REMOVE}할 ${label} ID가 없습니다.`);
      return;
    }
  
    ids.forEach((id, index) => {
      deleteApi(id, {
        onSuccess: () => {
          if (ids.length === 1 || index === ids.length - 1) {
            onClose();
            toast.success(`[200] ${label} ${Localization.kr.REMOVE} 요청완료`);
  
            const currentPath = location.pathname;
            const uuidRegex = /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  
            if (uuidRegex.test(currentPath)) {
              // UUID가 포함된 상세 경로 → 상위 경로로 이동
              const parentPath = currentPath.replace(uuidRegex, "");
              navigate(parentPath);
            }
            // UUID가 없으면 아무 것도 하지 않음 → 현재 화면 유지
          }
        },
        onError: (error) => {
          toast.error(`${label} ${Localization.kr.REMOVE} 요청완료: ${error.message}`);
        },
      });
    });
  };
  
  Logger.debug("DeleteModal ...")
  return (
    <BaseModal
      isOpen={isOpen} onClose={onClose}
      targetName={label}
      shouldWarn={true}
      submitTitle={Localization.kr.REMOVE}
      promptText={`다음 항목을 ${Localization.kr.REMOVE}하시겠습니까?`}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "660px" }}
    >
      {names.map((name, index) => (
        <div className="p-1.5 font-bold flex f-start" key={index}> 
          <RVI16 iconDef={rvi16ChevronRight("black")} className="mr-2"/>
          {name}
        </div>
      ))}
      <br/>
  </BaseModal>
  );
};

export default DeleteModal;
