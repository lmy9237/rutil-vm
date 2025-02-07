import React from "react";
import ClusterModal from "./ClusterModal";
import ClusterDeleteModal from "./ClusterDeleteModal";

const ClusterModals = ({ activeModal, cluster, selectedClusters = [], datacenterId, onClose }) => {
  const modals = {
    create: 
      <ClusterModal 
        isOpen={activeModal === 'create'} 
        datacenterId={datacenterId}
        onClose={onClose} 
      />,
    edit: (
      <ClusterModal
        editMode
        isOpen={activeModal === 'edit'}
        clusterId={cluster?.id}
        onClose={onClose}
    />
    ),
    delete: (
      <ClusterDeleteModal
        isOpen={activeModal === 'delete' }
        data={selectedClusters}
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

export default ClusterModals;