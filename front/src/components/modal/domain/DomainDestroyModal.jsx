import { useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import {
  useDestroyDomain
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";

const DomainDestroyModal = ({ 
  isOpen,
  onClose,
}) => {
  // const { closeModal } = useUIState()
  const { validationToast } = useValidationToast();
  const { domainsSelected } = useGlobal()
  const domain = useMemo(() => [...domainsSelected][0], [domainsSelected]);

  const {
    mutate: destroyDomain
  } = useDestroyDomain(onClose, onClose); // 파괴를 여기서
  const [approved, setApproved] = useState(false);

  const handleSubmit = () => {
    if (!approved) {
      validationToast.fail("작업을 승인해야 합니다.");
      return;
    };
  
    destroyDomain(domain?.id);
  };

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={Localization.kr.DESTROY}
      isOpen={isOpen} onClose={onClose}
      isReady={!!domain?.id}
      onSubmit={handleSubmit}
      contentStyle={{ width: "600px" }}
    >
      <br/>
      <div>
        [임시] {Localization.kr.DOMAIN} <b>{domain?.name}</b>을 파괴 하시겠습니까?
      </div>
      <div className="destroy-text my-5 f-center">
        다음의 작업은 복구가 불가능한 상태입니다!
      </div>
      <div>
        데이터베이스에 있는 <b>{domain?.name}</b> {Localization.kr.DOMAIN}에 속한 모든 객체에 대한 참조가 삭제될 것입니다.<br/>
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
