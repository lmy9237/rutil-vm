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
  useNetwork,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import TablesOuter from "../../table/TablesOuter";
import { RVI36, rvi36Add, rvi36Remove } from "../../icons/RutilVmIcons";
import Logger from "../../../utils/Logger";
import "./MNetwork.css";
import DynamicInputList from "../../label/DynamicInputList";

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
  const nLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;
  const [formState, setFormState] = useState(initialFormState);

  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [clusterVoList, setClusterVoList] = useState([]);
  const [dnsServers, setDnsServers] = useState([]);

  const onSuccess = () => {
    onClose();
    toast.success(`네트워크 ${nLabel} 완료`);
  };
  const { mutate: addNetwork } = useAddNetwork(onSuccess, () => onClose());
  const { mutate: editNetwork } = useEditNetwork(onSuccess, () => onClose());

  const { data: network } = useNetwork(networkId);
  
  Logger.debug(`NetworkModal ... network: ${JSON.stringify(network)}`);
  const { 
    data: datacenters = [], 
    isLoading: isDataCentersLoading 
  } = useAllDataCenters((e) => ({ ...e }));
  const { 
    data: clusters = [], 
    isLoading: isClustersLoading,
    isError: isClustersError,
    isSuccess: isClustersSuccess
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
        dnsEnabled: (network?.dnsNameServers || [])?.length !== 0,
      });
      setDataCenterVo({ id: network?.dataCenterVo?.id, name: network?.dataCenterVo?.name });
      setDnsServers(network?.dnsNameServers)
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
    setClusterVoList([]);
  }, [dataCenterVo.id]);
  
  useEffect(() => {
    if (clusters && clusters.length > 0) {
      setClusterVoList((prev) =>
        clusters.map((cluster) => {
          const existing = prev.find((c) => c.id === cluster.id);
          return {
            ...cluster,
            isConnected: existing?.isConnected ?? true,
            isRequired: existing?.isRequired ?? false,
          };
        })
      );
    }
  }, [clusters]);  

  // dns 
  const [isDnsHiddenBoxVisible, setDnsHiddenBoxVisible] = useState(false);
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
      mtu: formState.mtu ? parseInt(formState.mtu, 10) : 0, 
      vlan: formState.vlanEnabled && formState.vlan? parseInt(formState.vlan, 10): 0,      
      // portIsolation: formState.portIsolation,
      usage: { vm: formState.usageVm },
      dnsNameServers: dnsServers
    };

    Logger.debug(`NetworkModal > handleFormSubmit ... dataToSubmit: ${dataToSubmit}`); // 데이터를 확인하기 위한 로그
    editMode
      ? editNetwork({ networkId: formState.id, networkData: dataToSubmit })
      : addNetwork(dataToSubmit);
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
            setClusterVoList([]);
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
          className="mb-3"
          disabled={editMode || !formState.usageVm} // 가상 머신 네트워크가 비활성화되면 비활성화(??)
          onChange={(e) => setFormState((prev) => ({...prev, portIsolation: e.target.checked }))}
        />

          <div className="mtu-input-outer">
            <div className="mtu-radio-input">
              <div className="f-start">
                {/* TODO: 디자인 */}
                <input
                  type="radio"
                  checked={formState.mtu === 0} // 기본값 1500 선택됨
                  onChange={() => setFormState((prev) => ({ ...prev, mtu: 0 }))}
                />
                <label>기본값 (1500)</label>
              </div>

            <div  className="f-btw ">
              <div className="f-center">
                <input
                  type="radio"
                  checked={formState.mtu !== 0} // 사용자 정의 값이 있을 때 선택됨
                  onChange={() =>
                    setFormState((prev) => ({ ...prev, mtu: "" }))
                  } // 빈 문자열로 설정해 사용자가 입력할 수 있도록
                />
                <label>사용자 정의</label>
           
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

            </div>
          </div>
          
        <div>
          <br/>
          <span>DNS 수정 필요</span>
        </div>

        <LabelCheckbox id="dns_settings" label="DNS 설정"
          checked={formState.dnsEnabled}
          onChange={(e) => {
            const isChecked = e.target.checked;
            setFormState((prev) => ({ 
              ...prev, 
              dnsEnabled: isChecked,
            }))
            setDnsServers(isChecked ? [""] : []);
            if (!isChecked) {
              setDnsHiddenBoxVisible(false); // 체크 해제 시 숨김 박스도 닫기
            }
          }}
        />
        
        {/* {formState.dnsEnabled && (
          <>
            <div className="text-[15px] font-bold"> DNS 서버 </div>
            {dnsServers.length !== 0 ?
              (dnsServers.map((dns, index) => (
              <div
                key={index}
                className="network-form-group f-btw"
                style={{ width: "100%", padding: 0 }}
              >
                <input
                  type="text"
                  value={dns}
                  onChange={(e) => {
                    const updated = [...dnsServers];
                    updated[index] = e.target.value;
                    setDnsServers(updated);
                  }}
                />
                <div className="dynamic-btns f-end">
                  <RVI36
                    iconDef={rvi36Add(false)}
                    className="btn-icon"
                    currentColor="transparent"
                    onClick={() => setDnsServers((prev) => [...prev, ""])}
                  />
                  <RVI36
                    iconDef={rvi36Remove()}
                    className="btn-icon"
                    currentColor="transparent"
                    onClick={() => {
                      const updated = [...dnsServers];
                      updated.splice(index, 1);
                      setDnsServers(updated);
                    }}
                  />
                </div> 
              </div>
            ))) :(
              <>
              <span>t</span>
              </>
            )
          }
          </>
        )} */}
        {formState.dnsEnabled && (
          <>
            <div className="text-[15px] font-bold"> DNS 서버 </div>
            <DynamicInputList
              values={dnsServers.map((value) => ({ value }))}
              inputType="text"
              showLabel={false}
              onChange={(index, value) => {
                const updated = [...dnsServers];
                updated[index] = value;
                setDnsServers(updated);
              }}
              onAdd={() => setDnsServers((prev) => [...prev, ""])}
              onRemove={(index) => {
                const updated = [...dnsServers];
                updated.splice(index, 1);
                setDnsServers(updated);
              }}
            />
          </>
        )}

        
        {!editMode && (
          <div className="network-new-cluster-form mt-3">
            <hr />
            <span className="mt-3 block">클러스터에서 네트워크를 연결/분리</span>
            <TablesOuter
              isLoading={isClustersLoading} isError={isClustersError} isSuccess={isClustersSuccess}
              columns={[
                { header: Localization.kr.NAME, accessor: 'name', clickable: false },
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
                          clusterVoList.every((c) => c.isRequired) && clusterVoList.every((c) => c.isConnected)
                        }
                        disabled={!clusterVoList.every((c) => c.isConnected)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setClusterVoList((prevState) =>
                            prevState.map((cluster) => ({
                              ...cluster, isRequired: isChecked,
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
                name: `${cluster.name}`,
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
