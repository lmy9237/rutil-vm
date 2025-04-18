import { useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import { useAllHosts } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import LabelInput from "../../label/LabelInput";
import Logger from "../../../utils/Logger";

const VmExportOVAModal = ({ isOpen, onClose, selectedVms }) => {
  const [host, setHost] = useState("#");
  const [directory, setDirectory] = useState("#");

  // 선택된 VM의 이름 처리 (여러 개일 경우 이름을 결합)
  const vmNames =
    Array.isArray(selectedVms) && selectedVms.length > 0
      ? selectedVms.map((vm) => vm.name).join(", ")
      : `선택된 ${Localization.kr.VM} 없음`;
  const [name, setName] = useState(vmNames);

  const handleFormSubmit = () => {
    if (!host || host === "#") {
      toast.error(`${Localization.kr.HOST}를 선택하세요.`);
      return;
    }
    if (!directory || directory === "#") {
      toast.error("디렉토리를 입력하세요.");
      return;
    }
    if (!name) {
      toast.error(`${Localization.kr.NAME}을 입력하세요.`);
      return;
    }

    Logger.debug("Exporting OVA:", { host, directory, name });
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
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"가상 어플라이언스로 가상 머신"}
      submitTitle={"내보내기"}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "600px"}} 
    >
      {/* <div className="vm-ova-popup modal"> */}
      <LabelSelectOptions
        id="host_select"
        label="호스트"
        value={host}
        onChange={(e) => setHost(e.target.value)}
        options={[
          { value: "#", label: "호스트를 선택하세요" },
          ...hosts?.map((h) => ({ value: h.name, label: h.name })) || [],
        ]}
      />

      <LabelInput
        id="directory"
        label="디렉토리"
        value={directory}
        onChange={(e) => setDirectory(e.target.value)}
      />

      <LabelInput
        id="name"
        label="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

    </BaseModal>
  );
};

export default VmExportOVAModal;