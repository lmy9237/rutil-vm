import React from "react";
import DataCenterModal from "./DataCenterModal";
import DeleteModal from "../../../utils/DeleteModal";
import { useDeleteDataCenter } from "../../../api/RQHook";

const DataCenterModals = ({ 
  activeModal, 
  dataCenter, 
  selectedDataCenters = [], 
  onClose
}) => {
  const modals = {
    create: 
      <DataCenterModal 
        isOpen={activeModal === 'create'} 
        onClose={onClose} 
        />,
    edit: (
      <DataCenterModal
        editMode
        isOpen={activeModal === 'edit'}
        dcId={dataCenter?.id}
        onClose={onClose}
      />
    ),
    delete: (
      <DeleteModal
        isOpen={activeModal === "delete"}
        onClose={onClose}
        label={"데이터센터"}
        data={selectedDataCenters}
        api={useDeleteDataCenter()}
        navigation={'/computing/rutil-manager/datacenters'}
      />
    )
  };

  return (
    <>
      {Object.keys(modals).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default DataCenterModals;