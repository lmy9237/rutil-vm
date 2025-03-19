import React from "react";
import HostModal from "./HostModal";
import HostActionModal from "./HostActionModal";
import { useDeleteHost } from "../../../api/RQHook";
import DeleteModal from "../../../utils/DeleteModal";

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
        label={"호스트"}
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
          "reInstall",
          "register",
          "haOn",
          "haOff",
        ].includes(activeModal)}
        action={activeModal}
        data={selectedHosts}
        onClose={onClose}
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

export default HostModals;
