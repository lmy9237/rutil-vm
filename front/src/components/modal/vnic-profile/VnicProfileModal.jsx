import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import {
  useAddVnicProfile,
  useAllDataCenters,
  useEditVnicProfile,
  useNetworkFilters,
  useNetworksFromDataCenter,
  useVnicProfile,
} from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import "./MVnic.css";
import { checkKoreanName, checkName } from "../../../util";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelInput from "../../label/LabelInput";
import LabelCheckbox from "../../label/LabelCheckbox";
import Logger from "../../../utils/Logger";

const initialFormState = {
  id: "",
  name: "",
  description: "",
  passThrough: "DISABLED",
  portMirroring: false,
  migration: true,
};

const VnicProfileModal = ({
  isOpen,
  editMode = false,
  vnicProfileId,
  networkId,
  onClose,
}) => {
  const vLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;
  const [formState, setFormState] = useState(initialFormState);

  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [networkVo, setNetworkVo] = useState({ id: "", name: "" });
  const [networkFilterVo, setNetworkFilterVo] = useState({ id: "", name: "" });

  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.VNIC_PROFILE} ${vLabel} 완료`);
  };
  const { mutate: addVnicProfile } = useAddVnicProfile(onSuccess, () => onClose());
  const { mutate: editVnicProfile } = useEditVnicProfile(onSuccess, () => onClose());

  const { data: vnic } = useVnicProfile(vnicProfileId);
  const { 
    data: datacenters = [], 
    isLoading: isDataCentersLoading 
  } = useAllDataCenters((e) => ({ ...e }));
  const { 
    data: networks = [], 
    isLoading: isNetworksLoading 
  } = useNetworksFromDataCenter(dataCenterVo?.id || undefined, (e) => ({ ...e }));
  
  const { 
    data: nFilters = [], 
    isLoading: isNFiltersLoading 
  } = useNetworkFilters((e) => ({ ...e }));

  useEffect(() => {
    if (!isOpen) return setFormState(initialFormState);
    setFormState({
      id: vnic?.id || "",
      name: vnic?.name || "",
      description: vnic?.description || "",
      migration: vnic?.migration || false,
      passThrough: vnic?.passThrough || "DISABLED",
      portMirroring: vnic?.portMirroring || false,
    });
    setNetworkFilterVo({ id: vnic?.networkFilterVo?.id, name: vnic?.networkFilterVo?.name });
    setDataCenterVo({id: vnic?.dataCenterVo?.id, name: vnic?.dataCenterVo?.name});
    setNetworkVo({id: vnic?.networkVo?.id, name: vnic?.networkVo?.name});
  }, [isOpen, editMode, vnic]);

  useEffect(() => {
    if (!editMode && datacenters && datacenters.length > 0) {
      const defaultDc = datacenters.find(dc => dc.name === "Default"); // 만약 "Default"라는 이름이 있다면 우선 선택
      if (defaultDc) {
        setDataCenterVo({ id: defaultDc.id, name: defaultDc.name });
      } else {
        setDataCenterVo({ id: datacenters[0].id, name: datacenters[0].name });
      }
    }
  }, [isOpen, datacenters, editMode]);
  
  useEffect(() => {
    if(networkId) {
      setNetworkVo({id: networkId});
    } else if (!editMode && networks && networks.length > 0) {
      const defaultN = networks.find(n => n.name === "ovirtmgmt");
      if(defaultN){
        setNetworkVo({id: defaultN.id, name: defaultN.name});
      } else {
        setNetworkVo({id: networks[0].id, name: networks[0].name});
      }
    }
  }, [isOpen, networks, networkId, editMode]);
  
  useEffect(() => {
    if (!editMode && nFilters.length > 0) {
      setNetworkFilterVo({id: nFilters[0].id});
    }
  }, [nFilters, editMode]);

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectIdChange = (setVo, voList) => (e) => {
    const selected = voList.find((item) => item.id === e.target.value);
    if (selected) setVo({ id: selected.id, name: selected.name });
  }; 

  const validateForm = () => {
    const nameError = checkName(formState.name);
    if (nameError) return nameError;

    if (checkKoreanName(formState.description)) return `${Localization.kr.DESCRIPTION}이 유효하지 않습니다.`;
    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!networkVo.id) return `${Localization.kr.NETWORK}를 선택해주세요.`;
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const dataToSubmit = {
      ...formState,
      formState,portMirroring: formState.passThrough === "ENABLED" ? false : formState.portMirroring,
      dataCenterVo,
      networkVo,
      networkFilterVo,
    };
    Logger.debug("Form Data: ", dataToSubmit); // 데이터를 확인하기 위한 로그

    editMode
      ? editVnicProfile({ vnicId: formState.id, vnicData: dataToSubmit })
      : addVnicProfile(dataToSubmit);
  };

  return (
    <BaseModal targetName={Localization.kr.VNIC_PROFILE} submitTitle={vLabel}
      isOpen={isOpen} onClose={onClose}     
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px" }} 
    >
      <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
        value={dataCenterVo.id}
        disabled={editMode}
        loading={isDataCentersLoading}
        options={datacenters}
        onChange={handleSelectIdChange(setDataCenterVo, datacenters)}
      />
      <LabelSelectOptionsID label={Localization.kr.NETWORK}
        value={networkVo.id}
        disabled={editMode}
        loading={isNetworksLoading}
        options={networks}
        onChange={handleSelectIdChange(setNetworkVo, networks)}
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
      <LabelSelectOptionsID id="network-man" label={Localization.kr.NETWORK_FILTER}
        value={networkFilterVo.id}
        disabled={formState.passThrough !== "DISABLED"}
        loading={isNFiltersLoading}
        options={nFilters}
        onChange={handleSelectIdChange(setNetworkFilterVo, nFilters)}
      />
      {/* TODO: 옵션없음 필요 */}

      <LabelCheckbox id="passThrough" label="통과"
        checked={formState.passThrough === "ENABLED"}
        onChange={(e) => {
          const isChecked = e.target.checked;
          setFormState((prev) => ({
            ...prev,
            passThrough: isChecked ? "ENABLED" : "DISABLED",
            networkFilter: isChecked ? null : prev.networkFilter, // Passthrough 활성화 시 네트워크 필터 제거
            portMirroring: isChecked ? false : prev.portMirroring, // Passthrough 활성화 시 포트 미러링 비활성화
          }));
        }}
      />
      <LabelCheckbox id="migration" label="마이그레이션 가능"
        checked={formState.passThrough !== "DISABLED" || formState.migration}
        disabled={formState.passThrough === "DISABLED"}
        onChange={(e) => { setFormState((prev) => ({...prev, migration: e.target.checked})) }}
      />
      {/* 페일오버 vNIC 프로파일 */}
      {/* <div className="vnic-new-box">
        <label htmlFor="failover_vnic_profile">페일오버 vNIC 프로파일</label>
        <select
          id="failover_vnic_profile"
          disabled={!formState.migration || !formState.passThrough}
        >
          <option value="none">없음</option>
          {!isFailoverNicsLoading &&
            failoverNics.map((nic) => (
              <option key={nic.id} value={nic.id}>
                {nic.name}
              </option>
            ))}
        </select>
      </div> */}
      <LabelCheckbox id="portMirroring" label="포트 미러링"
        checked={formState.portMirroring}
        disabled={formState.passThrough === "ENABLED"}
        onChange={(e) => { setFormState((prev) => ({...prev, portMirroring: e.target.checked})) }}
      />
    </BaseModal>
  );
};

export default VnicProfileModal;
