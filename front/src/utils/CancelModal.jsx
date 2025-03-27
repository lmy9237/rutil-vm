import BaseModal from "../components/modal/BaseModal";

const CancelModal = ({ isOpen, onClose }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName="작업이 취소되었습니다"
      submitTitle="" 
      onSubmit={() => {}} // 무시
      extraFooter={
        <button className="action" onClick={onClose}>확인</button>
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
