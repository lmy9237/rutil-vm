import { useState, useEffect, useMemo } from "react";
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
  useClustersFromDataCenter,
} from "../../../api/RQHook";
import { checkName } from "../../../util";
import Localization from "../../../utils/Localization";
import ToggleSwitchButton from "../../button/ToggleSwitchButton";
import Logger from "../../../utils/Logger";
import useGlobal from "../../../hooks/useGlobal";
import "./MHost.css";
import { handleInputChange, handleSelectIdChange } from "../../label/HandleInput";

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
const HostModal = ({ 
  isOpen, onClose, editMode=false
}) => {
  const hLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;

  const { datacentersSelected, clustersSelected, hostsSelected } = useGlobal();
  const hostId = useMemo(() => [...hostsSelected][0]?.id, [hostsSelected]);
  const datacenterId = useMemo(() => [...datacentersSelected][0]?.id, [datacentersSelected]);
  const clusterId = useMemo(() => [...clustersSelected][0]?.id, [clustersSelected]);

  const [formState, setFormState] = useState(initialFormState);
  const [clusterVo, setClusterVo] = useState({ id: "", name: "" });

  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.HOST} ${hLabel} ${Localization.kr.FINISHED}`);
  };
  const { data: host } = useHost(hostId);
  const { mutate: addHost } = useAddHost(onSuccess, () => onClose());
  const { mutate: editHost } = useEditHost(onSuccess, () => onClose());
  // const {
  //   data: dcClusters = [],
  //   isLoading: isDcClustersLoading,
  // } = useClustersFromDataCenter(datacenterId, (e) => ({...e,}));
  const { 
    data: clusters = [], 
    isLoading: isClustersLoading 
  } = useAllClusters((e) => ({ ...e }));

  // const clusterOptions = datacenterId ? dcClusters : clusters;

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setClusterVo({id: "", name: ""});
    }
    if (editMode && host) {
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
      const selected = clusters.find(c => c.id === clusterId);
      setClusterVo({id: selected?.id, name: selected?.name});
    } else if (!editMode && clusters && clusters.length > 0) {
      // 만약 "Default"라는 이름이 있다면 우선 선택
      const defaultC = clusters.find(c => c.name === "Default");
      const firstC = defaultC || clusters[0];
      setClusterVo({ id: firstC.id, name: firstC.name });
    }
  }, [clusters, clusterId, editMode]);

  const validateForm = () => {
    const nameError = checkName(formState.name);
    if (nameError) return nameError;

    if (!editMode && !formState.sshPassWord) return "비밀번호를 입력해주세요.";
    if (!clusterVo.id) return `${Localization.kr.CLUSTER}를 선택해주세요.`;
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const dataToSubmit = {
      ...formState,
      clusterVo,
    };

    Logger.debug(`HostModal > handleFormSubmit ... dataToSubmit: ${JSON.stringify(dataToSubmit, null , 2)}`); // 데이터를 확인하기 위한 로그
    
    editMode
      ? editHost({ hostId: formState.id, hostData: dataToSubmit })
      : addHost({ hostData: dataToSubmit, deployHostedEngine: String(formState.hostedEngine), });
  };

  return (
    <BaseModal targetName={Localization.kr.HOST} submitTitle={hLabel}
      isOpen={isOpen} onClose={onClose}      
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px"}} 
    >
      <LabelSelectOptionsID label={`${Localization.kr.HOST} ${Localization.kr.CLUSTER}`}
        value={clusterVo.id}
        disabled={editMode}
        loading={isClustersLoading}
        options={clusters}
        onChange={handleSelectIdChange(setClusterVo, clusters)}
      />
      <hr />
      <LabelInput id="name" label={Localization.kr.NAME}
        autoFocus
        value={formState.name}
        onChange={handleInputChange(setFormState, "name")}
      />
      <LabelInput id="comment" label={Localization.kr.COMMENT}
        value={formState.comment}
        onChange={handleInputChange(setFormState, "comment")}
      />
      <LabelInput id="address" label={`${Localization.kr.HOST} 이름/IP`}
        value={formState.address}
        disabled={editMode}
        onChange={handleInputChange(setFormState, "address")}
      />
      <LabelInputNum id="sshPort" label="SSH 포트"
        value={formState.sshPort}
        disabled={editMode}
        onChange={handleInputChange(setFormState, "sshPort")}
      />
      <hr />
      {!editMode && (
        <>
          <div className="font-semibold py-1.5">
            <label>인증</label>
          </div>
          <LabelInput label="사용자 이름" value="root" disabled={true} />
          <LabelInput id="sshPassWord" label="암호" 
            type="password"           
            value={formState.sshPassWord}
            onChange={handleInputChange(setFormState, "sshPassWord")}
          />
        </>
      )}

      {/* <ToggleSwitchButton label="vGPU 배치"
        checked={formState.vgpu === "consolidated"}
        onChange={() => setFormState((prev) => ({ ...prev, vgpu: formState.vgpu === "consolidated" ? "separated" : "consolidated" }))}
        tType={"통합"} fType={"분산"}
      /> */}

      <ToggleSwitchButton label={`${Localization.kr.HOST} 엔진 배포 작업 선택`}
        checked={formState.hostedEngine}
        disabled={editMode}
        onChange={() => setFormState((prev) => ({ ...prev, hostedEngine: !formState.hostedEngine }))}
        tType={"배포"} fType={"없음"}
      />
    </BaseModal>
  );
};

export default HostModal;
