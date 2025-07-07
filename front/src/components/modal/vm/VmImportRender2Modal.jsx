import React, { useState, useEffect } from "react";
import LabelSelectOptionsID from "@/components/label/LabelSelectOptionsID";
import LabelCheckbox from "@/components/label/LabelCheckbox";
import FilterButtons from "@/components/button/FilterButtons";
import { InfoTable } from "@/components/table/InfoTable";
import LabelSelectOptions from "@/components/label/LabelSelectOptions";
import Localization from "@/utils/Localization";
import { emptyIdNameVo } from "@/util";
import { useAllOpearatingSystemsFromCluster } from "@/api/RQHook";
import { useQueries } from "@tanstack/react-query";
import ApiManager from "@/api/ApiManager";
import LabelInput from "@/components/label/LabelInput";
import { handleInputChange } from "@/components/label/HandleInput";

const VmImportRender2Modal = ({ 
  baseUrl,
  sessionId,
  targetVMs=[],
  domains,
  clusters,
  virtioChecked, 
  setVirtioChecked 
}) => {
  const [activeFilter, setActiveFilter] = useState("general");

  const [selectedId, setSelectedId] = useState(null);
  const [clusterVo, setClusterVo] = useState(emptyIdNameVo());
  const [detailedVMs, setDetailedVMs] = useState([]);

  const { 
    data: osList = [], 
    isLoading: isOsListLoading
  } = useAllOpearatingSystemsFromCluster(clusterVo.id, (e) => ({ ...e }));

  const vwvmQueries = useQueries({
    queries: targetVMs.map((vm) => ({
      queryKey: ['vmFromVMWare', vm.vm],
      queryFn: async () => {
        try {
          const vwvm = await ApiManager.findVmFromVMWare({
            baseUrl,
            sessionId,
            vmId: vm.vm
          });
          return vwvm.body || {};
        } catch (error) {
          console.error(`Error fetching vmware ${vm.vm}`, error);
          return {};
        }
      },
      enabled: !!baseUrl && !!sessionId && !!vm.vm,
    })),
  });

  useEffect(() => {
    if (targetVMs.length > 0 && selectedId === null) {
      setSelectedId(targetVMs[0].id);
    }
  }, [targetVMs, selectedId]);
  
  const detailedVmsMap = Object.fromEntries(
    vwvmQueries.map((q, idx) => [targetVMs[idx]?.vm, q.data])
  );

  const selectedVm = targetVMs.find(vm => vm.id === selectedId);
  const selectedDetail = detailedVmsMap[selectedVm?.vm];


  const generalInfoRows1 = (detail) => [
    { 
      label: Localization.kr.NAME, 
      value: 
        <LabelInput id="name"
          autoFocus
          value={detail.name}
          // onChange={handleInputChange(setFormState, "name", validationToast)}
        />
    },
    {
      label: Localization.kr.OPERATING_SYSTEM,
      value: 
        <LabelSelectOptionsID
          value={detail.guestOS}
          options={osList.map((opt) => ({ id: opt.name, name: opt.description }))}
        />
    },
    { label: Localization.kr.DESCRIPTION, value: detail.description || "-" },
    { label: `${Localization.kr.VM} ID`, value: detail.identity?.instanceUuid || "-" },
    { label: "메모리 (MB)", value: detail.memory?.sizeMiB || "-" },
    { label: "CPU 코어수", value: detail.cpu?.count || "-" },
    { label: "디스크 수", value: Object.keys(detail.disks || {}).length },
    { label: "NIC 수", value: Object.keys(detail.nics || {}).length },
  ];


  return (
    <>
      <div className="vm-impor-outer">
        <LabelSelectOptionsID label={Localization.kr.DOMAIN}
          options={domains}
          // value={}
          // onChange={}
        />
        <LabelSelectOptions id="sparse" label={Localization.kr.SPARSE}
            // value={sparse}
            // onChange={(e) => setFormState((prev) => ({...prev, sparse: e.target.value === "true"}))}
            options={sparseList}
        />
        <LabelSelectOptionsID label={`대상 ${Localization.kr.CLUSTER}`}
          options={clusters}
          // value={}
          // onChange={}
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
          // value={}
          // onChange={}
        />
        
      </div>

      <div className="section-table-outer w-full mb-2">
        <table className="custom-table w-full" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead style={{ background: "#f5f5f5" }}>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>{Localization.kr.NAME}</th>
              <th>소스</th>
              <th>{Localization.kr.MEMORY}</th>
              <th>CPU</th>
              <th>아키텍처</th>
              <th>{Localization.kr.DISK}</th>
            </tr>
          </thead>
          <tbody>
            {targetVMs.length > 0 ? (
              targetVMs.map(vm => (
                <tr key={vm.id} onClick={() => setSelectedId(vm.id)} style={{ backgroundColor: selectedId === vm.id ? "#e5f1ff" : "white", cursor: "pointer" }}>
                  <td style={{ textAlign: "center" }}>
                    <input type="checkbox" 
                      checked={vm.clone || false} 
                      readOnly 
                    />
                  </td>
                  <td>{vm.name}</td>
                  <td>VMware</td>
                  <td>{vm.memory} MB</td>
                  <td>{vm.cpu}</td>
                  <td>{vm.arch || "x86_64"}</td>
                  <td>{vm.disk || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  가져올 {Localization.kr.VM}이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
                    <InfoTable tableRows={generalInfoRows1(selectedVm)} />
                  </div>
                  <div>
                    {/* <LabelInputNum id="mem" label="메모리 크기(MB)" 
                    value={formSystemState.memorySize} onChange={handleInputChange("memorySize")} />
                    <LabelInputNum id="mem-max" label="최대 메모리(MB)" 
                    value={formSystemState.memoryMax} onChange={handleInputChange("memoryMax")} />
                    <LabelInputNum id="mem-actual" label="할당할 실제 메모리(MB)" 
                    value={formSystemState.memoryGuaranteed} onChange={handleInputChange("memoryGuaranteed")} />
                    <LabelInputNum id="cpu-total" label="총 가상 CPU" 
                    value={formSystemState.cpuTopologyCnt} onChange={handleCpuChange} />
                    <LabelSelectOptions id="virtual_socket" label="가상 소켓" 
                    value={formSystemState.cpuTopologySocket} options={generateOptions(formSystemState.cpuTopologyCnt)} onChange={handleSocketChange} />
                    <LabelSelectOptions id="core_per_socket" label="가상 소켓 당 코어" 
                    value={formSystemState.cpuTopologyCore} options={generateOptions(formSystemState.cpuTopologyCnt)} onChange={handleCorePerSocketChange} />
                    <LabelSelectOptions id="thread_per_core" label="코어당 스레드" 
                    value={formSystemState.cpuTopologyThread} options={generateOptions(formSystemState.cpuTopologyCnt)} onChange={handleThreadPerCoreChange} /> */}
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
                          <th>가상 크기</th>
                          <th>실제 크기</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>[datastore1] CentOS 7.9/CentOS 7.9.vmdk</td>
                          <td>200 GiB</td>
                          <td>4 GiB</td>
                        </tr>
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
                          <th>이름</th>
                          <th>기존 네트워크 이름</th>
                          <th>유형</th>
                          <th>MAC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {["nic1", "nic2", "nic3", "nic4"].map((nic, idx) => (
                          <tr key={nic}>
                            <td>{nic}</td>
                            <td>oVirt Network</td>
                            <td>VirtIO</td>
                            <td>{`00:50:56:97:${(idx * 0x2f + 0xfa).toString(16).padStart(2, "0")}`}</td>
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
  { value: "none", label: "자동감지" },
  { value: "true", label: "씬 프로비저닝" },
  { value: "false", label: "사전 할당" },
];

const filterOptions = [
  { key: "general", label: Localization.kr.GENERAL },
  { key: "disk", label: Localization.kr.DISK },
  { key: "network", label: Localization.kr.NICS },
];