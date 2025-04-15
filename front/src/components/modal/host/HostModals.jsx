import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import HostModal from "./HostModal";
import HostActionModal from "./HostActionModal";
import HostCommitNetModal from "./HostCommitNetModal";
import DeleteModal from "../../../utils/DeleteModal";
import { useDeleteHost } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name HostModals
 * @description 호스트 모달 모음
 * 
 * @returns {JSX.Element} HostModals
 */
const HostModals = ({
  host,
  clusterId,
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { hostsSelected } = useGlobal()

  const modals = {
    create: (
      <HostModal isOpen={activeModal() === "host:create"}
        clusterId={clusterId}
        onClose={() => setActiveModal(null)} 
      />
    ), update: (
      <HostModal isOpen={activeModal() === "host:update"}
        editMode
        hId={host?.id}
        clusterId={clusterId}
        onClose={() => setActiveModal(null)} 
      />
    ), remove: (
      <DeleteModal isOpen={activeModal() === "host:remove"}
        label={Localization.kr.HOST}
        data={hostsSelected}
        api={useDeleteHost()}
        onClose={() => setActiveModal(null)} 
        // navigation={''}
      />
    ), action: (
      <HostActionModal
        isOpen={[
          "deactivate",
          "activate",
          "restart",
          "refresh",
          // "reInstall",
          "enrollCert",
          "haOn",
          "haOff",
        ].includes(activeModal)}
        action={activeModal}
        data={hostsSelected}
        onClose={() => setActiveModal(null)} 
      />
    ),
    commitNetHost: (
      <HostCommitNetModal
        isOpen={activeModal() === "commitNetHost"}
        data={host} // TODO: 정의 필요
        onClose={() => setActiveModal(null)} 
      />
    )    
  };

  Logger.debug(`HostModals ...`)
  return (
    <>
      {Object.keys(modals).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default HostModals;
