import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";
import Localization from "../../utils/Localization";
import ActionButtonGroup from "../button/ActionButtonGroup";
import Logger from "../../utils/Logger";

const VnicProfileActionButtons = ({
  actionType = 'default'
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { vnicProfilesSelected } = useGlobal()

  const basicActions = [
    { type: "create", onBtnClick: () => setActiveModal("vnicprofile:create"), label: Localization.kr.CREATE, disabled: vnicProfilesSelected.length > 0, },
    { type: "update", onBtnClick: () => setActiveModal("vnicprofile:update"), label: Localization.kr.UPDATE, disabled: vnicProfilesSelected.length !== 1, },
    { type: "remove", onBtnClick: () => setActiveModal("vnicprofile:remove"), label: Localization.kr.REMOVE, disabled: vnicProfilesSelected.length === 0, },
  ];

  Logger.debug(`VnicProfileActionButtons ... `)
  return (
    <ActionButtonGroup actionType={actionType} actions={basicActions} />
  );
};

export default VnicProfileActionButtons;
