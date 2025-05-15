import React, { useState } from "react";
import BaseModal from "../BaseModal";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import LabelInput from "../../label/LabelInput";
import LabelCheckbox from "../../label/LabelCheckbox";
import Localization from "../../../utils/Localization";
import { useAllDataCenters, useAllNetworkProviders } from "../../../api/RQHook";
import "./MVm.css";

const VmImportModal = ({ 
  isOpen,
  onClose,
  onSubmit
}) => {
  // const { closeModal } = useUIState()
  const { 
    networkProvidersSelected, setNetworkProvidersSelected,
    datacentersSelected, setDatacentersSelected,
  } = useGlobal()

  const {
    data: datacenters,
    isLoading: isDatacentersLoading,
  } = useAllDataCenters()

  const transformedDatacenters = [
    { value: "", label: Localization.kr.NOT_ASSOCIATED },
    ...(!Array.isArray(datacenters) ? [] : datacenters).map((dc) => ({
      value: dc?.id,
      label: dc?.name
    }))
  ]

  const {
    data: networkProviders = [],
    isLoading: isNetworkProviders
  } = useAllNetworkProviders();

  const transformedNetorkProviders = [
    { value: "", label: Localization.kr.NOT_ASSOCIATED },
    ...[...networkProviders].map((p) => ({
      value: p?.id,
      label: p?.name
    }))
  ]

  const [step, setStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState("VMware");

  const [vcenter, setVcenter] = useState("");
  const [vcDataCenter, setVcDataCenter] = useState("");
  const [username, setUsername] = useState("");
  const [esxi, setEsxi] = useState("");
  const [cluster, setCluster] = useState("");
  const [password, setPassword] = useState("");
  const [authHostChecked, setAuthHostChecked] = useState(false);

  const goNext = () => setStep((prev) => prev + 1);
  const goPrev = () => setStep((prev) => prev - 1);
  const renderStep1 = () => (
    <>
      <div className="vm-import-form-grid">

        <div className="vm-impor-outer">
          <div className="vm-import-form-item">
            <LabelSelectOptions id="datacenter" label={Localization.kr.DATA_CENTER}
              value={datacentersSelected}
              onChange={(e) => setDatacentersSelected(e.target.value)}
              options={[...transformedDatacenters]}
            />
          </div>

          <div className="vm-import-form-item">
            <LabelSelectOptions
              label="소스"
              id="source"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              options={[{ value: "VMware", label: "VMware" }]}
            />
          </div>

          <div className="vm-import-form-item">
            <LabelSelectOptions
              label="외부 공급자"
              id="provider"
              value={networkProvidersSelected}
              onChange={(e) => setNetworkProvidersSelected(e.target.value)}
              disabled={isDatacentersLoading}
              options={[...transformedNetorkProviders]}
            />
          </div>
        </div>
        
        <div className="vm-impor-outer">
          <div className="vm-import-form-item">
            <LabelInput label="vCenter" id="vcenter" value={vcenter} onChange={(e) => setVcenter(e.target.value)} />
          </div>

          <div className="vm-import-form-item">
            <LabelInput label="데이터 센터" id="vcDataCenter" value={vcDataCenter} onChange={(e) => setVcDataCenter(e.target.value)} />
          </div>

          <div className="vm-import-form-item">
            <LabelInput label="사용자 이름" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="vm-import-form-item">
            <LabelInput label="ESXi" id="esxi" value={esxi} onChange={(e) => setEsxi(e.target.value)} />
          </div>

          <div className="vm-import-form-item">
            <LabelInput label="클러스터" id="cluster" value={cluster} onChange={(e) => setCluster(e.target.value)} />
          </div>

          <div className="vm-import-form-item">
            <LabelInput label="암호" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

      </div>

      <div className="vm-import-form-item">
        <LabelCheckbox id="authHost"
          label="서버 SSL 인증서 확인 프록시 호스트"
          checked={authHostChecked}
          onChange={(e) => setAuthHostChecked(e.target.checked)}
        />
      </div>

      <div className="vm-import-form-item">
        <LabelSelectOptions id="allHosts"
          value=""
          onChange={() => {}}
          options={[{ value: "", label: "데이터 센터에 있는 모든 호스트" }]}
        />
      </div>

      <div className="vm-import-table">
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
      </div>
    </>
  );

  const renderStep2 = () => (
    <div>
      <h3>가져올 VM 선택</h3>
      <table>
        <thead>
          <tr>
            <th>체크</th>
            <th>이름</th>
            <th>소스</th>
            <th>메모리</th>
            <th>CPU</th>
            <th>아키텍처</th>
            <th>디스크</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox" /></td>
            <td>CentOS 7.9</td>
            <td>VMware</td>
            <td>16384 MB</td>
            <td>4</td>
            <td>x86_64</td>
            <td>1</td>
          </tr>
          <tr>
            <td><input type="checkbox" /></td>
            <td>CentOS 7-1908 Minimum</td>
            <td>VMware</td>
            <td>16384 MB</td>
            <td>4</td>
            <td>x86_64</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <BaseModal targetName={Localization.kr.VM} submitTitle={step === 2 ? Localization.kr.IMPORT : "다음"}
      isOpen={isOpen} onClose={onClose}
      onSubmit={step === 2 ? onSubmit : goNext}
      contentStyle={{ width: "900px" }}
      extraFooter={
        step === 2 ? (
          <>
            <button className="back-button" onClick={goPrev}>
              뒤로
            </button>
            <button className="action" onClick={onSubmit}>
              {Localization.kr.IMPORT}
            </button>
          </>
        ) : null
      }
    >
      {step === 1 ? renderStep1() : renderStep2()}
    </BaseModal>
  );
};

export default VmImportModal;
