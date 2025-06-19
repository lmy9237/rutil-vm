import { useEffect, useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import ToggleSwitchButton               from "@/components/button/ToggleSwitchButton";
import ApiManager                       from "@/api/ApiManager";
import { useQueries }                   from "@tanstack/react-query";
import {
  useAllMigratableHosts4Vms,
  useMigration
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";


const VmMigrationModal = ({ 
  isOpen, 
  onClose,
}) => {
  const { validationToast } = useValidationToast();

  const { vmsSelected } = useGlobal()

  const { mutate: migration } = useMigration(onClose, onClose);

  const [vmList, setVmList] = useState([]);
  const [hostList, setHostList] = useState({});
  const [isCluster, setIsCluster] = useState(true);
  const [targetHosts, setTargetHosts] = useState({});
  const [affinityClosures, setAffinityClosures] = useState({});

  useEffect(() => {
    if (isOpen && vmsSelected.length > 0) {
      setVmList(vmsSelected);
      setIsCluster(true);
    }
  }, [isOpen]);
  
  const getHosts = useQueries({
    queries: vmList?.map((vm) => ({
      queryKey: ['allHostsFromVm', vm?.id],
      queryFn: async () => {
        try {
          const hosts = await ApiManager.findAllMigratableHostsFromVM(vm?.id);
          return hosts || [];
        } catch (error) {
          console.error(`Error fetching ${vm}`, error);
          return [];
        }
      }
    })),
  });  

  useEffect(() => {
    console.log("$v", vmList)
    console.log("$geth", getHosts)
  }, [])

  useEffect(()=>{
    const initialAffinityClosures = {};
    for (let i=0; i<vmList.length; i++) {
      const vm = vmList[i];
      initialAffinityClosures[vm.id] = false;
    }
    setAffinityClosures(initialAffinityClosures);
  }, [vmList]);

  useEffect(() => {
    const newHostList = {};

    for (let i = 0; i < getHosts.length; i++) {
      const queryResult = getHosts[i];
      const vm = vmList[i];

      if (vm && queryResult.data && queryResult.isSuccess) {
        const hosts = queryResult.data?.body ?? [];
        const filteredHosts = hosts
          .map(d => ({
            id: d.id,
            name: d.name,
          }));

        newHostList[vm.id] = filteredHosts;
      }
    }

    const isDifferent = JSON.stringify(hostList) !== JSON.stringify(newHostList);
    if (isDifferent) {
      setHostList(newHostList);
    }
  }, [getHosts, vmList]);

  useEffect(() => {
    if (!hostList || Object.keys(hostList).length === 0) return;
  
    setTargetHosts(prev => {
      const next = { ...prev };
      let changed = false;
  
      Object.entries(hostList).forEach(([vmId, hosts]) => {
        if (hosts && hosts.length > 0 && !next[vmId]) {
          next[vmId] = hosts[0].id;
          changed = true;
        }
      });
  
      return changed ? next : prev;
    });
  }, [hostList]);


  const validateForm = () => {    
    if(!isCluster){
      for (const vm of vmList) {
        const selectedHostId = targetHosts[vm.id];
        if (!selectedHostId || selectedHostId.trim() === "none") {
          return `${Localization.kr.HOST}가 지정되지 않았습니다.`;
        }
      }
    }
    
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    vmList?.forEach((vm) => {
      let selectHostId = targetHosts[vm.id];

      migration({
        vmId: vm.id,
        vm: isCluster ? { 
            clusterVo:{
              id: vm?.clusterVo.id
            }
          } : { 
            hostVo :{
              id: selectHostId
            }
        },
        affinityClosure: affinityClosures[vm.id]
      });
    });
  };

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={Localization.kr.MIGRATION}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "600px" }}
    >
      <form id="modal-vm-migration">
        <div className="migration-article">
          <p className="fw-bold mb-2">
            다음 {Localization.kr.VM}(을)를 {Localization.kr.MIGRATION}합니다:
          </p>
          <br/>

          <ToggleSwitchButton id="plugged-toggle" 
            label={`${Localization.kr.CLUSTER} ${vmsSelected[0]?.clusterVo?.name} 내 ${Localization.kr.HOST} 자동 선택`}
            checked={isCluster}
            onChange={() => setIsCluster(!isCluster)}
            tType="t" fType="f"
          />
          <span>{isCluster === true ? "T":"F"}</span>
          <br/><br/>

          {isCluster ? (
            <>
              {vmList.map((vm) => (
                <div key={vm.id} className="flex fw-bold">
                <div className="mr-1.5">-</div>
                <div>{vm.name}</div>
                </div>
              ))}
            </>
          ):(
            <>
              {vmList.map((vm) => (
                <div key={vm.id} className="flex fw-bold">
                  <div className="mr-1.5">-</div>
                  <div>{vm.name}</div>
                  <div>
                    <LabelSelectOptionsID id={`host-${vm.id}`}
                      label={``}
                      // label={`${Localization.kr.TARGET} ${Localization.kr.HOST}`}
                      value={targetHosts[vm.id] || ""}
                      options={hostList[vm.id] && hostList[vm.id].length > 0 
                        ? hostList[vm.id] 
                        : [{ id: "none", name: "마이그레이션 가능한 호스트 없음" }]
                      }
                      onChange={(selected) => {
                        setTargetHosts((prev) => ({ ...prev, [vm.id]: selected.id }));
                      }}
                    />

                    <LabelCheckbox id={`affinity-${vm.id}`}
                      label={`선택한 ${Localization.kr.VM}을 사용하여 양극 강제 연결 그룹의 모든 가상 시스템을 ${Localization.kr.MIGRATION}합니다.`}
                      checked={!!affinityClosures[vm.id]}
                      onChange={() => { 
                        setAffinityClosures((prev) => ({ ...prev, [vm.id]: !prev[vm.id] }));
                      }}
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div> 
      </form>
    </BaseModal>
  );
};

export default VmMigrationModal;
