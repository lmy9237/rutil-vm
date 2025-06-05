import React, { useMemo } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import DeleteModal from "../../../utils/DeleteModal";
import { useDeleteNetworkFromTemplate, useDeleteNetworkInterface } from "../../../api/RQHook";
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
    templatesSelected, 
    nicsSelected, setNicsSelected
  } = useGlobal()

  const templateId = useMemo(() => [...templatesSelected][0]?.id, [templatesSelected]);
  const { mutate: deleteNetworkInterface } = useDeleteNetworkFromTemplate();

  const wrappedApi = {
    mutate: (nicId, options) => {
      if (!templateId || !nicId) {
        return;
      }
      deleteNetworkInterface({ templateId, nicId }, options);
    },
  };

  const modals = {
    create: (
      <TemplateNicModal key={"templatenic:create"}  isOpen={activeModal().includes("templatenic:create")}
        onClose={() => closeModal("templatenic:create")}
      />
    ), update: (
      <TemplateNicModal key={"templatenic:update"} isOpen={activeModal().includes("templatenic:update")} editMode
        onClose={() => closeModal("templatenic:update")}
      />
    ),remove: (
      <DeleteModal key={"templatenic:remove"} isOpen={activeModal().includes("templatenic:remove")}
        onClose={() => closeModal("templatenic:remove")}
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
        activeModal().includes(`templatenic:${key}`)
      ).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
}

export default TemplateNicModals