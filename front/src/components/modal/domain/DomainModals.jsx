import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
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
  domain,
  datacenterId,
  sourceContext, // all, dcDomain, domainDc
  onClose,
}) => {
  const { activeModal, setActiveModal, } = useUIState()
  const { domainsSelected } = useGlobal()

  const modals = {
    create: (
      <DomainModal key={activeModal()} isOpen={activeModal() === "domain:create"}
        onClose={() => setActiveModal()}
        mode={activeModal}
        datacenterId={datacenterId}
      />
    ), update: (
      <DomainModal key={activeModal()} isOpen={activeModal() === "domain:update"}
        onClose={() => setActiveModal()}
        editMode
        mode={"update"}
        domainId={domain?.id}
      />
    ), import: (
      <DomainModal key={activeModal()} isOpen={activeModal() === "domain:import"}
        onClose={() => setActiveModal()}
        mode={"import"}
        domainId={domain?.id}
      />  /*
      <DomainImportModal
        isOpen={activeModal() === 'import'}
        domainId={domain?.id}
        onClose={() => setActiveModal()} />
      */
    ), remove: (
      <DomainDeleteModal key={activeModal()} isOpen={activeModal() === "domain:remove"}
        onClose={() => setActiveModal()}
        domain={domain}
        deleteMode={true}
      />
    ), destroy: (
      <DomainDestroyModal key={activeModal()} isOpen={activeModal() === "domain:destroy"}
        onClose={() => setActiveModal()}
        domain={domain}
      />
    ), attach: (
      <DomainAttachModal key={activeModal()} isOpen={activeModal() === "domain:attach"}
        onClose={() => setActiveModal()}
        sourceContext={sourceContext}
        actionType // true면 데이터센터에서 도메인를 바라봄 (도메인 목록이 뜸)
        domainId={domain?.id}
        datacenterId={datacenterId || ""}
      />
    ), activate: (
      <DomainActivateModal isOpen={activeModal() === "domain:activate"}
        onClose={() => setActiveModal()}
        domains={domainsSelected}
        datacenterId={datacenterId}
      />
    ), detach: (
      <DomainDetachModal isOpen={activeModal() === "domain:detach"}
        onClose={() => setActiveModal()}
        sourceContext={sourceContext}
        domain={domain}
        datacenterId={datacenterId}
      />
    ), maintenance: (
      <DomainMainTenanceModal key={activeModal()} isOpen={activeModal() === "domain:maintenance"}
        onClose={() => setActiveModal()}
        domains={domainsSelected}
        datacenterId={datacenterId}
      />
      /*
      <DomainCheckModal // 도메인 확인
        isOpen={activeModal() === "maintenance"}
        onClose={onClose}
      />
      */
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
