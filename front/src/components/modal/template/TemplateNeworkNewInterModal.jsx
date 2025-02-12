import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faGlassWhiskey } from "@fortawesome/free-solid-svg-icons";
import {
  useAddNicFromTemplate,
  useAddNicFromVM,
  useAllNicsFromTemplate,
  useAllVnicProfiles,
  useEditNicFromTemplate,
  useEditNicFromVM,
  useNetworkInterfaceFromVM,
} from "../../../api/RQHook";

const TemplateNeworkNewInterModal = ({
  isOpen,
  onRequestClose,
  editMode = false,
  nicData,
  templateId,
  nicId,
}) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
  const [vnicProfileVoId, setVnicProfileVoId] = useState("");
  const [vnicProfileVoName, setVnicProfileVoName] = useState("");
  const [linked, setLinked] = useState(false); //링크상태(link state) t(up)/f(down) -> nic 상태도 같이 변함
  const [plugged, setPlugged] = useState(false);
  const [status, setStatus] = useState("up");
  const [macAddress, setMacAddress] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("connected");

  const { mutate: addNicFromTemplate } = useAddNicFromTemplate();
  const { mutate: editNicFromTemplate } = useEditNicFromTemplate();

  // 유형
  const interfaceOptions = [
    { value: "E1000", label: "e1000" },
    { value: "E1000E", label: "e1000e" },
    { value: "PCI_PASSTHROUGH", label: "pci_passthrough" },
    { value: "RTL8139", label: "rtl8139" },
    { value: "RTL8139_VIRTIO", label: "rtl8139_virtio" },
    { value: "SPAPR_VLAN", label: "spapr_vlan" },
    { value: "VIRTIO", label: "virtio" },
  ];
  const [selectedInterface, setSelectedInterface] = useState("VIRTIO");

  useEffect(() => {
    if (!isOpen) {
      resetForm(); // 모달이 닫힐 때 상태를 초기화
    }
  }, [isOpen]);

  useEffect(() => {
    console.log("template ID아아아:", templateId); // vmId 값 확인
  }, [templateId]);

  // 템플릿 내 네트워크인터페이스 목록
  const { data: nics } = useAllNicsFromTemplate(templateId);

  // 모든 vnic프로파일 목록
  const { data: vnics } = useAllVnicProfiles((e) => ({
    ...e,
  }));

  useEffect(() => {
    console.log("useEffect 호출 - nicData 상태:", nicData);
    if (editMode && nicData) {
      setId(nicData.id);
      setName(nicData.name);
      setVnicProfileVoId(nicData.vnicProfileVo?.id || "");
      setVnicProfileVoName(nicData.vnicProfileVo.name || "");
      setSelectedInterface(nicData.interface_ || "VIRTIO");
      setLinked(nicData.linked?.toLowerCase() === "up");
      setPlugged(nicData.linked?.toLowerCase() === "연결됨");
      setStatus(nicData.status);
      setMacAddress(nicData.macAddress);
    } else {
      resetForm();
    }
  }, [isOpen, editMode, nicData, templateId, nics]);

  const resetForm = () => {
    if (!editMode) {
      setId("");
      setName("");
      setSelectedInterface("VIRTIO");
      setLinked(true);
      setPlugged(true);
      setProfile("");
      setMacAddress("");
      setStatus("up");
      setConnectionStatus("connected");
    }
  };

  const handleSubmit = () => {
    const dataToSubmit = {
      vnicProfileVo: {
        id: vnicProfileVoId || "", // null이면 서버에서 오류가 발생할 가능성 있음
        name: vnicProfileVoName || "", // 빈 문자열 처리 필요
      },
      name,
      interface_: selectedInterface,
      linked,
      plugged,
      macAddress,
    };
    console.log("네트워크인터페이스 생성, 편집데이터:", dataToSubmit);

    if (editMode && nicData) {
      editNicFromTemplate(
        {
          templateId,
          nicId: nicData.id,
          nicData: dataToSubmit,
        },
        {
          onSuccess: () => {
            toast.success("템플릿 네트워크인터페이스 편집 완료");
            onRequestClose();
          },
          onError: (error) => {
            toast.error("Error editing network:", error);
          },
        }
      );
    } else {
      addNicFromTemplate(
        {
          templateId,
          nicData: dataToSubmit,
        },
        {
          onSuccess: () => {
            toast.success("템플릿 네트워크인터페이스 생성 완료");
            onRequestClose();
          },
          onError: (error) => {
            toast.error("Error adding network:", error);
          },
        }
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={
        editMode ? "네트워크 인터페이스 편집" : "새 네트워크 인터페이스 생성"
      }
      className="Modal"
      overlayClassName="Overlay"
      shouldCloseOnOverlayClick={false}
    >
      <div className="new-network-interface modal">
        <div className="popup-header">
          <h1>
            {editMode
              ? "네트워크 인터페이스 편집"
              : "새 네트워크 인터페이스 생성"}
          </h1>
          <button onClick={onRequestClose}>
            <FontAwesomeIcon icon={faTimes} fixedWidth />
          </button>
        </div>

        <div className="network-popup-content">
          <div className="input_box pt-1">
            <span>이름</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
            />
          </div>
          <div className="select_box">
            <label htmlFor="profile">프로파일</label>
            <select
              id="profile"
              value={vnicProfileVoId} // vnicProfileVoId를 상태로 연결
              onChange={(e) => {
                setVnicProfileVoId(e.target.value); // 선택된 프로파일 ID 업데이트
                const selectedVnic = vnics?.find(
                  (vnic) => vnic.id === e.target.value
                );
                setVnicProfileVoName(selectedVnic ? selectedVnic.name : ""); // 선택된 프로파일 이름 업데이트
              }}
            >
              <option value="">프로파일을 선택하세요</option>
              {vnics?.map((vnic) => (
                <option key={vnic.id} value={vnic.id}>
                  {vnic.name} {/* 각 프로파일의 이름을 표시 */}
                </option>
              ))}
            </select>
          </div>
          <div className="select_box">
            <label htmlFor="type">유형</label>
            <select
              id="type"
              value={selectedInterface} // 선택된 값을 상태로 연결
              onChange={(e) => setSelectedInterface(e.target.value)} // 선택 시 상태 업데이트
            >
              {interfaceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} {/* 화면에 표시될 한글 */}
                </option>
              ))}
            </select>
            <span>선택된 유형: {selectedInterface}</span>
          </div>
          <div className="plug-radio-btn">
            <span>링크 상태</span>
            <div>
              <div className="radio-outer">
                <div>
                  <input
                    type="radio"
                    name="status"
                    id="status_up"
                    checked={linked === true} // linked가 true일 때 체크
                    onChange={() => setLinked(true)} // true로 설정
                  />
                  <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth />
                  <label htmlFor="status_up">Up</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="status"
                    id="status_down"
                    checked={linked === false} // linked가 false일 때 체크
                    onChange={() => setLinked(false)} // false로 설정
                  />
                  <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth />
                  <label htmlFor="status_down">Down</label>
                </div>
              </div>
            </div>
          </div>
          <div className="plug-radio-btn">
            <span>카드 상태</span>
            <div>
              <div className="radio-outer">
                <div>
                  <input
                    type="radio"
                    name="plugged_status"
                    id="plugged"
                    checked={plugged === true} // plugged가 true일 때 선택
                    onChange={() => setPlugged(true)} // true로 설정
                  />
                  <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth />
                  <label htmlFor="plugged">연결됨</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="plugged_status"
                    id="unplugged"
                    checked={plugged === false} // plugged가 false일 때 선택
                    onChange={() => setPlugged(false)} // false로 설정
                  />
                  <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth />
                  <label htmlFor="unplugged">분리</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="edit-footer">
          <button style={{ display: "none" }}></button>
          <button onClick={handleSubmit}>{editMode ? "편집" : "생성"}</button>
          <button onClick={onRequestClose}>취소</button>
        </div>
      </div>
    </Modal>
  );
};

export default TemplateNeworkNewInterModal;
