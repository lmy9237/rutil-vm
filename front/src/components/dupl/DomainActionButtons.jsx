import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButtonGroup from "../button/ActionButtonGroup";
import ActionButton from "../button/ActionButton";
import CancelModal from "../../utils/CancelModal";
import DomainDestroyModal from "../modal/domain/DomainDestroyModal";
import DomainMainTenanceModal from "../modal/domain/DomainMainTenanceModal";
import DomainCheckModal from "../modal/domain/DomainCheckModal";

const DomainActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  status,
  actionType = "default",
  isContextMenu
}) => {
  // 도메인 생성, 도메인 가져오기, 도메인 관리(편집), 삭제, connection, lun 새로고침, 파괴, 마스터 스토리지 도메인으로 선택
  // 데이터센터: 연결, 분리, 활성, 유지보수
  const navigate = useNavigate();

  const isUp = status === "UP";
  const isActive = status === "ACTIVE";
  const isMaintenance = status === "MAINTENANCE";
  const isUnknown = status === "UNKNOWN";

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // 삭제예정
  const [isDomainDestroyModalOpen, setIsDomainDestroyModalOpen] = useState(false); // 삭제예정
  const [isDomainMainTenanceModalOpen, setIsDomainMainTenanceModalOpen] = useState(false);// 삭제예정
  const [isDomainCheckModalOpen, setIsDomainCheckModalOpen] = useState(false); // 삭제예정

  const basicActions = [
    { type: "edit", label: "유지보수모달(임시)", onBtnClick: () => setIsDomainMainTenanceModalOpen(true) },
    { type: "edit", label: "도메인파괴(임시)", onBtnClick: () => setIsDomainDestroyModalOpen(true) }, // 이 부분 변경
    { type: "edit", label: "도메인 확인(임시 추가모달)", onBtnClick: () => setIsDomainCheckModalOpen(true) }, 
    { type: "edit", label: "작업취소모달(임시)", onBtnClick: () => setIsCancelModalOpen(true)},

    { type: "create", label: "생성", onBtnClick: () => openModal("create")  },
    { type: "import", label: "가져오기", onBtnClick: () => openModal("import")  },
    { type: "edit", label: "편집", disabled: isEditDisabled , onBtnClick: () => openModal("edit") },
    { type: "delete", label: "삭제", disabled: isDeleteDisabled || isMaintenance || !isUnknown, onBtnClick: () => openModal("delete")  },
    { type: "destory", label: "파괴", disabled: isDeleteDisabled || isMaintenance, onBtnClick: () => openModal("destroy")  },
  ];

  const dcDomainActions = [
    { type: "create", label: "생성", onBtnClick: () => openModal("create")},
    { type: "detach", label: "분리", disabled: isDeleteDisabled || isActive, onBtnClick: () => openModal("detach") },
    { type: "activate", label: "활성", disabled: isDeleteDisabled || isActive, onBtnClick: () => openModal("activate") },
    { type: "maintenance", label: "유지보수", disabled: isDeleteDisabled || isMaintenance, onBtnClick: () => openModal("maintenance")},
  ];

  const domainDcActions = [
    { type: "attach", label: "연결", disabled: isUp }, // 연결 disabled 조건 구하기
    // { type: 'attach', label: '연결', disabled: isDeleteDisabled || isActive }, // 연결 disabled 조건 구하기
    { type: "detach", label: "분리", disabled: isDeleteDisabled || isActive, onBtnClick: () => openModal("detach") },
    { type: "activate", label: "활성", disabled: isDeleteDisabled || isActive, onBtnClick: () => openModal("activate") },
    { type: "maintenance", label: "유지보수", disabled: isDeleteDisabled || isMaintenance, onBtnClick: () => openModal("maintenance") },
  ];

  const renderButtons = (actions) =>
    actions.map(({ type, label, disabled }) => (
      <button key={type} onClick={() => openModal(type)} disabled={disabled}>
        {label}
      </button>
    ));


  const selectedActions =
  actionType === "domain"
    ? basicActions
    : actionType === "dcDomain"
      ? dcDomainActions
      : actionType === "domainDc"
        ? domainDcActions
        : [];

  return (
 <>
    <ActionButtonGroup
      actionType={actionType}
      actions={selectedActions}
    >
      {!isContextMenu && (
        <ActionButton label={"디스크"} onClick={() => navigate("/storages/disks")} actionType={actionType}/>
      )}
    </ActionButtonGroup>
   
   <CancelModal
   isOpen={isCancelModalOpen}
   onClose={() => setIsCancelModalOpen(false)}
 />
 <DomainDestroyModal
   isOpen={isDomainDestroyModalOpen}
   onClose={() => setIsDomainDestroyModalOpen(false)}
 />
 <DomainMainTenanceModal
   isOpen={isDomainMainTenanceModalOpen}
   onClose={() => setIsDomainMainTenanceModalOpen(false)}
 />
 <DomainCheckModal
   isOpen={isDomainCheckModalOpen}
   onClose={() => setIsDomainCheckModalOpen(false)}
 />
 </>
    /*
    <div className={wrapperClass}>
 
  
      { 도메인 액션 버튼 }
      {actionType === "domain" && (
        <>
          {renderButtons(basicActions)}
          <button onClick={() => navigate("/storages/disks")}>디스크</button>
        </>
      )}

      {데이터센터-스토리지도메인 액션 버튼 }
      {actionType === "dcDomain" && (
        <>
          {renderButtons(dcDomainActions)}
          <button onClick={() => navigate("/storages/disks")}>디스크</button>
        </>
      )}
      { 스토리지도메인-데이터센터 액션 버튼 }
      {actionType === "domainDc" && renderButtons(domainDcActions)}
    </div>
    */

  );
};

export default DomainActionButtons;
