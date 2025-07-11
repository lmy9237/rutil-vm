import { useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import LabelInput                       from "@/components/label/LabelInput";
import {
  useAllHosts,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const VmExportOVAModal = ({ 
  isOpen,
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  // const { closeModal } = useUIState()
  const { vmsSelected } = useGlobal()
  const [host, setHost] = useState("#");
  const [directory, setDirectory] = useState("#");

  // 선택된 VM의 이름 처리 (여러 개일 경우 이름을 결합)
  const vmNames =
    [...vmsSelected]?.length > 0
      ? [...vmsSelected]?.map((vm) => vm.name).join(", ")
      : `선택된 ${Localization.kr.VM} 없음`;
  const [name, setName] = useState(vmNames);
  const validateForm = () => {
    Logger.debug(`VmExportOVAModal > validateForm ... `)
    if (!host || host === "#") return `${Localization.kr.HOST}를 ${Localization.kr.PLACEHOLDER_SELECT}.`;
    if (!directory || directory === "#") return "디렉토리를 입력하세요."
    if (!name) return `${Localization.kr.NAME}을 입력하세요.`
    return null;
  };

  // 모든 호스트 목록 가져오기
  const {
    data: hosts,
    isLoading: isHostsLoading,
  } = useAllHosts((toTableItemPredicateHosts));

  function toTableItemPredicateHosts(host) {
    return {
      name: host?.name ?? "",
    };
  }
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    Logger.debug("VmExportOVAModal > handleFormSubmit ... OVA:", { host, directory, name });
    onClose(); // 모달 닫기
  };

  return (
    <BaseModal  targetName={`가상 어플라이언스로 ${Localization.kr.VM}`} submitTitle={Localization.kr.EXPORT}
      isOpen={isOpen} onClose={onClose}
      isReady={!isHostsLoading} 
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "600px" }} 
    >
      {/* <div className="vm-ova-popup modal"> */}
      <LabelSelectOptions
        id="host_select"
        label={Localization.kr.HOST}
        value={host}
        onChange={(e) => setHost(e.target.value)}
        options={[
          { value: "#", label: `${Localization.kr.HOST}를 ${Localization.kr.PLACEHOLDER_SELECT}` },
          ...hosts?.map((h) => ({ value: h.name, label: h.name })) || [],
        ]}
      />

      <LabelInput id="directory" label="디렉토리"
        value={directory}
        onChange={(e) => setDirectory(e.target.value)}
      />

      <LabelInput id="name" label={Localization.kr.NAME}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

    </BaseModal>
  );
};

export default VmExportOVAModal;