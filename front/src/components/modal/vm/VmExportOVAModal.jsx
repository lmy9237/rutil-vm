import { useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import { useAllHosts } from "../../../api/RQHook";

const VmExportOVAModal = ({ isOpen, onClose, selectedVms }) => {
  const [host, setHost] = useState("#");
  const [directory, setDirectory] = useState("#");

  // 선택된 VM의 이름 처리 (여러 개일 경우 이름을 결합)
  const vmNames =
    Array.isArray(selectedVms) && selectedVms.length > 0
      ? selectedVms.map((vm) => vm.name).join(", ")
      : "선택된 가상 머신 없음";
  const [name, setName] = useState(vmNames);

  const handleFormSubmit = () => {
    if (!host || host === "#") {
      toast.error("호스트를 선택하세요.");
      return;
    }
    if (!directory || directory === "#") {
      toast.error("디렉토리를 입력하세요.");
      return;
    }
    if (!name) {
      toast.error("이름을 입력하세요.");
      return;
    }

    console.log("Exporting OVA:", { host, directory, name });
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
      targetName={"가상 어플라이언스로 가상 머신 내보내기"}
      submitTitle={"내보내기"}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "500px", height: "288px" }} 
    >
      {/* <div className="vm-ova-popup modal"> */}
      <div className="popup-content-outer py-0.5">
        <div className="ova-new-box">
          <label htmlFor="host_select">호스트</label>
          <select
            id="host_select"
            value={host}
            onChange={(e) => setHost(e.target.value)}
          >
            <option value="#">호스트를 선택하세요</option>
            {hosts?.map((hostItem, index) => (
              <option key={index} value={hostItem.name}>
                {hostItem.name}
              </option>
            ))}
          </select>
        </div>
        <div className="ova-new-box">
          <label htmlFor="directory">디렉토리</label>
          <input
            type="text"
            id="directory"
            value={directory}
            onChange={(e) => setDirectory(e.target.value)}
            placeholder="디렉토리를 입력하세요"
          />
        </div>
        <div className="ova-new-box">
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="가상 머신 이름을 입력하세요"
            rows={3} // 이름이 길 경우를 대비해 textarea로 변경
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default VmExportOVAModal;