import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import NetworkModal from "./NetworkModal";
import NetworkImportModal from "./NetworkImportModal";
import DeleteModal from "../../../utils/DeleteModal";
import Localization from "../../../utils/Localization";
import { useDeleteNetwork } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

const NetworkModals = ({ 
  network, 
  dcId,
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { networksSelected } = useGlobal()
  
  const modals = {
    create: (
      <NetworkModal key={activeModal()} isOpen={activeModal() === "network:create"} 
        onClose={() => setActiveModal(null)} 
        dcId={dcId}
      />
    ), update: (
      <NetworkModal key={activeModal()} isOpen={activeModal() === "network:update"}
        onClose={() => setActiveModal(null)}
        editMode
        networkId={network?.id}
      />
    ), import: (
      <NetworkImportModal key={activeModal()} isOpen={activeModal() === 'network:import'}
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

  Logger.debug(`NetworkModals ... `)
  return (
    <>
      {Object.keys(modals).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default NetworkModals;
