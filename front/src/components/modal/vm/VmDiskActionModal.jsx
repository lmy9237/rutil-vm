import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import {
  useActivateDiskFromVm,
  useDeactivateDiskFromVm,
} from "../../../api/RQHook";
import Logger from "../../../utils/Logger";
import Localization from "../../../utils/Localization";

/**
 * @name VmDiskActionModal
 * @description
 * 
 * @prop {boolean} isOpen ...
 * @prop {function} action ...
 * @prop {function} onClose ...
 * 
 * @returns 
 */
const VmDiskActionModal = ({
  isOpen, 
  action, 
  onClose, 
  vmId, 
  data 
}) => {
  const labelMap = {
    deactivate: "비활성화",
    activate: "활성화",
  };
  const contentLabel = useMemo(() => labelMap[action] || "", [action]);

  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.VM} ${Localization.kr.DISK} ${contentLabel} 완료`);
  };

  const { mutate: activateDisk } = useActivateDiskFromVm(onSuccess, () => onClose());
  const { mutate: deactivateDisk } = useDeactivateDiskFromVm(onSuccess, () => onClose());

  const actionMap = useMemo(() => ({
      deactivate: deactivateDisk,
      activate: activateDisk,
    }),[deactivateDisk, activateDisk]
  );

  const { ids, aliases } = useMemo(() => {
    const dataArray = Array.isArray(data) ? data : data ? [data] : [];
    return {
      ids: dataArray.map((item) => item.id),
      aliases: dataArray.map((item) => item.diskImageVo?.alias || "undefined"),
    };
  }, [data]);

  const handleFormSubmit = () => {
    if (!ids.length) return toast.error("ID가 없습니다.");

    const actionFn = actionMap[action];
    if (!actionFn) return toast.error(`알 수 없는 액션: ${action}`);

    ids.forEach((diskAttachId) => actionFn({ vmId: vmId, diskAttachmentId: diskAttachId }));
  };

  return (
    <BaseModal targetName={`${Localization.kr.VM} ${Localization.kr.DISK}`} submitTitle={contentLabel}
      isOpen={isOpen} onClose={onClose}
      promptText={`${aliases.join(", ")} 를(을) ${contentLabel}하시겠습니까?`}
      onSubmit={handleFormSubmit}contentStyle={{ width: "630px" }} 
      shouldWarn={true}
    >
    </BaseModal>
  );
};

export default VmDiskActionModal;
