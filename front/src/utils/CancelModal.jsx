import BaseModal from "../components/modal/BaseModal";
import Localization from "./Localization";

const CancelModal = ({ isOpen, onClose }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName="작업이 취소되었습니다"
      submitTitle="" 
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
