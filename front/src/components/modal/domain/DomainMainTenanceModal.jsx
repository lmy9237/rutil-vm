import { useState } from "react";
import LabelCheckbox from "../../label/LabelCheckbox";
import BaseModal from "../BaseModal";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

const DomainMainTenanceModal = ({ isOpen, onClose }) => {
  const [ignoreOVF, setIgnoreOVF] = useState(false);
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    Logger.debug("OVF 무시:", ignoreOVF);
    Logger.debug("이유:", reason);
    onClose();
  };
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName="스토리지 도메인"
      shouldWarn={true}
      submitTitle={Localization.kr.MANAGEMENT}
      promptText={`다음의 스토리지 도메인을 유지관리 모드로 설정하시겠습니까?`}
      onSubmit={() => {}} // 무시
      contentStyle={{ width: "670px" }}
    >
      <div className="domain-maintenance-modal">
        {/* 도메인명 */}
        <div className="domain-name-box">-hosted_storage</div>

        {/* 체크박스 */}
        <div className="ovf-checkbox-box">
          <LabelCheckbox
            id="ignoreOvf"
            label="OVF 업데이트 실패 무시"
            checked={ignoreOVF}
            onChange={(e) => setIgnoreOVF(e.target.checked)}
          />
        </div>

        {/* 이유 입력 */}
        <div className="reason-box f-btw">
          <div>이유</div>
          <input
            type="text"
            className="reason-input"
            placeholder="이유를 작성해주세요."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default DomainMainTenanceModal;
