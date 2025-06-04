// import { useState, useEffect, useMemo } from "react";
// import { useValidationToast }           from "@/hooks/useSimpleToast";
// import useUIState                       from "@/hooks/useUIState";
// import useGlobal                        from "@/hooks/useGlobal";
// import BaseModal                        from "../BaseModal";
// import ToggleSwitchButton               from "@/components/button/ToggleSwitchButton";
// import LabelInput                       from "@/components/label/LabelInput";
// import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
// import { 
//   handleInputChange, 
//   handleSelectIdChange,
// } from "@/components/label/HandleInput";
// import {
//   useAddNicFromVM,
//   useAddNicFromTemplate,
//   useEditNicFromVM,
//   useEditNicFromTemplate,
//   useAllvnicFromCluster,
//   useNetworkInterfaceFromVM,
//   useAllNicsFromTemplate,
//   useVm,
//   useTemplate,
// } from "@/api/RQHook";
// import Localization                     from "@/utils/Localization";
// import Logger                           from "@/utils/Logger";

// const initialFormState = {
//   id: "",
//   name: "",
//   linked: true,
//   plugged: true,
//   macAddress: "",
//   interface_: "VIRTIO",
// };

// const interfaceOptions = [
//   { value: "E1000", label: "e1000" },
//   { value: "E1000E", label: "e1000e" },
//   { value: "PCI_PASSTHROUGH", label: "pci_passthrough" },
//   { value: "RTL8139", label: "rtl8139" },
//   { value: "RTL8139_VIRTIO", label: "rtl8139_virtio" },
//   { value: "SPAPR_VLAN", label: "spapr_vlan" },
//   { value: "VIRTIO", label: "virtio" },
// ];

// const VmNicModal = ({ 
//   isOpen, 
//   onClose, 
//   editMode = false, 
//   type,
//   resourceId, 
//   nicId = null
// }) => {
//   const { validationToast } = useValidationToast();
//   const nLabel = editMode 
//     ? Localization.kr.UPDATE
//     : Localization.kr.CREATE;
//   const { vmsSelected, templatesSelected, nicsSelected, vnicProfilesSelected } = useGlobal();

//   const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
//   const templateId = useMemo(() => [...templatesSelected][0]?.id, [templatesSelected]);

// const selectedNicId = useMemo(() => {
//   if (nicId) return nicId;
//   if (!isOpen) return undefined; // 🔐 모달 열릴 때만 계산
//   return type === "vm" ? [...nicsSelected][0]?.id : [...vnicProfilesSelected][0]?.id;
// }, [nicId, type, isOpen, nicsSelected, vnicProfilesSelected]);

// console.log("🐛 리소스ID:", resourceId);
// console.log("🐛 NIC ID:", selectedNicId);
// console.log("🐛 타입:", type);
//   const [formInfoState, setFormInfoState] = useState(initialFormState);
//   const [vnicProfileVo, setVnicProfileVo] = useState({ id: "", name: "" });
//   const [isProfileOriginallySet, setIsProfileOriginallySet] = useState(false);
//   const isInterfaceDisabled = editMode && isProfileOriginallySet;

//   // const { data: vm } = useVm(vmId);
//   // const { data: template } = useTemplate(templateId);
// const { data: vm } = useVm(resourceId, undefined, { enabled: type === "vm" && !!resourceId });
// const { data: template } = useTemplate(resourceId, undefined, { enabled: type === "template" && !!resourceId });

//   useEffect(() => {
//     console.log("🔍 vm 데이터:", vm);
//   }, [vm]);

//   useEffect(() => {
//     console.log("🔍 template 데이터:", template);
//   }, [template]);
//   useEffect(() => {
//     console.log("🧩 [VmNicModal] type:", type);
//     console.log("📦 [VmNicModal] resourceId:", resourceId);
//   }, [type, resourceId]);

//   // 디버깅용: vmId, templateId 확인
//   useEffect(() => {
//     console.log("📌 [VmNicModal] vmId from useGlobal:", vmId);
//     console.log("📌 [VmNicModal] templateId from useGlobal:", templateId);
//   }, [vmId, templateId]);
//   //const clusterId = type === "vm" ? vm?.clusterVo?.id : template?.clusterVo?.id;
//   const clusterId = useMemo(() => {
//     if (type === "vm") return vm?.clusterVo?.id;
//     if (type === "template") return template?.clusterVo?.id;
//     return undefined;
//   }, [type, vm, template]);

