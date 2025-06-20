import { useState, useEffect, useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import CONSTANT               from "@/Constants";
import useGlobal              from "@/hooks/useGlobal";
import BaseModal              from "@/components/modal/BaseModal";
import LabelSelectOptionsID   from "@/components/label/LabelSelectOptionsID";
import LabelInput             from "@/components/label/LabelInput";
import LabelSelectOptions     from "@/components/label/LabelSelectOptions";
import {
  handleInputChange, handleSelectIdChange
} from "@/components/label/HandleInput";
import {
  useAddCluster,
  useEditCluster,
  useCluster,
  useAllDataCenters,
  useNetworksFromDataCenter,
} from "@/api/RQHook";
import {
  checkKoreanName,
  checkName
} from "@/util";
import Localization            from "@/utils/Localization";
import Logger                  from "@/utils/Logger";

const initialFormState = {
  id: "",
  name: "",
  description: "",
  comment: "",
  cpuArc: "undefined",
  cpuType: "",
  biosType: "cluster_default",
  errorHandling: "migrate",
};

const ClusterModal = ({
  isOpen, 
  onClose,
  editMode = false,
}) => {
  const { validationToast } = useValidationToast();
  // const { closeModal } = useUIState()
  const cLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;

  const { datacentersSelected, clustersSelected } = useGlobal()
  const clusterId = useMemo(() => [...clustersSelected][0]?.id, [clustersSelected])
  const datacenterId = useMemo(() => [...datacentersSelected][0]?.id, [datacentersSelected])

  const [formState, setFormState] = useState(initialFormState);
  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [networkVo, setNetworkVo] = useState({ id: "", name: "" });
  const [editCpuArc, setEditCpuArc] = useState(false);
  const [cpuOptions, setCpuOptions] = useState([]);

  const biosTypeFiltered = editMode
    ? biosTypeOptions.filter(opt => opt.value !== "cluster_default")
    : biosTypeOptions;

  const { mutate: addCluster } = useAddCluster(onClose, onClose);
  const { mutate: editCluster } = useEditCluster(onClose, onClose);
  const { data: cluster } = useCluster(clusterId);
  const { 
    data: datacenters = [], 
    isLoading: isDataCentersLoading 
  } = useAllDataCenters((e) => ({ ...e }));
  const { 
    data: networks = [], 
    isLoading: isNetworksLoading 
  } = useNetworksFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setDataCenterVo({id: "", name: ""});
      setNetworkVo({id: "", name: ""});
    }
    if (editMode && cluster) {
      setFormState((prev) => ({
        ...prev,
        id: cluster?.id,
        name: cluster?.name,
        description: cluster?.description,
        comment: cluster?.comment,
        cpuArc: cluster?.cpuArc,
        cpuType: cluster?.cpuType,
        biosType: cluster?.biosType,
        errorHandling: cluster?.errorHandling,
      }));
      setDataCenterVo({id: cluster?.dataCenterVo?.id, name: cluster?.dataCenterVo?.name});
      setNetworkVo({id: cluster?.networkVo?.id, name: cluster?.networkVo?.name});
    }
  }, [isOpen, editMode, cluster]);

  useEffect(() => {
    if (isOpen && editMode) {
      if (cluster?.cpuArc === "UNDEFINED") {
        setEditCpuArc(true);
      } else {
        setEditCpuArc(false);   // 이 부분이 핵심!
      }
    }
    if (!isOpen) {
      setEditCpuArc(false);
    }
  }, [isOpen, editMode, cluster]);

  useEffect(() => {
    if (datacenterId) {
      const selected = datacenters.find(dc => dc.id === datacenterId);
      setDataCenterVo({ id: selected?.id, name: selected?.name });
      setNetworkVo({id: "", name: ""});
    } else if (!editMode && datacenters.length > 0) {
      // datacenterId가 없다면 기본 데이터센터 선택
      const defaultDc = datacenters.find(dc => dc.name === "Default");
      const firstDc = defaultDc || datacenters[0];
      setDataCenterVo({ id: firstDc.id, name: firstDc.name });
      setNetworkVo({id: "", name: ""});
    }
  }, [datacenterId, datacenters, editMode]);

  useEffect(() => {
    if (editMode && cluster?.networkVo?.id) {
      setNetworkVo({id: cluster.networkVo.id, name: cluster.networkVo.name });
    } else if (!editMode && networks && networks.length > 0) {
      const defaultNetwork = networks.find(n => n.name === "ovirtmgmt");
      const firstN = defaultNetwork || networks[0];
      setNetworkVo({ id: firstN.id, name: firstN.name });
    }
  }, [networks, editMode]);
  
  useEffect(() => {
    const options = cpuTypeOptions[formState.cpuArc] || [];
    setCpuOptions(options);
    if (!editMode) {
      setFormState((prev) => ({
        ...prev,
        cpuType: options[0]?.value || ""
      }));
    }
  }, [formState.cpuArc, editMode]);
  
  const validateForm = () => {
    Logger.debug(`ClusterModal > validateForm ...`)
    const nameError = checkName(formState.name);
    if (nameError) return nameError;
    if (checkKoreanName(formState.description)) return `${Localization.kr.DESCRIPTION}이 유효하지 않습니다.`;
    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!networkVo.id) return `${Localization.kr.NETWORK}를 선택해주세요.`;
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    const dataToSubmit = {
      ...formState,
      dataCenterVo,
      biosType: formState?.biosType === "none" ? "" : formState?.biosType,
      networkVo,
    };

    Logger.debug(`ClusterModal > handleFormSubmit ... dataToSubmit: `, dataToSubmit)
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
        disabled={editMode && !!dataCenterVo.id}
        loading={isDataCentersLoading}
        options={datacenters}
        onChange={handleSelectIdChange(setDataCenterVo, datacenters, validationToast)}
      />

      <LabelInput id="name" label={Localization.kr.NAME}
        autoFocus
        value={formState.name}
        onChange={handleInputChange(setFormState, "name", validationToast)}
      />
      <LabelInput id="description" label={Localization.kr.DESCRIPTION}
        value={formState.description}
        onChange={handleInputChange(setFormState, "description", validationToast)}
      />
      <LabelInput id="comment" label={Localization.kr.COMMENT}
        value={formState.comment}
        onChange={handleInputChange(setFormState, "comment", validationToast)}
      />
      <LabelSelectOptionsID id="network-man" label={`관리 ${Localization.kr.NETWORK}`}
        value={networkVo.id}
        loading={isNetworksLoading}
        options={networks}
        disabled={editMode}
        onChange={handleSelectIdChange(setNetworkVo, networks, validationToast)}
      />
      <LabelSelectOptions id="cpu-arch" label={`CPU ${Localization.kr.ARCH}`}
        value={formState.cpuArc}
        options={CONSTANT.cpuArcs}
        disabled={!(!editMode || editCpuArc)}
        onChange={handleInputChange(setFormState, "cpuArc", validationToast)}
      />
      <LabelSelectOptions id="cpu-type" label="CPU 유형"
        value={formState.cpuType}
        options={cpuOptions}
        disabled={!(!editMode || editCpuArc)}
        onChange={handleInputChange(setFormState, "cpuType", validationToast)}
      />

      {!["ppc64", "s390x", "undefined"].includes(formState.cpuArc) && (
        <LabelSelectOptions id="firmware-type" label="칩셋/펌웨어 유형"
          value={formState.biosType}
          options={biosTypeFiltered}
          onChange={handleInputChange(setFormState, "biosType", validationToast)}
          placeholderLabel="자동 감지"
          placeholderValue="none"
        />
      )}
      <LabelSelectOptions id="error-handling" label="복구정책"
        value={formState.errorHandling}
        options={errorHandlingOptions}
        onChange={handleInputChange(setFormState, "errorHandling", validationToast)}
      />
    </BaseModal>
  );
};

