import React, { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import BaseModal from "../BaseModal";
import {
  usePreviewSnapshot,
  useCommitSnapshot,
  useUndoSnapshot
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name VmSnapshotActionModal
 * @description 가상머신 스냅샷 액션 모달
 * 
 * @returns {JSX.Element} VmSnapshotActionModal
 */
const VmSnapshotActionModal = ({
  isOpen, 
  onClose
}) => {
  const ACTIONS = useMemo(() => ({
    "vmsnapshot:preview": { label: Localization.kr.PREVIEW, hook: usePreviewSnapshot },
    "vmsnapshot:commit": { label: Localization.kr.COMMIT, hook: useCommitSnapshot },
    "vmsnapshot:undo": { label: Localization.kr.UNDO, hook: useUndoSnapshot },
  }), [])

  const { activeModal, setActiveModal } = useUIState()
  const { vmsSelected, snapshotsSelected } = useGlobal()
  const vmSelected1st = [...vmsSelected][0] ?? null

  const { label = "", hook } = ACTIONS[activeModal()] || {};
  const { mutate } = hook ? hook(onClose, onClose) : { mutate: null };

  const { ids, names } = useMemo(() => {
    return {
      ids: [...snapshotsSelected].map((item) => item?.id),
      names: [...snapshotsSelected].map((item) => item?.description || "undefined"),
    };
  }, [snapshotsSelected]);

  const handleSubmit = useCallback(() => {
    if (!mutate) return toast.error(`알 수 없는 액션: ${activeModal()}`);
    if (!ids.length) return toast.error("ID가 없습니다.");

    ids.forEach((id) => {
      if (activeModal() === "vmsnapshot:preview")
        mutate({ vmId: vmSelected1st?.id, snapshotId: id})
      else 
        mutate({ vmId: vmSelected1st?.id })
    });
  });

  return (
    <BaseModal targetName={Localization.kr.SNAPSHOT} submitTitle={label}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleSubmit}
      promptText={`${Localization.kr.SNAPSHOT} "${names.join(", ")}" 를(을) ${label} 하시겠습니까?`}
      contentStyle={{ width: "650px" }}
      shouldWarn={true}
    />
  );
}

export default VmSnapshotActionModal;
