import React from "react";
import useUIState from "../../../hooks/useUIState.jsx";
import VnicProfileModal from "./VnicProfileModal";
import DeleteModal from "../../../utils/DeleteModal";
import { useDeleteVnicProfile } from "../../../api/RQHook.js";
import Localization from "../../../utils/Localization.js";
import useGlobal from "../../../hooks/useGlobal.js";


const VnicProfileModals = ({ 
  vnicProfile,
  networkId,
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { vnicProfilesSelected } = useGlobal()

  const modals = {
    create: (
      <VnicProfileModal isOpen={activeModal() === "vnicprofile:create"} 
        networkId={networkId}
        onClose={() => setActiveModal(null)}
      />
    ),
    update: (
      <VnicProfileModal isOpen={activeModal() === "vnicprofile:update"}
        editMode
        vnicProfileId={vnicProfile?.id}
        onClose={() => setActiveModal(null)}
      />
    ),
    remove: (
      <DeleteModal isOpen={activeModal() === "vnicprofile:remove"}
        label={Localization.kr.VNIC_PROFILE}
        data={vnicProfilesSelected}
        api={useDeleteVnicProfile()}
        // navigation={''}
        onClose={() => setActiveModal(null)}
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
