import React from "react";
import DomainModal from "./DomainModal";
import DomainDeleteModal from "./DomainDeleteModal";
import DomainActionModal from "./DomainActionModal";
import DomainAttachModal from "./DomainAttachModal";
import Logger from "../../../utils/Logger";
import DomainDestroyModal from "./DomainDestroyModal";
import DomainCheckModal from "./DomainCheckModal";
import DomainMainTenanceModal from "./DomainMainTenanceModal";

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
        actionType // true면 데이터센터에서 도메인를 바라봄 (도메인 목록이 뜸)
        domainId={domain?.id}
        datacenterId={datacenterId || ""}
        onClose={onClose}
      />
    ),
    action: (
      <DomainActionModal
        isOpen={["detach", "activate"].includes(activeModal)}
        action={activeModal}
        domains={selectedDomains}
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
