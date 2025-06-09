import React from "react";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import DomainAttachModal      from "./DomainAttachModal";
import DomainActivateModal    from "./DomainActivateModal";
import DomainDetachModal      from "./DomainDetachModal";
import DomainMaintenanceModal from "./DomainMaintenanceModal";

/**
 * @name DomainDataCenterModals
 * @description 도메인-데이터센터 모달
 *
 * @param {boolean} isOpen
 *
 * @returns {JSX.Element} DomainDataCenterModals
 * 
 * @see DomainModal
 * @see DomainDeleteModal
 * @see DomainActionModal
 * @see DomainAttachModal
 */
const DomainDataCenterModals = () => {
  const { activeModal, closeModal } = useUIState()
  const { datacentersSelected } = useGlobal()

  const modals = {
    attach: (
      <DomainAttachModal key={"domaindatacenter:attach"} isOpen={activeModal().includes("domaindatacenter:attach")}
        onClose={() => closeModal("domaindatacenter:attach")}
        actionType // true면 데이터센터에서 도메인를 바라봄 (도메인 목록이 뜸)
      />
    ), detach: (
      <DomainDetachModal key={"domaindatacenter:detach"} isOpen={activeModal().includes("domaindatacenter:detach")} 
        onClose={() => closeModal("domaindatacenter:detach")}
      />
    ), activate: (
      <DomainActivateModal key={"domaindatacenter:activate"} isOpen={activeModal().includes("domaindatacenter:activate")} 
        onClose={() => closeModal("domaindatacenter:activate")}
      />
    ), maintenance: (
      <DomainMaintenanceModal key={"domaindatacenter:maintenance"} isOpen={activeModal().includes("domaindatacenter:maintenance")} 
        onClose={() => closeModal("domaindatacenter:maintenance")}
      />
    ),
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`domaindatacenter:${key}`)
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default DomainDataCenterModals;
