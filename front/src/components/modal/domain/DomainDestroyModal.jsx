import { useState } from "react";
import BaseModal from "../BaseModal";
import LabelCheckbox from "../../label/LabelCheckbox";
import Localization from "../../../utils/Localization";
import { useDestroyDomain } from "../../../api/RQHook";
import toast from "react-hot-toast";

const DomainDestroyModal = ({ isOpen, domain, onClose }) => {
  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.DOMAIN} ${Localization.kr.DESTROY} 완료`);
  };
  const { mutate: destroyDomain } = useDestroyDomain(onSuccess, () => onClose()); // 파괴를 여기서

  const [approved, setApproved] = useState(false);

  const handleSubmit = () => {
    if (!approved) return toast.error("작업승인해야함");
    
    destroyDomain({ domainId: domain?.id });
  };

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={Localization.kr.DESTROY}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleSubmit}
      contentStyle={{ width: "600px" }}
    >
      <div className="destroy-text">
        다음의 작업은 복구가 불가능한 상태입니다!
      </div>
      <div>
        데이터베이스에 있는 <b>{domain?.name}</b> 스토리지 도메인에 속한 모든 객체에 대한 참조가 삭제될 것입니다.
        다시 사용하려면 수동으로 스토리지를 정리해야 할 수 있습니다.
      </div>

      <div className="mt-4">
        <LabelCheckbox id="approveOperation" label="작업 승인"
          checked={approved}
          onChange={(e) => setApproved(e.target.checked)}
        />
      </div>
      <br/>
    </BaseModal>
  );
};

export default DomainDestroyModal;
