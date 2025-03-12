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
} from "../../../api/RQHook";
import LabelInput from "../../label/LabelInput";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelSelectOptions from "../../label/LabelSelectOptions";
 
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

const initialFormState = {
  id: "",
  name: "",
  linked: true, //링크상태(link state) t(up)/f(down) -> nic 상태도 같이 변함
  plugged: true,
  macAddress: "",
  interface_: "VIRTIO" || interfaceOptions[6].value
};

const NicModal = ({
  isOpen,
  onClose,
  editMode = false,
  vmId,
  nicId,
}) => {
  const nLabel = editMode ? "편집" : "생성";
  const [formInfoState, setFormInfoState] = useState(initialFormState);
  const [vnicProfileVo, setVnicProfileVo] = useState({ id: "", name: "" });

  const { mutate: addNicFromVM } = useAddNicFromVM();
  const { mutate: editNicFromVM } = useEditNicFromVM();

  // 가상머신 내 네트워크인터페이스 상세
  const { data: nicsdetail } = useNetworkInterfaceByVMId(vmId, nicId);

  // 모든 vnic프로파일 목록
  // TODO: 수정필요
  const { 
    data: vnics,
    isLoading: vnicLoading
  } = useAllVnicProfiles((e) => ({
    ...e,
  }));

  const handleInputChange = (field) => (e) => {
    setFormInfoState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRadioChange = (field, value) => {
    setFormInfoState((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if(!isOpen){
      setFormInfoState(initialFormState);
      setVnicProfileVo({ id: "", name: "" });
    }
    else if(editMode && nicsdetail) {
      console.log("NIC 데이터 확인:", nicsdetail);
      setFormInfoState({
        id: nicsdetail?.id || "",
        name: nicsdetail?.name || "",
        linked: nicsdetail?.linked ?? true,
        plugged: nicsdetail?.plugged ?? true,
        macAddress: nicsdetail?.macAddress || "",
        interface_: nicsdetail?.interface_ || "VIRTIO",
      });
      setVnicProfileVo({id: nicsdetail?.vnicProfileVo?.id, name: nicsdetail?.vnicProfileVo?.name})
    }
  }, [isOpen, editMode, nicsdetail])

  const dataToSubmit = {
    ...formInfoState,
    vnicProfileVo: { id: vnicProfileVo.id }
  }

  const validateForm = () => {
    if (!formInfoState.name) return "이름을 입력해주세요.";
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const onSuccess = () => {
      onClose();
      toast.success(`nic ${nLabel} 완료`);
    };
    const onError = (err) => toast.error(`Error ${nLabel} nic: ${err}`);

    console.log("가상머신 데이터 확인:", dataToSubmit);

    editMode
      ? editNicFromVM({ vmId, nicId, nicData: dataToSubmit }, { onSuccess, onError })
      : addNicFromVM({ vmId, nicData: dataToSubmit }, { onSuccess, onError });
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"네트워크 인터페이스"}
      submitTitle={nLabel}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "690px", height: "400px" }} 
    >
      <div className="popup-content-outer">
        <div className="network-popup-content">
          <LabelInput label="이름" id="name" value={formInfoState.name} onChange={ handleInputChange("name") }/>
          
          <LabelSelectOptionsID
            label="프로파일"
            value={vnicProfileVo?.id}
            onChange={(e) => setVnicProfileVo({ id: e.target.value })}
            loading={vnicLoading}
            options={vnics || []}
          />
          <LabelSelectOptions
            label="유형"
            value={formInfoState.interface_}
            onChange={ handleInputChange("interface_") }
            options={interfaceOptions}
            disabled={editMode}
          />
          <span>사용자 지정 MAC 주소</span>

          <div className="plug-radio-btn">
            <span>링크 상태</span>
            <div>
              <div className="radio-outer">
                <div>
                  <input
                    type="radio"
                    name="status"
                    id="status_up"
                    checked={formInfoState.linked === true} // linked가 true일 때 체크
                    onChange={() => handleRadioChange("linked", true)}
                  />
                  <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth style={{ marginRight: "0.1rem" }} />
                  <label htmlFor="status_up">Up</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="status"
                    id="status_down"
                    checked={formInfoState.linked === false} // linked가 false일 때 체크
                    onChange={() => handleRadioChange("linked", false)}
                  />
                  <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth style={{ marginRight: "0.1rem" }} />
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
                    checked={formInfoState.plugged === true}
                    onChange={() => handleRadioChange("plugged", true)}
                  />
                  <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth style={{ marginRight: "0.1rem" }} />
                  <label htmlFor="plugged">연결됨</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="plugged_status"
                    id="unplugged"
                    checked={formInfoState.plugged === false}
                    onChange={() => handleRadioChange("plugged", false)}
                  />
                  <FontAwesomeIcon icon={faGlassWhiskey} fixedWidth style={{ marginRight: "0.1rem" }} />
                  <label htmlFor="unplugged">분리</label>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </BaseModal>
  );
};

export default NicModal;
