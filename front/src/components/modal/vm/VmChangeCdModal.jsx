import { useEffect, useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "@/components/modal/BaseModal";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import {
  useUpdateCdromFromVM,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
/**
 * @name VmChangeCdModal
 * CD변경 모달
 * @returns {JSX.Element} CD변경 모달
 */
const VmChangeCdModal = ({
  isOpen, 
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  const { vmsSelected } = useGlobal()
  const [cdromIdSelected, setCdromIdSelected] = useState();
  const { mutate: changeCd } = useUpdateCdromFromVM(onClose, onClose);
  
  const validateForm = () => {    
    Logger.debug(`VmChangeCdModal > validateForm ...`)
    return null;
  }

  const handleFormSubmit = () => {
    Logger.debug(`VmChangeCdModal > handleFormSubmit ...`)
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    changeCd(vmsSelected[0]?.id, cdromIdSelected)
  }

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={Localization.kr.UPDATE_CDROM}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "600px" }}
    >
      {/* <LabelSelectOptionsID id={`host-${vm.id}`}
        label={``}
        // label={`${Localization.kr.TARGET} ${Localization.kr.HOST}`}
        value={targetHosts[vm.id] || ""}
        options={hostList[vm.id] && hostList[vm.id].length > 0 
          ? hostList[vm.id] 
          : [{ id: "none", name: "마이그레이션 가능한 호스트 없음" }]
        }
        onChange={(selected) => {
          setTargetHosts((prev) => ({ ...prev, [vm.id]: selected.id }));
        }}
      /> */}
    </BaseModal>
  );
};

export default VmChangeCdModal;
