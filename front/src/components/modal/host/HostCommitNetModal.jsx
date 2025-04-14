import { useState } from "react";
import BaseModal from "../BaseModal";
import LabelCheckbox from "../../label/LabelCheckbox";
import Localization from "../../../utils/Localization";
import toast from "react-hot-toast";
import { useCommitNetConfigHost } from "../../../api/RQHook";

const HostCommitNetModal = ({ isOpen, data, onClose }) => {
  const [approved, setApproved] = useState(false);
  
  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.HOST} 재부팅 확인`);
  };
  const { mutate: commitNetConfigHost } = useCommitNetConfigHost(onSuccess, () => onClose());

  const handleSubmit = () => {
    if (!approved) { return toast.error("확인버튼이 필요합니다") }

    commitNetConfigHost( data.id );
  };

  return (
    <BaseModal targetName={Localization.kr.HOST} submitTitle={`재부팅 ${Localization.kr.OK}`}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleSubmit}
      contentStyle={{ width: "670px" }}
    >
      <div>
        호스트 " {data?.name} " 이 수동으로 종료 또는 재부팅되어 있는지 확인하십시오. 
      </div>

      {data?.spmStatus === "보통" ? (
        <div className="destroy-text">
          적절한 수동 재부팅이 이루어 지지 않은 이 호스트에 이 동작을 실행 할 경우 가상 머신이 여러 호스트에서 중복적으로 실행되어 가상 머신의 데이터를 손실할 수 있습니다!
        </div>
      ): (
        <div className="destroy-text">
          이 호스트는 SPM입니다. 적절한 수동 재부팅이 이루어 지지 않은 이 호스트에 이동작을 실행할 경우 스토리지의 데이터를 손실할 수 있습니다.
        </div>
      )}
      <div className="destroy-text">
        만약 이 호스트가 수동으로 재부팅 되지 않았다면 '취소'를 눌러주십시오.
      </div>

      <div className="mt-4">
        <LabelCheckbox id="approveOperation" label="동작 확인"
          checked={approved}
          onChange={(e) => setApproved(e.target.checked)}
        />
      </div>
    </BaseModal>
  );
};

export default HostCommitNetModal;
