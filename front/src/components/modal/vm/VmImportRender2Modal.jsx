import React, { useState, useEffect } from "react";
import LabelSelectOptionsID from "@/components/label/LabelSelectOptionsID";
import LabelCheckbox from "@/components/label/LabelCheckbox";
import FilterButtons from "@/components/button/FilterButtons";
import { InfoTable } from "@/components/table/InfoTable";
import LabelSelectOptions from "@/components/label/LabelSelectOptions";
import Localization from "@/utils/Localization";
import { emptyIdNameVo } from "@/util";
import { useAllOpearatingSystemsFromCluster, useVmFromVMWare } from "@/api/RQHook";
import LabelInput from "@/components/label/LabelInput";
import { useValidationToast } from "@/hooks/useSimpleToast";
import { handleSelectIdChange } from "@/components/label/HandleInput";

const VmImportRender2Modal = ({ 
  baseUrl,
  sessionId,
  targetVMs=[],
  domains,
  clusters,
  virtioChecked, 
  setVirtioChecked 
}) => {
  const { validationToast } = useValidationToast();
  const [activeFilter, setActiveFilter] = useState("general");

  const [selectedId, setSelectedId] = useState(null);
  const [domainVo, setDomainVo] = useState(emptyIdNameVo());
  const [clusterVo, setClusterVo] = useState(emptyIdNameVo());
  const [cpuProfileVo, setCpuProfileVo] = useState(emptyIdNameVo());
  const [sparsd, setSparsd] = useState();

  const [name, setName] = useState("");
  const [detailedVMs, setDetailedVMs] = useState([]);

  const { 
    data: vmDetailsMap = {} 
  } = useVmFromVMWare({
    baseUrl,
    sessionId,
    vmIds: targetVMs.map(vm => vm.vm).join(","),
  });
  const { 
    data: osList = [], 
    isLoading: isOsListLoading
  } = useAllOpearatingSystemsFromCluster(clusterVo.id, (e) => ({ ...e }));

  
  const selectedVm = vmDetailsMap?.[selectedId];

  useEffect(() => {
    
  }, []);

  useEffect(() => {
    console.log("$ targetVMs", targetVMs);
  }, [targetVMs]);

  useEffect(() => {
    console.log("$ vmDetailsMap", vmDetailsMap);
  }, [vmDetailsMap]);


  const generalInfoRows = (vwvm) => [
    { 
      label: Localization.kr.NAME, 
      value: 
        <LabelInput id="name"
          autoFocus
          value={vwvm?.name}
          // onChange={handleInputChange(setFormState, "name", validationToast)}
        />
    },
    {
      label: Localization.kr.OPERATING_SYSTEM,
      value: 
        <LabelSelectOptionsID
          // value={vwvm?.guestOS}
          options={osList.map((opt) => ({ id: opt.name, name: opt.description }))}
          // onChange={handleSelectIdChange(setDomainVo, domains, validationToast)}
        />
    },
    // { label: Localization.kr.DESCRIPTION, value: vwvm?.description || "-" },
    { label: `${Localization.kr.VM} ID`, value: vwvm?.identity?.biosUuid || "-" },
    { label: "메모리 (MB)", value: `${vwvm?.memory?.sizeMiB}  MB` || "-" },
    { label: "CPU 코어수", value: `${vwvm?.cpu?.count} (${vwvm?.cpu?.count}:${vwvm?.cpu?.coresPerSocket}:1)` || "-" },
    { label: "디스크 수", value: Object.keys(vwvm?.disks || {}).length },
    { label: "NIC 수", value: Object.keys(vwvm?.nics || {}).length },
  ];

  const diskInfoRows = (vwvm) => [
    { label: "", value: vwvm.v || "-" },
    { label: "", value: vwvm.v || "-" },
    { label: "", value: vwvm.v || "-" },
  ];


  return (
    <>
      <div className="vm-impor-outer">
        <LabelSelectOptionsID label={Localization.kr.DOMAIN}
          options={domains}
          value={domainVo.id}
          onChange={handleSelectIdChange(setDomainVo, domains, validationToast)}
        />
        <LabelSelectOptions id="sparse" label={Localization.kr.SPARSE}
            // value={sparse}
            // onChange={(e) => setFormState((prev) => ({...prev, sparse: e.target.value === "true"}))}
            options={sparseList}
        />
        <LabelSelectOptionsID label={`대상 ${Localization.kr.CLUSTER}`}
          options={clusters}
          value={clusterVo.id}
          onChange={handleSelectIdChange(setClusterVo, clusters, validationToast)}
        />
        <div className="f-start items-center gap-2">
          <LabelCheckbox id="virtio" label="VirtIO 드라이버 연결"
            checked={virtioChecked}
            onChange={(e) => setVirtioChecked(e.target.checked)}
          />
          <LabelSelectOptionsID disabled={!virtioChecked} />
        </div>
        <LabelSelectOptionsID label="CPU 프로파일" 
          // options={}
          // value={cpuProfileVo.id}
          // onChange={handleSelectIdChange(setCpuProfileVo, domains, validationToast)}
        />
      </div>

      <div className="section-table-outer w-full mb-2">
        <table className="custom-table w-full" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead style={{ background: "#f5f5f5" }}>
            <tr>
              {/* <th style={{ width: '40px' }}></th> */}
              <th>{Localization.kr.NAME}</th>
              <th>소스</th>
              <th>{Localization.kr.MEMORY}</th>
              <th>CPU</th>
              <th>아키텍처</th>
              <th>{Localization.kr.DISK}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(vmDetailsMap).map(([vmId, vm]) => (
              <tr key={vm?.name} 
                onClick={() => setSelectedId(vmId)}
                style={{ 
                  backgroundColor: selectedId === vm?.name ? "#e5f1ff" : "white", 
                  cursor: "pointer" 
                }}
              >
                {/* <td style={{ textAlign: "center" }}>
                  <input type="checkbox" 
                    checked={ false} 
                    readOnly 
                  />
                </td> */}
                <td>{vm?.name}</td>
                <td>VMware</td>
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

      <div className="vm-import-detail-box mb-3">
        {selectedVm && (
          <>
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
                          <th>유형</th>
                          <th>MAC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(selectedVm?.nics || {}).map((nic, idx) => (
                          <tr key={idx}>
                            <td>{nic.label}</td>
                            <td>{nic.backing?.networkName || "-"}</td>
                            <td>{nic.type}</td>
                            <td>{nic.macAddress}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
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