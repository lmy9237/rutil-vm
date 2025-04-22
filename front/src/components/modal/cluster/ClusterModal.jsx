import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelInput from "../../label/LabelInput";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import {
  useAddCluster,
  useEditCluster,
  useCluster,
  useAllDataCenters,
  useNetworksFromDataCenter,
} from "../../../api/RQHook";
import { checkKoreanName, checkName } from "../../../util";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import CONSTANT from "../../../Constants";
import "./MCluster.css";


// name이 value고, description이 label
const cpuArcOptions = {
  X86_64: [
    { value: "Intel Nehalem Family", label: "Intel Nehalem Family" },
    { value: "Secure Intel Nehalem Family", label: "Secure Intel Nehalem Family" },
    { value: "Intel Westmere Family", label: "Intel Westmere Family" },
    { value: "Secure Intel Westmere Family", label: "Secure Intel Westmere Family" },
    { value: "Intel SandyBridge Family", label: "Intel SandyBridge Family" },
    { value: "Secure Intel SandyBridge Family", label: "Secure Intel SandyBridge Family" },
    { value: "Intel IvyBridge Family", label: "Intel IvyBridge Family" },
    { value: "Secure Intel IvyBridge Family", label: "Secure Intel IvyBridge Family" },
    { value: "Intel Haswell Family", label: "Intel Haswell Family" },
    { value: "Secure Intel Haswell Family", label: "Secure Intel Haswell Family" },
    { value: "Intel Broadwell Family", label: "Intel Broadwell Family" },
    { value: "Secure Intel Broadwell Family", label: "Secure Intel Broadwell Family" },
    { value: "Intel Skylake Client Family", label: "Intel Skylake Client Family" },
    { value: "Secure Intel Skylake Client Family", label: "Secure Intel Skylake Client Family" },
    { value: "Intel Skylake Server Family", label: "Intel Skylake Server Family" },
    { value: "Secure Intel Skylake Server Family", label: "Secure Intel Skylake Server Family" },
    { value: "Intel Cascadelake Server Family", label: "Intel Cascadelake Server Family" },
    { value: "Secure Intel Cascadelake Server Family", label: "Secure Intel Cascadelake Server Family" },
    { value: "Intel Icelake Server Family", label: "Intel Icelake Server Family" },
    { value: "Secure Intel Icelake Server Family", label: "Secure Intel Icelake Server Family" },
    { value: "AMD Opteron G4", label: "AMD Opteron G4" },
    { value: "AMD Opteron G5", label: "AMD Opteron G5" },
    { value: "AMD EPYC", label: "AMD EPYC" },
    { value: "Secure AMD EPYC", label: "Secure AMD EPYC" }
  ],
  PPC64: [
    { value: "IBM POWER8", label: "IBM POWER8" },
    { value: "IBM POWER9", label: "IBM POWER9" },
  ],
  S390X: [
    { value: "IBM z114, z196", label: "IBM z114, z196" },
    { value: "IBM zBC12, zEC12", label: "IBM zBC12, zEC12" },
    { value: "IBM z13s, z13", label: "IBM z13s, z13" },
    { value: "IBM z14", label: "IBM z14" },
  ],
  UNDEFINED: [
    { value: "", label: "자동 감지" },
    { value: "Intel Nehalem Family", label: "Intel Nehalem Family" },
    { value: "Secure Intel Nehalem Family", label: "Secure Intel Nehalem Family" },
    { value: "Intel Westmere Family", label: "Intel Westmere Family" },
    { value: "Secure Intel Westmere Family", label: "Secure Intel Westmere Family" },
    { value: "Intel SandyBridge Family", label: "Intel SandyBridge Family" },
    { value: "Secure Intel SandyBridge Family", label: "Secure Intel SandyBridge Family" },
    { value: "Intel IvyBridge Family", label: "Intel IvyBridge Family" },
    { value: "Secure Intel IvyBridge Family", label: "Secure Intel IvyBridge Family" },
    { value: "Intel Haswell Family", label: "Intel Haswell Family" },
    { value: "Secure Intel Haswell Family", label: "Secure Intel Haswell Family" },
    { value: "Intel Broadwell Family", label: "Intel Broadwell Family" },
    { value: "Secure Intel Broadwell Family", label: "Secure Intel Broadwell Family" },
    { value: "Intel Skylake Client Family", label: "Intel Skylake Client Family" },
    { value: "Secure Intel Skylake Client Family", label: "Secure Intel Skylake Client Family" },
    { value: "Intel Skylake Server Family", label: "Intel Skylake Server Family" },
    { value: "Secure Intel Skylake Server Family", label: "Secure Intel Skylake Server Family" },
    { value: "Intel Cascadelake Server Family", label: "Intel Cascadelake Server Family" },
    { value: "Secure Intel Cascadelake Server Family", label: "Secure Intel Cascadelake Server Family" },
    { value: "Intel Icelake Server Family", label: "Intel Icelake Server Family" },
    { value: "Secure Intel Icelake Server Family", label: "Secure Intel Icelake Server Family" },
    { value: "AMD Opteron G4", label: "AMD Opteron G4" },
    { value: "AMD Opteron G5", label: "AMD Opteron G5" },
    { value: "AMD EPYC", label: "AMD EPYC" },
    { value: "Secure AMD EPYC", label: "Secure AMD EPYC" },
    { value: "IBM POWER8", label: "IBM POWER8" },
    { value: "IBM POWER9", label: "IBM POWER9" },
    { value: "IBM z114, z196", label: "IBM z114, z196" },
    { value: "IBM zBC12, zEC12", label: "IBM zBC12, zEC12" },
    { value: "IBM z13s, z13", label: "IBM z13s, z13" },
    { value: "IBM z14", label: "IBM z14" },
  ],
};

