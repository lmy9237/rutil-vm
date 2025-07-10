import React, { useState, useEffect, useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelInput                       from "@/components/label/LabelInput";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import LabelInputNum                    from "@/components/label/LabelInputNum";
import DynamicInputList                 from "@/components/label/DynamicInputList";
import {
  handleInputChange, 
  handleInputCheck, 
  handleSelectIdChange,
} from "@/components/label/HandleInput";
import ToggleSwitchButton               from "@/components/button/ToggleSwitchButton";
import TablesOuter                      from "@/components/table/TablesOuter";
import {
  useAllDataCenters,
  useClustersFromDataCenter,
  useAddNetwork,
  useEditNetwork,
  useNetwork,
} from "@/api/RQHook";
import {
  checkName,
  emptyIdNameVo,
  useSelectItemOrDefaultEffect, 
} from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import "./MNetwork.css";

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
  useCustomMtu: false,      // ✅ 추가
  customMtu: "",            // ✅ 추가
};

//  Fault reason is "Operation Failed". Fault detail is "[Cannot edit Network. This logical network is used by host: rutilvm-dev.host04
const NetworkModal = ({
  isOpen,
  onClose,
  editMode = false,
}) => {
  const { validationToast } = useValidationToast();
  const nLabel = editMode 
    ? Localization.kr.UPDATE
    : Localization.kr.CREATE;
  
  const { networksSelected, datacentersSelected } = useGlobal()
  const networkId = useMemo(() => [...networksSelected][0]?.id, [networksSelected])
  const datacenterId = useMemo(() => [...datacentersSelected][0]?.id, [datacentersSelected])

  const [formState, setFormState] = useState(initialFormState);
  const [dataCenterVo, setDataCenterVo] = useState(emptyIdNameVo());
  const [clusterVoList, setClusterVoList] = useState([]);
  const [dnsServers, setDnsServers] = useState([]);
  const [isDnsHiddenBoxVisible, setDnsHiddenBoxVisible] = useState(false);

  const { data: network } = useNetwork(networkId);
  const { mutate: addNetwork } = useAddNetwork(onClose, onClose);
  const { mutate: editNetwork } = useEditNetwork(onClose, onClose);

  const { 
    data: datacenters = [], 
    isLoading: isDataCentersLoading 
  } = useAllDataCenters((e) => ({ ...e }));
  
  const {
    data: clusters = [], 
    isLoading: isClustersLoading,
    isError: isClustersError,
    isSuccess: isClustersSuccess,
    isRefetching: isClustersRefetching,
  } = useClustersFromDataCenter(dataCenterVo?.id || undefined, (e) => ({ ...e }));

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setDataCenterVo(emptyIdNameVo());
    }
    
    if (editMode && network) {
      setFormState({
        // ...initialFormState,
        id: network?.id,
        name: network?.name,
        description: network?.description,
        comment: network?.comment,
        mtu: network?.mtu,
        // useCustomMtu: false, 
        // customMtu: "",  
        // vlanEnabled
        vlan: network?.vlan != null && network?.vlan > 0 ? String(network.vlan) : "0",
        vlanEnabled: network?.vlan != null && network?.vlan > 0,
        usageVm: network?.usage?.vm,
        portIsolation: network?.portIsolation || false,

      });
      setDataCenterVo({ 
        id: network?.dataCenterVo?.id,
        name: network?.dataCenterVo?.name 
      });
      setDnsServers(network?.dnsNameServers || []); 
    }
  }, [isOpen, editMode, network]);  

  // 데이터센터 지정
  useSelectItemOrDefaultEffect(datacenterId, editMode, datacenters, setDataCenterVo, "Default");

  // useEffect(() => {
  //   if (datacenterId) {
  //     const selected = datacenters.find(dc => dc.id === datacenterId);
  //     setDataCenterVo({ 
  //       id: selected?.id, 
  //       name: selected?.name 
  //     });
  //   } else if (!editMode && datacenters.length > 0) {
  //     const defaultDc = datacenters.find(dc => dc.name === "Default");
  //     const firstDc = defaultDc || datacenters[0];
  //     setDataCenterVo({ 
  //       id: firstDc.id, 
  //       name: firstDc.name 
  //     });
  //   }
  // }, [datacenterId, datacenters, editMode]);


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
            isRequired: existing?.isRequired ?? true,
          };
        })
      );
    }
  }, [clusters]);  


  const validateForm = () => {
    Logger.debug(`NetworkModal > validateForm ... `);
    const nameError = checkName(formState.name);
    if (nameError) return nameError;

    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    const dataToSubmit = {
      ...formState,
      dataCenterVo,
      clusterVos:    
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

    Logger.debug(`NetworkModal > handleFormSubmit ... dataToSubmit: `, dataToSubmit); // 데이터를 확인하기 위한 로그
    editMode
      ? editNetwork({ networkId: formState.id, networkData: dataToSubmit })
      : addNetwork(dataToSubmit);
  };

  return (
    <BaseModal targetName={`논리 ${Localization.kr.NETWORK}`} submitTitle={nLabel}
      isOpen={isOpen} onClose={onClose}
      isReady={
        editMode
          ? true
          : (!isDataCentersLoading && !isClustersLoading)
      }
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "770px"}}
    >
      <div className="network-first-contents">
        <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
          value={dataCenterVo.id}
          disabled={editMode}
          loading={isDataCentersLoading}
          options={datacenters}
          onChange={handleSelectIdChange(setDataCenterVo, datacenters, validationToast)}
        />
        <LabelInput id="name" label={Localization.kr.NAME}
          autoFocus
          value={formState.name}
          onChange={handleInputChange(setFormState, "name", validationToast)}
        />
        <LabelInput id="description" label={Localization.kr.DESCRIPTION}
          value={formState.description}
          onChange={handleInputChange(setFormState, "description", validationToast)}
        />
        <LabelInput id="comment" label={Localization.kr.COMMENT}
          value={formState.comment}
          onChange={handleInputChange(setFormState, "comment", validationToast)}
        />
        <hr />

        <div id="vlan-enabled-group"
          className="f-btw">
         <LabelCheckbox id="vlanEnabled" label="VLAN 태깅 활성화"
            checked={formState.vlanEnabled} 
            onChange={(e) => //TODO 토스트 추가예정
              setFormState((prev) => ({
                ...prev,
                vlanEnabled: e.target.checked,
                vlan: e.target.checked ? prev.vlan : "", // 해제 시 vlan 값도 초기화
              }))
            }
          />
          <div style={{width:"55%"}} className="checkbox-number">
            <LabelInputNum id="vlan"
              placeholder="VLAN ID"
              value={formState.vlan}
              disabled={!formState.vlanEnabled}
              onChange={handleInputChange(setFormState, "vlan")}
            />
          </div>
        </div>

        <LabelCheckbox id="usageVm" label={`${Localization.kr.VM} ${Localization.kr.NETWORK}`}
          checked={formState.usageVm}
          disabled={editMode && formState.portIsolation} // 포트 분리 활성 상태에선 편집모드일 때 비활성화
          onChange={(e) => {
            const isChecked = e.target.checked;
            setFormState((prev) => ({
              ...prev,
              usageVm: isChecked,
              portIsolation: isChecked ? prev.portIsolation : false, // 꺼질 땐 포트 분리도 같이 false
            }));
          }}
        />
        <LabelCheckbox id="portIsolation" label={`포트 ${Localization.kr.DETACH}`}
          checked={formState.portIsolation}
          className="mb-3"
          disabled={editMode || !formState.usageVm} // 가상 머신 네트워크가 비활성화되면 비활성화(??)
          onChange={handleInputCheck(setFormState, "portIsolation")}
        />
          
        <div className="mtu-input-outer flex items-center gap-3">
          <ToggleSwitchButton id="mtuToggle" label="MTU 설정"
            checked={formState.mtu !== 0}
            onChange={(e) => {
              setFormState((prev) => ({ ...prev, mtu: e.target.checked ? 1500 : 0 }));
            }}
            tType="사용자 정의" fType="기본값 (1500)"
          />
          <input className="ml-2" style={{ width: "150px" }}
            type="number"             
            min="0" max="1500" step="1"
            value={formState.mtu === 0 ? 1500 : formState.mtu}
            disabled={formState.mtu === 0}
            onChange={handleInputChange(setFormState, "mtu")}
            // onChange={(e) => { setFormState((prev) => ({ ...prev, mtu: e.target.value }))}}
            onBlur={(e) => {
              let value = parseInt(e.target.value || "0", 10);

              if (isNaN(value) || value < 68) {
                validationToast.fail("MTU는 68 이상의 값만 입력 가능합니다.");
                value = 68;
              } else if (value > 1500) {
                validationToast.fail("MTU는 최대 1500까지만 설정할 수 있습니다.");
                value = 1500;
              }
              setFormState((prev) => ({ ...prev, mtu: value }));
            }}
          />
        </div>

        <div id="dns-settings-group" class="f-start">
          <LabelCheckbox id="dns-settings" label="DNS 설정 (DNS 수정이 안됨)"
            checked={dnsServers.length > 0}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setDnsServers(isChecked ? [""] : []);
              if (!isChecked) setDnsHiddenBoxVisible(false);
            }}
          />
        </div>

        {dnsServers.length > 0 && (
          <>
            <div className="font-bold mt-1"> DNS 서버 </div>
            <DynamicInputList
              values={dnsServers.map((dns) => ({ value: dns }))}
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
          <div className=" py-3">
            <hr />
            <span className="my-3 block font-bold">클러스터에서 네트워크를 연결/분리</span>
            <TablesOuter
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
              isLoading={isClustersLoading} isRefetching={isClustersRefetching} isError={isClustersError} isSuccess={isClustersSuccess}
            />
          </div>
        )}
        <br/>
      </div>
    </BaseModal>
  );
};

export default NetworkModal;
