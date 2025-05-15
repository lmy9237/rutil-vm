import React from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import DeleteModal from "../../../utils/DeleteModal";
import Localization from "../../../utils/Localization";
import { useRemoveJob, useRemoveJobs } from "../../../api/RQHook";

/**
 * @name JobModals
 * @description 작업 모달 모음
 *
 * @returns {JSX.Element} JobModals
 */
const JobModals = ({
  event,
}) => {
  const { activeModal, closeModal } = useUIState();
  const { jobsSelected } = useGlobal();

  const modals = {
    remove: (
      <DeleteModal key={activeModal()} isOpen={activeModal().includes("job:remove")}
        onClose={() => closeModal("job:remove")}
        label={Localization.kr.JOB}
        data={jobsSelected}
        api={useRemoveJob()}
        // api={useRemoveJobs()}
      />
    ),
  };
    return (
      <>
        {Object.keys(modals).filter((key) => 
          activeModal().includes(`job:${key}`)
        ).map((key) => (
          <React.Fragment key={key}>{modals[key]}</React.Fragment>
        ))}
      </>
    );
};
export default React.memo(JobModals);
