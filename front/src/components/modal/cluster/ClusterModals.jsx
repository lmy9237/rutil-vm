import React from 'react';
import ClusterModal from "./ClusterModal";
import DeleteModal from "../../../utils/DeleteModal";
import { useDeleteCluster } from "../../../api/RQHook";

const ClusterModals = ({
  activeModal,
  cluster,
  selectedClusters = [],
  datacenterId,
  onClose,
}) => {
  const modals = {
    create: (
      <ClusterModal
        isOpen={activeModal === "create"}
        datacenterId={datacenterId}
        onClose={onClose}
      />
    ),
    edit: (
      <ClusterModal
        editMode
        isOpen={activeModal === "edit"}
        clusterId={cluster?.id}
        onClose={onClose}
      />
    ),
    delete: (
      // <ClusterDeleteModal
      //   isOpen={activeModal === 'delete' }
      //   data={selectedClusters}
      //   onClose={onClose}
      // />
      <DeleteModal
        isOpen={activeModal === "delete"}
        onClose={onClose}
        label={"클러스터"}
        data={selectedClusters}
        api={useDeleteCluster()}
        // navigation={''}
      />
    ),
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
