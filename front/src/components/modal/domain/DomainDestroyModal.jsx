import { useState } from "react";
import BaseModal from "../BaseModal";
import LabelCheckbox from "../../label/LabelCheckbox";

const DomainDestroyModal = ({ isOpen, onClose }) => {
  const [approved, setApproved] = useState(false);

  const handleSubmit = () => {
    if (!approved) {
      alert("도메인 파괴 모달");
      return;
    }
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName="도메인"
      submitTitle="파괴"
      onSubmit={handleSubmit}
      contentStyle={{ width: "670px" }}
    >
      <div className="destroy-text">
        The following operation is unrecoverable and destructive!
      </div>
      <div>
        All references to objects that reside on Storage Domain <b>rutilvm-dev_nfs04</b> in the database will be removed.  
        You may need to manually clean the storage in order to reuse it.
      </div>

      <div className="mt-4">
        <LabelCheckbox
          id="approveOperation"
          label="Approve operation"
          checked={approved}
          onChange={(e) => setApproved(e.target.checked)}
        />
      </div>
    </BaseModal>
  );
};

export default DomainDestroyModal;
