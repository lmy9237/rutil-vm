import React, { useState } from "react";
import LabelSelectOptionsID from "@/components/label/LabelSelectOptionsID";
import LabelCheckbox from "@/components/label/LabelCheckbox";
import FilterButtons from "@/components/button/FilterButtons";
import { InfoTable } from "@/components/table/InfoTable";

const VmImportRender2Modal = ({ targetVMs = [], virtioChecked, setVirtioChecked }) => {
  const [activeFilter, setActiveFilter] = useState("general");
  const [selectedId, setSelectedId] = useState(null); // 기본 null → 아무것도 선택 안 된 상태

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
    { label: "비디오 유형", value: vm.video || "해당 없음" },
    { label: "우선 순위", value: vm.priority || "낮음" },
    { label: "설정된 메모리", value: vm.memory },
    { label: "최적화 옵션", value: vm.optimizedFor || "서버" },
  ];

  const generalInfoRows2 = (vm) => [
    { label: "할당할 실제 메모리", value: vm.memory || "16384 MB" },
    { label: "CPU 코어 수", value: vm.cpuTopology || `${vm.cpu} (4:1:1)` },
    { label: "게스트 CPU 수", value: vm.guestCpu || "해당 없음" },
    { label: "모니터 수", value: vm.monitors || "1" },
    { label: "USB", value: vm.usb ? "활성화됨" : "비활성화됨" },
    { label: "소스", value: vm.source || "VMware" },
    { label: "실행 호스트", value: vm.hostInCluster || "클러스터 내의 호스트" },
    { label: "사용자 정의 속성", value: vm.userAttrs || "설정되지 않음" },
  ];

  const generalInfoRows3 = (vm) => [
    { label: "클러스터 호환 버전", value: vm.clusterVersion || "4.7" },
    { label: "가상 머신 ID", value: vm.uuid || "4217523a-cc3c-1ef3-9d0b-0a312051e715" },
  ];
  return (
    <>
      {/* 상단 설정 영역 */}
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

      {/* 리스트 테이블 */}
      <div className="section-table-outer w-full mb-2">
        <table
          className="custom-table w-full"
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead style={{ background: "#f5f5f5" }}>
            <tr>
              <th>복제</th>
              <th>이름</th>
              <th>소스</th>
              <th>메모리</th>
              <th>CPU</th>
              <th>아키텍처</th>
              <th>디스크</th>
            </tr>
          </thead>
          <tbody>
            {vms.map((vm) => (
              <tr
                key={vm.id}
                onClick={() => setSelectedId(vm.id)}
                style={{
                  backgroundColor: selectedId === vm.id ? "#e5f1ff" : "white",
                  cursor: "pointer",
                }}
              >
                <td style={{ textAlign: "center" }}>
                  <input type="checkbox" checked={vm.clone} readOnly />
                </td>
                <td>{vm.name}</td>
                <td>{vm.source}</td>
                <td>{vm.memory}</td>
                <td>{vm.cpu}</td>
                <td>{vm.arch}</td>
                <td>{vm.disk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="vm-import-detail-box mb-3">
        {selectedVm ? (
            <>
            <div className="mb-2">
              <FilterButtons
                options={[
                  { key: "general", label: "일반" },
                  { key: "network", label: "네트워크" },
                  { key: "disk", label: "디스크" },
                ]}
                activeOption={activeFilter}
                onClick={setActiveFilter}
              />
            </div>

            <div className="vm-detail-content">
              {activeFilter === "general" && (
                <div className="vm-import-render-tb f-btw h-[100px]">
                  <InfoTable tableRows={generalInfoRows1(selectedVm)} />
                  <InfoTable tableRows={generalInfoRows2(selectedVm)} />
                  <InfoTable tableRows={generalInfoRows3(selectedVm)} />
                </div>
              )}
              {activeFilter === "network" && (
                <div className="mt-2">
              <div className="section-table-outer w-full mb-2">
                <table
                  className="custom-table w-full"
                  border="1"
                  cellPadding="8"
                  style={{ borderCollapse: "collapse", width: "100%" }}
                >
                  <thead style={{ background: "#f5f5f5" }}>
                    <tr>
                      <th>이름</th>
                      <th>기존 네트워크 이름</th>
                      <th>네트워크 이름</th>
                      <th>프로파일 이름</th>
                      <th>유형</th>
                      <th>MAC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["nic1", "nic2", "nic3", "nic4"].map((nic, idx) => (
                      <tr key={nic}>
                        <td>{nic}</td>
                        <td>oVirt Network</td>
                        <td>
                          <select>
                            <option>ovirtmgmt</option>
                          </select>
                        </td>
                        <td>
                          <select>
                            <option>ovirtmgmt</option>
                          </select>
                        </td>
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
                    <table
                      className="custom-table w-full"
                      border="1"
                      cellPadding="8"
                      style={{ borderCollapse: "collapse", width: "100%" }}
                    >
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
            </div>
            </>
        ) : (
            <></>
        )}
      </div>
    </>
  );
};

export default VmImportRender2Modal;
