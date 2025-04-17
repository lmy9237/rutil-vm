import React from "react";
import DomainModal from "./DomainModal";
import DomainDeleteModal from "./DomainDeleteModal";
import DomainAttachModal from "./DomainAttachModal";
import Logger from "../../../utils/Logger";
import DomainDestroyModal from "./DomainDestroyModal";
import DomainCheckModal from "./DomainCheckModal";
import DomainMainTenanceModal from "./DomainMainTenanceModal";
import DomainActivateModal from "./DomainActivateModal";
import DomainDetachModal from "./DomainDetachModal";

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
  activeModal,
  domain,
  selectedDomains = [],
  datacenterId,
  sourceContext, // all, dcDomain, domainDc
  onClose,
}) => {
  const modals = {
    create: (
      <DomainModal
        isOpen={activeModal === "create"}
        mode={activeModal}
        datacenterId={datacenterId}
        onClose={onClose}
      />
    ),
    edit: (
      <DomainModal
        isOpen={activeModal === "edit"}
        mode={activeModal}
        domainId={domain?.id}
        onClose={onClose}
      />
    ),
    import: (
      <DomainModal
        isOpen={activeModal === "import"}
        mode={activeModal}
        domainId={domain?.id}
        onClose={onClose}
      />
      // <DomainImportModal
      //   isOpen={activeModal === 'import'}
      //   domainId={domain?.id}
      //   onClose={onClose}
      // />
    ),
    delete: (
      <DomainDeleteModal
        isOpen={activeModal === "delete"}
        domain={domain}
        onClose={onClose}
      />
    ),
    destroy: (
      <DomainDestroyModal
        isOpen={activeModal === "destroy"}
        domain={domain}
        onClose={onClose}
      />
    ), 
    attach: (
      <DomainAttachModal
        isOpen={activeModal === "attach"}
        sourceContext={sourceContext}
        domainId={domain?.id}
        datacenterId={datacenterId || ""}
        onClose={onClose}
      />
    ),
    activate: (
      <DomainActivateModal
        isOpen={activeModal === "activate"}
        domains={selectedDomains}
        datacenterId={datacenterId}
        onClose={onClose}
      />
    ),
    detach: (
      <DomainDetachModal
        isOpen={activeModal === "detach"}
        sourceContext={sourceContext}
        domain={domain}
        datacenterId={datacenterId}
        onClose={onClose}
      />
    ),
    maintenance: (
      <DomainMainTenanceModal
        isOpen={activeModal === "maintenance"}
        domains={selectedDomains}
        datacenterId={datacenterId}
        onClose={onClose}
      />
      // <DomainCheckModal // 도메인 확인
      //   isOpen={activeModal === "maintenance"}
      //   onClose={onClose}
      // />
    ),

    // <CancelModal
    //   isOpen={isCancelModalOpen}
    //   onClose={() => setIsCancelModalOpen(false)}
    // />
    // <DomainDestroyModal
    //   isOpen={isDomainDestroyModalOpen}
    //   onClose={() => setIsDomainDestroyModalOpen(false)}
    // />
    // <DomainMainTenanceModal
    //   isOpen={isDomainMainTenanceModalOpen}
    //   onClose={() => setIsDomainMainTenanceModalOpen(false)}
    // />
    // <DomainCheckModal
    //   isOpen={isDomainCheckModalOpen}
    //   onClose={() => setIsDomainCheckModalOpen(false)}
    // />
   
  };

  Logger.debug("DomainModals ...")
  return (
    <>
      {Object.keys(modals).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default DomainModals;
