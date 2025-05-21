import React from 'react';
import useUIState           from "@/hooks/useUIState";
import useGlobal            from "@/hooks/useGlobal";
import {
  useDeleteCluster
} from "@/api/RQHook";
import DeleteModal from "@/utils/DeleteModal";
import Localization from "@/utils/Localization";
import ClusterModal from "./ClusterModal";

/**
 * @name ClusterModals
 * @description 클러스터 모달 모음
 * 
 * @returns {JSX.Element} ClusterModals
 */
const ClusterModals = () => {
  const { activeModal, closeModal } = useUIState()
  const { clustersSelected } = useGlobal()

  const modals = {
    create: (
      <ClusterModal key={activeModal()} isOpen={activeModal().includes("cluster:create")} 
        onClose={() => closeModal("cluster:create")}
      />
    ), update: (
      <ClusterModal key={activeModal()} isOpen={activeModal().includes("cluster:update")}
        onClose={() => closeModal("cluster:update")}
        editMode
      />
    ), remove: (
      <DeleteModal key={activeModal()} isOpen={activeModal().includes("cluster:remove")}
        onClose={() => closeModal("cluster:remove")}
        label={Localization.kr.CLUSTER}
        data={clustersSelected}
        api={useDeleteCluster()}
      />
    ),
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal().includes(`cluster:${key}`)
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default React.memo(ClusterModals);
