import React, { useState, useEffect, useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelInput                       from "@/components/label/LabelInput";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import {
  handleInputChange,
  handleSelectIdChange,
} from "@/components/label/HandleInput";
import {
  useAddVnicProfile,
  useAllDataCenters,
  useAllVmsFromVnicProfiles,
  useAllVnicProfiles,
  useEditVnicProfile,
  useAllNetworkFilters,
  useAllNetworksFromDataCenter,
  useVnicProfile,
} from "@/api/RQHook";
import { 
  checkDuplicateName, 
  checkName, 
  emptyIdNameVo, 
  useSelectItemOrDefaultEffect
} from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const initialFormState = {
  id: "",
  name: "",
  description: "",
  // passThrough: "DISABLED",
  portMirroring: false,
  migration: true,
};

const VnicProfileModal = ({
  isOpen, 
  onClose,
  editMode = false,
}) => {
  const { validationToast } = useValidationToast();
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
  const [dataCenterVo, setDataCenterVo] = useState(emptyIdNameVo());
  const [networkVo, setNetworkVo] = useState(emptyIdNameVo());
  const [networkFilterVo, setNetworkFilterVo] = useState(emptyIdNameVo());

  const { mutate: addVnicProfile } = useAddVnicProfile(onClose, onClose);
  const { mutate: editVnicProfile } = useEditVnicProfile(onClose, onClose);

  const { data: vnic } = useVnicProfile(vnicProfileId);
  const { data: vnics } = useAllVnicProfiles();
  const { 
    data: datacenters = [], 
    isLoading: isDataCentersLoading,
    isSuccess: isDataCentersSuccess,
  } = useAllDataCenters((e) => ({ ...e }));
  const { 
    data: networks = [], 
    isLoading: isNetworksLoading,
    isSuccess: isNetworksSuccess,
  } = useAllNetworksFromDataCenter(dataCenterVo?.id || undefined, (e) => ({ ...e }));
  const { 
    data: vms = [] 
  } = useAllVmsFromVnicProfiles(vnicProfileId);
  const { 
    data: nFilters = [], 
    isLoading: isNFiltersLoading,
    isSuccess: isNFiltersSuccess,
  } = useAllNetworkFilters((e) => ({ ...e }));

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setDataCenterVo(emptyIdNameVo());
      setNetworkVo(emptyIdNameVo());
      setNetworkFilterVo(emptyIdNameVo());
    }

    if (editMode && vnic) {
      setFormState({
        id: vnic?.id || "",
        name: vnic?.name || "",
        description: vnic?.description || "",
        migration: vnic?.migration || true,
        // passThrough: vnic?.passThrough || "DISABLED",
        portMirroring: vnic?.portMirroring || false,
      });
      setNetworkFilterVo({ 
        id: vnic?.networkFilterVo?.id, 
        name: vnic?.networkFilterVo?.name 
      });
      setDataCenterVo({
        id: vnic?.dataCenterVo?.id, 
        name: vnic?.dataCenterVo?.name
      });
      setNetworkVo({
        id: vnic?.networkVo?.id, 
        name: vnic?.networkVo?.name
      });
    }
  }, [isOpen, editMode, vnic]);

  // 데이터센터 지정
  useSelectItemOrDefaultEffect(datacenterId, editMode, datacenters, setDataCenterVo, "Default");
  useSelectItemOrDefaultEffect(networkId, editMode, networks, setNetworkVo, "ovirtmgmt");

  useEffect(() => {
    if (nFilters && nFilters.length > 0) {
      const defaultNF = nFilters.find(nf => nf.name === "vdsm-no-mac-spoofing");
      const firstNF = defaultNF || nFilters[0];
      setNetworkFilterVo({ 
        id: firstNF.id, 
        name: firstNF.name 
      });
    }
  }, [nFilters, editMode]);

  const validateForm = () => {
    const nameError = checkName(formState.name);
    if (nameError) return nameError;
    const duplicateError = checkDuplicateName(vnics, formState.name, formState.id);
    if (duplicateError) return duplicateError;
    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!networkVo.id) return `${Localization.kr.NETWORK}를 선택해주세요.`;
    return null;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    const dataToSubmit = {
      ...formState,
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
      isReady={
        editMode
        ? isDataCentersSuccess && isNetworksSuccess && isNFiltersSuccess
        : isDataCentersSuccess && isNetworksSuccess
      }
      onSubmit={handleFormSubmit}
  
      contentStyle={{ width: "730px" }} 
    >
      <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
        value={dataCenterVo.id}
        disabled={editMode}
        loading={isDataCentersLoading}
        options={datacenters}
        onChange={handleSelectIdChange(setDataCenterVo, datacenters, validationToast)}

      />
      <LabelSelectOptionsID label={Localization.kr.NETWORK}
        value={networkVo.id}
        disabled={editMode}
        loading={isNetworksLoading}
        options={networks}
        onChange={(selected) => setNetworkVo({ id: selected.id, name: selected.name })}
        // onChange={handleSelectIdChange(setNetworkVo, networks)}
      />
      <LabelInput id="name" label={Localization.kr.NAME}
        autoFocus
        value={formState.name}
        onChange={handleInputChange(setFormState, "name",validationToast)}
      />
      <LabelInput id="description" label={Localization.kr.DESCRIPTION}
        value={formState.description}
        onChange={handleInputChange(setFormState, "description",validationToast)}
      />
      <LabelSelectOptionsID id="network-man" label={Localization.kr.NETWORK_FILTER}
        value={networkFilterVo.id}
        // disabled={formState.passThrough !== "DISABLED"}
        loading={isNFiltersLoading}
        options={nFilters}
        onChange={(selected) => setNetworkFilterVo({ id: selected.id, name: selected.name })}
        // onChange={handleSelectIdChange(setNetworkFilterVo, nFilters)}
      />
      {/* <LabelCheckbox id="passThrough" label="통과"
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
      /> */}
      <LabelCheckbox id="migration" 
        label={`${Localization.kr.MIGRATION} 가능`}
        checked={formState.migration}
        disabled={true}
        // disabled={formState.passThrough === "DISABLED" || isVnicUsedByVm}
        onChange={(e) => {
          const isChecked = e.target.checked;
          setFormState((prev) => ({...prev, migration: isChecked }))
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
        disabled={vms.length > 0}
        // disabled={formState.passThrough === "ENABLED" || isVnicUsedByVm}
        onChange={(e) => { setFormState((prev) => ({...prev, portMirroring: e.target.checked})) }}
      />
    </BaseModal>
  );
};

export default VnicProfileModal;
