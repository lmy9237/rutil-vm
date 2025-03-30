import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelInput from "../../label/LabelInput";
import LabelCheckbox from "../../label/LabelCheckbox";
import LabelInputNum from "../../label/LabelInputNum";
import { checkName } from "../../../util";
import {
  useAllDataCenters,
  useClustersFromDataCenter,
  useAddNetwork,
  useEditNetwork,
  useNetworkById,
} from "../../../api/RQHook";
import "./MNetwork.css";
import Localization from "../../../utils/Localization";
import TablesOuter from "../../table/TablesOuter";

const FormGroup = ({ label, children }) => (
  <div className="network-form-group f-btw">
    <label style={{ "font-size": "15px" }}>{label}</label>
    {children}
  </div>
);

const initialFormState = {
  id: "",
  name: "",
  description: "",
  comment: "",
  mtu: 0,
  vlanEnabled: false,
  vlan: "0",
  usageVm: true,
  portIsolation: false,
  dnsEnabled: false,
};

//  Fault reason is "Operation Failed". Fault detail is "[Cannot edit Network. This logical network is used by host: rutilvm-dev.host04
const NetworkModal = ({
  isOpen,
  editMode = false,
  networkId,
  dcId,
  onClose,
}) => {
  const nLabel = editMode ? "편집" : "생성";
  const [formState, setFormState] = useState(initialFormState);

  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [clusterVoList, setClusterVoList] = useState([]);
  // const [dnsEnabled, setDnsEnabled] = useState(false);

  const { mutate: addNetwork } = useAddNetwork();
  const { mutate: editNetwork } = useEditNetwork();

  const { data: network } = useNetworkById(networkId);
  const { 
    data: datacenters = [], 
    isLoading: isDataCentersLoading 
  } = useAllDataCenters((e) => ({ ...e }));
  const { 
    data: clusters = [], 
    isLoading: isClustersLoading 
  } = useClustersFromDataCenter(dataCenterVo?.id || undefined, (e) => ({ ...e }));

  useEffect(() => {
    if (!isOpen) setFormState(initialFormState);
    if (editMode && network) {
      setFormState({
        id: network?.id,
        name: network?.name,
        description: network?.description,
        comment: network?.comment,
        mtu: network?.mtu,
        vlan: network?.vlan,
        vlanEnabled: network?.vlan > 0, // 🔥 vlan 값이 0보다 크면 true
        usageVm: network?.usage?.vm,
        portIsolation: network?.portIsolation || false,
        dnsEnabled: network?.dnsEnabled || false,
      });
      setDataCenterVo({ id: network?.datacenterVo?.id, name: network?.datacenterVo?.name });
    }
  }, [isOpen, editMode, network]);  

  useEffect(() => {
    if (dcId) {
      setDataCenterVo({id: dcId});
    } else if (!editMode && datacenters && datacenters.length > 0) {
      setDataCenterVo({id: datacenters[0].id, name: datacenters[0].name});
    }
  }, [datacenters, dcId, editMode]);

  useEffect(() => {
    if (clusters && clusters.length > 0) {
      setClusterVoList((prev) =>
        clusters.map((cluster, index) => ({
          ...cluster,
          isConnected: prev[index]?.isConnected ?? true,
          isRequired: prev[index]?.isRequired ?? false,
        }))
      );
    }
  }, [clusters]);

  
  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    checkName(formState.name);

    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const dataToSubmit = {
      ...formState,
      dataCenterVo,
      clusterVos: // 🔥 연결된 클러스터만 필터링      
        clusterVoList.filter((cluster) => cluster.isConnected).map((cluster) => ({
          id: cluster.id,
          name: cluster.name,
          required: cluster.isRequired,
        })),
      mtu: formState.mtu ? parseInt(formState.mtu, 10) : 0, // mtu가 빈 값이면 1500 설/정
      vlan: formState.vlanEnabled && formState.vlan? parseInt(formState.vlan, 10): 0,      
      // portIsolation: formState.portIsolation,
      usage: { vm: formState.usageVm },
    };

    const onSuccess = () => {
      onClose();
      toast.success(`네트워크 ${nLabel} 완료`);
    };
    const onError = (err) => toast.error(`Error ${nLabel} network: ${err}`);

    console.log("Form Data: ", dataToSubmit); // 데이터를 확인하기 위한 로그

    editMode
      ? editNetwork(
        { networkId: formState.id, networkData: dataToSubmit },
        { onSuccess, onError }
      )
      : addNetwork(dataToSubmit, { onSuccess, onError });
  };

  return (
    <BaseModal targetName={`논리 ${Localization.kr.NETWORK}`}
      isOpen={isOpen} onClose={onClose}       
      submitTitle={nLabel}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "770px"}}
    >
      <div className="network-first-contents">
        <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
          value={dataCenterVo.id}
          disabled={editMode}
          loading={isDataCentersLoading}
          options={datacenters}
          onChange={(e) => {
            const selected = datacenters.find(dc => dc.id === e.target.value);
            if (selected) setDataCenterVo({ id: selected.id, name: selected.name });
          }}
        />
        <LabelInput id="name" label={Localization.kr.NAME}
          autoFocus
          value={formState.name}
          onChange={handleInputChange("name")}
        />
        <LabelInput id="description" label={Localization.kr.DESCRIPTION}
          value={formState.description}
          onChange={handleInputChange("description")}
        />
        <LabelInput id="comment" label={Localization.kr.COMMENT}
          value={formState.comment}
          onChange={handleInputChange("comment")}
        />
        <hr />

        <div className="center">
          <LabelCheckbox id="vlanEnabled" label="VLAN 태깅 활성화"
            checked={formState.vlanEnabled || network?.vlan}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                vlanEnabled: e.target.checked,
                vlan: e.target.checked ? prev.vlan : ""
              }))
            }
          />
          <LabelInputNum id="vlan"
            placeholder="VLAN ID"
            value={formState.vlan}
            disabled={!formState.vlanEnabled}
            onChange={(e) => setFormState((prev) => ({ ...prev, vlan: e.target.value }))}
          />
        </div>

        <LabelCheckbox id="usageVm" label="가상 머신 네트워크"          
          checked={formState.usageVm}
          onChange={(e) => {
            const isChecked = e.target.checked;
            setFormState((prev) => ({
              ...prev,
              usageVm: isChecked,
              portIsolation: isChecked ? prev.portIsolation : false, // 포트 분리를 비활성화
            }));
          }}
        />
        <LabelCheckbox id="portIsolation" label="포트 분리"          
          checked={formState.portIsolation}
          disabled={editMode || !formState.usageVm} // 가상 머신 네트워크가 비활성화되면 비활성화(??)
          onChange={(e) => setFormState((prev) => ({...prev, portIsolation: e.target.checked }))}
        />

        <FormGroup label="MTU" className="mtu-form">
          <div className="mtu-input-outer">
            <div className="mtu-radio-input">
              <div className="flex">
                <input
                  type="radio"
                  checked={formState.mtu === 0} // 기본값 1500 선택됨
                  onChange={() => setFormState((prev) => ({ ...prev, mtu: 0 }))}
                />
                <label>기본값 (1500)</label>
              </div>
              <div className="flex">
                <input
                  type="radio"
                  checked={formState.mtu !== 0} // 사용자 정의 값이 있을 때 선택됨
                  onChange={() =>
                    setFormState((prev) => ({ ...prev, mtu: "" }))
                  } // 빈 문자열로 설정해 사용자가 입력할 수 있도록
                />
                <label>사용자 정의</label>
              </div>
            </div>
            <div className="mtu-text-input">
              <input
                type="number"
                style={{ width: "100%" }}
                min="68"
                step="1"
                disabled={formState.mtu === 0} // 기본값 선택 시 비활성화
                value={formState.mtu === 0 ? "" : formState.mtu} // 기본값일 경우 빈 값 표시
                onChange={(e) => {
                  const value = e.target.value;
                  setFormState((prev) => ({ ...prev, mtu: value }));
                }}
              />
            </div>
          </div>
        </FormGroup>

        <LabelCheckbox id="dns_settings" label="DNS 설정"
          checked={formState.dnsEnabled}
          // onChange={(e) => setDnsEnabled(e.target.checked)}
        />
        <span>TODO: DNS 추가구현</span>
        
