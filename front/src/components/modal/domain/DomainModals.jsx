import React from "react";
import useUIState             from "@/hooks/useUIState";
import DomainModal            from "./DomainModal";
import DomainDeleteModal      from "./DomainDeleteModal";
import DomainAttachModal      from "./DomainAttachModal";
import DomainDestroyModal     from "./DomainDestroyModal";
import DomainCheckModal       from "./DomainCheckModal";
import DomainActivateModal    from "./DomainActivateModal";
import DomainDetachModal      from "./DomainDetachModal";
import DomainImportModal      from "./DomainImportModal";
import DomainMaintenanceModal from "./DomainMaintenanceModal";
import DomainGetDiskModal     from "./DomainImportDiskModal";

/**
 * @name DomainModals
 * @description 도메인 모달
 *
 * @param {boolean} isOpen
 *
 * @returns
 * 
 * @see DomainModal
 * @see DomainDeleteModal
 * @see DomainActionModal
 * @see DomainAttachModal
 */
const DomainModals = () => {
  const { activeModal, closeModal } = useUIState()
  // const { domainsSelected } = useGlobal()

  const modals = {
    create: (
      <DomainModal key={"domain:create"} isOpen={activeModal().includes("domain:create")}
        onClose={() => closeModal("domain:create")}
      />
    ), update: (
      <DomainModal key={"domain:update"} isOpen={activeModal().includes("domain:update")}
        onClose={() => closeModal("domain:update")}
        editMode
        mode={"domain:update"}
      />
    ), import: (
      <DomainImportModal key={"domain:import"} isOpen={activeModal().includes("domain:import")} 
        onClose={() => closeModal("domain:import")}
      />
    ), remove: (
      <DomainDeleteModal key={"domain:remove"} isOpen={activeModal().includes("domain:remove")}
        onClose={() => closeModal("domain:remove")}
        deleteMode={true}
      />
    ), destroy: (
      <DomainDestroyModal key={"domain:destroy"} isOpen={activeModal().includes("domain:destroy")} 
        onClose={() => closeModal("domain:destroy")}
      />
    ), attach: (
      <DomainAttachModal key={"domain:attach"} isOpen={activeModal().includes("domain:attach")}
        onClose={() => closeModal("domain:attach")}
        actionType // true면 데이터센터에서 도메인를 바라봄 (도메인 목록이 뜸)
      />
    ), detach: (
      <DomainDetachModal key={"domain:detach"} isOpen={activeModal().includes("domain:detach")} 
        onClose={() => closeModal("domain:detach")}
      />
    ), activate: (
      <DomainActivateModal key={"domain:activate"} isOpen={activeModal().includes("domain:activate")} 
        onClose={() => closeModal("domain:activate")}
      />
    ), importDisk: (
      <DomainGetDiskModal key={"domain:importDisk"} isOpen={activeModal().includes("domain:importDisk")} 
        onClose={() => closeModal("domain:importDisk")}
      />
    ), maintenance: (
      <DomainMaintenanceModal key={"domain:maintenance"} isOpen={activeModal().includes("domain:maintenance")} 
        onClose={() => closeModal("domain:maintenance")}
      />
    ),
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`domain:${key}`)
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default DomainModals;
