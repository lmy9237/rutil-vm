import React from "react";
import { useNavigate } from "react-router-dom";
import ActionButtonGroup from "../button/ActionButtonGroup";
import ActionButton from "../button/ActionButton";
import Localization from "../../utils/Localization";

const DomainActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  status,
  isContextMenu = false,
  actionType = "default",  // default, context
}) => {
  // 도메인 생성, 도메인 가져오기, 도메인 관리(편집), 삭제, connection, lun 새로고침, 파괴, 마스터 스토리지 도메인으로 선택
  const navigate = useNavigate();

  const isUp = status === "UP";
  const isActive = status === "ACTIVE";
  const isMaintenance = status === "MAINTENANCE";
  const isUnknown = status === "UNKNOWN";

  const basicActions = [
    { type: "create", label: Localization.kr.CREATE, onBtnClick: () => openModal("create")  },
    { type: "import", label: Localization.kr.IMPORT, onBtnClick: () => openModal("import")  },
    { type: "edit", label: Localization.kr.UPDATE, disabled: isEditDisabled , onBtnClick: () => openModal("edit") },
    { type: "delete", label: Localization.kr.REMOVE, disabled: isDeleteDisabled || isMaintenance, onBtnClick: () => openModal("delete")  },
    { type: "destory", label: Localization.kr.DESTROY, disabled: isDeleteDisabled || isMaintenance, onBtnClick: () => openModal("destroy")  },
  ];

  return (
    <>
      <ActionButtonGroup
        actionType={actionType}
        actions={basicActions}
      >
        {!isContextMenu && (
          <ActionButton label={Localization.kr.DISK} onClick={() => navigate("/storages/disks")} actionType={actionType} />
        )}
      </ActionButtonGroup>
   </>
  );
};

export default DomainActionButtons;
