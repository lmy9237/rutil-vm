import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import DataCenterModal from "./DataCenterModal";
import DeleteModal from "../../../utils/DeleteModal";
import Localization from "../../../utils/Localization";
import { useDeleteDataCenter } from "../../../api/RQHook";

/**
 * @name DataCenterModals
 * @description 데이터센터 모달 모음
 * 
 * @returns {JSX.Element} DataCenterModals
 */
const DataCenterModals = () => {
  const { activeModal, setActiveModal } = useUIState()
  const { datacentersSelected } = useGlobal()

  const modals = {
    create: (
      <DataCenterModal key={activeModal()} isOpen={activeModal() === "datacenter:create"} 
        onClose={() => setActiveModal(null)}
      />
    ), update: (
      <DataCenterModal key={activeModal()} isOpen={activeModal() === "datacenter:update"}
        onClose={() => setActiveModal(null)}
        editMode
      />
    ), remove: (
      <DeleteModal key={activeModal()} isOpen={activeModal() === "datacenter:remove"}
        onClose={() => setActiveModal(null)}
        label={Localization.kr.DATA_CENTER}
        data={datacentersSelected}
        api={useDeleteDataCenter()}
        // navigation={'/computing/rutil-manager/datacenters'}
      />
    )
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal() === `datacenter:${key}`
      ).map((key) => 
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      )}
    </>
  );
};

export default DataCenterModals;