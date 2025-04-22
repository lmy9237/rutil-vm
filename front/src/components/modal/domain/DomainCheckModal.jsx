import { useState } from "react";
import BaseModal from "../BaseModal";
import LabelCheckbox from "../../label/LabelCheckbox";
import Localization from "../../../utils/Localization";

const DomainCheckModal = ({ isOpen, onClose }) => {
  const [approved, setApproved] = useState(false);

  const handleSubmit = () => {
    if (!approved) {
      alert("You must approve the operation before proceeding.");
      return;
    }
    onClose();
  };

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={Localization.kr.OK}
      isOpen={isOpen} onClose={onClose} 
      onSubmit={handleSubmit}
      promptText={`This operation might be unrecoverable and destructive!`}
      contentStyle={{ width: "770px" }}
      shouldWarn={true}
    >
      <div className="domain-check-modal">
        <div className="modal-info-text mt-4 f-center">
          <div>ⓘ The following LUNs are already in use:</div>
        </div>

        <div className="modal-lun-box mt-3 ">
          <div className="lun-info">
            - 360002ac0000000180001cf11(Used by VG : KN1B1-20F4-BDfT-nQ0s-0OGF-JOY4-qc7duh)
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
