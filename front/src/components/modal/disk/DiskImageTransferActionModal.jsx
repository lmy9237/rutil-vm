import React from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "@/components/modal/BaseModal";
import {
  useCancelImageTransfer4Disk,
  usePauseImageTransfer4Disk,
  useResumeImageTransfer4Disk,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const ACTIONS = {
  "disk:cancelit":   { label: Localization.kr.CANCEL,      hook: useCancelImageTransfer4Disk },
  "disk:pauseit":    { label: Localization.kr.PAUSE,       hook: usePauseImageTransfer4Disk },
  "disk:resumeit":   { label: Localization.kr.RESUME,      hook: useResumeImageTransfer4Disk },
};

/**
 * @name DiskImageTransferActionModal
 * 디스크 이미지 전송
 * 
 * @param {boolean} isOpen
 * @param {function} onClose
 * 
 * @returns {JSX.Element} DiskImageTransferActionModal
 */
const DiskImageTransferActionModal = ({
  isOpen,
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  const { activeModal, closeModal } = useUIState();
  const { disksSelected } = useGlobal();
  const { label = "", hook } = ACTIONS[activeModal()] || {};
  const { mutate } = hook ? hook(closeModal, closeModal) : { mutate: null };

  const { ids, names } = useMemo(() => {
    return {
      ids: [...disksSelected].map((item) => item.id),
      names: [...disksSelected].map((item) => item.name || "undefined"),
    };
  }, [disksSelected]);

  const validateForm = () => {
    Logger.debug(`DiskImageTransferActionModal > validateForm ... `)
    if (!mutate) return `알 수 없는 액션: ${activeModal()}`;
    if (!ids.length) return "ID가 없습니다.";
    return null
  }

  const handleSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    Logger.debug(`DiskImageTransferActionModal > handleSubmit ... `)
    ids.forEach((id) => mutate(id));
  };

  return (
    <BaseModal targetName={Localization.kr.IMAGE_TRANSFER} submitTitle={label}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleSubmit}
      promptText={`${names.join(", ")} 를(을) ${label} 하시겠습니까?`}
      contentStyle={{ width: "650px" }}
      shouldWarn={true}
    />
  );
};

export default DiskImageTransferActionModal;
