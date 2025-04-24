import React from 'react';
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import ClusterModal from "./ClusterModal";
import DeleteModal from "../../../utils/DeleteModal";
import Localization from "../../../utils/Localization";
import { useDeleteCluster } from "../../../api/RQHook";

/**
 * @name ClusterModals
 * @description 클러스터 모달 모음
 * 
 * @returns {JSX.Element} ClusterModals
 */
const ClusterModals = () => {
  const { activeModal, setActiveModal } = useUIState()
  const { clustersSelected } = useGlobal()

  const modals = {
    create: (
      <ClusterModal key={activeModal()} isOpen={activeModal() === "cluster:create"}
        onClose={() => setActiveModal(null)}
      />
    ), update: (
      <ClusterModal key={activeModal()} isOpen={activeModal() === "cluster:update"}
        onClose={() => setActiveModal(null)}
        editMode
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
