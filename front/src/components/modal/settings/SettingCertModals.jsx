import React from "react";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import {
  useDeleteDataCenter,
} from "@/api/RQHook";
import DeleteModal            from "@/utils/DeleteModal";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import SettingCertModal        from "./SettingCertModal";

/**
 * @name SettingCertModals
 * @description 인증서 관리 모달 모음
 * 
 * @returns {JSX.Element} SettingCertModals
 */
const SettingCertModals = ({
}) => {
  const { activeModal, closeModal } = useUIState()
  const { certsSelected } = useGlobal()

  const modals = {
    attach: (
      <SettingCertModal key={activeModal()} isOpen={activeModal().includes("cert:attach")}
        onClose={() => closeModal("cert:attach")}
        editMode
      />
    )
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`cert:${key}`)
      ).map((key) => 
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      )}
    </>
  );
};

export default SettingCertModals;