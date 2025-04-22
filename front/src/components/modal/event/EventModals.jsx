import React, { memo } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import DeleteModal from "../../../utils/DeleteModal";
import EventModal from "./EventModal";
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
  const { activeModal, setActiveModal } = useUIState();
  const { eventsSelected } = useGlobal();

  const modals = {
    remove: (
      <DeleteModal key={activeModal()} isOpen={activeModal() === "event:remove"}
        label={Localization.kr.EVENT}
        data={eventsSelected}
        api={useRemoveEvent()}
        onClose={() => setActiveModal(null)}
      />
    ),
  };
    return (
      <>
        {Object.keys(modals).filter((key) => 
          activeModal() === `event:${key}`
        ).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
        ))}
      </>
    );
};
export default React.memo(EventModals);
