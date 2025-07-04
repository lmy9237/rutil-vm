import { useState, useMemo, useEffect } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "@/components/modal/BaseModal";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelInput                       from "@/components/label/LabelInput";
import { 
  handleInputChange, handleSelectIdChange
} from "@/components/label/HandleInput";
import {
  useAllProviders,
  useAllDataCenters,
  useHostsFromDataCenter,
  useProvider,
  useAddProvider,
  useEditProvider,
} from "@/api/RQHook";
import { checkDuplicateName, checkName, emptyIdNameVo }                    from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import LabelSelectOptions from "@/components/label/LabelSelectOptions";

const initialFormState = {
  id: "",
  name: "",
  description: "",
  providerType: "vmware",
  vCenter: "",    
  esxi: "",        
  datacenter: "", 
  cluster: "",    
  authUsername: "",
  // password: ""
};

/**
 * @name SettingProviderModal
 * @description 공급자 모달
 *
 * @param {boolean} isOpen
 * @returns
 */
const SettingProviderModal = ({ 
  isOpen,
  onClose,
  editMode=false
}) => {
  const { validationToast } = useValidationToast();
  const pLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;

  const { providersSelected } = useGlobal();
  const providerId = useMemo(() => [...providersSelected][0]?.id, [providersSelected]);

  const [formState, setFormState] = useState(initialFormState);
  const [dataCenterVo, setDataCenterVo] = useState(emptyIdNameVo());
  const [hostVo, setHostVo] = useState(emptyIdNameVo());

  const { mutate: addProvider } = useAddProvider(onClose, onClose);
  const { mutate: editProvider } = useEditProvider(onClose, onClose);

  const { data: provider } = useProvider(providerId);
  const { data: providers = [] } = useAllProviders((e) => ({ ...e  }));
  const { 
    data: datacenters = [], 
    isLoading: isDataCentersLoading 
  } = useAllDataCenters();
  const {
    data: hosts = [],
    isLoading: isHostsLoading,
  } = useHostsFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setDataCenterVo(emptyIdNameVo());
      setHostVo(emptyIdNameVo());
    }
    if (editMode && provider) {
      const property = provider.providerPropertyVo
      setFormState((prev) => ({
        ...prev,
        id: provider?.id,
        name: provider?.name,
        description: provider?.description,
        providerType: provider?.providerType,
        vCenter: property?.vcenter,
        esxi: property?.esxi,
        datacenter: property?.dataCenter,
        cluster: property?.cluster,
        authUsername: provider?.authUsername,
      }));
      setDataCenterVo({
        id: property?.dataCenterVo?.id,
      });
      setHostVo({
        id: property?.hostVo?.id,
      })
    }
  }, [isOpen, editMode, provider]);

  useEffect(() => {
    if (!editMode && datacenters.length > 0) {
      const defaultDc = datacenters.find(dc => dc.name === "Default");
      const firstDc = defaultDc || datacenters[0];
      setDataCenterVo({ 
        id: firstDc.id, 
        name: firstDc.name 
      });
    }
  }, [datacenters, editMode]);

  const validateForm = () => {
    const nameError = checkName(formState.name);
    if (nameError) return nameError;
    const duplicateError = checkDuplicateName(providers, formState.name, formState.id);
    if (duplicateError) return duplicateError;

    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    const dataToSubmit = {
      ...formState,
      authRequired: false,
      providerPropertyVo: {
        dataCenterVo: dataCenterVo,
        hostVo: hostVo,
        vCenter: formState.vCenter,
        esxi: formState.esxi,
        dataCenter: formState.datacenter,
        cluster: formState.cluster,
        verifySSL: false
      },
    };

    Logger.debug(`SettingProviderModal > handleFormSubmit ... dataToSubmit: `, dataToSubmit);
    editMode
      ? editProvider({ providerId: formState.id, providerData: dataToSubmit })
      : addProvider(dataToSubmit);
  };

  return (
    <BaseModal targetName={Localization.kr.PROVIDER} submitTitle={pLabel}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "500px" }} 
    >
      <LabelInput id="name" label={Localization.kr.NAME}
        autoFocus
        value={formState.name}
        onChange={handleInputChange(setFormState, "name", validationToast)}
      />
      <LabelInput id="description" label={Localization.kr.DESCRIPTION}
        value={formState.description}
        onChange={handleInputChange(setFormState, "description", validationToast)}
      />
      {/* TODO:타입별 항목이 많이 달라짐 */}
      <LabelSelectOptions id="providerType" label={Localization.kr.TYPE}
        value={formState.providerType}
        options={providerTypes}
        disabled={editMode}
        onChange={handleInputChange(setFormState, "providerType", validationToast)}
      />
      <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
        value={dataCenterVo.id}
        loading={isDataCentersLoading}
        options={datacenters}
        onChange={handleSelectIdChange(setDataCenterVo, datacenters, validationToast)}
      />
      <hr/>
      
      <LabelInput id="vCenter" label={"vCenter"}
        value={formState.vCenter}
        onChange={handleInputChange(setFormState, "vCenter", validationToast)}
      />
      <LabelInput id="ESXi" label={"ESXi"}
        value={formState.esxi}
        onChange={handleInputChange(setFormState, "esxi", validationToast)}
      />
      <LabelInput id="datacenter" label={Localization.kr.DATA_CENTER}
        value={formState.datacenter}
        onChange={handleInputChange(setFormState, "datacenter", validationToast)}
      />
      <LabelInput id="cluster" label={Localization.kr.CLUSTER}
        value={formState.cluster}
        onChange={handleInputChange(setFormState, "cluster", validationToast)}
      />
      {/* ssl인증서가 false여야 값이 나옴 */}
      {/* <LabelCheckbox id="serverSsl" label={"서버 SSL 인증서 확인"}
        checked={formState.wipeAfterDelete}
        onChange={handleInputCheck(setFormState, "wipeAfterDelete", validationToast)}
      /> */}
      <LabelSelectOptionsID label={`프록시 ${Localization.kr.HOST}`}
        value={hostVo.id}
        loading={isHostsLoading}
        options={hosts}
        disabled={!dataCenterVo?.id || dataCenterVo.id === "none"}
        onChange={handleSelectIdChange(setHostVo, hosts, validationToast)}
      />
      <LabelInput id="authUsername" label={`${Localization.kr.USER} ${Localization.kr.NAME}`}
        value={formState.authUsername}
        onChange={handleInputChange(setFormState, "authUsername", validationToast)}
      />
      {/* <LabelInput id="password" label="비밀번호" type="password"
        onChange={handleInputChange(setFormState, "password")}
        value={formState.password}
        required={true}
      /> */}
      <br/>
    </BaseModal>
  );
};

export default SettingProviderModal;

const providerTypes = [
  { value: "vmware",   label: "VMware" },
];
