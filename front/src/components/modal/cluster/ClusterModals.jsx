import React from 'react';
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import ClusterModal from "./ClusterModal";
import DeleteModal from "../../../utils/DeleteModal";
import Localization from "../../../utils/Localization";
import { useDeleteCluster } from "../../../api/RQHook";

const ClusterModals = ({
  cluster,
  datacenterId, /* NOTE: 생성에만 필요함 */
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { datacentersSelected, clustersSelected } = useGlobal()

  const modals = {
    create: (
      <ClusterModal key={activeModal()} isOpen={activeModal() === "cluster:create"}
        onClose={() => setActiveModal(null)}
        datacenterId={datacenterId || datacentersSelected?.[0]?.id}
      />
    ), update: (
      <ClusterModal key={activeModal()} isOpen={activeModal() === "cluster:update"}
        onClose={() => setActiveModal(null)}
        editMode
        clusterId={clustersSelected[0]?.id ?? cluster?.id}
      />
    ), remove: (
      <DeleteModal key={activeModal()} isOpen={activeModal() === "cluster:remove"}
        onClose={() => setActiveModal(null)}
        label={Localization.kr.CLUSTER}
        data={clustersSelected}
        api={useDeleteCluster()}
      />
    ),
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal() === `cluster:${key}`
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default React.memo(ClusterModals);
