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
  vCenter: "",    // 192.168.0.7
  esx: "",        // 192.168.0.4
  dataCenter: "", // Datacenter
  cluster: "",    // ITITINFO
  userName: "",
  password: ""
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

  const { data: provider } = useProvider(providerId);
  const { data: providers = [] } = useAllProviders((e) => ({ ...e  }));
  const { 
    data: datacenters = [], 
    isLoading: isDataCentersLoading 
  } = useAllDataCenters();

  const {
    data: hosts = [],
    isLoading: isHostsLoading,
    isError: isHostsError,
    isSuccess: isHostsSuccess,
    refetch: refetchHosts,
    isRefetching: isHostsRefetching,
  } = useHostsFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));

  console.log("$ provider", provider)
  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
    }
    if (editMode && provider) {
      setFormState({
        id: provider?.id,
        name: provider?.name,
        description: provider?.description,
        providerType: provider?.providerType,
        vCenter: provider?.vCenter,
        esxi: provider?.esxi,
        datacenter: provider?.datacenter,
        cluster: provider?.cluster,
        userName: provider?.userName,
        password: provider?.password,
      });
      setDataCenterVo({
        id: provider?.storagePoolId,
      });
      setHostVo({
        id: provider?.proxyHostId,
      })
      
    }
  }, [isOpen, editMode]);


  const validateForm = () => {
    const nameError = checkName(formState.name);
    if (nameError) return nameError;
    const duplicateError = checkDuplicateName(providers, formState.name, formState.id);
    if (duplicateError) return duplicateError;

    if (!editMode && !formState.sshRootPassword) return "비밀번호를 입력해주세요.";
    if (!dataCenterVo.id === "none") return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!hostVo.id === "none") return `${Localization.kr.HOST}를 선택해주세요.`;
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
      
    };

    Logger.debug(`SettingProviderModal > handleFormSubmit ... dataToSubmit: `, dataToSubmit);
    // editMode
    //   ? editHost({ hostId: formState.id, hostData: dataToSubmit })
    //   : addHost({ hostData: dataToSubmit, deployHostedEngine: String(formState.deployHostedEngine), });
  };

  return (
    <BaseModal targetName={Localization.kr.PROVIDER} submitTitle={pLabel}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "600px" }} 
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
        options={[]}
        disabled={editMode}
        onChange={handleInputChange(setFormState, "quotaMode", validationToast)}
      />
      <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
        value={dataCenterVo.id}
        disabled={editMode && !!dataCenterVo.id}
        loading={isDataCentersLoading}
        options={datacenters}
        onChange={handleSelectIdChange(setDataCenterVo, "datacenter", validationToast)}
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
        onChange={handleSelectIdChange(setHostVo, "host", validationToast)}
      />
      <LabelInput id="userName" label={`${Localization.kr.USER} ${Localization.kr.NAME}`}
        value={formState.userName}
        onChange={handleInputChange(setFormState, "userName", validationToast)}
      />
      <LabelInput id="password" label="비밀번호" type="password"
        onChange={handleInputChange(setFormState, "password")}
        value={formState.password}
        required={true}
      />
    </BaseModal>
  );
};

export default SettingProviderModal;
