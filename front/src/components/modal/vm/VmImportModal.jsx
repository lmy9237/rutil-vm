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
import VmImportRender2Modal from "./VmImportRender2Modal";


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
    const vmToMove = sourceVMs.find(vm => vm.id === id);
    if (!vmToMove) return;

    // ✅ 먼저 오른쪽으로 옮긴 후, 체크는 유지된 상태
    setSourceVMs(prev => prev.filter(vm => vm.id !== id));
    setTargetVMs(prev => [...prev, { ...vmToMove, selected: true }]); // ✔ 유지

  } else if (type === "target") {
    const vmToMove = targetVMs.find(vm => vm.id === id);
    if (!vmToMove) return;

    // ✅ 왼쪽으로 옮긴 후, 체크는 해제된 상태로
    setTargetVMs(prev => prev.filter(vm => vm.id !== id));
    setSourceVMs(prev => [...prev, { ...vmToMove, selected: false }]); // ✔ 해제
  }
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
          <div className="dd">
            <div className="section-table-outer w-full mb-2 ">
              <table className="vm-import-table">
                <thead>
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
                </thead>
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
          </div>
        </div>


        {/* 우측 패널 */}
        <div className="vm-import-panel vm-import-target">
          <div className="vm-import-panel-title">가져오기할 가상 머신</div>
          <div className="dd">
            <div className="section-table-outer w-full mb-2">
              <table className="vm-import-table">
                <thead>
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
                </thead>
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
        </div>
      </div>
    </>
  );

  const renderStep2 = () => (
    <VmImportRender2Modal
      targetVMs={targetVMs}
      virtioChecked={virtioChecked}
      setVirtioChecked={setVirtioChecked}
    />
  );


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
