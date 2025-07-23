import { useEffect, useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import {
  useAllMigratableHostsFromVM,
  useHostsFromCluster,
  useMigration
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import LabelCheckbox from "@/components/label/LabelCheckbox";
import TabNavButtonGroup from "@/components/common/TabNavButtonGroup";


const VmMigrationModal2 = ({ 
  isOpen, 
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  const { vmsSelected } = useGlobal()
  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const clusterVo = vmsSelected[0]?.clusterVo;

  const [selectedModalTab, setSelectedModalTab] = useState("common");
  const tabs = useMemo(() => [
    { id: "common",  label: `${Localization.kr.VM}`,    onClick: () => setSelectedModalTab("common") },
    { id: "disk",    label: `${Localization.kr.DISK}`,  onClick: () => setSelectedModalTab("disk") },
    { id: "all",     label: `${Localization.kr.VM}/${Localization.kr.DISK}`,   onClick: () => setSelectedModalTab("all") },
    ], []);

  const {
    data: hosts=[],
    isLoading: isHostsLoading,
    isSuccess: isHostSuccess,
  } = useHostsFromCluster(clusterVo?.id ?? "");

  const { mutate: migration } = useMigration(onClose, onClose);

  const [vmList, setVmList] = useState([]);
  const [isCluster, setIsCluster] = useState(true);
  const [targetHostId, setTargetHostId] = useState("");
  const [affinityClosure, setAffinityClosure] = useState(false);

  useEffect(() => {
    if (isOpen && vmsSelected.length > 0) {
      setVmList(vmsSelected);
      setTargetHostId(clusterVo.id);     // 클러스터 자동선택을 기본으로
      setIsCluster(true);                // 기본 상태도 클러스터로 설정
    }
  }, [isOpen]);

  const hostsWithClusterOption = useMemo(() => {
    if (!clusterVo) return [];

    const currentHostId = vmsSelected[0]?.hostVo?.id;

    // 내부 함수: 현재 VM이 실행 중인 호스트 제외
    const getFilteredHosts = (hosts, currentHostId) => {
      if (!currentHostId) return hosts;
      return hosts.filter((host) => host.id !== currentHostId);
    };

    const filteredHosts = getFilteredHosts(hosts, currentHostId);

    if (!filteredHosts || filteredHosts.length === 0) {
      return [{
        id: "none",
        name: `${Localization.kr.MIGRATION} 가능한 ${Localization.kr.HOST} 없음`
      }];
    }

    const clusterHostOption = {
      id: clusterVo.id ?? "",
      name: `${Localization.kr.CLUSTER} ${clusterVo?.name} 내의 ${Localization.kr.HOST} 자동선택`,
    };

    return [clusterHostOption, ...filteredHosts];
  }, [hosts, clusterVo, vmsSelected]);



  const validateForm = () => {    
    if(targetHostId ==="none") 
      return `${Localization.kr.HOST}가 지정되지 않았습니다.`;
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    vmList?.forEach((vm) => {
      migration({
        vmId: vm.id,
        vm: isCluster 
          ? { clusterVo: { id: clusterVo?.id } } 
          : { hostVo: { id: targetHostId } },
        affinityClosure: affinityClosure
      });
    });
  };

  return (
    <BaseModal targetName={Localization.kr.MIGRATION} submitTitle={""}
      isOpen={isOpen} onClose={onClose}
      isReady={isHostSuccess}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "800px" }}
    >
    <div className="popup-content-outer flex">

      <TabNavButtonGroup  tabs={tabs} tabActive={selectedModalTab} />
       <div className="vm-edit-select-tab">
        <div className="edit-first-content pb-0.5">
          {selectedModalTab === "common" && (
            <>
            <br/>
            <span>현재 {Localization.kr.HOST} {vmsSelected[0]?.hostVo?.name}</span>
          <br/><br/>

          <div>
            {vmList.map((vm) => (
              <>
                <div key={vm.id} className="flex fw-bold">
                  <div className="mr-1.5">- <span>{vm.name}</span></div>
                </div>
                <br/>
              </>
            ))}
          </div>

          <LabelSelectOptionsID id={`host`} label={`${Localization.kr.HOST} 선택`}
            value={targetHostId}
            options={hostsWithClusterOption}
            disabled={[...hosts].length === 0}
            onChange={(selected) => {
              if (selected?.id === "none") {
                setTargetHostId("");
                setIsCluster(false);
                return;
              }
              setTargetHostId(selected?.id ?? "");
              setIsCluster(selected?.id === clusterVo.id);
            }}
          />
          <LabelCheckbox id={`affinity`}
            label={`선택한 ${Localization.kr.VM}을 사용하여 양극 강제 연결 그룹의 모든 가상 시스템을 ${Localization.kr.MIGRATION}합니다.`}
            value=""
            onChange={(e) => setAffinityClosure(e.target.checked)}
          />
          </>
          )}
        </div>
      </div>

      
    </div>
    </BaseModal>
  );
};

export default VmMigrationModal2;
