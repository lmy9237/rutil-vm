import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButtonGroup from "../button/ActionButtonGroup";
import ActionButton from "../button/ActionButton";
import Localization from "../../utils/Localization";
import NetworkModals from "../modal/network/NetworkModals";

const NetworkActionButtons = ({
  selectedNetworks = [],
  status,
  actionType = "default",
  isContextMenu = false,
  onCloseContextMenu, // contextMenu 닫기용 콜백
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (action) => {
    setActiveModal(action);
    onCloseContextMenu?.(); // contextMenu도 닫기
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const basicActions = [
    { type: "create", label: Localization.kr.CREATE, disabled: false, onBtnClick: () => openModal("create") },
    { type: "edit", label: Localization.kr.UPDATE, disabled: selectedNetworks.length !== 1, onBtnClick: () => openModal("edit") },
    { type: "delete", label: Localization.kr.REMOVE, disabled: selectedNetworks.length === 0, onBtnClick: () => openModal("delete") },
    { type: "import", label: Localization.kr.IMPORT, disabled: false, onBtnClick: () => openModal("import") },
  ];

  return (
    <>
      <ActionButtonGroup actionType={actionType} actions={basicActions}>
        {!isContextMenu && (
          <ActionButton
            label={"VNicProfile"}
            onClick={() => navigate("/vnicProfiles")}
            actionType={actionType}
          />
        )}
      </ActionButtonGroup>

      {/* context menu 안에서도 모달 띄우기 가능 */}
      <NetworkModals
        activeModal={activeModal}
        onClose={closeModal}
        selectedNetworks={selectedNetworks}
        network={selectedNetworks?.[0]}
        dcId={selectedNetworks?.[0]?.dataCenterId}
      />
    </>
  );
};

export default NetworkActionButtons;
