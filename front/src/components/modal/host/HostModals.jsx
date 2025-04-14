import React from "react";
import HostModal from "./HostModal";
import HostActionModal from "./HostActionModal";
import { useDeleteHost } from "../../../api/RQHook";
import DeleteModal from "../../../utils/DeleteModal";
import Localization from "../../../utils/Localization";
import HostCommitNetModal from "./HostCommitNetModal";

const HostModals = ({
  activeModal,
  host,
  selectedHosts = [],
  clusterId,
  onClose,
}) => {
  const modals = {
    create: (
      <HostModal
        isOpen={activeModal === "create"}
        clusterId={clusterId}
        onClose={onClose}
      />
    ),
    edit: (
      <HostModal
        editMode
        isOpen={activeModal === "edit"}
        hId={host?.id}
        clusterId={clusterId}
        onClose={onClose}
      />
    ),
    delete: (
      <DeleteModal
        isOpen={activeModal === "delete"}
        onClose={onClose}
        label={Localization.kr.HOST}
        data={selectedHosts}
        api={useDeleteHost()}
        // navigation={''}
      />
    ),
    action: (
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
        data={selectedHosts}
        onClose={onClose}
      />
    ),
    commitNetHost: (
      <HostCommitNetModal
        isOpen={activeModal === "commitNetHost"}
        data={host} // TODO: 정의 필요
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

export default HostModals;
