import { useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import { useDeleteDiskFromVM } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import LabelCheckbox from "../../label/LabelCheckbox";
import Logger from "../../../utils/Logger";
import useUIState from "../../../hooks/useUIState";

/**
 * @name VmDiskDeleteModal
 * @description ...
 * 
 * @param {boolean} isOpen ..
 * @returns
 */
const VmDiskDeleteModal = ({ 
  isOpen, 
  onClose,
  vmId, 
  data,
}) => {
  // const { closeModal } = useUIState()
  const {
    mutate: deleteDisk
  } = useDeleteDiskFromVM(onClose, onClose);



  const { ids, aliases } = useMemo(() => {
    return {
      ids: [...data].map((item) => item?.id),
      aliases: [...data].map((item) => item?.diskImageVo?.alias || "undefined"),
    };
  }, [data]);

  const [detachOnlyList, setDetachOnlyList] = useState([false]); // 디스크 완전삭제

  const validateForm = () => {
    Logger.debug(`VmDiskDeleteModal > validateForm ... `)
    if (!ids.length) return `삭제할 ${Localization.kr.DISK} ID가 없습니다.`
    return null
  }

  const handleFormSubmit = useCallback(() => {
    const error = validateForm();
    if (error) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error,
      });
      return;
    }

    Logger.debug(`VmDiskDeleteModal ... data: `, data);
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
        <div key={diskId} className="f-btw">
          <span className="fs-16 p-3.5 w-full">{aliases[index]}</span>
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