//   const {
//     data: vnics = [],
//     isLoading: isNicsLoading,
//   } = useAllvnicFromCluster(
//     clusterId,
//     (e) => ({ ...e }),
//     {
//       enabled: !!clusterId && (type === "vm" || type === "template")
//     }
//   );
//   // const {
//   //   data: vnics = [],
//   //   isLoading: isNicsLoading,
//   // } = useAllvnicFromCluster(
//   //   clusterId,
//   //   (e) => ({ ...e }),
//   //   { enabled: !!clusterId }
//   // );

// const nicFromVM = useNetworkInterfaceFromVM(resourceId, selectedNicId, {
//   enabled: type === "vm" && !!resourceId && !!selectedNicId,
// });

// const nicFromTemplate = useAllNicsFromTemplate(resourceId, selectedNicId, {
//   enabled: type === "template" && !!resourceId && !!selectedNicId,
// });
//   useEffect(() => {
//   if (type === "vm") {
//     console.log("🧠 [VmNicModal] ✅ useNetworkInterfaceFromVM 실행됨");
//     console.log("  ▶️ resourceId:", resourceId);
//     console.log("  ▶️ selectedNicId:", selectedNicId);
//     console.log("  ▶️ result:", nicFromVM.data);
//   } else if (type === "template") {
//     console.log("📐 [VmNicModal] ✅ useAllNicsFromTemplate 실행됨");
//     console.log("  ▶️ resourceId:", resourceId);
//     console.log("  ▶️ selectedNicId:", selectedNicId);
//     console.log("  ▶️ result:", nicFromTemplate.data);
//   } 
// }, [type, resourceId, selectedNicId]);
//   const nicDetail = type === "vm" ? nicFromVM.data : nicFromTemplate.data;

//   // const addNicFromVM = useAddNicFromVM(onClose, onClose);
//   // const addNicFromTemplate = useAddNicFromTemplate(onClose, onClose);
// const addNicFromVM = useAddNicFromVM(() => {
//   console.log("🔥 useAddNicFromVM 실행됨");
//   onClose();
// }, onClose);

// const addNicFromTemplate = useAddNicFromTemplate(() => {
//   console.log("💎 useAddNicFromTemplate 실행됨");
//   onClose();
// }, onClose);
//   const editNicFromVM = useEditNicFromVM(onClose, onClose);
//   const editNicFromTemplate = useEditNicFromTemplate(onClose, onClose);

//   const addNic = type === "vm" ? addNicFromVM.mutate : addNicFromTemplate.mutate;
//   const updateNic = type === "vm" ? editNicFromVM.mutate : editNicFromTemplate.mutate;



//   const filteredInterfaceOptions = useMemo(() => {
//     const selectedProfile = vnics.find((v) => v.id === vnicProfileVo.id);
//     return selectedProfile?.passThrough === "ENABLED"
//       ? interfaceOptions.filter(opt => opt.value === "PCI_PASSTHROUGH")
//       : interfaceOptions;
//   }, [vnics, vnicProfileVo]);

//   const handleRadioChange = (field, value) => {
//     setFormInfoState((prev) => ({ ...prev, [field]: value }));
//   };

//   useEffect(() => {
//     if (!isOpen) {
//       setFormInfoState(initialFormState);
//       setVnicProfileVo({ id: "", name: "" });
//     }
//   }, [isOpen]);

// // 편집 모드에서 nicDetail이 생기면 상태 세팅
// useEffect(() => {
//   if (isOpen && editMode && nicDetail) {
//     console.log("📦 nicDetail:", nicDetail);
//     setFormInfoState({
//       id: nicDetail?.id || "",
//       name: nicDetail?.name || "",
//       linked: nicDetail?.linked ?? true,
//       plugged: nicDetail?.plugged ?? true,
//       macAddress: nicDetail?.macAddress || "",
//       interface_: nicDetail?.interface_ || "VIRTIO",
//     });
//     setVnicProfileVo({
//       id: nicDetail?.vnicProfileVo?.id || "",
//       name: nicDetail?.vnicProfileVo?.name || "",
//     });
//     setIsProfileOriginallySet(!!nicDetail?.vnicProfileVo?.id);
//   }
// }, [nicDetail, isOpen, editMode]);


