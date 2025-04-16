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
  actionType=true,
}) => {
  // 도메인 생성, 도메인 가져오기, 도메인 관리(편집), 삭제, connection, lun 새로고침, 파괴, 마스터 스토리지 도메인으로 선택
  // 데이터센터: 연결, 분리, 활성, 유지보수
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

  const dcActions = [
    { type: "attach", label: "연결", disabled: isUp, onBtnClick: () => openModal("attach") }, // 연결 disabled 조건 구하기
    { type: "detach", label: "분리", disabled: isDeleteDisabled || isActive, onBtnClick: () => openModal("detach") },
    { type: "activate", label: "활성", disabled: isDeleteDisabled || isActive, onBtnClick: () => openModal("activate") },
    { type: "maintenance", label: "유지보수", disabled: isDeleteDisabled || isMaintenance, onBtnClick: () => openModal("maintenance") },
  ];

  return (
    <>
      <ActionButtonGroup
        actionType={actionType}
        actions={actionType === true ? basicActions : dcActions}
      >
        {!isContextMenu && (
          <ActionButton label={Localization.kr.DISK} onClick={() => navigate("/storages/disks")} actionType={actionType} />
        )}
      </ActionButtonGroup>
   </>
  );
};

export default DomainActionButtons;
