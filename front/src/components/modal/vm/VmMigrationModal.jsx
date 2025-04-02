import { useEffect, useMemo, useState } from "react";
import BaseModal from "../BaseModal";
import { useHostsForMigration, useMigration } from "../../../api/RQHook";
import "./MVm.css";
import LabelCheckbox from "../../label/LabelCheckbox";
import Localization from "../../../utils/Localization";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import toast from "react-hot-toast";

const VmMigrationModal = ({ isOpen, onClose, selectedVm = {} }) => {
  const [isCluster, setIsCluster] = useState(true);
  const [clusterVo, setClusterVo] = useState({ id: "", name: "" });
  const [hostVo, setHostVo] = useState({ id: "", name: "" });
  const [affinityClosure, setAffinityClosure] = useState(false);

  const { data: hostList = [], isLoading: isAbleHostLoading } = useHostsForMigration(selectedVm.id);
  const currentHostId = selectedVm?.hostVo?.id;

  const ableHost = useMemo(() => {
    return hostList.filter((host) => host.id !== currentHostId);
  }, [hostList, currentHostId]);
  
  const onSuccess = () => {
    toast.success(`가상머신 마이그레이션 완료`);
    onClose();
  };
  const { mutate: migration } = useMigration(onSuccess, () => onClose());

  useEffect(() => {
    if (!isOpen) return;
    if (isCluster) {
      setClusterVo({id: selectedVm?.clusterVo?.id || "", name: selectedVm?.clusterVo?.name || ""});
      setHostVo({ id: "", name: "" });
      setAffinityClosure(false);
    }
  }, [isOpen, isCluster]);
  
  useEffect(() => {
    if (!isOpen || isCluster || hostVo.id || ableHost.length === 0) return;
  
    const firstHost = ableHost[0];
    setHostVo({ id: firstHost.id, name: firstHost.name });
    setClusterVo({ id: "", name: "" });
    setAffinityClosure(false);
  }, [isOpen, isCluster, ableHost]);
  

  const handleFormSubmit = () => {
    migration({
      vmId: selectedVm.id,
      vm: { clusterVo, hostVo },
      affinityClosure: affinityClosure,
    });
  };

  return (
    <BaseModal targetName="가상머신" submitTitle="마이그레이션"
      isOpen={isOpen} onClose={onClose}      
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "770px" }}
    >
      <div className="migration-article-outer">
        <h1>1대의 가상 머신이 마이그레이션되는 호스트를 선택하십시오.</h1>

        <div className="migration-article">
          <LabelCheckbox
            id="cluster"
            label={`클러스터 ${selectedVm?.clusterVo?.name || ""} 내 호스트 자동 선택`}
            checked={isCluster}
            onChange={() => {
              const newIsCluster = !isCluster;
              setIsCluster(newIsCluster);
              if (newIsCluster) {
                setClusterVo({
                  id: selectedVm?.clusterVo?.id || "",
                  name: selectedVm?.clusterVo?.name || "",
                });
                setHostVo({ id: "", name: "" });
              }
            }}
          />
          <span>{clusterVo.id}</span>

          <LabelSelectOptionsID
            id="host"
            label={`${Localization.kr.TARGET} ${Localization.kr.HOST}`}
            value={hostVo.id}
            disabled={isCluster}
            loading={isAbleHostLoading}
            options={ableHost}
            onChange={(e) => {
              const selected = ableHost.find((h) => h.id === e.target.value);
              if (selected) {
                setHostVo({ id: selected.id, name: selected.name });
                setClusterVo({ id: "", name: "" });
              }
            }}
          />
          <span>{hostVo.id}</span>

          <LabelCheckbox
            id="affinityClosure"
            label="선택한 가상 머신을 사용하여 양극 강제 연결 그룹의 모든 가상 시스템을 마이그레이션합니다."
            checked={affinityClosure}
            onChange={() => setAffinityClosure(!affinityClosure)}
          />

          <div>가상머신 : {selectedVm?.name || ""}</div>
        </div>
      </div>
    </BaseModal>
  );
};

export default VmMigrationModal;
