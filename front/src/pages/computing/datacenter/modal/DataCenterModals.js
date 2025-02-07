import React from "react";
import DataCenterModal from "./DataCenterModal";
import DataCenterDeleteModal from "./DataCenterDeleteModal";

const DataCenterModals = ({ activeModal, dataCenter, selectedDataCenters = [], onClose }) => {
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
      <DataCenterDeleteModal
        isOpen={activeModal === 'delete' }
        data={selectedDataCenters}
        onClose={onClose}
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