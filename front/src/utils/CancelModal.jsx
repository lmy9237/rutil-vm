import BaseModal from "../components/modal/BaseModal";
import useUIState from "../hooks/useUIState";
import Localization from "./Localization";

const CancelModal = ({ 
  isOpen,
  onClose,
 }) => {
  // const { closeModal } = useUIState()
  return (
    <BaseModal targetName="작업이 취소되었습니다" submitTitle="" 
      isOpen={isOpen}
      onSubmit={() => {}} // 무시
      extraFooter={
        <button className="action" onClick={onClose}>{Localization.kr.OK}</button>
      }
      contentStyle={{ width: "670px" }}
    >
      <div className="cancel-modal">
        <p>작업이 정상적으로 취소되었습니다.</p>
      </div>
    </BaseModal>
  );
};

export default CancelModal;
