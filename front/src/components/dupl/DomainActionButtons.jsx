import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useGlobal              from "@/hooks/useGlobal";
import useUIState             from "@/hooks/useUIState";
import {
  ActionButton, 
  ActionButtons
} from "@/components/button/ActionButtons";
import Localization           from "@/utils/Localization";

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

  const isUp = domain1st?.status?.toUpperCase() === "UP";
  const isActive = domain1st?.status?.toUpperCase() === "ACTIVE";
  const isMaintenance = domain1st?.status?.toUpperCase() === "MAINTENANCE";
  const isLocked = domain1st?.status?.toUpperCase() === "LOCKED";
  const isUnknown = domain1st?.status?.toUpperCase() === "UNKNOWN";
  const isUnattached = domain1st?.status?.toUpperCase() === "UNATTACHED";

  const basicActions = [
    { type: "create",  onClick: () => setActiveModal("domain:create"),  label: Localization.kr.CREATE,  disabled: isContextMenu },
    { type: "import",  onClick: () => setActiveModal("domain:import"),  label: Localization.kr.IMPORT,  disabled: isContextMenu },
    { type: "update",  onClick: () => setActiveModal("domain:update"),  label: Localization.kr.UPDATE,  disabled: domainsSelected.length !== 1 },
    { type: "remove",  onClick: () => setActiveModal("domain:remove"),  label: Localization.kr.REMOVE,  disabled: domainsSelected.length !== 1 || !isUnknown },
    { type: "destory", onClick: () => setActiveModal("domain:destroy"), label: Localization.kr.DESTROY, disabled: domainsSelected.length === 0 || !isUnattached || !isMaintenance },
  ];

  return (
    <>
      <ActionButtons actionType={actionType}
        actions={basicActions}
      >
        {!isContextMenu && (
          <ActionButton label={Localization.kr.DISK} onClick={() => navigate("/storages/disks")} actionType={actionType} />
        )}
      </ActionButtons>
   </>
  );
};

export default DomainActionButtons;
