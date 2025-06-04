import React, { useMemo } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import DeleteModal from "../../../utils/DeleteModal";
import { useDeleteNetworkInterface } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import TemplateNicModal from "./TemplateNicModal";

/**
 * @name TemplateNicModals
 * @description ...
 * 
 * @param {boolean} isOpen ...
 * @returns 
 */
const TemplateNicModals = ({
  nic,
}) => {
  const { activeModal, closeModal } = useUIState()
  const {
    vmsSelected, 
    nicsSelected, setNicsSelected
  } = useGlobal()

  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const { mutate: deleteNetworkInterface } = useDeleteNetworkInterface();

  
  const modals = {
    create: (
      <TemplateNicModal key={"templatenic:create"}  isOpen={activeModal().includes("templatenic:create")}
        onClose={() => closeModal("templatenic:create")}
      />
    ), update: (
      <TemplateNicModal key={"templatenic:update"} isOpen={activeModal().includes("templatenic:update")} editMode
        onClose={() => closeModal("templatenic:update")}
      />
    )
    //  remove: (
    //   <DeleteModal key={"nic:remove"} isOpen={activeModal().includes("nic:remove")}
    //     onClose={() => closeModal("nic:remove")}
    //     label={Localization.kr.NICS}
    //     data={nicsSelected}
    //     api= {wrappedApi} 
    //     shouldRedirect={false} 
    //   />
    // )
  }
  
  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`templatenic:${key}`)
      ).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
}

export default TemplateNicModals