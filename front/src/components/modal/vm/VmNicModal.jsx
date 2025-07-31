import { useState, useEffect, useMemo } from "react";
import { useValidationToast }  from "@/hooks/useSimpleToast";
import useGlobal               from "@/hooks/useGlobal";
import BaseModal               from "@/components/modal/BaseModal";
import ToggleSwitchButton      from "@/components/button/ToggleSwitchButton";
import LabelInput              from "@/components/label/LabelInput";
import LabelSelectOptions      from "@/components/label/LabelSelectOptions";
import { 
  handleInputChange, 
} from "@/components/label/HandleInput";
import {
  useAddNicFromVM,
  useAllVnicsFromCluster,
  useEditNicFromVM,
  useNetworkAttachmentsFromHost,
  useNetworkInterfaceFromVM,
  useNetworkInterfacesFromVM,
  useVm,
} from "@/api/RQHook";
import {
  checkDuplicateName,
  emptyIdNameVo,
  useSelectFirstNameItemEffect,
} from "@/util";
import Localization               from "@/utils/Localization";
import Logger                     from "@/utils/Logger";

const initialFormState = {
  id: "",
  name: "",
  linked: true, 
  plugged: true,
  macAddress: "",
  interface_: "virtio",
};

const VmNicModal = ({ 
  isOpen,
  onClose,
  editMode=false,
  nicName
}) => {
  const { validationToast } = useValidationToast();
  const nLabel = editMode 
    ? Localization.kr.UPDATE
    : Localization.kr.CREATE;

  const { vmsSelected, nicsSelected } = useGlobal();
  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const nicId = useMemo(() => [...nicsSelected][0]?.id, [nicsSelected]);
  // const hostId = useMemo(() => [...vmsSelected][0]?.hostVo?.id, [vmsSelected]?.hostVo);

  const [formInfoState, setFormInfoState] = useState(initialFormState);
  const [vnicProfileVo, setVnicProfileVo] = useState(emptyIdNameVo());

  // 편집 모드이고 vnic프로파일 존재하는 조건
  const [isProfileOriginallySet, setIsProfileOriginallySet] = useState(false);
  const isInterfaceDisabled = editMode && isProfileOriginallySet;

  const { data: vm } = useVm(vmId);
  
  // 해당 가상머신이 up인상태에서는 호스트에 내 nic 네트워크와 호스트 네트워크에 잇는게 같아야함
  // 즉 없는 네트워크로 편집/추가 불가능
  // const { 
  //   data: networkAttachments = [] 
  // } = useNetworkAttachmentsFromHost(hostId, (e) => ({ ...e }));

  const { data: nics = [] } = useNetworkInterfacesFromVM(vmId, (e) => ({ ...e }));
  const { data: nicsdetail } = useNetworkInterfaceFromVM(vmId, nicId);
  const { 
    data: vnics=[],
    isLoading: isNicsLoading,
    isSuccess: isAllVnicsSuccess,
  } = useAllVnicsFromCluster(vm?.clusterVo?.id, (e) => ({ ...e }));

  // useEffect(()=>{
  //   Logger.debug(`NicModal > useEffect ... networkAttachments: `, networkAttachments)
  // }, [networkAttachments])

  const { mutate: addNicFromVM } = useAddNicFromVM(onClose, onClose);
  const { mutate: editNicFromVM } = useEditNicFromVM(onClose, onClose);

  const filteredInterfaceOptions = useMemo(() => {
    const selectedVnicProfile = vnics.find((v) => v.id === vnicProfileVo.id);
    if (selectedVnicProfile?.passThrough === "ENABLED") {
      return interfaceOptions.filter((opt) => opt.value === "pci_passthrough");
    }
    return interfaceOptions;
  }, [vnics, vnicProfileVo]);

  const handleRadioChange = (field, value) => {
    Logger.debug(`NicModal > handleRadioChange ... field: ${field}, value: ${value}`);
    setFormInfoState((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!editMode && isOpen) {
      setFormInfoState((prev) => ({
        ...prev,
        name: nicName || "nic",
      }));
    }
  }, [editMode, isOpen]);
  
  useSelectFirstNameItemEffect(vnics, setVnicProfileVo, "ovirtmgmt");
  
  useEffect(() => {
    if (!isOpen) {
      setFormInfoState(initialFormState);
      setVnicProfileVo(emptyIdNameVo());
    } else if (editMode && nicsdetail) {
      Logger.debug(`NIC 데이터: ${JSON.stringify(nicsdetail, null, 2)}`);
      setFormInfoState({
        id: nicsdetail?.id || "",
        name: nicsdetail?.name || "",
        linked: nicsdetail?.linked ?? true,
        plugged: nicsdetail?.plugged ?? true,
        macAddress: nicsdetail?.macAddress || "",
        interface_: nicsdetail?.interface_ || "virtio",
      });
      setVnicProfileVo({
        id: nicsdetail?.vnicProfileVo?.id,
        name: nicsdetail?.vnicProfileVo?.name,
      });

      // 최초 프로파일 존재 여부 저장
      setIsProfileOriginallySet(!!nicsdetail?.vnicProfileVo?.id);
    }
  }, [isOpen, editMode, nicsdetail]);


  useEffect(() => {
    const selectedVnicProfile = vnics.find((v) => v.id === vnicProfileVo.id);
    if (selectedVnicProfile?.passThrough === "ENABLED") {
      setFormInfoState(prev => ({ ...prev, interface_: "pci_passthrough" }));
    } else {
      setFormInfoState(prev => ({ ...prev, interface_: "virtio" }));
    }
  }, [vnicProfileVo, vnics]);

  
  const validateForm = () => {
    if (!formInfoState.name) return `${Localization.kr.NAME}을 입력해주세요.`;
    
    const duplicateError = checkDuplicateName(nics, formInfoState.name, formInfoState.id);
    if (duplicateError) return duplicateError;
    
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    const dataToSubmit = {
      ...formInfoState,
      vnicProfileVo: { id: vnicProfileVo.id },
    };

    Logger.debug(`VmNicModal > handleFormSubmit ... dataToSubmit: `, dataToSubmit); // 데이터 출력

    editMode
      ? editNicFromVM({ vmId, nicId, nicData: dataToSubmit })
      : addNicFromVM({ vmId, nicData: dataToSubmit });
  };

  return (
    <BaseModal targetName={Localization.kr.NICS} submitTitle={nLabel}
      isOpen={isOpen} onClose={onClose}
      isReady={
        isAllVnicsSuccess &&
        Array.isArray(vnics) &&
        vnics.length > 0 &&
        typeof formInfoState.name === "string"
      }
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "550px" }}
    >
      <LabelInput id="name" label={Localization.kr.NAME}
        value={formInfoState.name}
        onChange={handleInputChange(setFormInfoState, "name",validationToast)}
      />
      <LabelSelectOptions label="프로파일"
        value={vnicProfileVo?.id}
        loading={isNicsLoading}
        onChange={(e) => setVnicProfileVo({id: e.target.value})}
        options={vnics.map(opt => ({
          value: opt.id,
          label: `${opt.name} [${Localization.kr.NETWORK}: ${opt.networkVo?.name || ""}]`
        }))}
      />
      <LabelSelectOptions label="유형"
        value={formInfoState.interface_}
        onChange={handleInputChange(setFormInfoState, "interface_")}
        options={filteredInterfaceOptions}
        disabled={isInterfaceDisabled}
      />
      {/* <LabelInput
        id="macAddress"
        label="사용자 지정 MAC 주소"
        placeholder="00:1A:4B:16:01:59"
        value={formInfoState.macAddress}
        onChange={handleInputChange(setFormInfoState, "macAddress")}
      /> */}
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
          tType="연결됨" fType={Localization.kr.DETACH}
        />
      </div>

    </BaseModal>
  );
};

export default VmNicModal;

// 유형
const interfaceOptions = [
  { value: "e1000", label: "e1000" },
  { value: "e1000e", label: "e1000e" },
  { value: "pci_passthrough", label: "pci_passthrough" },
  { value: "rtl8139", label: "rtl8139" },
  { value: "rtl8139_virtio", label: "rtl8139_virtio" },
  { value: "spapr_vlan", label: "spapr_vlan" },
  { value: "virtio", label: "virtio" },
];

const pciPassthroughOption = [
  { value: "pci_passthrough", label: "pci_passthrough" }
];

