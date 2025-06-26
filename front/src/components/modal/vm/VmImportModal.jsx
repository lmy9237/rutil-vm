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
        <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
    //       value={dataCenterVo.id}

    //  loading={isDataCentersLoading}
    //       options={datacenters}
    //       onChange={handleSelectIdChange(setDataCenterVo, datacenters)}
        />

        </div>
        <div className="vm-impor-outer">
          <LabelSelectOptionsID label={'소스'}/>
          <LabelSelectOptionsID label={'소스'}/>
        </div>
        <hr/>
        <div className="vm-impor-outer">
          <LabelInput label="vCenter" id="vcenter" value={vcenter} onChange={(e) => setVcenter(e.target.value)} />
          <LabelInput label="데이터 센터" id="vcDataCenter" value={vcDataCenter} onChange={(e) => setVcDataCenter(e.target.value)} />
          <LabelInput label="사용자 이름" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <LabelInput label="ESXi" id="esxi" value={esxi} onChange={(e) => setEsxi(e.target.value)} />
          <LabelInput label="클러스터" id="cluster" value={cluster} onChange={(e) => setCluster(e.target.value)} />
          <LabelInput label="암호" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

      </div>

      <div className="vm-import-form-item">
        <LabelCheckbox id="authHost"
          label="서버 SSL 인증서 확인"
          checked={authHostChecked}
          onChange={(e) => setAuthHostChecked(e.target.checked)}
        />
      </div>

      {/* select박스 값 보정필요  */}
    

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
            <th>{Localization.kr.NAME}</th>
            <th>소스</th>
            <th>메모리</th>
            <th>CPU</th>
            <th>{Localization.kr.ARCH}</th>
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
    <BaseModal targetName={`${Localization.kr.VM} 가져오기`} submitTitle={step === 2 ? Localization.kr.IMPORT : "다음"}
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
