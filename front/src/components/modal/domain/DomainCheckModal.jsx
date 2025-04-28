import { useState } from "react";
import BaseModal from "../BaseModal";
import LabelCheckbox from "../../label/LabelCheckbox";
import Localization from "../../../utils/Localization";
import toast from "react-hot-toast";

const DomainCheckModal = ({ isOpen, onClose, onApprove }) => {
  const [approved, setApproved] = useState(false);

  const handleSubmit = () => {
    if (!approved) {
      toast.error("작업을 승인해야 합니다."); 
      return;
    }
    onApprove(); // 승인 시 콜백 호출
  };

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={Localization.kr.OK}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleSubmit}
      promptText="이 작업은 복구 불가능할 수 있습니다!"
      contentStyle={{ width: "770px" }}
      shouldWarn={true}
    >
      <div className="domain-check-modal">
        <div className="modal-info-text mt-4 f-center">
          <div className="destroy-text">이미 사용 중인 LUN이 있습니다.</div>
        </div>

        <div className="modal-lun-box mt-3">
          <div className="lun-info">
            - 사용중인 LUN 표시
          </div>
        </div>

        <LabelCheckbox id="approve" label="작업 승인"
          checked={approved}
          onChange={(e) => setApproved(e.target.checked)}
        />
      </div>
    </BaseModal>
  );
};


export default DomainCheckModal;
