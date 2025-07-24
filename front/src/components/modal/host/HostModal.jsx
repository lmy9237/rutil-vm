import { useState, useEffect, useMemo } from "react";
import { Label }                        from "@/components/ui/label";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "@/components/modal/BaseModal";
import ToggleSwitchButton               from "@/components/button/ToggleSwitchButton";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelInput                       from "@/components/label/LabelInput";
import LabelInputNum                    from "@/components/label/LabelInputNum";
import { 
  handleInputChange, 
  handleSelectIdChange, 
  handleInputCheck,
} from "@/components/label/HandleInput";
import {
  useAddHost,
  useEditHost,
  useReinstallHost,
  useHost,
  useAllClusters,
  useAllHosts,
} from "@/api/RQHook";
import { 
  checkDuplicateName, 
  checkName, 
  emptyIdNameVo, 
  useSelectItemEffect, 
  useSelectItemOrDefaultEffect
} from "@/util";
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
  editMode=false,
  reinstallMode=false,
}) => {
  const { validationToast } = useValidationToast();
  const hLabel = reinstallMode
    ? Localization.kr.REINSTALL
    : editMode 
      ? Localization.kr.UPDATE
      : Localization.kr.CREATE;

  const { datacentersSelected, clustersSelected, hostsSelected } = useGlobal();
  const hostId = useMemo(() => [...hostsSelected][0]?.id, [hostsSelected]);
  const datacenterId = useMemo(() => [...datacentersSelected][0]?.id, [datacentersSelected]);
  const clusterId = useMemo(() => [...clustersSelected][0]?.id, [clustersSelected]);
  const isMaintenance = hostsSelected[0]?.status?.toUpperCase() === "MAINTENANCE";

  const [formState, setFormState] = useState(initialFormState);
  const [clusterVo, setClusterVo] = useState(emptyIdNameVo());

  const { 
    data: host,
    isLoading: isHostLoading,
    isSuccess: isHostSuccess,
  } = useHost(hostId);

  const { 
    data: hosts,
    isLoading: isHostsLoading,
    isSuccess: isHostsSuccess,
  } = useAllHosts();

  const { mutate: addHost } = useAddHost(onClose, onClose);
  const { mutate: editHost } = useEditHost(onClose, onClose);
  const { mutate: reinstallHost } = useReinstallHost(onClose, onClose);
  
  const { 
    data: clusters = [], 
    isLoading: isClustersLoading,
    isSuccess: isClustersSuccess 
  } = useAllClusters((e) => ({ ...e }));

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setClusterVo(emptyIdNameVo());
    }
    if ((editMode || reinstallMode) && host) {
      setFormState({
        id: host?.id,
        name: host?.name,
        comment: host?.comment,
        address: host?.address,
        port: formState?.ssh?.port,
        rootPassword: formState?.ssh?.rootPassword,
        vgpu: host?.vgpu,
        deployHostedEngine: host?.hostedEngine != null,
      });
      setClusterVo({
        id: host?.clusterVo?.id, 
        name: host?.clusterVo?.name
      });
    }
  }, [isOpen, editMode, reinstallMode, host]);

  // 클러스터 지정
  useSelectItemOrDefaultEffect(clusterId, editMode, clusters, setClusterVo, "Default");

  const validateForm = () => {
    Logger.debug(`HostModal > validateForm ... `)
    const nameError = checkName(formState.name);
    if (nameError) return nameError;
    const duplicateError = checkDuplicateName(hosts, formState.name, formState.id);
    if (duplicateError) return duplicateError;

    if (!(editMode || reinstallMode) && !formState.sshRootPassword) return "비밀번호를 입력해주세요.";
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
    reinstallMode 
      ? reinstallHost({ hostId: formState.id, hostData: dataToSubmit, deployHostedEngine: String(formState.deployHostedEngine)})
      : editMode
        ? editHost({ hostId: formState.id, hostData: dataToSubmit })
        : addHost({ hostData: dataToSubmit, deployHostedEngine: String(formState.deployHostedEngine), });
  };

  return (
    <BaseModal targetName={Localization.kr.HOST} submitTitle={hLabel}
      isOpen={isOpen} onClose={onClose}
      isReady={
        (editMode || reinstallMode)
          ? (isHostSuccess && isHostsSuccess && isClustersSuccess)
          : (isHostsSuccess && isClustersSuccess)
      }
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px" }} 
    >
      <LabelSelectOptionsID label={`${Localization.kr.HOST} ${Localization.kr.CLUSTER}`}
        value={clusterVo.id}
        disabled={(editMode || reinstallMode) && !isMaintenance}
        loading={isClustersLoading}
        options={clusters}
        onChange={handleSelectIdChange(setClusterVo, clusters, validationToast)}
      />
      <hr />
      <LabelInput id="name" label={Localization.kr.NAME}
        autoFocus
        disabled={reinstallMode}
        value={formState.name}
        onChange={handleInputChange(setFormState, "name", validationToast)}
      />
      <LabelInput id="comment" label={Localization.kr.COMMENT}
        disabled={reinstallMode}
        value={formState.comment}
        onChange={handleInputChange(setFormState, "comment", validationToast)}
      />
      <LabelInput id="address" label={`${Localization.kr.HOST} 이름/IP`}
        disabled={(editMode || reinstallMode)}
        value={formState.address}
        onChange={handleInputChange(setFormState, "address", validationToast)}
      />
      <LabelInputNum id="sshPort" label="SSH 포트"
        value={formState.sshPort}
        disabled={(editMode || reinstallMode)}
        onChange={handleInputChange(setFormState, "sshPort", validationToast)}
      />
      <hr />
      {!(editMode) && (
        <>
          <div className="font-semibold mt-4 mb-2">
            <label>인증</label>
          </div>
          <LabelInput label="사용자 이름" value="root" disabled={true} />
          <LabelInput id="sshRootPassword" label="암호" 
            type="password"           
            value={formState.sshRootPassword}
            onChange={handleInputChange(setFormState, "sshRootPassword", validationToast)}
          />
        </>
      )}

      {/* <ToggleSwitchButton label="vGPU 배치"
        checked={formState.vgpu === "consolidated"}
        onChange={() => setFormState((prev) => ({ ...prev, vgpu: formState.vgpu === "consolidated" ? "separated" : "consolidated" }))}
        tType={"통합"} fType={"분산"}
      /> */}
      <ToggleSwitchButton label={`${Localization.kr.HOST} 엔진 배포 작업`}
        checked={formState.deployHostedEngine}
        onChange={handleInputCheck(setFormState, "deployHostedEngine", validationToast)}
        disabled={editMode}
        tType={"배포"} fType={"없음"}
      />
    </BaseModal>
  );
};

export default HostModal;
