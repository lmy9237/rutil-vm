import { useEffect, useMemo, useState } from "react";
import BaseModal from "../BaseModal";
import { useMigration } from "../../../api/RQHook";
import "./MVm.css";
import LabelCheckbox from "../../label/LabelCheckbox";
import Localization from "../../../utils/Localization";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import toast from "react-hot-toast";
import { useQueries } from "@tanstack/react-query";
import ApiManager from "../../../api/ApiManager";

const VmMigrationModal = ({ 
  isOpen, 
  selectedVms,
  onClose, 
}) => {
  const onSuccess = () => {
    toast.success(`${Localization.kr.VM} 마이그레이션 완료`);
    onClose();
  };
  const { mutate: migration } = useMigration(onSuccess, () => onClose());

  const [vmStates, setVmStates] = useState({});

  const { ids, names } = useMemo(() => {
    if (!selectedVms) return { ids: [], names: [] };
    const dataArray = Array.isArray(selectedVms) ? selectedVms : [selectedVms];
    return {
      ids: dataArray.map((item) => item.id),
      names: dataArray.map((item) => item.name || 'undefined'),
    };
  }, [selectedVms]);


  useEffect(() => {
    if (!isOpen || !selectedVms) return;

    const initialState = {};
    const dataArray = Array.isArray(selectedVms) ? selectedVms : [selectedVms];
    
    dataArray.forEach((vm) => {
      initialState[vm.id] = {
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
  }, [isOpen, selectedVms]);

  const hostQueries = useQueries({
    queries: ids.map((vmId) => ({
      queryKey: ['HostsFromVM', vmId],
      queryFn: async () => {
        try {
          const hosts = await ApiManager.migrateHostsFromVM(vmId);
          console.info(`hosts *** ${vmId}`, hosts);
          return hosts.body || [];
        } catch (error) {
          console.error(`Error fetching hosts for VM ${vmId}`, error);
          return [];
        }
      }
    })),
  });    

  const handleFormSubmit = () => {
    selectedVms.forEach((vm) => {
      const { isCluster, clusterVo, hostVo, affinityClosure } = vmStates[vm.id] || {};
      const payload = {
        vmId: vm.id,
        vm: isCluster ? { clusterVo } : { hostVo },
        affinityClosure
      };
      migration(payload);
    });
  };

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle="마이그레이션"
      isOpen={isOpen} onClose={onClose}      
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "770px" }}
    >
      {Array.isArray(selectedVms) &&
        selectedVms.map((vm, index) => {
        const vmState = vmStates[vm.id] || {};
        const { isCluster, clusterVo, hostVo, affinityClosure } = vmState;

        const hostQuery = hostQueries[index];
        const hostList = hostQuery?.data || [];
        const ableHost = hostList.filter(h => h.id !== vm?.hostVo?.id);

        return (
          <div key={vm.id} className="migration-article">
            <div>{vm.name}</div>
            <LabelCheckbox id={`cluster-${vm.id}`}
              label={`${Localization.kr.CLUSTER} ${vm?.clusterVo?.name} 내 ${Localization.kr.HOST} 자동 선택`}
              checked={isCluster}
              onChange={() => {
                const newVal = !isCluster;
                setVmStates(prev => ({
                  ...prev,
                  [vm.id]: {
                    ...prev[vm.id],
                    isCluster: newVal,
                    clusterVo: newVal ? {
                      id: vm?.clusterVo?.id || "",
                      name: vm?.clusterVo?.name || "",
                    } : { id: "", name: "" },
                    hostVo: !newVal ? {
                      id: ableHost[0]?.id || "",
                      name: ableHost[0]?.name || ""
                    } : { id: "", name: "" }
                  }
                }));
              }}
            />

            <LabelSelectOptionsID id={`host-${vm.id}`}
              label={`${Localization.kr.TARGET} ${Localization.kr.HOST}`}
              value={hostVo?.id}
              disabled={isCluster}
              loading={hostQuery?.isLoading}
              options={ableHost}
              onChange={(e) => {
                const selected = ableHost.find(h => h.id === e.target.value);
                if (selected) {
                  setVmStates(prev => ({
                    ...prev,
                    [vm.id]: {
                      ...prev[vm.id],
                      hostVo: { id: selected.id, name: selected.name },
                      clusterVo: { id: "", name: "" }
                    }
                  }));
                }
              }}
            />

            <LabelCheckbox id={`affinity-${vm.id}`}
              label="선택한 가상 머신을 사용하여 양극 강제 연결 그룹의 모든 가상 시스템을 마이그레이션합니다."
              checked={affinityClosure}
              onChange={() =>
                setVmStates(prev => ({ ...prev, [vm.id]: { ...prev[vm.id], affinityClosure: !affinityClosure}}))
              }
            />
          </div>
        );
      })}
  </BaseModal>
  );
};

export default VmMigrationModal;
