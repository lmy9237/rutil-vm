import React, { useEffect, useState } from "react";
import BaseModal                        from "@/components/modal/BaseModal";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import LabelInput                       from "@/components/label/LabelInput";
import {
  useAllDataCenters, 
  useAllProviders,
  useAuthenticate4VMWare,
  useHostsFromDataCenter,
  useVmsFromVMWare,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import "./MVm.css";
import LabelSelectOptionsID from "@/components/label/LabelSelectOptionsID";
import { useValidationToast } from "@/hooks/useSimpleToast";
import VmImportRender2Modal from "./VmImportRender2Modal";
import { emptyIdNameVo, useSelectFirstItemEffect } from "@/util";
import { handleInputChange, handleSelectIdChange } from "@/components/label/HandleInput";
import Logger from "@/utils/Logger";

const initialFormState = {
  step: 1,
  source: "vmware",
  vcenter: "",
  esxi: "",
  dataCenter: "",
  cluster: "",
  username: "",
  password: "Vmware1!",
  authHostChecked: "",
};

const VmImportModal = ({ 
  isOpen,
  onClose,
  onSubmit
}) => {
  const { validationToast } = useValidationToast();
  const [virtioChecked, setVirtioChecked] = useState(false); // ← 체크 상태 저장
  
  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState(initialFormState);
  
  const [dataCenterVo, setDataCenterVo] = useState(emptyIdNameVo());
  const [hostVo, setHostVo] = useState(emptyIdNameVo());
  const [providerVo, setProviderVo] = useState(emptyIdNameVo());
  
  const [sessionId, setSessionId] = useState(null); // 로드버튼 클릭시 가상머신목록 불러오기

  const [targetVMs, setTargetVMs] = useState([]);

  //선택된 데이터가 없을 때 footer '다음'버튼 비활성화
  const isNextDisabled = step === 1 && targetVMs.length === 0;
  const goNext = () => setStep((prev) => prev + 1);
  const goPrev = () => setStep((prev) => prev - 1);

  const { 
    mutate: authenticate4VmWare 
  } = useAuthenticate4VMWare((resValue) => {
      Logger.debug("$ [onSuccess] sessionId:", resValue);
      setSessionId(resValue);
      refetchVms(); 
  },
    (error) => {
      validationToast?.fail("로그인 실패: ", error);
    }
  );
  
  // 데이터센터 목록
  const { 
    data: datacenters = [], 
    isLoading: isDataCentersLoading 
  } = useAllDataCenters((e) => ({ ...e }));

  // 외부 공급자목록 
  const {  
    data: providers = [],
    isLoading: isProvidersLoading, 
  } = useAllProviders((e) => ({ ...e }));
  const vwProviders = [...providers]
    .filter((p) => p.providerType === "vmware")
    .sort((a, b) => a.name.localeCompare(b.name));
  
  // 호스트 목록
  const {
    data: hosts = [],
    isLoading: isHostsLoading,
  } = useHostsFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));

  // vmware 가상머신 목록
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    refetch: refetchVms,
  } = useVmsFromVMWare(
    { baseUrl: formState.vcenter, sessionId },
    (e) => ({ ...e })
  );
  const vwVms = [...vms].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    setFormState(initialFormState);
    setDataCenterVo(emptyIdNameVo);
    setHostVo(emptyIdNameVo());
    setSessionId(null);
  }, [isOpen]);

  // 데이터센터 지정
  useSelectFirstItemEffect(datacenters, setDataCenterVo);

  useEffect(() => {
    if (!providerVo?.id) {
      setFormState((prev) => ({
        ...prev,
        vcenter: "",
        esxi: "",
        dataCenter: "",
        cluster: "",
        username: "",
        password: ""
      }));
      return;
    }

    const selectedProvider = providers.find(p => p.id === providerVo.id);
    if (!selectedProvider) return;

    const props = selectedProvider?.providerPropertyVo || {};
    setFormState((prev) => ({
      ...prev,
      vcenter: props.vcenter || "",
      esxi: props.esxi || "",
      dataCenter: props.dataCenter || "",
      cluster: props.cluster || "",
      username: selectedProvider.authUsername || "",
      password: "Vmware1!" // "" 가 맞는값

      
    }));
  }, [providerVo, providers]);


  const toggleSelect = (vmVm) => {
    setTargetVMs(prev => {
      const exists = prev.some(vm => vm.vm === vmVm);
      if (exists) {
        return prev.filter(vm => vm.vm !== vmVm);
      } else {
        const found = vwVms.find(vm => vm.vm === vmVm);
        if (!found) return prev;
        return [...prev, found];
      }
    });
  };

  const handleLoadVMs = () => {
    const { vcenter, username, password } = formState;
    if (!vcenter || !username || !password) {
      validationToast?.fail("vCenter, 사용자 이름, 암호를 모두 입력해주세요.");
      return;
    }

    authenticate4VmWare(
      { baseUrl: vcenter, username: username, password: password }
    );
  };


  const renderStep1 = () => (
    <>
      <div className="vm-import-form-grid pt-2">
        <div className="vm-impor-outer">
          <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
            value={dataCenterVo.id}
            loading={isDataCentersLoading}
            options={datacenters}
            onChange={handleSelectIdChange(setDataCenterVo, datacenters, validationToast)}
          />
          <LabelSelectOptions label="소스"
            value={formState.source}
            options={sources}
            onChange={handleInputChange(setFormState, "source", validationToast)}
          />
        </div>
        <div className="vm-impor-outer">
          <LabelSelectOptionsID label={"외부 공급자"}
            value={providerVo?.id}
            loading={isProvidersLoading}
            options={vwProviders}
            onChange={handleSelectIdChange(setProviderVo, providers, validationToast)}
          />
        </div>
        <hr/>
        <div className="vm-impor-outer">
          <LabelInput label="vcenter" id="vcenter"
            value={formState.vcenter}
            onChange={handleInputChange(setFormState, "vcenter", validationToast)}
            disabled={!!providerVo.id}
          />

          <LabelInput label="ESXi" id="esxi"
            value={formState.esxi}
            onChange={handleInputChange(setFormState, "esxi", validationToast)}
            disabled={!!providerVo.id}
          />

          <LabelInput label={Localization.kr.DATA_CENTER} id="vcDataCenter"
            value={formState.dataCenter}
            onChange={handleInputChange(setFormState, "dataCenter", validationToast)}
            disabled={!!providerVo.id}
          />

          <LabelInput label={Localization.kr.CLUSTER} id="cluster"
            value={formState.cluster}
            onChange={handleInputChange(setFormState, "cluster", validationToast)}
            disabled={!!providerVo.id}
          />

          <LabelInput label="사용자 이름" id="username"
            value={formState.username}
            onChange={handleInputChange(setFormState, "username", validationToast)}
            disabled={!!providerVo.id}
          />

          <LabelInput label="암호" id="password"
            type="password"
            value={formState.password}
            onChange={handleInputChange(setFormState, "password", validationToast)}
          />
        </div>
      </div>
      <div className="vm-impor-outer">
        <LabelSelectOptionsID label="호스트 목록" 
          value={hostVo?.id}
          loading={isHostsLoading}
          options={hosts}
          onChange={handleSelectIdChange(setHostVo, hosts, validationToast)}
        />
      </div>

      <button className="instance-disk-btn ml-0 mb-3" onClick={handleLoadVMs}>
        로드
      </button>

      <div className="vm-import-list-outer f-btw mb-4">
        <div className="vm-import-panel vm-import-source">
          <div className="vm-import-panel-title">소스 상의 {Localization.kr.VM}</div>
          <div className="vm-import-table-outer">
            <div className="section-table-outer w-full ">
              <table className="vm-import-table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}>선택</th>
                    <th>{Localization.kr.NAME}</th>
                    <th style={{ width: "40px" }}>{Localization.kr.STATUS}</th>                    
                  </tr>
                </thead>
                <tbody>
                  {vwVms.map(vm => (
                    <tr key={vm.vm}>
                      <td>
                        <input type="checkbox"
                          checked={targetVMs.some(t => t.vm === vm.vm)}
                          disabled={vm.powerState === "POWERED_ON"}
                          onChange={() => toggleSelect(vm.vm)}
                        />
                      </td>
                      <td>{vm.name}</td>
                      <td>{vm.powerState?.split("_").pop()}</td>
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
      baseUrl={formState.vcenter}
      sessionId={sessionId}
      dataCenterVo={dataCenterVo}
      targetVMs={targetVMs}
    />
  );

  return (
    <BaseModal 
      targetName={`${Localization.kr.VM}`} 
      submitTitle={Localization.kr.IMPORT}
      isOpen={isOpen} onClose={onClose}
      onSubmit={step === 2 ? onSubmit : goNext}
      contentStyle={{ width: "1000px" }}
      extraFooter={ step === 2 
        ? (
          <>
            <button className="back-button" onClick={goPrev}>뒤로</button>
            <button className="action" onClick={onSubmit}>확인</button>
          </>
        ) : (
          <button className="action" 
            onClick={goNext} 
            disabled={isNextDisabled}
          >다음</button>
        )
      }
    >
      {step === 1 ? renderStep1() : renderStep2()}
    </BaseModal>
  );
};

export default VmImportModal;

const sources = [
  { value: "vmware", label: "VMware" },
];