import React, { useState } from "react";
import LabelSelectOptionsID from "@/components/label/LabelSelectOptionsID";
import LabelCheckbox from "@/components/label/LabelCheckbox";
import FilterButtons from "@/components/button/FilterButtons";
import { InfoTable } from "@/components/table/InfoTable";
import LabelInputNum from "@/components/label/LabelInputNum";
import LabelSelectOptions from "@/components/label/LabelSelectOptions";
import Logger from "@/utils/Logger";

const VmImportRender2Modal = ({ targetVMs = [], virtioChecked, setVirtioChecked }) => {
  const [activeFilter, setActiveFilter] = useState("general");
  const [selectedId, setSelectedId] = useState(null);
  const [formSystemState, setFormSystemState] = useState({
    memorySize: "",
    memoryMax: "",
    memoryGuaranteed: "",
    cpuTopologyCnt: "",
    cpuTopologySocket: "",
    cpuTopologyCore: "",
    cpuTopologyThread: "",
  });

  const sampleData = [
    {
      id: 1,
      name: "sample-vm",
      clone: true,
      source: "VMware",
      memory: "8192 MB",
      cpu: 4,
      arch: "x86_64",
      disk: 2,
      os: "CentOS 7.9",
      description: "Test VM",
      usb: true,
    },
    {
      id: 2,
      name: "another-vm",
      clone: false,
      source: "VMware",
      memory: "4096 MB",
      cpu: 2,
      arch: "x86_64",
      disk: 1,
      os: "Ubuntu 20.04",
      description: "Dev VM",
      usb: false,
    }
  ];

  const vms = targetVMs.length > 0 ? targetVMs : sampleData;
  const selectedVm = vms.find(vm => vm.id === selectedId); 

  const generalInfoRows1 = (vm) => [
    { label: "이름", value: vm.name },
    { label: "운영 시스템", value: vm.os || "Other OS" },
    { label: "설명", value: vm.description || "없음" },
    { label: "템플릿", value: vm.template || "해당 없음" },
  ];

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    Logger.debug(`handleInputChange ... field: ${field}, value: ${value}`);
    setFormSystemState((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "memorySize") {
        const parsed = parseInt(value);
        if (!isNaN(parsed)) {
          updated.memoryMax = parsed * 4;
          updated.memoryGuaranteed = parsed;
        } else {
          updated.memoryMax = "";
          updated.memoryGuaranteed = "";
        }
      }
      return updated;
    });
  };

  const handleCpuChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value <= 0) return;
    setFormSystemState(prev => ({
      ...prev,
      cpuTopologyCnt: value,
      cpuTopologySocket: value,
      cpuTopologyCore: 1,
      cpuTopologyThread: 1
    }));
  };

  const generateOptions = (total) => {
    const res = [];
    for (let i = 1; i <= total; i++) {
      if (total % i === 0) res.push({ value: i, label: i.toString() });
    }
    return res;
  };

  const handleSocketChange = (e) => {
    const socket = parseInt(e.target.value);
    const cnt = formSystemState.cpuTopologyCnt;
    if (!cnt || isNaN(socket)) return;
    const core = cnt / socket;
    const thread = 1;
    setFormSystemState(prev => ({
      ...prev,
      cpuTopologySocket: socket,
      cpuTopologyCore: core,
      cpuTopologyThread: thread
    }));
  };

  const handleCorePerSocketChange = (e) => {
    const core = parseInt(e.target.value);
    const cnt = formSystemState.cpuTopologyCnt;
    if (!cnt || isNaN(core)) return;
    const socket = cnt / core;
    const thread = 1;
    setFormSystemState(prev => ({
      ...prev,
      cpuTopologySocket: socket,
      cpuTopologyCore: core,
      cpuTopologyThread: thread
    }));
  };

  const handleThreadPerCoreChange = (e) => {
    const thread = parseInt(e.target.value);
    const cnt = formSystemState.cpuTopologyCnt;
    if (!cnt || isNaN(thread)) return;
    const socket = 1;
    const core = cnt / thread;
    setFormSystemState(prev => ({
      ...prev,
      cpuTopologySocket: socket,
      cpuTopologyCore: core,
      cpuTopologyThread: thread
    }));
  };

  return (
    <>
      <div className="vm-impor-outer">
        <LabelSelectOptionsID label="스토리지 도메인" />
        <LabelSelectOptionsID label="할당 정책" />
        <LabelSelectOptionsID label="대상 클러스터" />
        <div className="f-start items-center gap-2">
          <LabelCheckbox
            id="virtio"
            label="VirtIO 드라이버 연결"
            checked={virtioChecked}
            onChange={(e) => setVirtioChecked(e.target.checked)}
          />
          <LabelSelectOptionsID disabled={!virtioChecked} />
        </div>
        <LabelSelectOptionsID label="CPU 프로파일" />
      </div>

      <div className="section-table-outer w-full mb-2">
        <table className="custom-table w-full" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead style={{ background: "#f5f5f5" }}>
            <tr>
              <th style={{width:'40px'}}>복제</th>
              <th>이름</th>
              <th>소스</th>
              <th>메모리</th>
              <th>CPU</th>
              <th>아키텍처</th>
              <th>디스크</th>
            </tr>
          </thead>
          <tbody>
            {vms.map(vm => (
              <tr key={vm.id} onClick={() => setSelectedId(vm.id)} style={{ backgroundColor: selectedId === vm.id ? "#e5f1ff" : "white", cursor: "pointer" }}>
                <td style={{ textAlign: "center" }}><input type="checkbox" checked={vm.clone} readOnly /></td>
                <td>{vm.name}</td><td>{vm.source}</td><td>{vm.memory}</td><td>{vm.cpu}</td><td>{vm.arch}</td><td>{vm.disk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="vm-import-detail-box mb-3">
        {selectedVm && (
          <>
            <div className="mb-2">
              <FilterButtons
                options={[{ key: "general", label: "일반" }, { key: "network", label: "네트워크" }, { key: "disk", label: "디스크" }]}
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
                    <LabelInputNum id="mem" label="메모리 크기(MB)" value={formSystemState.memorySize} onChange={handleInputChange("memorySize")} />
                    <LabelInputNum id="mem-max" label="최대 메모리(MB)" value={formSystemState.memoryMax} onChange={handleInputChange("memoryMax")} />
                    <LabelInputNum id="mem-actual" label="할당할 실제 메모리(MB)" value={formSystemState.memoryGuaranteed} onChange={handleInputChange("memoryGuaranteed")} />
                    <LabelInputNum id="cpu-total" label="총 가상 CPU" value={formSystemState.cpuTopologyCnt} onChange={handleCpuChange} />
                    <LabelSelectOptions id="virtual_socket" label="가상 소켓" value={formSystemState.cpuTopologySocket} options={generateOptions(formSystemState.cpuTopologyCnt)} onChange={handleSocketChange} />
                    <LabelSelectOptions id="core_per_socket" label="가상 소켓 당 코어" value={formSystemState.cpuTopologyCore} options={generateOptions(formSystemState.cpuTopologyCnt)} onChange={handleCorePerSocketChange} />
                    <LabelSelectOptions id="thread_per_core" label="코어당 스레드" value={formSystemState.cpuTopologyThread} options={generateOptions(formSystemState.cpuTopologyCnt)} onChange={handleThreadPerCoreChange} />
                  </div>
                </div>
              )}
              {activeFilter === "network" && (
                <div className="mt-2">
                  <div className="section-table-outer w-full mb-2">
                    <table className="custom-table w-full" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                      <thead style={{ background: "#f5f5f5" }}>
                        <tr>
                          <th style={{width:'40px'}}></th>
                          <th>이름</th>
                          <th>기존 네트워크 이름</th>
                          <th>유형</th>
                          <th>MAC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {["nic1", "nic2", "nic3", "nic4"].map((nic, idx) => (
                          <tr key={nic}>
                            {/* 체크박스 셀 */}
                            <td>
                              <input type="checkbox" />
                            </td>
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
              {activeFilter === "disk" && (
                <div className="mt-2">
                  <div className="section-table-outer w-full mb-2">
                    <table className="custom-table w-full" border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
                      <thead style={{ background: "#f5f5f5" }}>
                        <tr>
                          <th>경로</th><th>가상 크기</th><th>실제 크기</th>
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
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VmImportRender2Modal;