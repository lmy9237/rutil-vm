import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import DeleteModal from "../../../utils/DeleteModal";
import Localization from "../../../utils/Localization";
import { useRemoveEvent } from "../../../api/RQHook";

/**
 * @name EventModals
 * @description 이벤트 모달 모음
 *
 * @returns {JSX.Element} EventModals
 */
const EventModals = ({
  event,
}) => {
  const { activeModal, closeModal } = useUIState();
  const { eventsSelected } = useGlobal();

  const modals = {
    remove: (
      <DeleteModal key={"event:remove"} isOpen={activeModal().includes("event:remove")}
        onClose={() => closeModal("event:remove")}
        label={Localization.kr.EVENT}
        data={eventsSelected}
        api={useRemoveEvent()}
      />
    ),
  };
    return (
      <>
        {Object.keys(modals).filter((key) => 
          activeModal().includes(`event:${key}`)
        ).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
        ))}
      </>
    );
};
export default React.memo(EventModals);
