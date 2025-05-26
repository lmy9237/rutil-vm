import React, { useCallback, useMemo } from "react";
import { useToast }           from "@/hooks/use-toast";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import BaseModal              from "../BaseModal";
import {
  usePreviewSnapshot,
  useCommitSnapshot,
  useUndoSnapshot
} from "@/api/RQHook";
import Localization from "@/utils/Localization";
import Logger from "@/utils/Logger";

/**
 * @name VmSnapshotActionModal
 * @description 가상머신 스냅샷 액션 모달
 * 
 * @returns {JSX.Element} VmSnapshotActionModal
 */
const VmSnapshotActionModal = ({
  isOpen, 
  onClose, 
}) => {
  const { toast } = useToast();
  const ACTIONS = useMemo(() => ({
    "vmsnapshot:preview": { label: Localization.kr.PREVIEW, hook: usePreviewSnapshot },
    "vmsnapshot:commit": { label: Localization.kr.COMMIT, hook: useCommitSnapshot },
    "vmsnapshot:undo": { label: Localization.kr.UNDO, hook: useUndoSnapshot },
  }), [])

  const { activeModal } = useUIState()
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

  const promptTextByAction = useMemo(() => (
    (activeModal().includes("vmsnapshot:undo")) /* 되돌리기 */
      ? `전 상태로 ${label} 하시겠습니까 ?`
      : `${Localization.kr.SNAPSHOT} "${names.join(", ")}" 를(을) ${label} 하시겠습니까?`
  ), [names, label])

  const validateForm = () => {
    Logger.debug(`VmSnapshotActionModal > validateForm ... `)
    if (!mutate) return `알 수 없는 액션: ${activeModal()[0]}`
    if (!ids.length) return "ID가 없습니다.";
    return null;
  }

  const handleSubmit = () => {
    const error = validateForm();
    if (error) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error,
      });
      return;
    }

    Logger.debug(`VmSnapshotActionModal > handleSubmit ... `)
    ids.forEach((id) => {
      if (activeModal().includes("vmsnapshot:preview")) /* 미리보기 */
        mutate({ vmId: vmSelected1st?.id, snapshotId: id})
      else 
        mutate({ vmId: vmSelected1st?.id })
    });
  }

  return (
    <BaseModal targetName={Localization.kr.SNAPSHOT} submitTitle={label}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleSubmit}
      promptText={promptTextByAction}
      contentStyle={{ width: "650px" }}
      shouldWarn={true}
    />
  );
}

export default VmSnapshotActionModal;
