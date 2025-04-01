import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlassWhiskey } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import {
  useAddNicFromTemplate,
  useAllNicsFromTemplate,
  useAllVnicProfiles,
  useEditNicFromTemplate,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

const TemplateNeworkNewInterModal = ({
  isOpen,
  onClose,
  editMode = false,
  nicData,
  templateId,
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
    Logger.debug(`TemplateNetworkNewInterModal.templateId: ${templateId}`); // vmId 값 확인
  }, [templateId]);

  // 템플릿 내 네트워크인터페이스 목록
  const { data: nics } = useAllNicsFromTemplate(templateId);

  // 모든 vnic프로파일 목록
  const { data: vnics } = useAllVnicProfiles((e) => ({
    ...e,
  }));

  useEffect(() => {
    Logger.debug(`TemplateNetworkNewInterModal.nicData: ${JSON.stringify(nicData)}`);
    if (editMode && nicData) {
      setId(nicData.id);
      setName(nicData.name);
      setVnicProfileVoId(nicData.vnicProfileVo?.id || "");
      setVnicProfileVoName(nicData.vnicProfileVo.name || "");
      setSelectedInterface(nicData.interface_ || "VIRTIO");
      setLinked(nicData.linked);
      setPlugged(nicData.plugged);
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

  const handleFormSubmit = () => {
    const dataToSubmit = {
      id: editMode && nicData ? nicData.id : undefined,
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
    Logger.debug(`TemplateNetworkNewInterModal > handleFormSubmit ... dataToSubmit: ${JSON.stringify(dataToSubmit, null, 2)}`);

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
            onClose();
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
            onClose();
            toast.success("템플릿 네트워크인터페이스 생성 완료");
          },
          onError: (error) => {
            toast.error("Error adding network:", error);
          },
        }
      );
    }
  };

  Logger.debug("...");
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={Localization.kr.NICS}
      submitTitle={editMode ? Localization.kr.UPDATE : Localization.kr.CREATE}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="new-network-interface modal"> */}
      <div className="network-popup-content">
        <div className="input_box pt-1">
          <span>{Localization.kr.NAME}</span>
          <input type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={Localization.kr.NAME}
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
          <span>링크 {Localization.kr.STATUS}</span>
          <div className="radio-outer">
            <div>
              <input
                type="radio"
                name="status"
                id="status_up"
                checked={linked === true}
                onChange={() => setLinked(true)}
              />
              <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth />
              <label htmlFor="status_up">Up</label>
            </div>
            <div>
              <input
                type="radio"
                name="status"
                id="status_down"
                checked={linked === false}
                onChange={() => setLinked(false)}
              />
              <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth />
              <label htmlFor="status_down">Down</label>
            </div>
          </div>
        </div>

        <div className="plug-radio-btn">
          <span>카드 {Localization.kr.STATUS}</span>
          <div className="radio-outer">
            <div>
              <input
                type="radio"
                name="plugged_status"
                id="plugged"
                checked={plugged === true}
                onChange={() => setPlugged(true)}
              />
              <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth />
              <label htmlFor="plugged">연결됨</label>
            </div>
            <div>
              <input
                type="radio"
                name="plugged_status"
                id="unplugged"
                checked={plugged === false}
                onChange={() => setPlugged(false)}
              />
              <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth />
              <label htmlFor="unplugged">분리</label>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default TemplateNeworkNewInterModal;
