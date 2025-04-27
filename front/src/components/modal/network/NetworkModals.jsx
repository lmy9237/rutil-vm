import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import NetworkModal from "./NetworkModal";
import NetworkImportModal from "./NetworkImportModal";
import DeleteModal from "../../../utils/DeleteModal";
import Localization from "../../../utils/Localization";
import { useDeleteNetwork } from "../../../api/RQHook";

const NetworkModals = ({ }) => {
  const { activeModal, setActiveModal } = useUIState()
  const { networksSelected } = useGlobal()
  
  const modals = {
    create: (
      <NetworkModal key={activeModal()} isOpen={activeModal() === "network:create"} 
        onClose={() => setActiveModal(null)} 
      />
    ), update: (
      <NetworkModal key={activeModal()} isOpen={activeModal() === "network:update"}
        onClose={() => setActiveModal(null)}
        editMode
      />
    ), import: (
      <NetworkImportModal key={activeModal()} isOpen={activeModal() === "network:import"}
        onClose={() => setActiveModal(null)}
        data={networksSelected}
      />
    ), remove: (
      <DeleteModal key={activeModal()} isOpen={activeModal() === "network:remove"}
        onClose={() => setActiveModal(null)}
        label={Localization.kr.NETWORK}
        data={networksSelected}
        api={useDeleteNetwork()}
        // navigation={''}
      />
    ), 
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal() === `network:${key}`
      ).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}   
    </>
  );
};

export default NetworkModals;
