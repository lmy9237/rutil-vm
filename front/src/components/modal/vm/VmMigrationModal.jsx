import { useEffect, useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import {
  useAllStorageDomainsToMoveFromDisk4EachDisk,
  useDisksFromVM,
  useHostsFromCluster,
  useMigration,
  useMoveDisk
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import TabNavButtonGroup from "@/components/common/TabNavButtonGroup";
import VmMigrationTabVM from "./migrate/VmMigrationTabVM";
import VmMigrationTabDisk from "./migrate/VmMigrationTabDisk";
import VmMigrationTabAll from "./migrate/VmMigrationTabAll";

const VmMigrationModal = ({ 
  isOpen, 
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  const { vmsSelected } = useGlobal()
  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const clusterVo = vmsSelected[0]?.clusterVo;

  const [selectedModalTab, setSelectedModalTab] = useState("vm");
  const tabs = useMemo(() => {
    const baseTabs = [
      {
        id: "vm",
        label: (
          <>
            <input type="radio" id="vm" name="migrate"
              checked={selectedModalTab === "vm"}
              className="mr-2"
              onChange={() => setSelectedModalTab("vm")}
            />
            <label htmlFor="vm">&nbsp;{Localization.kr.VM}</label>
          </>
        ),
        onClick: () => setSelectedModalTab("vm")
      }
    ];

    if (vmsSelected.length === 1) {
      baseTabs.push(
        {
          id: "disk",
          label: (
            <>
              <input type="radio" id="disk" name="migrate"
                checked={selectedModalTab === "disk"}
                className="mr-2"
                onChange={() => setSelectedModalTab("disk")}
              />
              <label htmlFor="disk">&nbsp;{Localization.kr.DISK}</label>
            </>
          ),
          onClick: () => setSelectedModalTab("disk")
        },
        // {
        //   id: "all",
        //   label: (
        //     <>
        //       <input type="radio" id="vmdisk" name="migrate"
        //         checked={selectedModalTab === "all"}
        //         onChange={() => setSelectedModalTab("all")}
        //       />
        //       <label htmlFor="vmdisk">{Localization.kr.VM} / {Localization.kr.DISK}</label>
        //     </>
        //   ),
        //   onClick: () => setSelectedModalTab("all")
        // }
      );
    }

    return baseTabs;
  }, [vmsSelected, selectedModalTab]);

  // const tabs = useMemo(() => {
  //   const baseTabs = [
  //     {
  //       id: "vm",
  //       label: Localization.kr.VM,
  //       onClick: () => setSelectedModalTab("vm"),
  //     },
  //   ];

  //   if (vmsSelected.length === 1) {
  //     baseTabs.push({
  //       id: "disk",
  //       label: Localization.kr.DISK,
  //       onClick: () => setSelectedModalTab("disk"),
  //     });

    
  //     // baseTabs.push({
  //     //   id: "all",
  //     //   label: `${Localization.kr.VM} / ${Localization.kr.DISK}`,
  //     //   onClick: () => setSelectedModalTab("all"),
  //     // });
  //   }

  //   return baseTabs;
  // }, [vmsSelected]);


  const {
    data: hosts=[],
    isSuccess: isHostSuccess,
  } = useHostsFromCluster(clusterVo?.id ?? "");

  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isSuccess: isDisksSuccess,
  } = useDisksFromVM(vmId, (e) => ({ ...e }));

  const { mutate: migration } = useMigration(onClose, onClose);
  const { mutate: moveDisk } = useMoveDisk(onClose, onClose);

  // 가상머신 이동
  const [vmList, setVmList] = useState([]);
  const [isCluster, setIsCluster] = useState(true);
  const [targetHostId, setTargetHostId] = useState("");
  const [affinityClosure, setAffinityClosure] = useState(false);

  // 디스크 이동
  const [diskList, setDiskList] = useState([]);
  const [domainList, setDomainList] = useState({});
  const [targetDomains, setTargetDomains] = useState({});
  
  const qr = useAllStorageDomainsToMoveFromDisk4EachDisk(diskList, (e) => ({ ...e }));
  
  const isQrSuccess = useMemo(() => {
    return qr.every((q) => q?.isSuccess);
  }, [qr]);
  
  useEffect(() => {
    if (isOpen && disks.length > 0) {
      setDiskList(disks);
    }
  }, [isOpen]);

  useEffect(() => {
    const newDomainList = {};

    for (let i = 0; i < qr.length; i++) {
      const allDomains = qr[i]?.data ?? []
      const disk = diskList[i];
      const currentDomainId = disk?.diskImageVo?.storageDomainVo?.id;

      const filteredDomains = [...allDomains].filter((d) => {
        return d.status?.toUpperCase() === "ACTIVE" && d.id !== currentDomainId;
      }).map((d) => ({
        id: d.id,
        name: d.name,
        availableSize: d.availableSize,
        usedSize: d.usedSize,
      }));
      newDomainList[disk?.id] = filteredDomains;
    }

    const isDifferent = JSON.stringify(domainList) !== JSON.stringify(newDomainList);
    if (isDifferent) {
      setDomainList(newDomainList);
    }
  }, [qr, diskList]);
    
  useEffect(() => {
    // domainList가 갱신될 때마다 실행
    if (!domainList || Object.keys(domainList).length === 0) return;

    setTargetDomains(prev => {
      const next = { ...prev };
      let changed = false;

      Object.entries(domainList).forEach(([diskId, domains]) => {
        if (domains && domains.length > 0 && !next[diskId]) {
          next[diskId] = domains[0].id;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [domainList]);


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


  // const validateForm = () => {    
  //   if(targetHostId ==="none") 
  //     return `${Localization.kr.HOST}가 지정되지 않았습니다.`;
  //   return null;
  // };

  const handleFormSubmit = async () => {
    // const error = validateForm();
    // if (error) {
    //   validationToast.fail(error);
    //   return;
    // }

    if (selectedModalTab === "vm") {
      // VM Migration만 실행
      vmList?.forEach((vm) => {
        migration({
          vmId: vm.id,
          vm: isCluster 
            ? { clusterVo: { id: clusterVo?.id } } 
            : { hostVo: { id: targetHostId } },
          affinityClosure: affinityClosure
        });
      });
    } else if (selectedModalTab === "disk") {
      // Disk Move만 실행
      Object.entries(targetDomains).forEach(([diskId, domainId]) => {
        moveDisk({ diskId, storageDomainId: domainId });
      });
    }
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
      <div className="vm-edit-select-tab px-[15px]">
        <div className="edit-first-content min-h-[180px]">
          {selectedModalTab === "vm" && (
            <VmMigrationTabVM
              vmsSelected={vmsSelected}
              vmList={vmList}
              targetHostId={targetHostId}
              hostsWithClusterOption={hostsWithClusterOption}
              setTargetHostId={setTargetHostId}
              clusterVo={clusterVo}
              setIsCluster={setIsCluster}
              affinityClosure={affinityClosure}
              setAffinityClosure={setAffinityClosure}
            />
          )}
          {selectedModalTab === "disk" && (
            <VmMigrationTabDisk
              diskList={diskList}
              domainList={domainList}
              targetDomains={targetDomains}
              setTargetDomains={setTargetDomains}
            />
          )}
          {/* {selectedModalTab === "all" && (
            <VmMigrationTabAll
              // VM 관련
              vmsSelected={vmsSelected}
              vmList={vmList}
              targetHostId={targetHostId}
              setTargetHostId={setTargetHostId}
              clusterVo={clusterVo}
              hostsWithClusterOption={hostsWithClusterOption}
              isCluster={isCluster}
              setIsCluster={setIsCluster}
              affinityClosure={affinityClosure}
              setAffinityClosure={setAffinityClosure}
              // Disk 관련
              diskList={diskList}
              domainList={domainList}
              targetDomains={targetDomains}
              setTargetDomains={setTargetDomains}
            />
          )} */}
        </div>
      </div>
    </div>
    </BaseModal>
  );
};

export default VmMigrationModal;
