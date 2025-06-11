import React, { useMemo } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import VmNicModal from "./VmNicModal";
import DeleteModal from "../../../utils/DeleteModal";
import { useDeleteNetworkInterface } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name VmNicModals
 * @description ...
 * 
 * @param {boolean} isOpen ...
 * @returns 
 */
const VmNicModals = ({
  nic,
}) => {
  const { activeModal, closeModal } = useUIState()
  const {
    vmsSelected, 
    nicsSelected, setNicsSelected
  } = useGlobal()

  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const { mutate: deleteNetworkInterface } = useDeleteNetworkInterface();

  const wrappedApi = {
    mutate: (nicId, options) => {
      if (!vmId || !nicId) {
        return;
      }
      deleteNetworkInterface({ vmId, nicId }, options);
    },
  };
  
  const modals = {
    create: (
      <VmNicModal key={"nic:create"}  isOpen={activeModal().includes("nic:create")}
        onClose={() => closeModal("nic:create")}
      />
    ), update: (
      <VmNicModal key={"nic:update"} isOpen={activeModal().includes("nic:update")} editMode
        onClose={() => closeModal("nic:update")}
      />
    ), remove: (
      <DeleteModal key={"nic:remove"} isOpen={activeModal().includes("nic:remove")}
        onClose={() => closeModal("nic:remove")}
        label={Localization.kr.NICS}
        data={nicsSelected}
        api= {wrappedApi} 
        shouldRedirect={false} 
      />
    )
  }
  
  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`nic:${key}`)
      ).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
}

export default VmNicModals