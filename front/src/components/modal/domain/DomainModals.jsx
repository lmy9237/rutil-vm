import React from "react";
import useUIState from "../../../hooks/useUIState";
import DomainModal from "./DomainModal";
import DomainDeleteModal from "./DomainDeleteModal";
import DomainAttachModal from "./DomainAttachModal";
import DomainDestroyModal from "./DomainDestroyModal";
import DomainCheckModal from "./DomainCheckModal";
import DomainActivateModal from "./DomainActivateModal";
import DomainDetachModal from "./DomainDetachModal";
import DomainImportModal from "./DomainImportModal";
import DomainMaintenanceModal from "./DomainMaintenanceModal";

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
const DomainModals = ({
  domain,
  datacenterId,
}) => {
  const { activeModal, setActiveModal, } = useUIState()
  // const { domainsSelected } = useGlobal()

  const modals = {
    create: (
      <DomainModal key={activeModal()} isOpen={activeModal() === "domain:create"}
        onClose={() => setActiveModal(null)}
        datacenterId={datacenterId}
      />
    ), update: (
      <DomainModal key={activeModal()} isOpen={activeModal() === "domain:update"}
        onClose={() => setActiveModal(null)}
        editMode
        mode={activeModal()}
        // domainId={domain?.id ?? domainsSelected[0]?.id}
      />
    ), import: (
      <DomainImportModal key={activeModal()} isOpen={activeModal() === "domain:import"}
        onClose={() => setActiveModal(null)}
        // mode={activeModal()}
      />
    ), remove: (
      <DomainDeleteModal key={activeModal()} isOpen={activeModal() === "domain:remove"}
        onClose={() => setActiveModal(null)}
        deleteMode={true}
      />
    ), destroy: (
      <DomainDestroyModal key={activeModal()} isOpen={activeModal() === "domain:destroy"}
        onClose={() => setActiveModal(null)}
        domain={domain}
      />
    ), attach: (
      <DomainAttachModal key={activeModal()} isOpen={activeModal() === "domain:attach"}
        onClose={() => setActiveModal(null)}
        actionType // true면 데이터센터에서 도메인를 바라봄 (도메인 목록이 뜸)
      />
    ), activate: (
      <DomainActivateModal isOpen={activeModal() === "domain:activate"}
        onClose={() => setActiveModal(null)}
      />
    ), detach: (
      <DomainDetachModal isOpen={activeModal() === "domain:detach"}
        onClose={() => setActiveModal(null)}
      />
    ), maintenance: (
      <DomainMaintenanceModal key={activeModal()} isOpen={activeModal() === "domain:maintenance"}
        onClose={() => setActiveModal()}
      />
      /*
      <DomainCheckModal // 도메인 확인
        isOpen={activeModal() === "maintenance"}
        onClose={onClose}
      />
      */
    ),
    /*
    <CancelModal
      isOpen={isCancelModalOpen}
      onClose={() => setIsCancelModalOpen(false)}
    />
    <DomainDestroyModal
      isOpen={isDomainDestroyModalOpen}
      onClose={() => setIsDomainDestroyModalOpen(false)}
    />
    <DomainMainTenanceModal
      isOpen={isDomainMainTenanceModalOpen}
      onClose={() => setIsDomainMainTenanceModalOpen(false)}
    />
    <DomainCheckModal
      isOpen={isDomainCheckModalOpen}
      onClose={() => setIsDomainCheckModalOpen(false)}
    />
    */
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal() === `domain:${key}`
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default DomainModals;
