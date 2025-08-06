import { useMemo } from "react";
import BaseModal from "../BaseModal";
import {
  useAttachNicFromVM,
  useDetachNicFromVM,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import useGlobal from "@/hooks/useGlobal";
import { useValidationToast } from "@/hooks/useSimpleToast";

/**
 * @name VmNicActionModal
 * @description
 * 
 * @prop {boolean} isOpen ...
 * @prop {function} action ...
 * @prop {function} onClose ...
 * 
 * @returns 
 */
const VmNicActionModal = ({
  isOpen, onClose,
  action, 
  // vmId, 
}) => {
  const { validationToast } = useValidationToast();
  const { vmsSelected, nicsSelected } = useGlobal()
  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  
  const labelMap = {
    "nic:attach": Localization.kr.ATTACH,
    "nic:detach": Localization.kr.DETACH,
  };
  const contentLabel = useMemo(() => labelMap[action] || "", [action]);

  const { mutate: attachNic } = useAttachNicFromVM(onClose, onClose);
  const { mutate: detachNic } = useDetachNicFromVM(onClose, onClose);

  const actionMap = useMemo(() => ({
      "nic:attach": attachNic,
      "nic:detach": detachNic,
    }),[attachNic, detachNic]
  );

  const { ids, names } = useMemo(() => {
    const dataArray = Array.isArray(nicsSelected) ? nicsSelected : nicsSelected ? [danicsSelectedta] : [];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name),
    };
  }, [nicsSelected]);

  const validateForm = () => {
    if (!ids.length) return "ID가 없습니다.";
    const actionFn = actionMap[action];
    if (!actionFn) return `알 수 없는 액션: ${action}`;
    return null
  }
  
  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    const actionFn = actionMap[action];
    
    ids.forEach((nicId) => 
      actionFn({ vmId, nicId })
    );
  };

  return (
    <BaseModal targetName={`${Localization.kr.VM} ${Localization.kr.NICS}`} submitTitle={contentLabel}
      isOpen={isOpen} onClose={onClose}
      promptText={`${names.join(", ")} 를(을) ${contentLabel} 하시겠습니까?`}
      onSubmit={handleFormSubmit}contentStyle={{ width: "630px" }} 
      shouldWarn={true}
    >
    </BaseModal>
  );
};

export default VmNicActionModal;
