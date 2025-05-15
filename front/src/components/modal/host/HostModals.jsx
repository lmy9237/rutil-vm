import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import HostModal from "./HostModal";
import HostActionModal from "./HostActionModal";
import HostCommitNetModal from "./HostCommitNetModal";
import DeleteModal from "../../../utils/DeleteModal";
import { useDeleteHost } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name HostModals
 * @description 호스트 모달 모음
 * 
 * @returns {JSX.Element} HostModals
 */
const HostModals = ({
}) => {
  const { activeModal, closeModal } = useUIState()
  const { hostsSelected } = useGlobal()

  const modals = {
    create: (
      <HostModal key={"host:create"} isOpen={activeModal().includes("host:create")} 
        onClose={() => closeModal("host:create")}
      />
    ), update: (
      <HostModal key={"host:update"} isOpen={activeModal().includes("host:update")} editMode 
        onClose={() => closeModal("host:update")}
      />
    ), remove: (
      <DeleteModal key={"host:remove"} isOpen={activeModal().includes("host:remove")}
        onClose={() => closeModal("host:remove")}
        label={Localization.kr.HOST}
        data={hostsSelected}
        api={useDeleteHost()}
      />
    ), action: (
      <HostActionModal key={activeModal()[0]} isOpen={ACTIONS.includes(activeModal()[0])}
        onClose={() => closeModal(activeModal()[0])}
        action={activeModal()[0]}
      />
    ), commitNetHost: (
      <HostCommitNetModal key={"host:commitNetHost"} isOpen={activeModal().includes("host:commitNetHost")} 
        onClose={() => closeModal("host:commitNetHost")}
      />
    )    
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`host:${key}`) || 
        ACTIONS.includes(activeModal()[0])
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default HostModals;

const ACTIONS = [
  "host:deactivate",
  "host:activate",
  "host:restart",
  "host:refresh",
  // "host:reInstall",
  "host:enrollCert",
  "host:haOn",
  "host:haOff",
]