const biosTypeOptions = [
  { value: "CLUSTER_DEFAULT", label: "자동 감지" },
  { value: "Q35_OVMF", label: "UEFI의 Q35 칩셋" },
  { value: "I440FX_SEA_BIOS", label: "BIOS의 I440FX 칩셋" },
  { value: "Q35_SEA_BIOS", label: "BIOS의 Q35 칩셋" },
  { value: "Q35_SECURE_BOOT", label: "UEFI SecureBoot의 Q35 칩셋" },
];

const errorHandlingOptions = [
  { value: "migrate", label: `${Localization.kr.VM}을 ${Localization.kr.MIGRATION}함` },
  { value: "migrate_highly_available", label: `${Localization.kr.HOST} ${Localization.kr.VM}만 ${Localization.kr.MIGRATION}` },
  { value: "do_not_migrate", label: `${Localization.kr.VM}은 ${Localization.kr.MIGRATION} 하지 않음` },
];

const initialFormState = {
  id: "",
  name: "",
  description: "",
  comment: "",
  cpuArc: "UNDEFINED",
  cpuType: "",
  biosType: "CLUSTER_DEFAULT",
  errorHandling: "migrate",
};

const ClusterModal = ({
  isOpen, 
  editMode = false, 
  clusterId, 
  datacenterId, 
  onClose
}) => {
  const cLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;
  const [formState, setFormState] = useState(initialFormState);

  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [networkVo, setNetworkVo] = useState({ id: "", name: "" });
  const [cpuOptions, setCpuOptions] = useState([]);

  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.CLUSTER} ${cLabel} 완료`);
  };
  const { data: cluster } = useCluster(clusterId);
  const { mutate: addCluster } = useAddCluster(onSuccess, () => onClose());
  const { mutate: editCluster } = useEditCluster(onSuccess, () => onClose());

  const { 
    data: datacenters = [], 
    isLoading: isDataCentersLoading 
  } = useAllDataCenters((e) => ({ ...e }));
  const { 
    data: networks = [], 
    isLoading: isNetworksLoading 
  } = useNetworksFromDataCenter(dataCenterVo?.id || undefined, (e) => ({ ...e }));

  useEffect(() => {
    if (!isOpen) {
      return setFormState(initialFormState);
    }
    if (editMode && cluster) {
      setFormState({
        id: cluster?.id,
        name: cluster?.name,
        description: cluster?.description,
        comment: cluster?.comment,
        cpuArc: cluster?.cpuArc,
        cpuType: cluster?.cpuType,
        biosType: cluster?.biosType,
        errorHandling: cluster?.errorHandling,
      });
      setDataCenterVo({id: cluster?.dataCenterVo?.id, name: cluster?.dataCenterVo?.name});
      setNetworkVo({id: cluster?.networkVo?.id, name: cluster?.networkVo?.name});
    }
  }, [isOpen, editMode, cluster]);

  useEffect(() => {
    if (datacenterId) {
      setDataCenterVo({ id: datacenterId });
    } else if (!editMode && datacenters && datacenters.length > 0) {
      const defaultDc = datacenters.find(dc => dc.name === "Default"); // 만약 "Default"라는 이름이 있다면 우선 선택
      if (defaultDc) {
        setDataCenterVo({ id: defaultDc.id, name: defaultDc.name });
      } else {
        setDataCenterVo({ id: datacenters[0].id, name: datacenters[0].name });
      }
    }
  }, [datacenters, datacenterId, editMode]);  

  useEffect(() => {
    if (!editMode && networks && networks.length > 0) {
      const defaultN = networks.find(n => n.name === "ovirtmgmt");
      if(defaultN){
        setNetworkVo({id: defaultN.id, name: defaultN.name});
      } else {
        setNetworkVo({id: networks[0].id, name: networks[0].name});
      }
    }
  }, [networks, editMode]);

  useEffect(() => {
    const options = cpuArcOptions[formState.cpuArc] || [];
    setCpuOptions(options);
  
    // CPU 아키텍처가 변경시 cpu유형 0번째로 자동 설정
    if (options.length > 0) {
      setFormState((prev) => ({ ...prev, cpuType: options[0].value }));
    } else {
      setFormState((prev) => ({ ...prev, cpuType: "" }));
    }
  }, [formState.cpuArc]);
  

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectIdChange = (setVo, voList) => (e) => {
    const selected = voList.find((item) => item.id === e.target.value);
    if (selected) setVo({ id: selected.id, name: selected.name });
  };

  const validateForm = () => {
    const nameError = checkName(formState.name);
    if (nameError) return nameError;

    if (checkKoreanName(formState.description)) return `${Localization.kr.DESCRIPTION}이 유효하지 않습니다.`;
    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!networkVo.id) return `${Localization.kr.NETWORK}를 선택해주세요.`;
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const dataToSubmit = {
      ...formState,
      dataCenterVo,
      networkVo,
    };

    Logger.debug(`Form Data: ${JSON.stringify(dataToSubmit, null, 2)}`); // 데이터 출력

    editMode
      ? editCluster({ clusterId: formState.id, clusterData: dataToSubmit })
      : addCluster(dataToSubmit);
  };

  return (
    <BaseModal targetName={Localization.kr.CLUSTER} submitTitle={cLabel}
      isOpen={isOpen} onClose={onClose}      
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px" }} 
    >
      <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
        value={dataCenterVo.id}
        disabled={editMode}
        loading={isDataCentersLoading}
        options={datacenters}
        onChange={handleSelectIdChange(setDataCenterVo, datacenters) }
      />
      <hr />
      <LabelInput id="name" label={Localization.kr.NAME}
        autoFocus
        value={formState.name}
        onChange={handleInputChange("name")}
      />
      <LabelInput id="description" label={Localization.kr.DESCRIPTION}
        value={formState.description}
        onChange={handleInputChange("description")}
      />
      <LabelInput id="comment" label={Localization.kr.COMMENT}
        value={formState.comment}
        onChange={handleInputChange("comment")}
      />
      <LabelSelectOptionsID id="network-man" label={`관리 ${Localization.kr.NETWORK}`}
        value={networkVo.id}
        disabled={editMode}
        loading={isNetworksLoading}
        options={networks}
        onChange={handleSelectIdChange(setNetworkVo, networks)}
      />
      <LabelSelectOptions id="cpu-arch" label="CPU 아키텍처"
        value={formState.cpuArc}
        options={CONSTANT.cpuArcs}
        disabled={editMode}
        onChange={handleInputChange("cpuArc")}
      />
      <LabelSelectOptions id="cpu-type" label="CPU 유형"
        value={formState.cpuType}
        disabled={editMode}
        options={cpuOptions}
        onChange={handleInputChange("cpuType")}
      />
      <LabelSelectOptions id="firmware-type" label="칩셋/펌웨어 유형"
        value={formState.biosType}
        disabled={["PPC64", "S390X"].includes(formState.cpuArc)}
        options={biosTypeOptions}
        onChange={handleInputChange("biosType")}
      />
      <LabelSelectOptions id="recovery_policy-type" label="복구정책"
        value={formState.errorHandling}
        options={errorHandlingOptions}
        onChange={handleInputChange("errorHandling")}
      />
    </BaseModal>
  );
};

export default ClusterModal;
