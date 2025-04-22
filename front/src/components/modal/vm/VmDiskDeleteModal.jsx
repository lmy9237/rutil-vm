import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import { useDeleteDiskFromVM } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import LabelCheckbox from "../../label/LabelCheckbox";
import Logger from "../../../utils/Logger";

/**
 * @name VmDiskDeleteModal
 * @description ...
 * 
 * @param {boolean} isOpen ..
 * @returns
 */
const VmDiskDeleteModal = ({ 
  isOpen, 
  vmId, 
  data,
  onClose, 
}) => {
  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.VM} ${Localization.kr.DISK} ${Localization.kr.REMOVE} 완료`);
  };
  const { mutate: deleteDisk } = useDeleteDiskFromVM(onSuccess, () => onClose());

  Logger.debug(`VmDiskDeleteModal ... data: `, data);

  const { ids, aliases } = useMemo(() => {
    return {
      ids: [...data].map((item) => item?.id),
      aliases: [...data].map((item) => item?.diskImageVo?.alias || "undefined"),
    };
  }, [data]);

  const [detachOnlyList, setDetachOnlyList] = useState([false]); // 디스크 완전삭제

  const handleFormSubmit = useCallback(() => {
    if (!ids.length) {
      return toast.error(`삭제할 ${Localization.kr.DISK} ID가 없습니다.`)
    }

    [...ids]?.forEach((diskAttachmentId, index) => {
      deleteDisk({ vmId, diskAttachmentId, detachOnly: detachOnlyList[index] });
    });
  }, [ids]);

  return (
    <BaseModal targetName={`${Localization.kr.VM} ${Localization.kr.DISK}`} submitTitle={Localization.kr.REMOVE}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      promptText={`다음 항목을 삭제하시겠습니까?`}
      contentStyle={{ width: "630px" }}
      shouldWarn={true}
    >
      {ids.map((diskId, index) => (
        <div key={diskId} className="disk-delete-checkbox f-btw">
          <div className="disk-delete-label">{aliases[index]}</div>
          <LabelCheckbox label={`완전 ${Localization.kr.REMOVE}`}
            id={`diskDelete-${index}`}
            checked={detachOnlyList[index] || false}
            onChange={() =>
              setDetachOnlyList((prev) => {
                const newList = [...prev];
                newList[index] = !newList[index]; // 값 반전
                return newList;
              })
            }
          />
          {/* <span>{detachOnlyList[index] === true ? "A" : "B"}</span> */}
        </div>
      ))}
    </BaseModal>
  );
};

export default VmDiskDeleteModal;