export default ClusterModal;

// name이 value고, description이 label
const cpuTypeOptions = {
  x86_64: [
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
  ppc64: [
    { value: "IBM POWER8", label: "IBM POWER8" },
    { value: "IBM POWER9", label: "IBM POWER9" },
  ],
  s390x: [
    { value: "IBM z114, z196", label: "IBM z114, z196" },
    { value: "IBM zBC12, zEC12", label: "IBM zBC12, zEC12" },
    { value: "IBM z13s, z13", label: "IBM z13s, z13" },
    { value: "IBM z14", label: "IBM z14" },
  ],
  undefined: [
    { value: "none", label: "자동 감지" },
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
  { value: "cluster_default", label: "자동 감지" },
  { value: "q35_ovmf", label: "UEFI의 Q35 칩셋" },
  { value: "i440fx_sea_bios", label: "BIOS의 I440FX 칩셋" },
  { value: "q35_sea_bios", label: "BIOS의 Q35 칩셋" },
  { value: "q35_secure_boot", label: "UEFI SecureBoot의 Q35 칩셋" },
];

const errorHandlingOptions = [
  { value: "migrate",                  label: `${Localization.kr.VM}을 ${Localization.kr.MIGRATION}함` },
  { value: "migrate_highly_available", label: `${Localization.kr.HOST} ${Localization.kr.VM}만 ${Localization.kr.MIGRATION}` },
  { value: "do_not_migrate",           label: `${Localization.kr.VM}은 ${Localization.kr.MIGRATION} 하지 않음` },
];
