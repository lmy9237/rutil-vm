import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import NetworkModal from "./NetworkModal";
import NetworkImportModal from "./NetworkImportModal";
import DeleteModal from "../../../utils/DeleteModal";
import Localization from "../../../utils/Localization";
import { useDeleteNetwork } from "../../../api/RQHook";
import NetworkClusterModal from "./NetworkClusterModal";

const NetworkModals = ({ }) => {
  const { activeModal, closeModal } = useUIState()
  const { networksSelected } = useGlobal()
  
  const modals = {
    create: (
      <NetworkModal key={"network:create"} isOpen={activeModal().includes("network:create")} 
        onClose={() => closeModal("network:create")}
      />
    ), update: (
      <NetworkModal key={"network:update"} isOpen={activeModal().includes("network:update")} editMode 
        onClose={() => closeModal("network:update")}
      />
    ), import: (
      <NetworkImportModal key={"network:import"} isOpen={activeModal().includes("network:import")}
        onClose={() => closeModal("network:import")}
        data={networksSelected}
      />
    ), remove: (
      <DeleteModal key={"network:remove"} isOpen={activeModal().includes("network:remove")}
        onClose={() => closeModal("network:remove")}
        label={Localization.kr.NETWORK}
        data={networksSelected}
        api={useDeleteNetwork()}
        // navigation={''}
      />
    ), 
    manage: (
      <NetworkClusterModal key={"network:manage"} isOpen={activeModal().includes("network:manage")}
        onClose={() => closeModal("network:manage")}
        networkId={networksSelected?.[0]?.id}
      />
    ),
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`network:${key}`)
      ).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}   
    </>
  );
};

export default NetworkModals;
