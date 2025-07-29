import React from "react";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import DiskModal                        from "./DiskModal";
import DiskUploadModal                  from "./DiskUploadModal";
import DiskActionModal                  from "./DiskActionModal";
import DiskImageTransferActionModal     from "./DiskImageTransferActionModal";
import {
  useDeleteDisk
} from "@/api/RQHook";
import DeleteModal                      from "@/utils/DeleteModal";
import Localization                     from "@/utils/Localization";
import "./MDisk.css";

const DiskModals = ({ 
  disk,
}) => {
  const { activeModal, closeModal } = useUIState()
  const { disksSelected } = useGlobal()

  /* 디스크 이동,복사 구분 */
  const modalKey = typeof activeModal === "function" ? activeModal() : activeModal;
  const modalValue = Array.isArray(modalKey) ? modalKey[0] : modalKey;
  const isAction = [
    "disk:copy",
    "disk:move",
  ].includes(modalValue);
  const isItAction = [
    "disk:cancelit", // 이미지 전송 취소
    "disk:pauseit",  // 이미지 전송 일시정지
    "disk:resumeit", // 이미지 전송 재개
  ].includes(modalValue);
  const actionType = isAction ? modalValue.split(":")[1] : null;

  const modals = {
    create: (
      <DiskModal key={"disk:create"} isOpen={activeModal().includes("disk:create")}
        onClose={() => closeModal("disk:create")}
      />
    ), update: (
      <DiskModal key={"disk:update"} isOpen={activeModal().includes("disk:update")} editMode 
        onClose={() => closeModal("disk:update")}
      />
    ), remove: (
      <DeleteModal key={"disk:remove"} isOpen={activeModal().includes("disk:remove")}
        onClose={() => closeModal("disk:remove")}
        label={Localization.kr.DISK}
        data={disksSelected}
        api={useDeleteDisk()}
        shouldRedirect={false}
      />
    ), upload: (
      <DiskUploadModal key={activeModal()} isOpen={activeModal().includes("disk:upload")} 
        onClose={() => closeModal("disk:upload")}
      />
    ), upload: (
      <DiskUploadModal key={activeModal()} isOpen={activeModal().includes("disk:upload")} 
        onClose={() => closeModal("disk:upload")}
      />
    ), action: (
      <DiskActionModal key={modalValue} isOpen={isAction}
        onClose={() => closeModal(modalValue)}
      />
    ), itaction: (
      <DiskImageTransferActionModal key={modalValue} isOpen={isItAction}
        onClose={() => closeModal(modalValue)}
      />
    )
  };

  return (
    <>
      {Object.keys(modals).filter((key) =>
        modalValue === `disk:${key}` ||
        (key === "action" && isAction) ||
        (key === "itaction" && isItAction)
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default DiskModals;
