import React, { useState, useEffect, useMemo } from "react";
import { useValidationToast } from "@/hooks/useSimpleToast";
import LabelSelectOptionsID   from "@/components/label/LabelSelectOptionsID";
import LabelCheckbox          from "@/components/label/LabelCheckbox";
import FilterButtons          from "@/components/button/FilterButtons";
import { InfoTable }          from "@/components/table/InfoTable";
import LabelInput             from "@/components/label/LabelInput";
import LabelSelectOptions     from "@/components/label/LabelSelectOptions";
import { 
  useAllOpearatingSystemsFromCluster,
  useClustersFromDataCenter,
  useCpuProfilesFromCluster,
  useVmFromVMWare,
  qpAllActiveDomainsFromDataCenter,
  useCdromFromDataCenter,
  useAllVnicsFromCluster,
} from "@/api/RQHook";
import {
  handleSelectIdChange
} from "@/components/label/HandleInput";
import { 
  emptyIdNameVo,
  useSelectFirstItemEffect,
  useSelectFirstNameItemEffect
} from "@/util";
import Localization           from "@/utils/Localization";

const VmImportRender2Modal = ({ 
  baseUrl,
  sessionId,
  dataCenterVo,
  targetVMs=[],
  onConfigChange
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

  const [nicList, setNicList] = useState([]);

  const [vmConfigs, setVmConfigs] = useState({});

  const {
    data: vmDetailsMap = {},
    isLoading: isVmDetailsLoading
  } = useVmFromVMWare({ baseUrl, sessionId, vmIds: targetVMs.map(vm => vm.vm).join(",") } );

  const {
    data: domains = [],
    isLoading: isStorageDomainsLoading,
    isSuccess: isStorageDomainsSuccess,
  } = qpAllActiveDomainsFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));

  const {
    data: clusters = [],
    isLoading: isClustersLoading,
    isSuccess: isClustersSuccess,
  } = useClustersFromDataCenter(dataCenterVo?.id, (e) => ({...e,}));

  const { 
    data: cpuProfiles = [], 
    isLoading: isCpuProfilesLoading,
    isSuccess: isCpuProfilesSuccess,
  } = useCpuProfilesFromCluster(clusterVo?.id, (e) => ({ ...e }));

  const { 
    data: isos = [], 
    isLoading: isIsoLoading 
  } = useCdromFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));

  const { 
    data: osList = [], 
    isLoading: isOsListLoading,
    isSuccess: isOsListSuccess,
  } = useAllOpearatingSystemsFromCluster(clusterVo.id, (e) => ({ ...e }));

  const { 
    data: vnics = [], 
    isLoading: isNicsLoading 
  } = useAllVnicsFromCluster(clusterVo.id, (e) => ({ ...e }));
  
  
  const vmMapById = useMemo(() => {
    return Array.isArray(vmDetailsMap)
      ? Object.fromEntries(vmDetailsMap.map(vm => [vm.id, vm]))
      : {};
  }, [vmDetailsMap]);
  
  const selectedVm = vmMapById[selectedId];
  console.log("$ vmDetailsMap", vmDetailsMap); // TODO: 필요없으면 제거

  // 첫번째 항목으로 지정
  useSelectFirstItemEffect(domains, setDomainVo);
  useSelectFirstNameItemEffect(clusters, setClusterVo, "Default");
  useSelectFirstItemEffect(cpuProfiles, setCpuProfileVo);
  useSelectFirstItemEffect(isos, setVirtioVo);

  useEffect(() => {
    const config = {
      vmConfigs,
      domainVo,
      clusterVo,
      cpuProfileVo,
      virtioVo,
    };
    onConfigChange?.(config);
  }, [vmConfigs, domainVo, clusterVo, cpuProfileVo, virtioVo]);
  
  useEffect(() => {
    if (osList.length > 0 && !osSystem) {
      setOsSystem(osList[0].name);
    }
  }, [osList]);

  // 자동감지 설정
  // 우선 백엔드에서 무조건 씬으로 지정되게 해뒀음
  useEffect(() => {
    if (!sparsd && sparseList.length > 0) {
      setSparsd(sparseList[0].value);
    }
  }, [sparsd]);

  // 값 넘기기
  useEffect(() => {
    const newConfigs = {};
    for (const vm of Object.values(vmDetailsMap)) {
      const nicList = Object.entries(vm.nics || {}).map(([nicKey, nic], idx) => {
        const defaultVnic = vnics.find(n => n.name === "ovirtmgmt") || vnics[0];

        return {
          id: nicKey,
          name: `nic${idx + 1}`,
          vnicProfileVo: { id: defaultVnic?.id || "" },
          macAddress: nic.macAddress,
          type: nic.type,
          sourceNetworkName: nic.backing?.networkName || "-"
        };
      });

      newConfigs[vm.id] = {
        id: vm?.identity?.biosUuid,
        name: vm.name,
        osSystem: osList[0]?.name || "",
        nicList,
        clusterVo: clusterVo,
        cpuProfileVo: cpuProfileVo,
        storageDomainVo: domainVo,
        cdRomVo: virtioChecked ? virtioVo : { id: "" },
      };
    }
    setVmConfigs(newConfigs);
  }, [vmDetailsMap, osList, vnics]); // ← 중요: vnics 의존성 추가

  const updateVmConfig = (vmId, field, value) => {
    setVmConfigs(prev => ({
      ...prev,
      [vmId]: { ...prev[vmId], [field]: value }
    }));
  };

  const updateVmNic = (vmId, nicId, vnicProfileId) => {
    setVmConfigs(prev => {
      const targetVm = prev[vmId];
      if (!targetVm) return prev;

      const updatedNicList = targetVm.nicList.map(nic =>
        nic.id === nicId
          ? { ...nic, vnicProfileVo: { id: vnicProfileId }}
          : nic
      );

      return {
        ...prev,
        [vmId]: { ...targetVm, nicList: updatedNicList }
      };
    });
  };


  const generalInfoRows = (vwvm) => [
    { 
      label: Localization.kr.NAME, 
      value: 
        <LabelInput
          value={vmConfigs[selectedId]?.name || ""}
          onChange={(e) => updateVmConfig(selectedId, "name", e.target.value)}
        />
    }, {
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
      {isVmDetailsLoading ? (
        <div>{Localization.kr.VM} 정보를 불러오는 중...</div>
      ) : (
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
                onChange={(checked) => setVirtioChecked(checked)}
              />
              <LabelSelectOptionsID label="" value={virtioVo.id}
                options={isos}
                disabled={!virtioChecked} 
                onChange={handleSelectIdChange(setVirtioVo, isos, validationToast)}
              />
            </div>
            <LabelSelectOptionsID label={Localization.kr.CPU_PROFILE}
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
                {Object.entries(vmDetailsMap || {}).map(([index, vm]) => (
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
                {activeFilter === "network" && (
                  <div className="mt-2">
                    <div className="section-table-outer w-full mb-2">
                      <table className="custom-table w-full" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                        <thead style={{ background: "#f5f5f5" }}>
                          <tr>
                            <th>{Localization.kr.NAME}</th>
                            <th>기존 {Localization.kr.NETWORK} {Localization.kr.NAME}</th>
                            <th>{Localization.kr.VNIC_PROFILE} {Localization.kr.NAME}</th>
                            <th>유형</th>
                            <th>MAC</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(vmConfigs[selectedId]?.nicList || []).map((nic, idx) => (
                            <tr key={nic.id}>
                              <td>{nic.name}</td>
                              <td>{nic.sourceNetworkName}</td>
                              <td>
                                <LabelSelectOptionsID
                                  value={nic.vnicProfileVo?.id || ""}
                                  options={vnics.map(opt => ({
                                    id: opt.id,
                                    name: `${opt.name} [${Localization.kr.NETWORK}: ${opt.networkVo?.name || ""}]`
                                  }))}
                                  onChange={(opt) => updateVmNic(selectedId, nic.id, opt.id)}
                                />
                                <span>1 {nic.vnicProfileVo?.id}</span>
                              </td>
                              <td>{nic.type === "VMXNET3" ? "VirtIO" : nic.type}</td>
                              <td>{nic.macAddress}</td>
                            </tr>
                          ))}
                          {/* {Object.entries(selectedVm?.nics || {}).map(([nicKey, nic], idx) => {
                            return (
                              <tr key={nicKey}>
                                <td>nic{idx + 1}</td>
                                <td>{nic.backing?.networkName || "-"}</td>
                                <td>
                                  <LabelSelectOptionsID
                                    value={vmConfigs[selectedId]?.vnic?.[nicKey] || ""}
                                    options={vnics.map(opt => ({
                                      id: opt.id,
                                      name: `${opt.name} [${Localization.kr.NETWORK}: ${opt.networkVo?.name || ""}]`
                                    }))}
                                    onChange={(opt) => updateVmNic(selectedId, nicKey, opt.id)}
                                  />
                                  <span>1 {vmConfigs[selectedId]?.vnic?.[nicKey]}</span>
                                </td>
                                <td>{nic.type === "VMXNET3" ? "VirtIO" : nic.type}</td>
                                <td>{nic.macAddress}</td>
                              </tr>
                            );
                          })} */}
                        </tbody>
                      </table>
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
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default VmImportRender2Modal;

const sparseList = [
  // { value: "auto", label: "자동감지" },
  { value: "true", label: Localization.kr.THIN_PROVISIONING },
  // { value: "false", label: Localization.kr.PREALLOCATED },
];

const filterOptions = [
  { key: "general", label: Localization.kr.GENERAL },
  { key: "network", label: Localization.kr.NICS },
  { key: "disk", label: Localization.kr.DISK },
];