{/* 
        <div className="text-[15px] font-bold">
          DNS 서버
        </div> */}
      
        {/* <FormGroup>
          <div
            className="network-form-group f-btw"
            style={{ width: "100%", padding: 0 }}
          >
            <input type="text" id="dns_server" disabled={!dnsEnabled} />
            <div
              className="plusbtns"
              style={{ "font-size": "13px", height: "32px" }}
            >
              <button
                type="button"
                className="border-r border-gray-500"
                onClick={() => console.log("Add DNS Server")}
                disabled={!dnsEnabled} // 버튼도 비활성화
              >
                +
              </button>
              <button
                type="button"
                className="border-r border-gray-500"
                onClick={() => console.log("Remove DNS Server")}
                disabled={!dnsEnabled}
              >
                -
              </button>
            </div>
          </div>
        </FormGroup> */}
        {/* <DynamicInputList maxCount={3}  inputType="text"  disabled={!dnsEnabled} /> */}

        {!editMode && (
          <div className="network-new-cluster-form">
            <hr />
            <span>클러스터에서 네트워크를 연결/분리</span>
            <TablesOuter
              isLoading={false} isError={false} isSuccess={true}
              columns={[
                {
                  header: "이름",
                  accessor: "name",
                },
                {
                  header: (
                    <div className="flex">
                      <input
                        type="checkbox"
                        id="connect_all"
                        checked={clusterVoList.every((cluster) => cluster.isConnected)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setClusterVoList((prevState) =>
                            prevState.map((cluster) => ({
                              ...cluster,
                              isConnected: isChecked,
                              isRequired: isChecked ? cluster.isRequired : false,
                            }))
                          );
                        }}
                      />
                      <label htmlFor="connect_all"> 모두 연결</label>
                    </div>
                  ),
                  accessor: "connect",
                  width: "150px",
                },
                {
                  header: (
                    <div className="flex">
                      <input
                        type="checkbox"
                        id="require_all"
                        checked={
                          clusterVoList.every((c) => c.isRequired) &&
                          clusterVoList.every((c) => c.isConnected)
                        }
                        disabled={!clusterVoList.every((c) => c.isConnected)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setClusterVoList((prevState) =>
                            prevState.map((cluster) => ({
                              ...cluster,
                              isRequired: isChecked,
                            }))
                          );
                        }}
                      />
                      <label htmlFor="require_all"> 모두 필요</label>
                    </div>
                  ),
                  accessor: "require",
                  width: "150px",
                },
              ]}
              data={clusterVoList.map((cluster, index) => ({
                id: cluster.id,
                name: `${cluster.name} / ${cluster.id}`,
                connect: (
                  <div className="flex">
                    <input
                      type="checkbox"
                      id={`connect_${cluster.id}`}
                      checked={cluster.isConnected}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setClusterVoList((prevState) =>
                          prevState.map((c, i) =>
                            i === index
                              ? {
                                  ...c,
                                  isConnected: isChecked,
                                  isRequired: isChecked ? c.isRequired : false,
                                }
                              : c
                          )
                        );
                      }}
                    />
                    <label htmlFor={`connect_${cluster.id}`}> 연결</label>
                  </div>
                ),
                require: (
                  <div className="flex">
                    <input
                      type="checkbox"
                      id={`require_${cluster.id}`}
                      checked={cluster.isRequired}
                      disabled={!cluster.isConnected}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setClusterVoList((prevState) =>
                          prevState.map((c, i) =>
                            i === index ? { ...c, isRequired: isChecked } : c
                          )
                        );
                      }}
                    />
                    <label htmlFor={`require_${cluster.id}`}> 필수</label>
                  </div>
                ),
              }))}
            />
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default NetworkModal;
