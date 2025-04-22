import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import HostModal from "./HostModal";
import HostActionModal from "./HostActionModal";
import HostCommitNetModal from "./HostCommitNetModal";
import DeleteModal from "../../../utils/DeleteModal";
import { useDeleteHost } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

const ACTIONS = [
  "host:deactivate",
  "host:activate",
  "host:restart",
  "host:refresh",
  // "host:reInstall",
  "host:enrollCert",
  "host:haOn",
  "host:haOff",
]
/**
 * @name HostModals
 * @description 호스트 모달 모음
 * 
 * @returns {JSX.Element} HostModals
 */
const HostModals = ({
  host,
  clusterId, /* NOTE: 생성에만 필요함 */
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { hostsSelected } = useGlobal()

  const modals = {
    create: (
      <HostModal key={activeModal()} isOpen={activeModal() === "host:create"}
        clusterId={clusterId}
        onClose={() => setActiveModal(null)} 
      />
    ), update: (
      <HostModal key={activeModal()} isOpen={activeModal() === "host:update"}
        editMode
        hostId={host?.id}
        onClose={() => setActiveModal(null)} 
      />
    ), remove: (
      <DeleteModal key={activeModal()} isOpen={activeModal() === "host:remove"}
        label={Localization.kr.HOST}
        data={hostsSelected}
        api={useDeleteHost()}
        onClose={() => setActiveModal(null)} 
        // navigation={''}
      />
    ), action: (
      <HostActionModal key={activeModal()} isOpen={ACTIONS.includes(activeModal())}
        onClose={() => setActiveModal(null)} 
        action={activeModal()}
      />
    ), commitNetHost: (
      <HostCommitNetModal key={activeModal()} isOpen={activeModal() === "host:commitNetHost"}
        onClose={() => setActiveModal(null)} 
        data={hostsSelected[0]}
        // data={hostsSelected[0] ?? host} // TODO: 정의 필요
      />
    )    
  };

  return (
    <>
      {Object.keys(modals).filter((key) => 
        activeModal() === `host:${key}` || ACTIONS.includes(activeModal())
      ).map((key) => (
        <React.Fragment key={key}>{modals[key]}</React.Fragment>
      ))}
    </>
  );
};

export default HostModals;