//   useEffect(() => {
//     if (!editMode && vnics.length > 0) {
//       const defaultVnic = vnics.find(n => n.name === "ovirtmgmt") || vnics[0];
//       setVnicProfileVo({ id: defaultVnic.id, name: defaultVnic.name });
//     }
//   }, [vnics, editMode]);

//   // useEffect(() => {
//   //   const selected = vnics.find((v) => v.id === vnicProfileVo.id);
//   //   setFormInfoState(prev => ({
//   //     ...prev,
//   //     interface_: selected?.passThrough === "ENABLED" ? "PCI_PASSTHROUGH" : "VIRTIO",
//   //   }));
//   // }, [vnicProfileVo, vnics]);
// useEffect(() => {
//   if (!editMode && !formInfoState.id) {
//     const selected = vnics.find((v) => v.id === vnicProfileVo.id);
//     if (selected) {
//       setFormInfoState(prev => ({
//         ...prev,
//         interface_: selected.passThrough === "ENABLED" ? "PCI_PASSTHROUGH" : "VIRTIO",
//       }));
//     }
//   }
// }, [vnicProfileVo, vnics, editMode, formInfoState.id]);

//   const validateForm = () => {
//     if (!formInfoState.name) return `${Localization.kr.NAME}을 입력해주세요.`;
//     return null;
//   };

//   const handleFormSubmit = () => {
//     const error = validateForm();
//     if (error) {
//       validationToast.fail(error);
//       return;
//     }

//     const dataToSubmit = {
//       ...formInfoState,
//       vnicProfileVo: { id: vnicProfileVo.id },
//     };

//     const payload = {
//       nicId: selectedNicId,
//       nicData: dataToSubmit,
//       ...(type === "vm" ? { vmId: resourceId } : { templateId: resourceId }),
//     };

//     editMode ? updateNic(payload) : addNic(payload);
//   };

//   return (
//     <BaseModal
//       targetName={Localization.kr.NICS}
//       submitTitle={nLabel}
//       isOpen={isOpen}
//       onClose={onClose}
//       onSubmit={handleFormSubmit}
//       contentStyle={{ width: "690px" }}
//     >
//       <LabelInput
//         id="name"
//         label={Localization.kr.NAME}
//         value={formInfoState.name}
//         onChange={handleInputChange(setFormInfoState, "name")}
//       />
//       <LabelSelectOptions
//         label="프로파일"
//         value={vnicProfileVo?.id}
//         loading={isNicsLoading}
//         onChange={(e) => setVnicProfileVo({ id: e.target.value })}
//         options={vnics.map(opt => ({
//           value: opt.id,
//           label: `${opt.name} [네트워크: ${opt.networkVo?.name || ""}]`,
//         }))}
//       />
//       <LabelSelectOptions
//         label="유형"
//         value={formInfoState.interface_}
//         onChange={handleInputChange(setFormInfoState, "interface_")}
//         options={filteredInterfaceOptions}
//         disabled={isInterfaceDisabled}
//       />
//       <div className="nic-toggle">
//         <ToggleSwitchButton
//           id="linked-toggle"
//           label="링크 상태"
//           checked={formInfoState.linked}
//           onChange={() => handleRadioChange("linked", !formInfoState.linked)}
//           tType="Up"
//           fType="Down"
//         />
//       </div>
//       <div className="nic-toggle">
//         <ToggleSwitchButton
//           id="plugged-toggle"
//           label="카드 상태"
//           checked={formInfoState.plugged}
//           onChange={() => handleRadioChange("plugged", !formInfoState.plugged)}
//           tType="연결됨"
//           fType={Localization.kr.DETACH}
//         />
//       </div>
//     </BaseModal>
//   );
// };

// export default VmNicModal;



import { useState, useEffect, useMemo } from "react";
import useUIState              from "@/hooks/useUIState";
import useGlobal               from "@/hooks/useGlobal";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import { handleInputChange, handleSelectIdChange } from "../../label/HandleInput";
import {
  useAddNicFromVM,
  useAllvnicFromCluster,
  useEditNicFromVM,
  useNetworkInterfaceFromVM,
  useVm,
} from "../../../api/RQHook";
import ToggleSwitchButton from "../../button/ToggleSwitchButton";
import Logger from "../../../utils/Logger";
import Localization from "../../../utils/Localization";
import { useToast } from "@/hooks/use-toast";

