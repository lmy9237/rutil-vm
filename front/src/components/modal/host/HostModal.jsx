import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelInput from "../../label/LabelInput";
import LabelInputNum from "../../label/LabelInputNum";
import {
  useAddHost,
  useEditHost,
  useHost,
  useAllClusters,
} from "../../../api/RQHook";
import "./MHost.css";
import Localization from "../../../utils/Localization";
import { checkName } from "../../../util";
import ToggleSwitchButton from "../../button/ToggleSwitchButton";

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
  const [clusterVo, setClusterVo] = useState({ id: "", name: "" });

  const { mutate: addHost } = useAddHost();
  const { mutate: editHost } = useEditHost();
  const { data: host } = useHost(hId);
  const { 
    data: clusters = [], 
    isLoading: isClustersLoading 
  } = useAllClusters( (e) => ({ ...e }));

  useEffect(() => {
    if (!isOpen) return setFormState(initialFormState);
    if (editMode && host) {
      console.log("hostModal", host);
      setFormState({
        id: host?.id,
        name: host?.name,
        comment: host?.comment,
        address: host?.address,
        sshPort: host?.sshPort,
        sshPassWord: host?.sshPassWord,
        vgpu: host?.vgpu,
        hostedEngine: Boolean(host?.hostedEngine),
      });
      setClusterVo({id: host?.clusterVo?.id, name: host?.clusterVo?.name});
    }
  }, [isOpen, editMode, host]);

  useEffect(() => {
    if (clusterId) {
      setClusterVo({id: clusterId});
    } else if (!editMode && clusters && clusters.length > 0) {
      setClusterVo({id: clusters[0].id});
    }
  }, [clusters, clusterId, editMode]);

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    checkName(formState.name);// 이름 검증
    if (!editMode && !formState.sshPassWord) 
      return "비밀번호를 입력해주세요.";
    if (!clusterVo.id)
      return `${Localization.kr.CLUSTER}를 선택해주세요.`;
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const dataToSubmit = {
      ...formState,
      clusterVo,
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
          { hostData: dataToSubmit, deployHostedEngine: String(formState.hostedEngine), },
          { onSuccess, onError }
        );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={Localization.kr.HOST}
      submitTitle={hLabel}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px", height: "560px" }} 
    >
      <LabelSelectOptionsID
        label={`${Localization.kr.HOST} ${Localization.kr.CLUSTER}`}
        value={clusterVo.id}
        disabled={editMode}
        loading={isClustersLoading}
        options={clusters}
        onChange={(e) => {
          const selected = clusters.find(c => c.id === e.target.value);
          if (selected) setClusterVo({ id: selected.id, name: selected.name });
        }}
      />
      <hr />

      <LabelInput id="name" label={Localization.kr.NAME}
        value={formState.name}
        onChange={handleInputChange("name")}
        autoFocus
      />
      <LabelInput id="comment" label={Localization.kr.COMMENT}
        value={formState.comment}
        onChange={handleInputChange("comment")}
      />
      <LabelInput id="address" label={`${Localization.kr.HOST} 이름/IP`}
        value={formState.address}
        onChange={handleInputChange("address")}
        disabled={editMode}
      />
      <LabelInputNum id="sshPort" label="SSH 포트"
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
          <LabelInput label="암호" type="password" 
            id="sshPassWord"
            value={formState.sshPassWord}
            onChange={handleInputChange("sshPassWord")}
          />
        </>
      )}

      <ToggleSwitchButton
        label="vGPU 배치"
        checked={formState.vgpu === "consolidated"}
        onChange={(checked) => setFormState((prev) => ({...prev, vgpu: checked ? "consolidated" : "separated" }))}
        tType={"통합"}
        fType={"분산"}
      />

      <ToggleSwitchButton
        label={`${Localization.kr.HOST} 엔진 배포 작업 선택`}
        checked={formState.hostedEngine}
        onChange={(checked) => setFormState((prev) => ({...prev, hostedEngine: checked }))}
        disabled={editMode}
        tType={"배포"}
        fType={"없음"}
      />
      
{/* const hostEngines = [
  { value: "false", label: "없음" },
  { value: "true", label: "배포" },
]; */}

        {/* <div>
        <div>vGPU 배치</div>
        <div className="f-center">
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
      </div>}*/}
      {/* <LabelSelectOptions label={`${Localization.kr.HOST} 엔진 배포 작업 선택`}
        value={String(formState.deployHostedEngine)}
        onChange={handleInputChange("deployHostedEngine")}
        options={hostEngines}
        disabled={editMode}
      /> */}
    </BaseModal>
  );
};

export default HostModal;
