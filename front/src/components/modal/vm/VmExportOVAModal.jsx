import { useState } from "react";
import { useToast }            from "@/hooks/use-toast";
import useUIState              from "@/hooks/useUIState";
import useGlobal               from "@/hooks/useGlobal";
import BaseModal from "../BaseModal";
import { useAllHosts } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import LabelInput from "../../label/LabelInput";
import Logger from "../../../utils/Logger";

const VmExportOVAModal = ({ 
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
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
  const handleFormSubmit = () => {
    Logger.debug(`VmExportOVAModal > handleFormSubmit ... `)
    const error = validateForm();
    if (error) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error,
      });
      return;
    }

    Logger.debug("VmExportOVAModal > handleFormSubmit ... OVA:", { host, directory, name });
    onClose(); // 모달 닫기
  };

  // 모든 호스트 목록 가져오기
  const { data: hosts } = useAllHosts(toTableItemPredicateHosts);

  function toTableItemPredicateHosts(host) {
    return {
      name: host?.name ?? "",
    };
  }

  return (
    <BaseModal  targetName={`가상 어플라이언스로 ${Localization.kr.VM}`} submitTitle={Localization.kr.EXPORT}
      isOpen={isOpen} onClose={onClose}
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