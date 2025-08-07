import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CONSTANT               from "@/Constants";
import useGlobal              from "@/hooks/useGlobal";
import useUIState             from "@/hooks/useUIState";
import {
  rvi16HardDrive
} from "@/components/icons/RutilVmIcons";
import {
  ActionButton, 
  ActionButtons
} from "@/components/button/ActionButtons";
import Localization            from "@/utils/Localization";
import Logger                  from "@/utils/Logger";

/**
 * @name DomainActionButtons
 * @description 스토리지 도메인 관련 액션버튼
 * 
 * @prop {string} actionType
 * 
 * @returns {JSX.Element} DomainActionButtons
 * 
 * @see ActionButtons
 */
const DomainActionButtons = ({
  actionType="default"
}) => {
  // 도메인 생성, 도메인 가져오기, 도메인 관리(편집), 삭제, connection, lun 새로고침, 파괴, 마스터 스토리지 도메인으로 선택
  const navigate = useNavigate();
  const { setActiveModal } = useUIState();
  const { domainsSelected } = useGlobal()
  const isContextMenu = useMemo(() => actionType === "context", [actionType])

  const domain1st = useMemo(() => [...domainsSelected][0], [domainsSelected])

  const isUp = domain1st?.status?.toLowerCase() === "up".toLowerCase();
  const isActive = domain1st?.status?.toLowerCase() === "active".toLowerCase();
  const isMaintenance = domain1st?.status?.toLowerCase() === "maintenance".toLowerCase();
  const isLocked = domain1st?.status?.toLowerCase() === "locked".toLowerCase(); // 잠겨있을 떄 파괴는 가능
  const isUnknown = domain1st?.status?.toLowerCase() === "unknown".toLowerCase();
  const isUnattached = domain1st?.status?.toLowerCase() === "unattached".toLowerCase();

  const basicActions = [
    { type: "create",  onClick: () => setActiveModal("domain:create"),  label: Localization.kr.CREATE,  disabled: isContextMenu },
    { type: "import",  onClick: () => setActiveModal("domain:import"),  label: Localization.kr.IMPORT,  disabled: isContextMenu },
    { type: "update",  onClick: () => setActiveModal("domain:update"),  label: Localization.kr.UPDATE,  disabled: domainsSelected.length !== 1 },
    { type: "remove",  onClick: () => setActiveModal("domain:remove"),  label: Localization.kr.REMOVE,  disabled: domainsSelected.length !== 1 || isUnknown || !(isUnattached || isMaintenance) },
    { type: "destory", onClick: () => setActiveModal("domain:destroy"), label: Localization.kr.DESTROY, disabled: domainsSelected.length === 0 || isUnknown || !(isUnattached || isMaintenance || isLocked) },
  ];

  return (
    <>
      <ActionButtons actionType={actionType}
        actions={isContextMenu ? basicActions.slice(2) : basicActions}
      >
        {!isContextMenu && (
          <ActionButton actionType={actionType} 
          label={Localization.kr.DISK} 
          iconPrefix={rvi16HardDrive(CONSTANT.color.black)}
          onClick={() => navigate("/storages/disks")} 
          />
        )}
      </ActionButtons>
   </>
  );
};

export default DomainActionButtons;
