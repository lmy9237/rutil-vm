import React, { useState, useEffect, useMemo } from "react";
import { useToast }            from "@/hooks/use-toast";
import useUIState              from "@/hooks/useUIState";
import useGlobal               from "@/hooks/useGlobal";
import BaseModal from "../BaseModal";
import {
  useAddVnicProfile,
  useAllDataCenters,
  useAllVmsFromVnicProfiles,
  useEditVnicProfile,
  useNetworkFilters,
  useNetworksFromDataCenter,
  useVnicProfile,
} from "../../../api/RQHook";
import { checkKoreanName, checkName } from "../../../util";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelInput from "../../label/LabelInput";
import LabelCheckbox from "../../label/LabelCheckbox";
import { handleInputChange, handleSelectIdChange } from "../../label/HandleInput";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import "./MVnic.css";

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
  onClose,
  editMode = false,
}) => {
  const { toast } = useToast()
  // const { closeModal } = useUIState()
  const vLabel = editMode 
    ? Localization.kr.UPDATE
    : Localization.kr.CREATE;
  const {
    networksSelected, vnicProfilesSelected, datacentersSelected 
  } = useGlobal();  
  const datacenterId = useMemo(() => [...datacentersSelected][0]?.id, [datacentersSelected])
  const networkId = useMemo(() => [...networksSelected][0]?.id, [networksSelected]);
  const vnicProfileId = useMemo(() => [...vnicProfilesSelected][0]?.id, [vnicProfilesSelected]);

  const [formState, setFormState] = useState(initialFormState);

  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [networkVo, setNetworkVo] = useState({ id: "", name: "" });
  const [networkFilterVo, setNetworkFilterVo] = useState({ id: "", name: "" });

  const { mutate: addVnicProfile } = useAddVnicProfile(onClose, onClose);
  const { mutate: editVnicProfile } = useEditVnicProfile(onClose, onClose);

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

  const { data: vms = [] } = useAllVmsFromVnicProfiles(vnicProfileId);
  const isVnicUsedByVm = vms.length > 0;

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setDataCenterVo({id: "", name: ""});
      setNetworkVo({id: "", name: ""});
      setNetworkFilterVo({id: "", name: ""});
    }
    setFormState({
      id: vnic?.id || "",
      name: vnic?.name || "",
      description: vnic?.description || "",
      migration: vnic?.migration || true,
      passThrough: vnic?.passThrough || "DISABLED",
      portMirroring: vnic?.portMirroring || false,
    });
    setNetworkFilterVo({ id: vnic?.networkFilterVo?.id, name: vnic?.networkFilterVo?.name });
    setDataCenterVo({id: vnic?.dataCenterVo?.id, name: vnic?.dataCenterVo?.name});
    setNetworkVo({id: vnic?.networkVo?.id, name: vnic?.networkVo?.name});
  }, [isOpen, editMode, vnic]);

  Logger.debug("VnicProfileModal.networkFilterVo ", networkFilterVo);

  useEffect(() => {
    Logger.debug(`VnicProfileModal > useEffect ... editMode: ${editMode}, datacenterId: ${datacenterId}`)
    if (datacenterId) {
      const selected = datacenters.find(dc => dc.id === datacenterId);
      setDataCenterVo({ id: selected?.id, name: selected?.name });
    } else if (!editMode && datacenters.length > 0) {
      // datacenterId가 없다면 기본 데이터센터 선택
      const defaultDc = datacenters.find(dc => dc.name === "Default");
      const firstDc = defaultDc || datacenters[0];
      setDataCenterVo({ id: firstDc.id, name: firstDc.name });
    }
  }, [datacenterId, datacenters, editMode]);
  
  useEffect(() => {
    Logger.debug(`VnicProfileModal > useEffect ... editMode: ${editMode}, networkId: ${networkId}`)
    if (networkId) {
      const selected = networks.find(n => n.id === networkId);
      setNetworkVo({id: selected?.id, name: selected?.name});
    } else if (!editMode && networks && networks.length > 0) {
      const defaultNetwork = networks.find(n => n.name === "ovirtmgmt");
      const firstN = defaultNetwork || networks[0];
      setNetworkVo({ id: firstN.id, name: firstN.name });
    }
  }, [networkId, networks, editMode]);
  
  useEffect(() => {
    Logger.debug(`VnicProfileModal > useEffect ... editMode: ${editMode}, nFilters.length: ${nFilters.length}`)
    if (!editMode && nFilters && nFilters.length > 0) {
      const defaultNF = nFilters.find(nf => nf.name === "vdsm-no-mac-spoofing");
      const firstNF = defaultNF || nFilters[0];
      setNetworkFilterVo({ id: firstNF.id, name: firstNF.name });
    }
  }, [nFilters, editMode]);

  const validateForm = () => {
    Logger.debug(`VnicProfileModal > validateForm ...`)
    const nameError = checkName(formState.name);
    if (nameError) return nameError;

    // if (checkKoreanName(formState.description)) return `${Localization.kr.DESCRIPTION}이 유효하지 않습니다.`; -> 설명 유효성검사 삭제
    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!networkVo.id) return `${Localization.kr.NETWORK}를 선택해주세요.`;
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error,
      });
      return;
    }

    const dataToSubmit = {
      ...formState,
    portMirroring: formState.passThrough === "ENABLED" ? false : formState.portMirroring,
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
        onChange={handleInputChange(setFormState, "name")}
      />
      <LabelInput id="description" label={Localization.kr.DESCRIPTION}
        value={formState.description}
          onChange={handleInputChange(setFormState, "description")}
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
        disabled={isVnicUsedByVm}
        onChange={(e) => {
          const isChecked = e.target.checked;
          setFormState((prev) => ({
            ...prev,
            passThrough: isChecked ? "ENABLED" : "DISABLED",
            networkFilter: isChecked ? null : prev.networkFilter, // Passthrough 활성화 시 네트워크 필터 제거
            portMirroring: isChecked ? false : prev.portMirroring, // Passthrough 활성화 시 포트 미러링 비활성화
            migration: isChecked ? prev.migration : true,
          }));
        }}
      />
      <LabelCheckbox id="migration" 
        label={`${Localization.kr.MIGRATION} 가능`}
        checked={formState.migration}
        disabled={formState.passThrough === "DISABLED" || isVnicUsedByVm}
        onChange={(e) => {
          const isChecked = e.target.checked;
          setFormState((prev) => ({
            ...prev,
            migration: isChecked
          }))
        }}
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
        disabled={formState.passThrough === "ENABLED" || isVnicUsedByVm}
        onChange={(e) => { setFormState((prev) => ({...prev, portMirroring: e.target.checked})) }}
      />
    </BaseModal>
  );
};

export default VnicProfileModal;
