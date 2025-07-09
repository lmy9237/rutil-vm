import React, { useState, useEffect, useMemo } from "react";
import LabelSelectOptionsID from "@/components/label/LabelSelectOptionsID";
import LabelCheckbox from "@/components/label/LabelCheckbox";
import FilterButtons from "@/components/button/FilterButtons";
import { InfoTable } from "@/components/table/InfoTable";
import LabelSelectOptions from "@/components/label/LabelSelectOptions";
import Localization from "@/utils/Localization";
import { emptyIdNameVo, useSelectFirstItemEffect, useSelectFirstNameItemEffect } from "@/util";
import { 
    useAllActiveDomainsFromDataCenter,
    useAllVnicProfilesFromNetwork,
    useAllOpearatingSystemsFromCluster,
    useClustersFromDataCenter,
    useCpuProfilesFromCluster,
    useNetworksFromDataCenter,
    useVmFromVMWare,
    useAllVnicProfilesFromNetwork4EachNetwork,
} from "@/api/RQHook";
import LabelInput from "@/components/label/LabelInput";
import { useValidationToast } from "@/hooks/useSimpleToast";
import { handleSelectIdChange } from "@/components/label/HandleInput";
import ApiManager from "@/api/ApiManager";

const VmImportRender2Modal = ({ 
  baseUrl,
  sessionId,
  dataCenterVo,
  targetVMs=[],
}) => {
  const { validationToast } = useValidationToast();
  const [activeFilter, setActiveFilter] = useState("general");

  // 전체적용
  const [domainVo, setDomainVo] = useState(emptyIdNameVo());
  const [clusterVo, setClusterVo] = useState(emptyIdNameVo());
  const [cpuProfileVo, setCpuProfileVo] = useState(emptyIdNameVo());
  const [virtioVo, setVirtioVo] = useState(emptyIdNameVo());
  const [virtioChecked, setVirtioChecked] = useState("");
  const [sparsd, setSparsd] = useState("");

  const [selectedId, setSelectedId] = useState(null);

  //각각 적용
  const [name, setName] = useState("");
  const [osSystem, setOsSystem] = useState("");

  // const [diskList, setDiskList] = useState([]);

  const [nicList, setNicList] = useState([]);
  const [vnicProfileList, setVnicProfilesList] = useState([]);

  const [vmConfigs, setVmConfigs] = useState({});

  const { 
    data: vmDetailsMap = {} 
  } = useVmFromVMWare({ baseUrl, sessionId, vmIds: targetVMs.map(vm => vm.vm).join(",") });

  const {
    data: domains = [],
    isLoading: isStorageDomainsLoading,
  } = useAllActiveDomainsFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));

  const {
    data: clusters = [],
    isLoading: isClustersLoading,
  } = useClustersFromDataCenter(dataCenterVo?.id, (e) => ({...e,}));

  const { 
    data: cpuProfiles = [], 
    isLoading: isCpuProfilesLoading
  } = useCpuProfilesFromCluster(clusterVo?.id, (e) => ({ ...e }));

  const { 
    data: osList = [], 
    isLoading: isOsListLoading
  } = useAllOpearatingSystemsFromCluster(clusterVo.id, (e) => ({ ...e }));

  const { 
    data: networks = [], 
    isLoading: isNetworksLoading 
  } = useNetworksFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));

  // const { 
  //   data: vnics = [], 
  //   isLoading: isvNicsLoading 
  // } = useAllVnicProfilesFromNetwork(networkVo.id, (e) => ({ ...e }));
  
  const qr = useAllVnicProfilesFromNetwork4EachNetwork(networks, (e) => ({ ...e }));
  /* const getVnicProfiles = useQueries({
    queries: networks.map((network) => ({
      queryKey: ['VnicProfilesFromNetwork', network.id],
      queryFn: async () => {
        try {
          const vnicProfiles = await ApiManager.findAllVnicProfilesFromNetwork(network.id);
          return vnicProfiles || [];
        } catch (error) {
          console.error(`Error fetching ${network}`, error);
          return [];
        }
      }
    })),
  });*/
  
  const vmMapById = useMemo(() => {
    return Array.isArray(vmDetailsMap)
      ? Object.fromEntries(vmDetailsMap.map(vm => [vm.id, vm]))
      : {};
  }, [vmDetailsMap]);
  const selectedVm = vmMapById[selectedId];
  console.log("$ vmDetailsMap", vmDetailsMap)


  // 첫번째 항목으로 지정
  useSelectFirstItemEffect(domains, setDomainVo);
  useSelectFirstNameItemEffect(clusters, setClusterVo, "Default");
  useSelectFirstItemEffect(cpuProfiles, setCpuProfileVo);

  // useEffect로 getVnicProfiles 결과를 정리하여 vnicProfiles 업데이트
  useEffect(() => {
    const newVnicProfilesMap = {};
  
    qr.forEach((queryResult, idx) => {
      const network = networks[idx];
      console.log("$network", network)
      if (network && queryResult?.data && !queryResult?.isLoading) {
        newVnicProfilesMap[network.id] = queryResult?.data || [];
      }
    });
    
    // 기존 값과 다를 때만 업데이트
    const isDifferent = JSON.stringify(vnicProfileList) !== JSON.stringify(newVnicProfilesMap);
    if (isDifferent) {
      setVnicProfilesList(newVnicProfilesMap);
    }
  }, [qr, networks]); 


  useEffect(() => {
    const newConfigs = {};
    for (const vm of Object.values(vmDetailsMap)) {
      newConfigs[vm.id] = {
        name: vm.name,
        osSystem: osList[0]?.name || "",
        network: {},  // nicKey: network ID
        vnic: {},     // nicKey: vnic ID
      };
    }
    setVmConfigs(newConfigs);
  }, [vmDetailsMap, osList]);
  
  useEffect(() => {
    if (osList.length > 0 && !osSystem) {
      setOsSystem(osList[0].name);
    }
  }, [osList]);

  // 자동감지 설정
  useEffect(() => {
    if (!sparsd && sparseList.length > 0) {
      setSparsd(sparseList[0].value);
    }
  }, [sparsd]);

  
  useEffect(() => {
    if (!selectedVm || networks.length === 0) return;

    const selectedConfig = vmConfigs[selectedId] || {};
    const nicNetwork = selectedConfig.network || {};

    const updated = { ...nicNetwork };
    let changed = false;
    
    // ovirtmgmt 우선 선택
    const defaultNetwork = networks.find(n => n.name === "ovirtmgmt") || networks[0];

    for (const nicKey of Object.keys(selectedVm.nics || {})) {
      if (!nicNetwork[nicKey]) {
        updated[nicKey] = defaultNetwork?.id || networks[0].id;
        changed = true;
      }
    }

    if (changed) {
      setVmConfigs(prev => {
        const updatedVmConfig = {
          ...prev[selectedId],
          network: updated,
          vnic: { ...prev[selectedId]?.vnic }
        };

        // NIC별로 vNIC Profile 기본값 설정
        for (const nicKey of Object.keys(updated)) {
          const netId = updated[nicKey];
          const vnicProfiles = vnicProfileList[netId];
          if (vnicProfiles && vnicProfiles.length > 0) {
            updatedVmConfig.vnic[nicKey] = vnicProfiles[0].id;
          } else {
            updatedVmConfig.vnic[nicKey] = "";
          }
        }

        return {
          ...prev,
          [selectedId]: updatedVmConfig
        };
      });
    }
  }, [selectedId, networks, selectedVm]);

  const updateVmConfig = (vmId, field, value) => {
    setVmConfigs(prev => ({
      ...prev,
      [vmId]: {
        ...prev[vmId],
        [field]: value
      }
    }));
  };

  const updateVmNicNetwork = async (vmId, nicKey, networkId) => {
    try {
      const response = await ApiManager.findAllVnicProfilesFromNetwork(networkId);
      const profiles = response?.body || [];

      const firstProfileId = profiles[0]?.id || "";
      console.log("$ firstProfileId", firstProfileId)
      setVmConfigs(prev => ({
        ...prev,
        [vmId]: {
          ...prev[vmId],
          network: {
            ...prev[vmId]?.network,
            [nicKey]: networkId
          },
          vnic: {
            ...prev[vmId]?.vnic,
            [nicKey]: firstProfileId
          }
        }
      }));

      setVnicProfilesList(prev => ({
        ...prev,
        [networkId]: profiles
      }));
    } catch (error) {
      console.error("vNIC profile 로딩 실패:", error);

      setVmConfigs(prev => ({
        ...prev,
        [vmId]: {
          ...prev[vmId],
          vnic: {
            ...prev[vmId]?.vnic,
            [nicKey]: ""
          }
        }
      }));

      setVnicProfilesList(prev => ({
        ...prev,
        [networkId]: []
      }));
    }
  };

  const updateVmNicVnic = (vmId, nicKey, value) => {
    setVmConfigs(prev => ({
      ...prev,
      [vmId]: {
        ...prev[vmId],
        vnic: {
          ...prev[vmId]?.vnic,
          [nicKey]: value
        }
      }
    }));
  };

  console.log("$selectedVm", selectedVm);

  const generalInfoRows = (vwvm) => [
    { 
      label: Localization.kr.NAME, 
      value: 
        <LabelInput
          value={vmConfigs[selectedId]?.name || ""}
          onChange={(e) => updateVmConfig(selectedId, "name", e.target.value)}
        />
    },
    {
      label: Localization.kr.OPERATING_SYSTEM,
      value: 
        <LabelSelectOptionsID
          value={vmConfigs[selectedId]?.osSystem || ""}
          options={osList.map((opt) => ({ id: opt.name, name: opt.description }))}
          isLoading={isOsListLoading}
          onChange={(opt) => updateVmConfig(selectedId, "osSystem", opt.id)}
        />
    },
    { label: `${Localization.kr.VM} ID`, value: vwvm?.identity?.biosUuid || "-" },
    { label: `${Localization.kr.MEMORY} (MB)`, value: `${vwvm?.memory?.sizeMiB}  MB` || "-" },
    { label: "CPU 코어 수", value: `${vwvm?.cpu?.count} (${vwvm?.cpu?.count}:${vwvm?.cpu?.coresPerSocket}:1)` || "-" },
    { label: `${Localization.kr.DISK} 수`, value: Object.keys(vwvm?.disks || {}).length },
    { label: `${Localization.kr.NICS} 수`, value: Object.keys(vwvm?.nics || {}).length },
  ];

  return (
    <>
      <div className="vm-impor-outer">
        <LabelSelectOptionsID label={Localization.kr.DOMAIN}
          value={domainVo.id}
          options={domains}
          isLoading={isStorageDomainsLoading}
          onChange={handleSelectIdChange(setDomainVo, domains, validationToast)}
        />
        <LabelSelectOptions id="sparse" label={Localization.kr.SPARSE}
          value={sparsd}
          options={sparseList}
          onChange={(e) => setSparsd(e.target.value)}
        />
        <LabelSelectOptionsID label={`대상 ${Localization.kr.CLUSTER}`}
          value={clusterVo.id}
          options={clusters}
          isLoading={isClustersLoading}
          onChange={handleSelectIdChange(setClusterVo, clusters, validationToast)}
        />
        <div className="f-start items-center gap-2">
          <LabelCheckbox id="virtio" label="VirtIO 드라이버 연결"
            checked={virtioChecked}
            onChange={(e) => setVirtioChecked(e.target.checked)}
          />
          <LabelSelectOptionsID label="" disabled={!virtioChecked} />
        </div>
        <LabelSelectOptionsID label="CPU 프로파일" 
          value={cpuProfileVo.id}
          options={cpuProfiles}
          isLoading={isCpuProfilesLoading}
          onChange={handleSelectIdChange(setCpuProfileVo, cpuProfiles, validationToast)}
        />
      </div>

      <div className="section-table-outer w-full mb-2">
        <table className="custom-table w-full" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead style={{ background: "#f5f5f5" }}>
            <tr>
              <th>{Localization.kr.NAME}</th>
              <th>소스</th>
              <th>{Localization.kr.MEMORY}</th>
              <th>CPU</th>
              <th>아키텍처</th>
              <th>{Localization.kr.DISK}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(vmDetailsMap).map(([index, vm]) => (
              <tr key={vm?.id} 
                onClick={() => setSelectedId(vm.id)}
                style={{ 
                  backgroundColor: selectedId === vm?.id ? "#e5f1ff" : "white", 
                  cursor: "pointer" 
                }}
              >
                <td>{vm?.name}</td>
                <td>{Localization.kr.VW}</td>
                <td>{vm?.memory?.sizeMiB} MB</td>
                <td>{vm?.cpu?.count}</td>
                <td>{"x86_64"}</td>
                <td>{Object.keys(vm?.disks || {}).length || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <span>id: {selectedId} </span>
      </div>

      {selectedVm && (
        <div className="vm-import-detail-box mb-3">
          <div className="mb-2">
            <FilterButtons
              options={filterOptions}
              activeOption={activeFilter}
              onClick={setActiveFilter}
            />
          </div>

          <div className="vm-detail-content">
            {activeFilter === "general" && (
              <div className="vm-import-render-tb flex justify-between">
                <div className="mr-20">
                  <InfoTable tableRows={generalInfoRows(selectedVm)} />
                </div>
              </div>
            )}
            {activeFilter === "disk" && (
              <div className="mt-2">
                <div className="section-table-outer w-full mb-2">
                  <table className="custom-table w-full" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                    <thead style={{ background: "#f5f5f5" }}>
                      <tr>
                        <th>경로</th>
                        <th style={{ width: '600px' }}>{Localization.kr.SIZE_VIRTUAL}</th>
                        <th style={{ width: '600px' }}>{Localization.kr.SIZE_ACTUAL}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(selectedVm?.disks || {}).map((disk, idx) => (
                        <tr key={idx}>
                          <td>{disk.backing?.vmdkFile || "-"}</td>
                          <td>{(disk.capacity / 1024 / 1024 / 1024).toFixed(0)} GiB</td>
                          <td>-</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeFilter === "network" && (
              <div className="mt-2">
                <div className="section-table-outer w-full mb-2">
                  <table className="custom-table w-full" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                    <thead style={{ background: "#f5f5f5" }}>
                      <tr>
                        <th>{Localization.kr.NAME}</th>
                        <th>기존 {Localization.kr.NETWORK} {Localization.kr.NAME}</th>
                        <th>{Localization.kr.NETWORK} {Localization.kr.NAME}</th>
                        <th>{Localization.kr.VNIC_PROFILE} {Localization.kr.NAME}</th>
                        <th>유형</th>
                        <th>MAC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(selectedVm?.nics || {}).map(([nicKey, nic], idx) => {
                        return (
                          <tr key={nicKey}>
                            <td>nic{idx + 1}</td>
                            <td>{nic.backing?.networkName || "-"}</td>
                            <td>
                              <LabelSelectOptionsID
                                value={vmConfigs[selectedId]?.network?.[nicKey] || ""}
                                loading={isNetworksLoading}
                                options={networks}
                                onChange={(opt) => updateVmNicNetwork(selectedId, nicKey, opt.id)}
                              />
                              <span>1 {vmConfigs[selectedId]?.network?.[nicKey]}</span>
                            </td>
                            <td>
                              <LabelSelectOptionsID
                                value={vmConfigs[selectedId]?.vnic?.[nicKey] || ""}
                                options={
                                  vnicProfileList[vmConfigs[selectedId]?.network?.[nicKey]] || []
                                }
                                onChange={(opt) => updateVmNicVnic(selectedId, nicKey, opt.id)}
                              />
                              <span>1 {vmConfigs[selectedId]?.vnic?.[nicKey]}</span>
                            </td>
                            <td>{nic.type === "VMXNET3" ? "VirtIO" : nic.type}</td>
                            <td>{nic.macAddress}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
      </div>
    )}
    </>
  );
};

export default VmImportRender2Modal;

const sparseList = [
  { value: "auto", label: "자동감지" },
  { value: "true", label: "씬 프로비저닝" },
  { value: "false", label: "사전 할당" },
];

const filterOptions = [
  { key: "general", label: Localization.kr.GENERAL },
  { key: "disk", label: Localization.kr.DISK },
  { key: "network", label: Localization.kr.NICS },
];