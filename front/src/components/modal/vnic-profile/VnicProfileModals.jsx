import React from "react";
import useUIState from "../../../hooks/useUIState.jsx";
import VnicProfileModal from "./VnicProfileModal";
import DeleteModal from "../../../utils/DeleteModal";
import { useDeleteVnicProfile } from "../../../api/RQHook.js";
import Localization from "../../../utils/Localization.js";


const VnicProfileModals = ({ 
  vnicProfile,
  selectedVnicProfiles = [],
  networkId,
  onClose
}) => {
  const { activeModal } = useUIState()

  const modals = {
    create: (
      <VnicProfileModal isOpen={activeModal() === "vnicprofile:create"} 
        networkId={networkId}
        onClose={onClose} 
      />
    ),
    update: (
      <VnicProfileModal isOpen={activeModal() === "vnicprofile:update"}
        editMode
        vnicProfileId={vnicProfile?.id}
        onClose={onClose}
      />
    ),
    remove: (
      <DeleteModal isOpen={activeModal() === "vnicprofile:remove"}
        label={Localization.kr.VNIC_PROFILE}
        onClose={onClose}
        data={selectedVnicProfiles}
        api={useDeleteVnicProfile()}
        // navigation={''}
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

export default VnicProfileModals;
