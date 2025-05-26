import { useState, useEffect, useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import ToggleSwitchButton               from "@/components/button/ToggleSwitchButton";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelInput                       from "@/components/label/LabelInput";
import LabelInputNum                    from "@/components/label/LabelInputNum";
import { 
  handleInputChange, 
  handleSelectIdChange
} from "@/components/label/HandleInput";
import {
  useAddHost,
  useEditHost,
  useHost,
  useAllClusters,
  useClustersFromDataCenter,
} from "@/api/RQHook";
import { checkName }                    from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import "./MHost.css";

const initialFormState = {
  id: "",
  name: "",
  comment: "",
  address: "",
  sshPort: "22",
  sshRootPassword: "",
  vgpu: "consolidated",
  deployHostedEngine: false,
};

/**
 * @name HostModal
 * @description 호스트 관련 모달
 *
 * @param {boolean} isOpen
 * @returns
 */
const HostModal = ({ 
  isOpen,
  onClose,
  editMode=false
}) => {
  const { validationToast } = useValidationToast();
  // const { closeModal } = useUIState()
  const hLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;

  const { datacentersSelected, clustersSelected, hostsSelected } = useGlobal();
  const hostId = useMemo(() => [...hostsSelected][0]?.id, [hostsSelected]);
  const datacenterId = useMemo(() => [...datacentersSelected][0]?.id, [datacentersSelected]);
  const clusterId = useMemo(() => [...clustersSelected][0]?.id, [clustersSelected]);
  const isMaintenance = hostsSelected[0]?.status === "MAINTENANCE";

  const [formState, setFormState] = useState(initialFormState);
  const [clusterVo, setClusterVo] = useState({ id: "", name: "" });

  const { data: host } = useHost(hostId);
  const { mutate: addHost } = useAddHost(onClose, onClose);
  const { mutate: editHost } = useEditHost(onClose, onClose);
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
        port: formState?.ssh?.port,
        rootPassword: formState?.ssh?.rootPassword,
        vgpu: host?.vgpu,
        // hostedEngine: Boolean(host?.hostedEngine),
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
    Logger.debug(`HostModal > validateForm ... `)
    const nameError = checkName(formState.name);
    if (nameError) return nameError;

    if (!editMode && !formState.sshRootPassword) return "비밀번호를 입력해주세요.";
    if (!clusterVo.id) return `${Localization.kr.CLUSTER}를 선택해주세요.`;
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
      ssh: {
        port: formState?.sshPort,
        rootPassword: formState?.sshRootPassword,
      },
      clusterVo,
    };

    Logger.debug(`HostModal > handleFormSubmit ... dataToSubmit: `, dataToSubmit); // 데이터를 확인하기 위한 로그
    editMode
      ? editHost({ hostId: formState.id, hostData: dataToSubmit })
      : addHost({ hostData: dataToSubmit, deployHostedEngine: String(formState.deployHostedEngine), });
  };

  return (
    <BaseModal targetName={Localization.kr.HOST} submitTitle={hLabel}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px" }} 
    >
      <LabelSelectOptionsID label={`${Localization.kr.HOST} ${Localization.kr.CLUSTER}`}
        value={clusterVo.id}
        // disabled={editMode}
        disabled={editMode && !isMaintenance}
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
          <LabelInput id="sshRootPassword" label="암호" 
            type="password"           
            value={formState.sshRootPassword}
            onChange={handleInputChange(setFormState, "sshRootPassword")}
          />
        </>
      )}

      {/* <ToggleSwitchButton label="vGPU 배치"
        checked={formState.vgpu === "consolidated"}
        onChange={() => setFormState((prev) => ({ ...prev, vgpu: formState.vgpu === "consolidated" ? "separated" : "consolidated" }))}
        tType={"통합"} fType={"분산"}
      /> */}

      <ToggleSwitchButton label={`${Localization.kr.HOST} 엔진 배포 작업 선택`}
        checked={formState.deployHostedEngine}
        onChange={() => setFormState((prev) => ({ ...prev, deployHostedEngine: !formState.deployHostedEngine }))}
        disabled={editMode}
        tType={"배포"} fType={"없음"}
      />
    </BaseModal>
  );
};

export default HostModal;
