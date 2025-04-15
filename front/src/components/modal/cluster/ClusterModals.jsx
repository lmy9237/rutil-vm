import React from 'react';
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import ClusterModal from "./ClusterModal";
import DeleteModal from "../../../utils/DeleteModal";
import Localization from "../../../utils/Localization";
import { useDeleteCluster } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

const ClusterModals = ({
  cluster,
  datacenterId, /* NOTE: 생성에만 필요함 */
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { clustersSelected } = useGlobal()

  const modals = {
    create: (
      <ClusterModal key={activeModal()} isOpen={activeModal() === "cluster:create"}
        datacenterId={datacenterId}
        onClose={() => setActiveModal(null)}
      />
    ), update: (
      <ClusterModal key={activeModal()} isOpen={activeModal() === "cluster:update"}
        editMode
        clusterId={cluster?.id}
        onClose={() => setActiveModal(null)}
      />
    ), remove: (
      <DeleteModal key={activeModal()} isOpen={activeModal() === "cluster:remove"}
        label={Localization.kr.CLUSTER}
        data={clustersSelected}
        api={useDeleteCluster()}
        onClose={() => setActiveModal(null)}
      />
    ),
  };

  Logger.debug(`ClusterModals ...`)
  return (
    <>
      {Object.keys(modals).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default ClusterModals;
