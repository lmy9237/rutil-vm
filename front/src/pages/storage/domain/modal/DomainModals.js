import React from "react";
import DomainModal from "./DomainModal";
import DomainDeleteModal from "./DomainDeleteModal";
import DomainActionModal from "./DomainActionModal";
import DomainAttachModal from "./DomainAttachModal";

const DomainModals = ({ activeModal, domain, selectedDomains = [], datacenterId, onClose }) => {
  const modals = {
    create: (
      <DomainModal
        isOpen={activeModal === 'create'}
        mode={activeModal}
        datacenterId={datacenterId}
        onClose={onClose}
      />
    ),
    edit: (
      <DomainModal
        isOpen={activeModal === 'edit'}
        mode={activeModal}
        domainId={domain?.id}
        onClose={onClose}
      />
    ),
    import: (
      <DomainModal
        isOpen={activeModal === 'import'}
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
        isOpen={activeModal === 'delete' }
        data={selectedDomains}
        deleteMode={true}
        onClose={onClose}
      />
    ),
    destroy: (
      <DomainDeleteModal
        isOpen={activeModal === 'destroy'}
        data={selectedDomains}
        deleteMode={false}
        onClose={onClose}
      />
    ),
    action: (
      <DomainActionModal
        isOpen={['detach', 'activate', 'maintenance'].includes(activeModal)}
        action={activeModal}
        data={selectedDomains}
        datacenterId={datacenterId}
        onClose={onClose}
      />
    ),
    attach: (
      <DomainAttachModal
        isOpen={activeModal === 'attach'}
        data={selectedDomains}
        onClose={onClose}
      />
    )
  };

  return (
    <>
      {Object.keys(modals).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default DomainModals;
