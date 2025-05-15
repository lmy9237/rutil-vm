import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import VnicProfileModal from "./VnicProfileModal";
import DeleteModal from "../../../utils/DeleteModal";
import { useDeleteVnicProfile } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

const VnicProfileModals = ({
}) => {
  const { activeModal, closeModal } = useUIState()
  const { vnicProfilesSelected } = useGlobal()

  const modals = {
    create: (
      <VnicProfileModal isOpen={activeModal().includes("vnicprofile:create")}
        onClose={() => closeModal("vnicprofile:create")}
      />
    ), update: (
      <VnicProfileModal isOpen={activeModal().includes("vnicprofile:update")} editMode 
        onClose={() => closeModal("vnicprofile:update")}
      />
    ), remove: (
      <DeleteModal isOpen={activeModal().includes("vnicprofile:remove")}
        onClose={() => closeModal("vnicprofile:remove")}
        label={Localization.kr.VNIC_PROFILE}
        data={vnicProfilesSelected}
        api={useDeleteVnicProfile()}
        // navigation={''}
      />
    )
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`vnicprofile:${key}`)
      ).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default VnicProfileModals;
