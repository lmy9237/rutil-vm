import React, { useState } from "react";
import Localization from "../../utils/Localization";
import ActionButtonGroup from "../button/ActionButtonGroup";
import DataCenterModals from "../modal/datacenter/DataCenterModals";

const DataCenterActionButtons = ({
  selectedDataCenters = [],
  status, // 'none' | 'single' | 'multi' 등
  actionType = "default",
  onCloseContextMenu, // 우클릭 박스 닫기용
}) => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (action) => {
    setActiveModal(action);
    onCloseContextMenu?.(); // contextMenu도 닫기
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const basicActions = [
    {
      type: "create",
      label: Localization.kr.CREATE,
      disabled: false,
      onBtnClick: () => openModal("create"),
    },
    {
      type: "edit",
      label: Localization.kr.UPDATE,
      disabled: status !== "single",
      onBtnClick: () => openModal("edit"),
    },
    {
      type: "delete",
      label: Localization.kr.REMOVE,
      disabled: status === "none",
      onBtnClick: () => openModal("delete"),
    },
  ];

  return (
    <>
      <ActionButtonGroup actionType={actionType} actions={basicActions} />

      <DataCenterModals
        activeModal={activeModal}
        dataCenter={activeModal === "edit" ? selectedDataCenters[0] : null}
        selectedDataCenters={selectedDataCenters}
        onClose={closeModal}
      />
    </>
  );
};

export default DataCenterActionButtons;
