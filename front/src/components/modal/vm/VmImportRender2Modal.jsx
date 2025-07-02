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

  const generalInfoRows = (vm) => [
    { label: "이름", value: vm.name },
    { label: "운영 체제", value: vm.os },
    { label: "설명", value: vm.description },
    { label: "메모리", value: vm.memory },
    { label: "CPU", value: vm.cpu },
    { label: "USB", value: vm.usb ? "활성화" : "비활성화" },
    { label: "아키텍처", value: vm.arch },
    { label: "디스크 수", value: vm.disk },
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
        {/* 탭 및 상세 정보 (선택된 항목이 있을 때만 표시) */}
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
                <div className="get-template-info f-btw three-columns">
                    <InfoTable tableRows={generalInfoRows(selectedVm)} />
                </div>
                )}
                {activeFilter === "network" && (
                <div className="mt-2">네트워크 어댑터 정보 없음</div>
                )}
                {activeFilter === "disk" && (
                <div className="mt-2">디스크 정보 없음</div>
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
