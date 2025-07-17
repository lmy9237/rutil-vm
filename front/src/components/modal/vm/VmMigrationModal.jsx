import { useEffect, useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import {
  useAllMigratableHostsFromVM,
  useMigration
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import LabelCheckbox from "@/components/label/LabelCheckbox";


const VmMigrationModal = ({ 
  isOpen, 
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  const { vmsSelected } = useGlobal()
  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const clusterVo = vmsSelected[0]?.clusterVo;

  const {
    data: hosts=[],
    isLoading: isHostsLoading,
    isSuccess: isHostSuccess,
  } = useAllMigratableHostsFromVM(vmId ?? "");

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

    // 호스트가 하나도 없을 때
    if (!hosts || hosts.length === 0) {
      return [{
        id: "none",
        name: `${Localization.kr.MIGRATION} 가능한 ${Localization.kr.HOST} 없음`
      }];
    }

    // 정상일 때 클러스터 자동선택 + hosts
    const clusterHostOption = {
      id: clusterVo.id ?? "",
      name: `${Localization.kr.CLUSTER} ${clusterVo?.name} 내의 ${Localization.kr.HOST} 자동선택`,
    };

    return [clusterHostOption, ...hosts];
  }, [hosts, clusterVo]);

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
    <BaseModal targetName={Localization.kr.VM} submitTitle={Localization.kr.MIGRATION}
      isOpen={isOpen} onClose={onClose}
      isReady={isHostSuccess}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "650px" }}
    >
      <form id="modal-vm-migration">
        <div className="migration-article">
          <p className="fw-bold mb-2">다음 {Localization.kr.VM}을 {Localization.kr.MIGRATION}합니다</p>
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
          {/* {import.meta.env.DEV && <span>{targetHostId}</span>} <br/>
          {import.meta.env.DEV && <span>{isCluster === true ? "T" : "F"}</span>} */}
          <LabelCheckbox id={`affinity`}
            label={`선택한 ${Localization.kr.VM}을 사용하여 양극 강제 연결 그룹의 모든 가상 시스템을 ${Localization.kr.MIGRATION}합니다.`}
            value=""
            onChange={(e) => setAffinityClosure(e.target.checked)}
          />
          {/* {import.meta.env.DEV && <span>{affinityClosure === true ? "T" : "F"}</span>} */}

        </div> 
      </form>
    </BaseModal>
  );
};

export default VmMigrationModal;
