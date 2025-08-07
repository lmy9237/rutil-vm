import React, { useMemo } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import VmNicModal from "./VmNicModal";
import DeleteModal from "../../../utils/DeleteModal";
import { useRemoveNicFromVm, useNetworkInterfacesFromVM } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import VmNicActionModal from "./VmNicActionModal";

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
  const { data: nics = [] } = useNetworkInterfacesFromVM(vmId, (e) => ({ ...e }));
  const { mutate: deleteNetworkInterface } = useRemoveNicFromVm();

  const wrappedApi = {
    mutate: (nicId, options) => {
      if (!vmId || !nicId) {
        return;
      }
      deleteNetworkInterface({ vmId, nicId }, options);
    },
  };

  const nicCount = nics.filter((n) => {
    return n && n?.name?.includes(`nic`)
  })?.length+1 || 1;
  
  const modals = {
    create: (
      <VmNicModal key={"nic:create"}  isOpen={activeModal().includes("nic:create")}
        onClose={() => closeModal("nic:create")}
        nicName={`nic${nicCount}`}
      />
    ), update: (
      <VmNicModal key={"nic:update"} isOpen={activeModal().includes("nic:update")} editMode
        onClose={() => closeModal("nic:update")}
      />
    ), attach: (
      <VmNicActionModal key={"nic:attach"} isOpen={activeModal().includes("nic:attach")}
        onClose={() => closeModal("nic:attach")}
        action={"nic:attach"}
      />
    ), detach: (
      <VmNicActionModal key={"nic:detach"} isOpen={activeModal().includes("nic:detach")}
        onClose={() => closeModal("nic:detach")}
        action={"nic:detach"}
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