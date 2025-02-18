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
import { CheckKoreanName } from "../../../util";
import "./MCluster.css";

const cpuArcs = [
  { value: "UNDEFINED", label: "정의되지 않음" },
  { value: "X86_64", label: "x86_64" },
  { value: "PPC64", label: "ppc64" },
  { value: "S390X", label: "s390x" },
];

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
    { value: "자동 감지", label: "자동 감지" },
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
  { value: "migrate", label: "가상 머신을 마이그레이션함" },
  { value: "migrate_highly_available", label: "고가용성 가상 머신만 마이그레이션" },
  { value: "do_not_migrate", label: "가상 머신은 마이그레이션 하지 않음" },
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
  onClose,
}) => {
  const cLabel = editMode ? "편집" : "생성";
  const [formState, setFormState] = useState(initialFormState);
  const [dataCenterVoId, setDataCenterVoId] = useState("");
  const [networkVoId, setNetworkVoId] = useState("");
  const [cpuOptions, setCpuOptions] = useState([]);

  const { mutate: addCluster } = useAddCluster();
  const { mutate: editCluster } = useEditCluster();

  const { data: cluster } = useCluster(clusterId);
  const { data: datacenters = [], isLoading: isDataCentersLoading } = 
    useAllDataCenters((e) => ({ ...e }));
  const { data: networks = [], isLoading: isNetworksLoading } = 
    useNetworksFromDataCenter(dataCenterVoId, (e) => ({ ...e }));

  useEffect(() => {
    if (!isOpen) return setFormState(initialFormState);
    if (editMode && cluster) {
      setFormState({
        id: cluster.id,
        name: cluster.name,
        description: cluster?.description,
        comment: cluster.comment,
        cpuArc: cluster.cpuArc,
        cpuType: cluster.cpuType,
        biosType: cluster.biosType,
        errorHandling: cluster.errorHandling,
      });
      setDataCenterVoId(cluster?.dataCenterVo?.id);
      setNetworkVoId(cluster?.networkVo?.id);
    }
  }, [isOpen, editMode, cluster]);

  useEffect(() => {
    if (datacenterId) {
      setDataCenterVoId(datacenterId);
    } else if (!editMode && datacenters && datacenters.length > 0) {
      setDataCenterVoId(datacenters[0].id);
    }
  }, [datacenters, datacenterId, editMode]);

  useEffect(() => {
    if (!editMode && networks.length > 0) {
      setNetworkVoId(networks[0].id);
    }
  }, [networks, editMode]);

  useEffect(() => {
    setCpuOptions(cpuArcOptions[formState.cpuArc] || []);
  }, [formState.cpuArc]);

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    if (!CheckKoreanName(formState.name) || !formState.name) return "이름이 유효하지 않습니다.";
    if (!CheckKoreanName(formState.description)) return "설명이 유효하지 않습니다.";
    if (!dataCenterVoId) return "데이터센터를 선택해주세요.";
    if (!networkVoId) return "네트워크를 선택해주세요.";
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const selectedDataCenter = datacenters.find((dc) => dc.id === dataCenterVoId);
    const selectedNetwork = networks.find((n) => n.id === networkVoId);

    const dataToSubmit = {
      ...formState,
      dataCenterVo: {
        id: selectedDataCenter.id,
        name: selectedDataCenter.name,
      },
      networkVo: { id: selectedNetwork.id, name: selectedNetwork.name },
    };

    const onSuccess = () => {
      onClose();
      toast.success(`클러스터 ${cLabel} 완료`);
    };
    const onError = (err) => toast.error(`Error ${cLabel} cluster: ${err}`);

    console.log("Form Data: ", dataToSubmit); // 데이터를 확인하기 위한 로그

    editMode
      ? editCluster({ clusterId: formState.id, clusterData: dataToSubmit },{ onSuccess, onError })
      : addCluster(dataToSubmit, { onSuccess, onError });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={"클러스터"}
      submitTitle={cLabel}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="cluster-new-popup modal"></div> */}
      <div className="h-3/4 max-height-100 flex flex-col justify-center items-center">
        <LabelSelectOptionsID
          label="데이터센터"
          value={dataCenterVoId}
          onChange={(e) => setDataCenterVoId(e.target.value)}
          disabled={editMode}
          loading={isDataCentersLoading}
          options={datacenters}
        />
        <hr />
        <LabelInput
          label="이름"
          id="name"
          value={formState.name}
          onChange={handleInputChange("name")}
          autoFocus
        />
        <LabelInput
          label="설명"
          id="description"
          value={formState.description}
          onChange={handleInputChange("description")}
        />
        <LabelInput
          label="코멘트"
          id="comment"
          value={formState.comment}
          onChange={handleInputChange("comment")}
        />

        <LabelSelectOptionsID id="network-man" label="관리 네트워크"
          value={networkVoId}
          onChange={(e) => setNetworkVoId(e.target.value)}
          disabled={editMode}
          loading={isNetworksLoading}
          options={networks}
        />
        <LabelSelectOptions id="cpu-arch" label="CPU 아키텍처"
          value={formState.cpuArc}
          onChange={handleInputChange("cpuArc")}
          options={cpuArcs}
        />
        <LabelSelectOptions id="cpu-type" label="CPU 유형"
          value={formState.cpuType}
          onChange={handleInputChange("cpuType")}
          options={cpuOptions}
        />
        <LabelSelectOptions id="firmware-type" label="칩셋/펌웨어 유형"
          value={formState.biosType}
          onChange={handleInputChange("biosType")}
          options={biosTypeOptions}
          disabled={
            formState.cpuArc === "PPC64" || formState.cpuArc === "S390X"
          }
        />

        <div className="recovery-policy">
          <div className="cluster-form-group">
            <div className="font-bold mb-0.5">복구정책</div>
            {errorHandlingOptions.map((option) => (
              <div key={option.value} className="host-text-radio-box mb-1">
                <input
                  type="radio"
                  name="recovery_policy"
                  value={option.value}
                  checked={formState.errorHandling === option.value}
                  onChange={handleInputChange("errorHandling")}
                />
                <label htmlFor={option.value}>{option.label}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default ClusterModal;
