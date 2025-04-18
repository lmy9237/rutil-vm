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
  const { vnicProfilesSelected, networksSelected } = useGlobal()

  const modals = {
    create: (
      <VnicProfileModal isOpen={activeModal() === "vnicprofile:create"} 
        onClose={() => setActiveModal(null)}
        networkId={networksSelected[0]?.id ?? networkId}
      />
    ), update: (
      <VnicProfileModal isOpen={activeModal() === "vnicprofile:update"}
        onClose={() => setActiveModal(null)}
        editMode
        vnicProfileId={vnicProfilesSelected[0]?.id ?? vnicProfile?.id}
      />
    ), remove: (
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
      {Object.keys(modals).filter((key) => 
        activeModal() === `vnicprofile:${key}`
      ).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default VnicProfileModals;
