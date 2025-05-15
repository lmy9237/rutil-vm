import { useMemo } from "react";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
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
  onClose,
  action, 
  vmId, 
  data 
}) => {
  // const { closeModal } = useUIState()
  const labelMap = {
    "vmdisk:deactivate": "비활성화",
    "vmdisk:activate": "활성화",
  };
  const contentLabel = useMemo(() => labelMap[action] || "", [action]);

  const { mutate: activateDisk } = useActivateDiskFromVm(onClose, onClose);
  const { mutate: deactivateDisk } = useDeactivateDiskFromVm(onClose, onClose);

  const actionMap = useMemo(() => ({
      "vmdisk:deactivate": deactivateDisk,
      "vmdisk:activate": activateDisk,
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
    Logger.debug(`VmDiskActionModal > handleFormSubmit ... `)
    if (!ids.length) return toast.error("ID가 없습니다.");

    const actionFn = actionMap[action];
    if (!actionFn) return toast.error(`알 수 없는 액션: ${action}`);

    ids.forEach((diskAttachId) => actionFn({ vmId: vmId, diskAttachmentId: diskAttachId }));
  };

  return (
    <BaseModal targetName={`${Localization.kr.VM} ${Localization.kr.DISK}`} submitTitle={contentLabel}
      isOpen={isOpen} onClose={onClose}
      promptText={`${aliases.join(", ")} 를(을) ${contentLabel} 하시겠습니까?`}
      onSubmit={handleFormSubmit}contentStyle={{ width: "630px" }} 
      shouldWarn={true}
    >
    </BaseModal>
  );
};

export default VmDiskActionModal;
