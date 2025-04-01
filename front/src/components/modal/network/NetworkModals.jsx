import React, { useEffect } from "react";
import NetworkModal from "./NetworkModal";
import NetworkImportModal from "./NetworkImportModal";
import DeleteModal from "../../../utils/DeleteModal";
import Localization from "../../../utils/Localization";
import { useDeleteNetwork } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

const NetworkModals = ({ 
  activeModal, 
  network, 
  selectedNetworks = [], 
  dcId, 
  onClose
}) => {
  useEffect(() => {
    Logger.debug(`NetworkModals.selectedNetworks:`, selectedNetworks);
  }, [selectedNetworks]);
  
  const modals = {
    create: 
      <NetworkModal 
        isOpen={activeModal === 'create'} 
        dcId={dcId}
        onClose={onClose} 
      />,
    edit: (
      <NetworkModal
        editMode
        isOpen={activeModal === 'edit'}
        networkId={network?.id}
        onClose={onClose}
    />
    ),
    delete: (
      <DeleteModal
        isOpen={activeModal === 'delete' }
        onClose={onClose}
        label={Localization.kr.NETWORK}
        data={selectedNetworks}
        api={useDeleteNetwork()}
        // navigation={''}
      />
    ),
    import: (
      <NetworkImportModal
        isOpen={activeModal === 'import'}
        onClose={onClose}
        data={selectedNetworks}
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

export default NetworkModals;
