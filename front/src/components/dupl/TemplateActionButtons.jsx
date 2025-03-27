import { useState } from "react";
import ActionButtonGroup from "../button/ActionButtonGroup";
import CancelModal from "../../utils/CancelModal";
import DomainDestroyModal from "../modal/domain/DomainDestroyModal";
import DomainMainTenanceModal from "../modal/domain/DomainMainTenanceModal";
import DomainCheckModal from "../modal/domain/DomainCheckModal";

const TemplateActionButtons = ({
  openModal,
  isEditDisabled,
  isDeleteDisabled,
  actionType = "default",
}) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // 삭제예정
  const [isDomainDestroyModalOpen, setIsDomainDestroyModalOpen] = useState(false); // 삭제예정
  const [isDomainMainTenanceModalOpen, setIsDomainMainTenanceModalOpen] = useState(false);// 삭제예정
  const [isDomainCheckModalOpen, setIsDomainCheckModalOpen] = useState(false); // 삭제예정


  const basicActions = [
    { type: "edit", label: "유지보수모달", onBtnClick: () => setIsDomainMainTenanceModalOpen(true) },
    { type: "edit", label: "도메인파괴", onBtnClick: () => setIsDomainDestroyModalOpen(true) }, // 이 부분 변경
    { type: "edit", label: "도메인 확인(추가모달)", onBtnClick: () => setIsDomainCheckModalOpen(true) }, 
    { type: "edit", label: "작업취소모달", onBtnClick: () => setIsCancelModalOpen(true)},
    { type: "edit", label: "편집", disabled: isEditDisabled, onBtnClick: () => openModal("edit")  },
    { type: "delete", label: "삭제", disabled: isDeleteDisabled, onBtnClick: () => openModal("delete")  },
  ];

  return (
    <>
    <ActionButtonGroup
      actionType={actionType}
      actions={basicActions}
    />

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
  );
};

export default TemplateActionButtons;
