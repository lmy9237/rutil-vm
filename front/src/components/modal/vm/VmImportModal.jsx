import React, { useEffect, useState } from "react";
import BaseModal from "../BaseModal";
import { useAllNetworkProviders } from "../../../api/RQHook";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import LabelInput from "../../label/LabelInput";
import LabelCheckbox from "../../label/LabelCheckbox";
import Localization from "../../../utils/Localization";
import "./MVm.css";

const VmImportModal = ({ isOpen, onClose, onSubmit }) => {
  const { data: networkProvider = [], isLoading: isDatacentersLoading } = useAllNetworkProviders();

  const [selectedProvider, setSelectedProvider] = useState("");
  const [vcenter, setVcenter] = useState("");
  const [vcDataCenter, setVcDataCenter] = useState("");
  const [username, setUsername] = useState("");
  const [esxi, setEsxi] = useState("");
  const [cluster, setCluster] = useState("");
  const [password, setPassword] = useState("");
  const [authHostChecked, setAuthHostChecked] = useState(false);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName="가상머신 가져오기"
      submitTitle=""
      onSubmit={onSubmit}
      contentStyle={{ width: "900px" }}
    >
      <div className="vm-import-form-grid">
        <LabelSelectOptions
          label="데이터 센터"
          id="datacenter"
          value="select36"
          onChange={() => {}}
          options={[{ value: "select36", label: "select36" }]}
        />
        <LabelSelectOptions
          label="외부 공급자"
          id="provider"
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          disabled={isDatacentersLoading}
          options={networkProvider.map((p) => ({ value: p.name, label: p.name }))}
        />
        <LabelInput label="vCenter" id="vcenter" value={vcenter} onChange={(e) => setVcenter(e.target.value)} />
        <LabelInput label="데이터 센터" id="vcDataCenter" value={vcDataCenter} onChange={(e) => setVcDataCenter(e.target.value)} />
        <LabelInput label="사용자 이름" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <LabelInput label="ESXi" id="esxi" value={esxi} onChange={(e) => setEsxi(e.target.value)} />
        <LabelInput label="클러스터" id="cluster" value={cluster} onChange={(e) => setCluster(e.target.value)} />
        <LabelInput label="암호" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      <div className="vm-import-checkbox">
        <LabelCheckbox
          id="authHost"
          label="서버 인증 외장 확인 프록시 호스트"
          checked={authHostChecked}
          onChange={(e) => setAuthHostChecked(e.target.checked)}
        />
      </div>

      <LabelSelectOptions
        label="데이터 센터에 있는 모든 호스트"
        id="allHosts"
        value=""
        onChange={() => {}}
        options={[{ value: "", label: "데이터 센터에 있는 모든 호스트" }]}
      />

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
              <td>CentOS 7</td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>CentOS 7-1908 Minimum</td>
            </tr>
            <tr>
              <td><input type="checkbox" /></td>
              <td>CentOS 7.9 Stream - LIS</td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseModal>
  );
};

export default VmImportModal;