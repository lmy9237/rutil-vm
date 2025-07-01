import React, { useState } from "react";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "@/components/modal/BaseModal";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import LabelInput                       from "@/components/label/LabelInput";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import {
  useAllDataCenters, useAllNetworkProviders
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import "./MVm.css";
import LabelSelectOptionsID from "@/components/label/LabelSelectOptionsID";
import { useValidationToast } from "@/hooks/useSimpleToast";
import { handleSelectIdChange } from "@/components/label/HandleInput";
import TablesOuter from "@/components/table/TablesOuter";
import TableColumnsInfo from "@/components/table/TableColumnsInfo";


const VmImportModal = ({ 
  isOpen,
  onClose,
  onSubmit
}) => {
  const { validationToast } = useValidationToast();
  const { 
    networkProvidersSelected, setNetworkProvidersSelected,
    datacentersSelected, setDatacentersSelected,
  } = useGlobal()

  const {
    data: datacenters,
    isLoading: isDatacentersLoading,
  } = useAllDataCenters()

const transformedDatacenters = [
  { value: "none", label: Localization.kr.NOT_ASSOCIATED },
  ...(!Array.isArray(datacenters) ? [] : datacenters).map((dc) => ({
    value: dc?.id,
    label: dc?.name
  }))
];


  const {
    data: networkProviders = [],
    isLoading: isNetworkProviders
  } = useAllNetworkProviders();


const transformedNetorkProviders = [
  { value: "none", label: Localization.kr.NOT_ASSOCIATED },
  ...networkProviders.map((p) => ({
    value: p?.id,
    label: p?.name
  }))
];

/*표 */
const [sourceVMs, setSourceVMs] = useState([
  { id: 1, name: "vm-centos-01", selected: false },
  { id: 2, name: "vm-ubuntu-test", selected: false },
]);

const [targetVMs, setTargetVMs] = useState([]);
const toggleSelect = (id, type) => {
  if (type === "source") {
    setSourceVMs(prev =>
      prev.map(vm =>
        vm.id === id ? { ...vm, selected: !vm.selected } : vm
      )
    );
  } else if (type === "target") {
    setTargetVMs(prev =>
      prev.map(vm =>
        vm.id === id ? { ...vm, selected: !vm.selected } : vm
      )
    );
  }
};
const moveToTarget = () => {
  const selected = sourceVMs.filter(vm => vm.selected);
  setSourceVMs(sourceVMs.filter(vm => !vm.selected));
  setTargetVMs(prev => [...prev, ...selected.map(vm => ({ ...vm, selected: false }))]);
};

const moveToSource = () => {
  const selected = targetVMs.filter(vm => vm.selected);
  setTargetVMs(targetVMs.filter(vm => !vm.selected));
  setSourceVMs(prev => [...prev, ...selected.map(vm => ({ ...vm, selected: false }))]);
};
const [selectAllSource, setSelectAllSource] = useState(false);
const [selectAllTarget, setSelectAllTarget] = useState(false);
const handleSelectAll = (type) => {
  if (type === "source") {
    const newState = !selectAllSource;
    setSelectAllSource(newState);
    setSourceVMs(prev => prev.map(vm => ({ ...vm, selected: newState })));
  } else {
    const newState = !selectAllTarget;
    setSelectAllTarget(newState);
    setTargetVMs(prev => prev.map(vm => ({ ...vm, selected: newState })));
  }
};
    const [virtioChecked, setVirtioChecked] = useState(false); // ← 체크 상태 저장
    
/* */
  const [step, setStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState("VMware");

  const [vcenter, setVcenter] = useState("");
  const [vcDataCenter, setVcDataCenter] = useState("");
  const [username, setUsername] = useState("");
  const [esxi, setEsxi] = useState("");
  const [cluster, setCluster] = useState("");
  const [password, setPassword] = useState("");
  const [authHostChecked, setAuthHostChecked] = useState(false);

 const isNextDisabled = step === 1 && targetVMs.every(vm => !vm.selected);//선택된 데이터가 없을 때 footer '다음'버튼 비활성화

  const goNext = () => setStep((prev) => prev + 1);
  const goPrev = () => setStep((prev) => prev - 1);
  const renderStep1 = () => (
    <>
      <div className="vm-import-form-grid">
        <div className="vm-impor-outer">
        <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}/>

        </div>
        <div className="vm-impor-outer">
          <LabelSelectOptionsID label={'소스'}/>
          <LabelSelectOptionsID label={'외부 공급자'}/>
        </div>
        <hr/>
        <div className="vm-impor-outer">
          <LabelInput label="vCenter" id="vcenter" value={vcenter} onChange={(e) => setVcenter(e.target.value)} />
          <LabelInput label="ESXi" id="esxi" value={esxi} onChange={(e) => setEsxi(e.target.value)} />
          <LabelInput label="데이터 센터" id="vcDataCenter" value={vcDataCenter} onChange={(e) => setVcDataCenter(e.target.value)} />
          <LabelInput label="클러스터" id="cluster" value={cluster} onChange={(e) => setCluster(e.target.value)} />
          <LabelInput label="사용자 이름" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <LabelInput label="암호" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

      </div>
      <div className="vm-impor-outer">
        <LabelSelectOptionsID label={'프록시 호스트'}/>
      </div>

      <button className="instance-disk-btn ml-0 mb-3">로드</button>

  
      <div className="vm-import-list-outer f-btw mb-4">
        {/* 좌측 패널 */}
        <div className="vm-import-panel vm-import-source">
          <div className="vm-import-panel-title">소스 상의 가상 머신</div>
          <table className="vm-import-table">
            {/* <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={sourceVMs.length > 0 && sourceVMs.every(vm => vm.selected)}
                    onChange={() => handleSelectAll("source")}
                  />
                </th>
                <th>이름</th>
              </tr>
            </thead> */}
            <tbody>
              {sourceVMs.map(vm => (
                <tr key={vm.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={vm.selected}
                      onChange={() => toggleSelect(vm.id, "source")}
                    />
                  </td>
                  <td>{vm.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 중앙 버튼 */}
        <div className="vm-import-arrows">
          <button className="vm-import-arrow-btn mb-2" onClick={moveToTarget}>&rarr;</button>
          <button className="vm-import-arrow-btn" onClick={moveToSource}>&larr;</button>
        </div>

        {/* 우측 패널 */}
        <div className="vm-import-panel vm-import-target">
          <div className="vm-import-panel-title">가져오기할 가상 머신</div>
          <table className="vm-import-table">
      {/* <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={targetVMs.length > 0 && targetVMs.every(vm => vm.selected)}
              onChange={() => handleSelectAll("target")}
            />
          </th>
          <th>이름</th>
        </tr>
      </thead> */}
            <tbody>
              {targetVMs.map(vm => (
                <tr key={vm.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={vm.selected}
                      onChange={() => toggleSelect(vm.id, "target")}
                    />
                  </td>
                  <td>{vm.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* <div className="vm-import-table">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>이름</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="checkbox" defaultChecked /></td>
              <td>CentOS 7-1908 Minimum</td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>CentOS 7.9</td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>CentOS 7.9 Stream - LIS</td>
            </tr>
          </tbody>
        </table>
      </div> */}
    </>
  );

const renderStep2 = () => {

  //임시데이터
  const importTableData = targetVMs.map((vm) => ({
    id: vm.id,
    clone: <input type="checkbox" />,
    name: vm.name,
    source: "VMware",
    memory: "16384 MB",
    cpu: 4,
    arch: "x86_64",
    disk: 1
  }));

  return (
    <>
      {/* 왼쪽 컬럼 */}
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
          <LabelSelectOptionsID  disabled={!virtioChecked} />
        </div>
        <LabelSelectOptionsID label="CPU 프로파일" />
      </div>

      <TablesOuter
        target="vm-import"
        columns={TableColumnsInfo.GET_IMPORT_VMS}
        data={importTableData}
        showSearchBox={false}
      />
    </>
  );
};


  return (
    <BaseModal 
      targetName={`${Localization.kr.VM}`} 
      submitTitle={Localization.kr.IMPORT}
      isOpen={isOpen} onClose={onClose}
      onSubmit={step === 2 ? onSubmit : goNext}
      contentStyle={{ width: "1000px" }}
      extraFooter={
        step === 2 ? (
          <>
            <button className="back-button" onClick={goPrev}>뒤로</button>
            <button className="action" onClick={onSubmit}>ok</button>
          </>
        ) : (
          <button className="action" onClick={goNext} disabled={isNextDisabled}>다음</button>
        )
      }
    >
      {step === 1 ? renderStep1() : renderStep2()}
    </BaseModal>
  );
};

export default VmImportModal;
