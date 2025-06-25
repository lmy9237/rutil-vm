import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import SettingUsersModal from './SettingUsersModal'
import DeleteModal from "../../../utils/DeleteModal"
import Localization from "../../../utils/Localization";
import SettingProviderModal from "./SettingProviderModal";

/**
 * @name SettingProviderModals
 * @description 관리 > 공급자 모달
 * 
 * @returns 
 */
const SettingProviderModals = ({
  provider,
}) => {
  const { activeModal, closeModal } = useUIState()
  const { providersSelected } = useGlobal()

  const modals = {
    create:  (
      <SettingProviderModal key={"provider:create"} isOpen={activeModal().includes("provider:create")}
        onClose={() => closeModal("provider:create")}
      />
    ), update: (
      <SettingProviderModal key={"provider:update"} isOpen={activeModal().includes("provider:update")} editMode
        onClose={() => closeModal("provider:update")}
      />
    ), remove: (
      <DeleteModal key={"provider:remove"} isOpen={activeModal().includes("provider:remove")}
        onClose={() => closeModal("provider:remove")}
        label={Localization.kr.PROVIDER}
        data={providersSelected}
        // api={useRemoveUser()}
      />
    ),
  }
  
  return (
    <>
     {Object.keys(modals).filter((key) => 
        activeModal().includes(`provider:${key}`)
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
}

export default React.memo(SettingProviderModals)