import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import Localization from "../../../utils/Localization";
import {
  useAddNicFromVM,
  useAllVnicProfiles,
  useEditNicFromVM,
  useNetworkInterfaceByVMId,
} from "../../../api/RQHook";
import ToggleSwitchButton from "../../button/ToggleSwitchButton";

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
  interface_: "VIRTIO" || interfaceOptions[6].value,
};

const NicModal = ({ isOpen, onClose, editMode = false, vmId, nicId }) => {
  const nLabel = editMode ? "확인" : "생성";
  const [formInfoState, setFormInfoState] = useState(initialFormState);
  const [vnicProfileVo, setVnicProfileVo] = useState({ id: "", name: "" });

  const { mutate: addNicFromVM } = useAddNicFromVM();
  const { mutate: editNicFromVM } = useEditNicFromVM();

  // 가상머신 내 네트워크인터페이스 상세
  const { data: nicsdetail } = useNetworkInterfaceByVMId(vmId, nicId);

  // 모든 vnic프로파일 목록
  // TODO: 수정필요
  const { data: vnics, isLoading: vnicLoading } = useAllVnicProfiles((e) => ({
    ...e,
  }));

  const handleInputChange = (field, value = null) => (e) => {
    console.log(`NicModal > handleInputChange ... field: ${field}, value: ${value}`)
    setFormInfoState((prev) => ({ ...prev, [field]: value ?? e.target.value }));
  };

  const handleRadioChange = (field, value) => {
    console.log(`NicModal > handleRadioChange ... field: ${field}, value: ${value}`)
    setFormInfoState((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!isOpen) {
      setFormInfoState(initialFormState);
      setVnicProfileVo({ id: "", name: "" });
    } else if (editMode && nicsdetail) {
      console.log("NIC 데이터 확인:", nicsdetail);
      setFormInfoState({
        id: nicsdetail?.id || "",
        name: nicsdetail?.name || "",
        linked: nicsdetail?.linked ?? true,
        plugged: nicsdetail?.plugged ?? true,
        macAddress: nicsdetail?.macAddress || "",
        interface_: nicsdetail?.interface_ || "VIRTIO",
      });
      setVnicProfileVo({
        id: nicsdetail?.vnicProfileVo?.id,
        name: nicsdetail?.vnicProfileVo?.name,
      });
    }
  }, [isOpen, editMode, nicsdetail]);

  const dataToSubmit = {
    ...formInfoState,
    vnicProfileVo: { id: vnicProfileVo.id },
  };

  const validateForm = () => {
    if (!formInfoState.name) return `${Localization.kr.NAME}을 입력해주세요.`;
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
      ? editNicFromVM(
          { vmId, nicId, nicData: dataToSubmit },
          { onSuccess, onError }
        )
      : addNicFromVM({ vmId, nicData: dataToSubmit }, { onSuccess, onError });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={Localization.kr.NICS}
      submitTitle={nLabel}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "690px" }}
    >
      <div className="network-popup-content">
        <LabelInput
          id="name"
          label={Localization.kr.NAME}
          value={formInfoState.name}
          onChange={handleInputChange("name")}
        />

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
          onChange={handleInputChange("interface_")}
          options={interfaceOptions}
          disabled={editMode}
        />
        <div className="mac-address">사용자 지정 MAC 주소</div>

       
             
          </div>
        
              <ToggleSwitchButton id="plugged" 
                label="링크 상태"
                checked={formInfoState.linked}
                onChange={() => handleRadioChange("linked", !formInfoState.linked)}
                tType="Up" fType="Down"
              />
              {/* <div>
                <input
                  type="radio"
                  name="status"
                  id="status_up"
                  checked={formInfoState.linked === true} // linked가 true일 때 체크
                  onChange={() => handleRadioChange("linked", true)}
                />
                <RVI16 iconDef={rvi16Connected} />
                <label htmlFor="status_up">Up</label>
              </div>
              <div>
                <input
                  id="status_down"
                  type="radio"
                  name="status"
                  checked={formInfoState.linked === false} // linked가 false일 때 체크
                  onChange={() => handleRadioChange("linked", false)}
                />
                <RVI16 iconDef={rvi16Disconnected} />
                <label htmlFor="status_down">Down</label>
              </div>*/}
       
       
            <ToggleSwitchButton id="plugged" 
              label="카드 상태"
              tType="연결됨" fType="분리"
              checked={formInfoState.plugged === true}
              onChange={() => handleRadioChange("plugged", !formInfoState.plugged)}
            />

 
    </BaseModal>
  );
};

export default NicModal;
