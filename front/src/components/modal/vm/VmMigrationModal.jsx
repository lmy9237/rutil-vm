import { useEffect, useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
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
  // const { closeModal } = useUIState()
  const { 
    vmsSelected, 
    clustersSelected
  } = useGlobal()
  
  const {
    mutate: migration
  } = useMigration(onClose, onClose);
  const {
    data: hostsForMigration = [],
    isLoading: isHostsForMigrationLoading,
  } = useAllMigratableHosts4Vms(vmsSelected.map((e) => (e?.id)))

  const [vmStates, setVmStates] = useState({});
  const { ids, names } = useMemo(() => {
    if (!vmsSelected) return { ids: [], names: [] };
    
    return {
      ids: [...vmsSelected].map((item) => item.id),
      names: [...vmsSelected].map((item) => item.name || 'undefined'),
    };
  }, [vmsSelected]);

  useEffect(() => {
    Logger.debug(`VmMigrationModal > useEffect ...`)
    if (!isOpen || !vmsSelected) return;

    const initialState = {};
 
    [...vmsSelected].forEach((vm) => {
      initialState[vm?.id] = {
        isCluster: true,
        clusterVo: {
          id: vm?.clusterVo?.id || "",
          name: vm?.clusterVo?.name || "",
        },
        hostVo: { id: "", name: "" },
        affinityClosure: false,
      };
    });
    setVmStates(initialState);
  }, [isOpen, vmsSelected]);

  const handleFormSubmit = () => {
    Logger.debug(`VmMigrationModal > handleFormSubmit ...`)
    vmsSelected.forEach((vm) => {
      const { 
        isCluster, 
        clusterVo, 
        hostVo, 
        affinityClosure
      } = vmStates[vm.id] || {};

      const payload = {
        vmId: vm.id,
        vm: isCluster ? { 
          clusterVo
        } : {
          hostVo
        },
        affinityClosure
      };
      migration(payload);
    });
  };
  
  // 기준 VM (첫 번째) 기준
  const referenceVM = vmsSelected[0];
  const vmState = referenceVM
    ? vmStates[referenceVM.id]
    : {};
  const { 
    isCluster, 
    clusterVo, 
    hostVo, 
    affinityClosure
  } = vmState || {};
    
  const ableHost = [...hostsForMigration]?.filter((h) => h?.id !== referenceVM?.hostVo?.id);

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={Localization.kr.MIGRATION}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "770px" }}
    >
      <form id="modal-vm-migration">
        <div className="migration-article">
          <p className="fw-bold mb-2">
            다음 {Localization.kr.VM}(을)를 {Localization.kr.MIGRATION}합니다:
          </p>
          {[...vmsSelected].map((vm) => (
            <div key={vm.id} className="flex fw-bold">
              <div className="mr-1.5">-</div>
              <div>{vm.name}</div>
            </div>
          ))}
        </div> 
        {/* ✅ 공통 옵션 UI 1세트만 표시 */}
        {referenceVM && (
          <>
            <LabelCheckbox
              id={`cluster-${referenceVM.id}`}
              label={`${Localization.kr.CLUSTER} ${referenceVM?.clusterVo?.name} 내 ${Localization.kr.HOST} 자동 선택`}
              checked={isCluster}
              onChange={() => {
                const newVal = !isCluster;
                const updated = { ...vmStates };
                [...vmsSelected].forEach((vm) => {
                  updated[vm?.id] = {
                    ...updated[vm?.id],
                    isCluster: newVal,
                    clusterVo: newVal ? {
                      id: vm?.clusterVo?.id || "",
                      name: vm?.clusterVo?.name || "",
                    } : { id: "", name: "" },
                    hostVo: !newVal ? {
                      id: ableHost[0]?.id || "",
                      name: ableHost[0]?.name || "",
                    } : { id: "", name: "" },
                  };
                });
                setVmStates(updated);
              }}
            />

            <LabelSelectOptionsID
              id={`host-${referenceVM.id}`}
              label={`${Localization.kr.TARGET} ${Localization.kr.HOST}`}
              value={hostVo?.id}
              disabled={isCluster}
              loading={isHostsForMigrationLoading}
              options={ableHost}
              onChange={(item) => {
                const selected = ableHost.find(h => h.id === item.id);
                const updated = { ...vmStates };
                [...vmsSelected].forEach((vm) => {
                  updated[vm?.id] = {
                    ...updated[vm?.id],
                    hostVo: {
                      id: selected?.id || "", 
                      name: selected?.name || "",
                    },
                    clusterVo: {
                      id: "",
                      name: ""
                    },
                  };
                });
                setVmStates(updated);
              }}
            />

            <LabelCheckbox
              id={`affinity-${referenceVM.id}`}
              label={`선택한 ${Localization.kr.VM}을 사용하여 양극 강제 연결 그룹의 모든 가상 시스템을 ${Localization.kr.MIGRATION}합니다.`}
              checked={affinityClosure}
              onChange={() => {
                const updated = { ...vmStates };
                [...vmsSelected].forEach((vm) => {
                  updated[vm.id] = {
                    ...updated[vm.id],
                    affinityClosure: !affinityClosure,
                  };
                });
                setVmStates(updated);
              }}
            />
          </>
        )}
      </form>
    </BaseModal>
  );
};

export default VmMigrationModal;
