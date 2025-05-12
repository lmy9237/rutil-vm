import React from "react";
import { useNavigate } from "react-router-dom";
import useContextMenu from "../../hooks/useContextMenu";
import useGlobal from "../../hooks/useGlobal";
import useUIState from "../../hooks/useUIState";
import ActionButtonGroup from "../button/ActionButtonGroup";
import Localization from "../../utils/Localization";


const JobActionButtons = ({
  actionType = "default"
}) => {
  const navigate = useNavigate();
  const { clearAllContextMenu } = useContextMenu()
  const { setActiveModal } = useUIState()
  const { jobsSelected } = useGlobal()
  
  const basicActions = [
    { type: "remove",  onBtnClick: () => setActiveModal("job:remove"), label: Localization.kr.REMOVE, disabled: jobsSelected.length === 0 },
  ];

  return (
    <ActionButtonGroup actionType={actionType}
      actions={basicActions}
    />
  );
};

export default JobActionButtons;
