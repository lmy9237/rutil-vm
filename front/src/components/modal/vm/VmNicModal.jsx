import { useState, useEffect, useMemo } from "react";
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
  useNetworkInterfaceFromVM,
} from "../../../api/RQHook";
import ToggleSwitchButton from "../../button/ToggleSwitchButton";
import Logger from "../../../utils/Logger";
import useGlobal from "../../../hooks/useGlobal";
import { handleInputChange, handleSelectIdChange } from "../../label/HandleInput";

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
  linked: true, 
  plugged: true,
  macAddress: "",
  interface_: "VIRTIO" || interfaceOptions[6].value,
};

const VmNicModal = ({ isOpen, onClose, editMode = false, }) => {
  const nLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;

  const { vmsSelected, nicsSelected } = useGlobal();
  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const nicId = useMemo(() => [...nicsSelected][0]?.id, [nicsSelected]);

  const [formInfoState, setFormInfoState] = useState(initialFormState);
  const [vnicProfileVo, setVnicProfileVo] = useState({ id: "", name: "" });

  const onSuccess = () => {
    onClose();
    toast.success(`nic ${nLabel} 완료`);
  };
  const { data: nicsdetail } = useNetworkInterfaceFromVM(vmId, nicId);
  const { mutate: addNicFromVM } = useAddNicFromVM(onSuccess, () => onClose());
  const { mutate: editNicFromVM } = useEditNicFromVM(onSuccess, () => onClose());

  // 모든 vnic프로파일 목록
  // TODO: 수정필요
  const {
    data: vnics,
    isLoading: vnicLoading
  } = useAllVnicProfiles((e) => ({...e}));

  const handleRadioChange = (field, value) => {
    Logger.debug(`NicModal > handleRadioChange ... field: ${field}, value: ${value}`);
    setFormInfoState((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!isOpen) {
      setFormInfoState(initialFormState);
      setVnicProfileVo({ id: "", name: "" });
    } else if (editMode && nicsdetail) {
      Logger.debug(`NIC 데이터: ${JSON.stringify(nicsdetail, null, 2)}`);
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

  useEffect(() => {
    if (!editMode && vnics && vnics.length > 0) {
      const defaultVnic = vnics.find(n => n.name === "ovirtmgmt");
      const firstN = defaultVnic || vnics[0];
      setVnicProfileVo({ id: firstN.id, name: firstN.name });
    }
  }, [vnics, editMode]);

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

    
    const onError = (err) => toast.error(`Error ${nLabel} nic: ${err}`);

    Logger.debug(`NicModal > handleFormSubmit ... dataToSubmit: ${dataToSubmit}`)

    editMode
      ? editNicFromVM(
          { vmId, nicId, nicData: dataToSubmit },
          { onSuccess, onError }
        )
      : addNicFromVM({ vmId, nicData: dataToSubmit }, { onSuccess, onError });
  };

  return (
    <BaseModal targetName={Localization.kr.NICS} submitTitle={nLabel}
      isOpen={isOpen} onClose={onClose}       
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "690px" }}
    >
      <div className="network-popup-content">
        <LabelInput id="name" label={Localization.kr.NAME}
          value={formInfoState.name}
          onChange={handleInputChange(setFormInfoState, "name")}
        />
        <LabelSelectOptionsID label="프로파일"
          value={vnicProfileVo?.id}
          loading={vnicLoading}
          options={vnics}
          onChange={handleSelectIdChange(setVnicProfileVo, vnics)}
          // etcLabel={} // 네트워크명
        />
        <LabelSelectOptions label="유형"
          value={formInfoState.interface_}
          onChange={handleInputChange(setFormInfoState, "interface_")}
          options={interfaceOptions}
          disabled={editMode}
        />
        <div className="mac-address fs-18">사용자 지정 MAC 주소</div>
      </div>

      <div className="nic-toggle">
        <ToggleSwitchButton id="linked-toggle" label="링크 상태"
          checked={formInfoState.linked}
          onChange={() => handleRadioChange("linked", !formInfoState.linked)}
          tType="Up" fType="Down"
        />
      </div>
      <div className="nic-toggle">
        <ToggleSwitchButton id="plugged-toggle" label="카드 상태"
          checked={formInfoState.plugged}
          onChange={() => handleRadioChange("plugged", !formInfoState.plugged)}
          tType="연결됨" fType="분리"
        />
      </div>
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
          </div>
        */}


    </BaseModal>
  );
};

export default VmNicModal;
