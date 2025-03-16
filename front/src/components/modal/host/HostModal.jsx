import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelInput from "../../label/LabelInput";
import LabelInputNum from "../../label/LabelInputNum";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import {
  useAddHost,
  useEditHost,
  useHost,
  useAllClusters,
} from "../../../api/RQHook";
import "./MHost.css";

const initialFormState = {
  id: "",
  name: "",
  comment: "",
  address: "",
  sshPort: "22",
  sshPassWord: "",
  vgpu: "consolidated",
  hostedEngine: false,
};

const hostEngines = [
  { value: "false", label: "없음" },
  { value: "true", label: "배포" },
];

/**
 * @name HostModal
 * @description 호스트 관련 모달
 *
 * @param {boolean} isOpen
 * @returns
 */
const HostModal = ({ isOpen, editMode = false, hId, clusterId, onClose }) => {
  const hLabel = editMode ? "편집" : "생성";
  const [formState, setFormState] = useState(initialFormState);
  const [clusterVoId, setClusterVoId] = useState("");

  const { mutate: addHost } = useAddHost();
  const { mutate: editHost } = useEditHost();
  const { data: host } = useHost(hId);
  const { data: clusters = [], isLoading: isClustersLoading } = useAllClusters(
    (e) => ({ ...e })
  );

  useEffect(() => {
    if (!isOpen) return setFormState(initialFormState);
    if (editMode && host) {
      console.log("hostModal", host);
      setFormState({
        id: host.id,
        name: host.name,
        comment: host.comment,
        address: host.address,
        sshPort: host.sshPort,
        sshPassWord: host.sshPassWord,
        vgpu: host.vgpu,
        hostedEngine: host.hostedEngine,
      });
      setClusterVoId(host?.clusterVo?.id);
    }
  }, [isOpen, editMode, host]);

  useEffect(() => {
    if (clusterId) {
      setClusterVoId(clusterId);
    } else if (!editMode && clusters && clusters.length > 0) {
      setClusterVoId(clusters[0].id);
    }
  }, [clusters, clusterId, editMode]);

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    if (!formState.name) return "이름을 입력해주세요.";
    if (!editMode && !formState.sshPassWord) return "비밀번호를 입력해주세요.";
    if (!clusterVoId) return "클러스터를 선택해주세요.";
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const selectedCluster = clusters.find((c) => c.id === clusterVoId);
    const dataToSubmit = {
      ...formState,
      clusterVo: { id: selectedCluster.id },
    };

    const onSuccess = () => {
      onClose();
      toast.success(`호스트 ${hLabel} 완료`);
    };
    const onError = (err) => toast.error(`Error ${hLabel} host: ${err}`);

    console.log("Form Data: ", dataToSubmit); // 데이터를 확인하기 위한 로그

    editMode
      ? editHost(
          { hostId: formState.id, hostData: dataToSubmit },
          { onSuccess, onError }
        )
      : addHost(
          { hostData: dataToSubmit, deploy_hosted_engine: formState.hostedEngine,},
          { onSuccess, onError }
        );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"호스트"}
      submitTitle={hLabel}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px", height: "560px" }} 
    >
      {/* <div className="host-new-popup modal"> */}
      <div className="popup-content-outer">
        <LabelSelectOptionsID
          label="호스트 클러스터"
          value={clusterVoId}
          onChange={(e) => setClusterVoId(e.target.value)}
          disabled={editMode}
          loading={isClustersLoading}
          options={clusters}
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
          label="코멘트"
          id="comment"
          value={formState.comment}
          onChange={handleInputChange("comment")}
        />
        <LabelInput
          label="호스트 이름/IP"
          id="address"
          value={formState.address}
          onChange={handleInputChange("address")}
          disabled={editMode}
        />
        <LabelInputNum
          label="SSH 포트"
          id="sshPort"
          value={formState.sshPort}
          onChange={handleInputChange("sshPort")}
          disabled={editMode}
        />
        <hr />

        {!editMode && (
          <>
            <div className="font-semibold">
              <label className="py-1">인증</label>
            </div>
            <LabelInput label="사용자 이름" value="root" disabled={true} />
            <LabelInputNum
              label="암호"
              id="sshPassWord"
              value={formState.sshPassWord}
              onChange={handleInputChange("sshPassWord")}
              type="password" 
            />

          </>
        )}
        <div className="p-1.5">
          <div className="p-1">vGPU 배치</div>
          <div className="flex">
            {["consolidated", "separated"].map((option) => (
              <label
                key={option}
                style={{ marginRight: "0.2rem", display: "flex" }}
              >
                <input
                  type="radio"
                  name="vgpu"
                  value={option}
                  checked={formState.vgpu === option}
                  onChange={handleInputChange("vgpu")}
                />
                {option === "consolidated" ? "통합" : "분산"}
              </label>
            ))}
          </div>
        </div>
        <LabelSelectOptions
          label="호스트 엔진 배포 작업 선택"
          value={String(formState.hostedEngine)}
          onChange={handleInputChange("hostedEngine")}
          options={hostEngines}
        />
      </div>
    </BaseModal>
  );
};

export default HostModal;
