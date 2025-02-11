import { useState } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAllHosts } from "../../../api/RQHook";

const VmExportOVAModal = ({ isOpen, onRequestClose, selectedVms }) => {
  const [host, setHost] = useState("#");
  const [directory, setDirectory] = useState("#");

  // 선택된 VM의 이름 처리 (여러 개일 경우 이름을 결합)
  const vmNames =
    Array.isArray(selectedVms) && selectedVms.length > 0
      ? selectedVms.map((vm) => vm.name).join(", ")
      : "선택된 가상 머신 없음";
  const [name, setName] = useState(vmNames);

  const handleExport = () => {
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
    onRequestClose(); // 모달 닫기
  };

  // 모든 호스트 목록 가져오기
  const { data: hosts } = useAllHosts(toTableItemPredicateHosts);

  function toTableItemPredicateHosts(host) {
    return {
      name: host?.name ?? "",
    };
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Export VM as OVA"
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="vm-ova-popup modal">
        <div className="popup-header">
          <h1>가상 어플라이언스로 가상 머신 내보내기</h1>
          <button onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div>
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

        <div className="edit-footer">
          <button onClick={handleExport}>OK</button>
          <button onClick={onRequestClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default VmExportOVAModal;