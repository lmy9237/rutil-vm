import React, { useEffect, useState } from "react";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "@/components/modal/BaseModal";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import LabelInput                       from "@/components/label/LabelInput";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import {
  useAllDataCenters, useAllHosts, useAllNetworkProviders,
  useAllProviders,
  useAuthenticate4VMWare,
  useVmsFromVMWare,
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
  const [virtioChecked, setVirtioChecked] = useState(false); // ← 체크 상태 저장
  const [step, setStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState("VMware");
  const [vcenter, setVcenter] = useState("");
  const [vcDataCenter, setVcDataCenter] = useState("");
  const [username, setUsername] = useState("");
  const [esxi, setEsxi] = useState("");
  const [cluster, setCluster] = useState("");
  const [password, setPassword] = useState("");
  const [authHostChecked, setAuthHostChecked] = useState(false);
  const [selectedDatacenterId, setSelectedDatacenterId] = useState("");
  const [selectedHostId, setSelectedHostId] = useState("");

  // 데이터센터 목록
  const {
  data: datacenters = [],
    isLoading: isDatacentersLoading,
  } = useAllDataCenters()
  const transformedDatacenters = datacenters.map((dc) => ({
    value: dc?.id,
    label: dc?.name,
  }));

  // 외부 공급자목록 
  const {  
    data: providers = [],
    isLoading: isProvidersLoading, 
  } = useAllProviders((e) => ({ ...e  }));
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const selectedProvider = providers.find(p => p.id === selectedProviderId);

  const transformedProviders = providers.map((provider) => ({
    value: provider.id,
    label: provider.name,
  }));

  useEffect(() => {
    if (!selectedProvider || selectedProvider.providerType !== "vmware") return;
    const props = selectedProvider.providerPropertyVo || {};
    setVcenter(props.vcenter || "");
    setEsxi(props.esx || "");
    setVcDataCenter(props.dataCenter || "");
    setCluster(props.cluster || ""); // 필요 시 props.cluster가 있으면 세팅
    setUsername(selectedProvider.authUsername || "");
    // setPassword(selectedProvider.authPassword || "");
    setPassword("");
  }, [selectedProviderId]);

  const isAutoFillDisabled = !!selectedProvider;
  // 호스트 목록
  const {
    data: hosts = [],
    isLoading: isHostsLoading,
    isError: isHostsError
  } = useAllHosts((e) => ({ ...e }));
  
  const transformedHosts = hosts.map((host) => ({
    value: host.id,
    label: host.name
  }));

  // 로드버튼 클릭시 가상머신목록 불러오기
  const [sessionId, setSessionId] = useState(null);
  const {
    mutate: authenticate4VmWare,
  } = useAuthenticate4VMWare((res) => {
    setSessionId(res);    
  });

  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    refetch: refetchVms,
    isRefetching: isVmsRefetching,
  } = useVmsFromVMWare({ baseUrl: vcenter, sessionId: sessionId , mapPredicate: (e) => ({
    ...e,
    id:  e.vm || "",
    name: e.name,
    selected: false,
    memory: e.memorySizeMiB,
    cpu: e.cpuCount,
    powerState: e.powerState,
  })})

  // setSourceVMs(transformed);
  const handleLoadVMs = () => {
    if (!vcenter || !username || !password) {
      validationToast?.fail("vCenter, 사용자 이름, 암호를 모두 입력해주세요.");
      return;
    }

    Logger.debug("[handleLoadVMs] 인증 요청", {
      baseUrl: vcenter, username, password,
    });

    authenticate4VmWare({ baseUrl: vcenter, username, password, });
  };


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
const [sourceVMs, setSourceVMs] = useState([]);

useEffect(() => {
  if (sessionId && vms && vms.length > 0) {
    setSourceVMs(vms.map(vm => ({ ...vm, selected: false })));
  }
}, [sessionId, vms]);
  const [targetVMs, setTargetVMs] = useState([]);
  const toggleSelect = (id, type) => {
    if (type === "source") {
      const vmToMove = sourceVMs.find(vm => vm.id === id);
      if (!vmToMove) return;

      // ✅ 먼저 오른쪽으로 옮긴 후, 체크는 유지된 상태
      setSourceVMs(prev => prev.filter(vm => vm.id !== id));
      setTargetVMs(prev => [...prev, { ...vmToMove, selected: true }]); 

    } else if (type === "target") {
      const vmToMove = targetVMs.find(vm => vm.id === id);
      if (!vmToMove) return;

      // ✅ 왼쪽으로 옮긴 후, 체크는 해제된 상태로
      setTargetVMs(prev => prev.filter(vm => vm.id !== id));
      setSourceVMs(prev => [...prev, { ...vmToMove, selected: false }]); 
    }
  };
  const [selectAllSource, setSelectAllSource] = useState(false);
  const [selectAllTarget, setSelectAllTarget] = useState(false);
  const handleSelectAll = (type) => {
    if (type === "source") {
      const newState = !selectAllSource;
      setSelectAllSource(newState);

      if (newState) {
        // 체크 ON: 전체 이동
        const allToMove = [...sourceVMs].map(vm => ({ ...vm, selected: true }));
        setSourceVMs([]);
        setTargetVMs(prev => [...prev, ...allToMove]);
      } else {
        // 체크 OFF: 전체 되돌리기
        const allToMoveBack = [...targetVMs].filter(vm => vm.selected);
        const remain = [...targetVMs].filter(vm => !vm.selected);
        setTargetVMs(remain);
        setSourceVMs(prev => [...prev, ...allToMoveBack.map(vm => ({ ...vm, selected: false }))]);
      }

    } else if (type === "target") {
      const newState = !selectAllTarget;
      setSelectAllTarget(newState);

      if (newState) {
        // 체크 ON: 전체 되돌리기
        const allToMove = [...targetVMs].map(vm => ({ ...vm, selected: true }));
        setTargetVMs([]);
        setSourceVMs(prev => [...prev, ...allToMove.map(vm => ({ ...vm, selected: false }))]);
      } else {
        // 체크 OFF: 전체 다시 이동 (선택 유지)
        const allToMoveBack = [...sourceVMs].filter(vm => vm.selected);
        const remain = [...sourceVMs].filter(vm => !vm.selected);
        setSourceVMs(remain);
        setTargetVMs(prev => [...prev, ...allToMoveBack.map(vm => ({ ...vm, selected: true }))]);
      }
    }
  };
 const isNextDisabled = step === 1 && targetVMs.every(vm => !vm.selected);//선택된 데이터가 없을 때 footer '다음'버튼 비활성화

  const goNext = () => setStep((prev) => prev + 1);
  const goPrev = () => setStep((prev) => prev - 1);
  const renderStep1 = () => (
    <>
      <div className="vm-import-form-grid pt-2">
        <div className="vm-impor-outer">
          <LabelSelectOptions
            label={Localization.kr.DATA_CENTER}
            options={transformedDatacenters}
            value={selectedDatacenterId}
            onChange={(e) => setSelectedDatacenterId(e.target.value)}
          />
        </div>
        <div className="vm-impor-outer">
          <LabelSelectOptionsID
            label="소스"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          />
          <LabelSelectOptions
            label="외부 공급자"
            options={transformedProviders}
            value={selectedProviderId}
            onChange={(e) => setSelectedProviderId(e.target.value)}
          />
        </div>
        <hr/>
        <div className="vm-impor-outer">
          <LabelInput label="vcenter" id="vcenter"
            value={vcenter}
            onChange={(e) => setVcenter(e.target.value)}
            disabled={!!selectedProvider}
          />

          <LabelInput
            label="ESXi"
            id="esxi"
            value={esxi}
            onChange={(e) => setEsxi(e.target.value)}
            disabled={!!selectedProvider}
          />

          <LabelInput label={Localization.kr.DATA_CENTER} id="vcDataCenter"
            value={vcDataCenter}
            onChange={(e) => setVcDataCenter(e.target.value)}
            disabled={!!selectedProvider}
          />

          <LabelInput
            label={Localization.kr.CLUSTER}
            id="cluster"
            value={cluster}
            onChange={(e) => setCluster(e.target.value)}
            disabled={!!selectedProvider}
          />

          <LabelInput
            label="사용자 이름"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={!!selectedProvider}
          />

          <LabelInput
            label="암호"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="vm-impor-outer">
        <LabelSelectOptions label="호스트 목록" options={transformedHosts}
          value={selectedHostId}
          onChange={(e) => setSelectedHostId(e.target.value)}
        />
      </div>

     <button className="instance-disk-btn ml-0 mb-3" onClick={handleLoadVMs}>
      로드
     </button>

      <div className="vm-import-list-outer f-btw mb-4">
        {/* 좌측 패널 */}
        <div className="vm-import-panel vm-import-source">
          <div className="vm-import-panel-title">소스 상의 가상 머신</div>
          <div className="vm-import-table-outer">
            <div className="section-table-outer w-full ">
              <table className="vm-import-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>
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
          <div className="vm-import-table-outer">
            <div className="section-table-outer w-full">
              <table className="vm-import-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>
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