const initialFormState = {
  id: "",
  name: "",
  linked: true, 
  plugged: true,
  macAddress: "",
  interface_: "VIRTIO",
};

const VmNicModal = ({ 
  isOpen,
  onClose,
  editMode=false,
}) => {
  const { toast } = useToast();
  // const { closeModal } = useUIState()
  const nLabel = editMode 
    ? Localization.kr.UPDATE
    : Localization.kr.CREATE;

  const { vmsSelected, nicsSelected } = useGlobal();
  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const nicId = useMemo(() => [...nicsSelected][0]?.id, [nicsSelected]);

  const [formInfoState, setFormInfoState] = useState(initialFormState);
  const [vnicProfileVo, setVnicProfileVo] = useState({ id: "", name: "" });

  // 편집 모드이고 vnic프로파일 존재하는 조건
  const [isProfileOriginallySet, setIsProfileOriginallySet] = useState(false);
  const isInterfaceDisabled = editMode && isProfileOriginallySet;

  const {
    data: vm
  } = useVm(vmId);
  const { data: nicsdetail } = useNetworkInterfaceFromVM(vmId, nicId);
  const { 
    data: vnics=[],
    isLoading: isNicsLoading
  } = useAllvnicFromCluster(vm?.clusterVo?.id, (e) => ({ ...e }));

  const { mutate: addNicFromVM } = useAddNicFromVM(onClose, onClose);
  const { mutate: editNicFromVM } = useEditNicFromVM(onClose, onClose);

  const filteredInterfaceOptions = useMemo(() => {
    const selectedVnicProfile = vnics.find((v) => v.id === vnicProfileVo.id);
    if (selectedVnicProfile?.passThrough === "ENABLED") {
      return interfaceOptions.filter((opt) => opt.value === "PCI_PASSTHROUGH");
    }
    return interfaceOptions;
  }, [vnics, vnicProfileVo]);

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

      // 최초 프로파일 존재 여부 저장
      setIsProfileOriginallySet(!!nicsdetail?.vnicProfileVo?.id);
    }
  }, [isOpen, editMode, nicsdetail]);

  useEffect(() => {
    if (!editMode && vnics && vnics.length > 0) {
      const defaultVnic = vnics.find(n => n.name === "ovirtmgmt");
      const firstN = defaultVnic || vnics[0];
      setVnicProfileVo({ id: firstN.id, name: firstN.name });
    }
  }, [vnics, editMode]);

  useEffect(() => {
    const selectedVnicProfile = vnics.find((v) => v.id === vnicProfileVo.id);
    if (selectedVnicProfile?.passThrough === "ENABLED") {
      setFormInfoState(prev => ({ ...prev, interface_: "PCI_PASSTHROUGH" }));
    } else {
      setFormInfoState(prev => ({ ...prev, interface_: "VIRTIO" }));
    }
  }, [vnicProfileVo, vnics]);

  
  const validateForm = () => {
    if (!formInfoState.name) return `${Localization.kr.NAME}을 입력해주세요.`;
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error,
      });
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
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "690px" }}
    >
      <LabelInput id="name" label={Localization.kr.NAME}
        value={formInfoState.name}
        onChange={handleInputChange(setFormInfoState, "name")}
      />
      {/* <LabelSelectOptionsID label="프로파일"
        value={vnicProfileVo?.id}
        loading={isNicsLoading}
        options={vnics}
        onChange={handleSelectIdChange(setVnicProfileVo, vnics)}
        // etcLabel={networkVo?.name} // 네트워크명
      /> */}
      <LabelSelectOptions label="프로파일"
        value={vnicProfileVo?.id}
        loading={isNicsLoading}
        onChange={(e) => setVnicProfileVo({id: e.target.value})}
        options={vnics.map(opt => ({
          value: opt.id,
          label: `${opt.name} [네트워크: ${opt.networkVo?.name || ""}]`
        }))}
      />
      <LabelSelectOptions label="유형"
        value={formInfoState.interface_}
        onChange={handleInputChange(setFormInfoState, "interface_")}
        options={filteredInterfaceOptions}
        // disabled={!!vnicProfileVo?.id}
        disabled={isInterfaceDisabled}
      />
      {/* <LabelInput
        id="macAddress"
        label="MAC 주소"
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

const pciPassthroughOption = [
  { value: "PCI_PASSTHROUGH", label: "pci_passthrough" }
];

