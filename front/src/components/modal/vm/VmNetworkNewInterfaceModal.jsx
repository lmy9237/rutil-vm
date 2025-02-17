import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faGlassWhiskey } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import {
  useAddNicFromVM,
  useAllVnicProfiles,
  useEditNicFromVM,
  useNetworkInterfaceByVMId,
  useNetworkInterfaceFromVM,
} from "../../../api/RQHook";

const VmNetworkNewInterfaceModal = ({
  isOpen,
  onClose,
  editMode = false,
  nicData,
  vmId,
  nicId,
}) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
  const [vnicProfileVoId, setVnicProfileVoId] = useState("");
  const [vnicProfileVoName, setVnicProfileVoName] = useState("");
  const [linked, setLinked] = useState(true); //링크상태(link state) t(up)/f(down) -> nic 상태도 같이 변함
  const [plugged, setPlugged] = useState(true);
  const [status, setStatus] = useState("up");
  const [macAddress, setMacAddress] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("connected");

  const { mutate: addNicFromVM } = useAddNicFromVM();
  const { mutate: editNicFromVM } = useEditNicFromVM();

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
    console.log("VM ID아아아:", vmId); //잘찍힘
    console.log("nicID아아아:", nicId); //잘찍힘
  }, [vmId, nicId]);

  // 가상머신 내 네트워크인터페이스 목록
  const { data: nics } = useNetworkInterfaceFromVM(vmId);

  // 가상머신 내 네트워크인터페이스 상세
  const { data: nicsdetail } = useNetworkInterfaceByVMId(vmId, nicId);

  useEffect(() => {
    console.log("nics 데이터:", nicsdetail);
  }, [nicsdetail]); // nics 데이터가 변경될 때마다 실행

  // 가상머신 내 네트워크인터페이스 상세조회
  // const {
  //   data: nicDetail
  // } = useNetworkInterfaceByVMId(vmId, editMode && nicId ? nicId : null);
  // useEffect(() => {
  //   if (editMode && nicDetail) {
  //     console.log('가상머신 네트워크 인터페이스 상세 정보:', nicDetail);
  //   }
  // }, [editMode, nicDetail]);

  // 모든 vnic프로파일 목록
  const { data: vnics } = useAllVnicProfiles((e) => ({
    ...e,
  }));

  useEffect(() => {
    console.log("useEffect 호출 - nicData 상태:", nicData);
    if (editMode && nicData && nicsdetail) {
      console.log("vnicProfileVo:", nicData.vnicProfileVo?.name);
      setId(nicData.id);
      setName(nicData.name);
      setVnicProfileVoId(nicsdetail.vnicProfileVo?.id || "");
      setVnicProfileVoName(nicsdetail.vnicProfileVo?.name || "");
      setSelectedInterface(nicData.interface_ || "VIRTIO");
      setLinked(nicsdetail.linked);
      setPlugged(nicsdetail.plugged); // 기본값 설정
      setStatus(nicData.status);
      setMacAddress(nicData.macAddress);
    } else {
      resetForm();
    }
  }, [isOpen, editMode, nicData, vmId, nics, nicData, nicsdetail]);

  const resetForm = () => {
    if (!editMode) {
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
    console.log("Submitting namedddddddd:", name);
    const dataToSubmit = {
      vnicProfileVo: {
        id: vnicProfileVoId || "",
        name: vnicProfileVoName || "",
      },
      name,
      interface_: selectedInterface,
      linked,
      plugged,
    };

    console.log("네트워크인터페이스 생성, 편집데이터:", dataToSubmit);

    if (editMode && nicData) {
      dataToSubmit.id = id;
      editNicFromVM(
        {
          vmId,
          nicId: nicData.id,
          nicData: dataToSubmit,
        },
        {
          onSuccess: () => {
            onClose();
            toast.success("네트워크인터페이스 편집 완료");
          },
          onError: (error) => {
            toast.error("Error editing network:", error);
          },
        }
      );
    } else {
      addNicFromVM(
        {
          vmId,
          nicData: dataToSubmit,
        },
        {
          onSuccess: () => {
            toast.success("네트워크인터페이스 생성 완료");
            onClose();
          },
          onError: (error) => {
            toast.error("Error adding network:", error);
          },
        }
      );
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"네트워크 인터페이스"}
      submitTitle={editMode ? "편집" : "생성"}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="new-network-interface modal"> */}
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
        <div className="network_form_group">
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
                <FontAwesomeIcon
                  icon={faGlassWhiskey}
                  fixedWidth
                  style={{ marginRight: "0.1rem" }}
                />
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
                <FontAwesomeIcon
                  icon={faGlassWhiskey}
                  fixedWidth
                  style={{ marginRight: "0.1rem" }}
                />
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
                  checked={plugged === true}
                  onChange={() => setPlugged(true)}
                />
                <FontAwesomeIcon
                  icon={faGlassWhiskey}
                  fixedWidth
                  style={{ marginRight: "0.1rem" }}
                />
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
                <FontAwesomeIcon
                  icon={faGlassWhiskey}
                  fixedWidth
                  style={{ marginRight: "0.1rem" }}
                />
                <label htmlFor="unplugged">분리</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default VmNetworkNewInterfaceModal;
