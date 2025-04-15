import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import DataCenterModal from "./DataCenterModal";
import DeleteModal from "../../../utils/DeleteModal";
import { useDeleteDataCenter } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

const DataCenterModals = ({ 
  dataCenter,
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { datacentersSelected } = useGlobal()

  const modals = {
    create: (
      <DataCenterModal key={activeModal()} isOpen={activeModal() === "datacenter:create"} 
        onClose={() => setActiveModal(null)}
      />
    ), update: (
      <DataCenterModal key={activeModal()} isOpen={activeModal() === "datacenter:update"}
        editMode
        datacenterId={dataCenter?.id ?? datacentersSelected[0]?.id}
        onClose={() => setActiveModal(null)}
      />
    ), remove: (
      <DeleteModal key={activeModal()} isOpen={activeModal() === "datacenter:remove"}
        label={Localization.kr.DATA_CENTER}
        data={datacentersSelected}
        api={useDeleteDataCenter()}
        onClose={() => setActiveModal(null)}
        // navigation={'/computing/rutil-manager/datacenters'}
      />
    )
  };

  Logger.debug(`DataCenterModals ...`)
  return (
    <>
      {Object.keys(modals).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default DataCenterModals;