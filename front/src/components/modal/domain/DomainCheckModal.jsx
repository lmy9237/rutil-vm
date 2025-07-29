import { useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import BaseModal                        from "../BaseModal";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const DomainCheckModal = ({ 
  isOpen, 
  onClose,
  domain, 
  onApprove
}) => {
  // const { closeModal } = useUIState()
  const { validationToast } = useValidationToast();
  const [approved, setApproved] = useState(false);

  const validateForm = () => {
    Logger.debug(`DomainCheckModal > validateForm ...`);
    if (!approved) return "작업을 승인해야 합니다.";
    return null
  }

  const handleSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    Logger.debug(`DomainCheckModal > handleSubmit ... `)
    onApprove();
  };

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={Localization.kr.OK}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleSubmit}
      promptText="이 작업은 파괴적이며 복구할 수 없습니다!"
      contentStyle={{ width: "600px" }}
      shouldWarn={true}
    >
      <div className="domain-check-modal py-3">
        <LabelCheckbox id="approve" label="작업 승인"
          checked={approved}
          // onChange={(e) => setApproved(e.target.checked)}
          onChange={(checked) => {
            import.meta.env.DEV && validationToast.debug(`approved: ${checked}`);
            setApproved(checked);
          }}
        />
        <div className="modal-info-text mt-4 ">
          <div className="text-red-600 font-bold">다음 LUN이 이미 사용 중입니다:</div>
        </div>
    
        <div className="modal-lun-box mt-3">
          <div className="lun-info">
            {/* <div><b>Status:</b> {domain?.status?.toUpperCase() === "USED" ? "사용중" : domain?.status}</div> */}
            <div><b>Volume Group ID:</b> {domain?.volumeGroupId}</div>
            <div><b>LUN ID:</b> {domain?.id}</div>
            <div><b>Serial:</b> {domain?.serial}</div>
          </div>
        </div>

        <SelectedIdView items={[domain]} />
       
      </div>
    </BaseModal>
  );
};

export default DomainCheckModal;
