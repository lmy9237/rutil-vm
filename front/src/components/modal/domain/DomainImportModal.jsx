import React, { useState, useEffect, useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import DomainImportNfs                  from "./import/DomainImportNfs";
import DomainImportFibre                from "./import/DomainImportFibre";
import LabelInputNum                    from "@/components/label/LabelInputNum";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import LabelInput                       from "@/components/label/LabelInput";
import { 
  handleInputChange, 
  handleSelectIdChange,
} from "@/components/label/HandleInput";
import {
  useImportDomain,
  useAllDataCenters,
  useHostsFromDataCenter,
  useSearchFcFromHost,
  useAllNfsStorageDomains,
} from "../../../api/RQHook";
import { checkName }                    from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

// 일반 정보
const initialFormState = {
  id: "",
  domainType: "data", // 기본값 설정
  storageType: "NFS", // 기본값 설정
  name: "",
  comment: "",
  description: "",
  warning: "10",
  spaceBlocker: "5",
};


const DomainImportModal = ({
  isOpen,
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  const { datacentersSelected } = useGlobal()
  const datacenterId = useMemo(() => [...datacentersSelected][0]?.id, [datacentersSelected]);

  const [formState, setFormState] = useState(initialFormState); // 일반정보
  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [hostVo, setHostVo] = useState({ id: "", name: "" });
  const [storageTypes, setStorageTypes] = useState([]);
  const [nfsAddress, setNfsAddress] = useState(""); // nfs
  const [id, setId] = useState(""); // fibre 사용 id

  const { mutate: importDomain } = useImportDomain(onClose, onClose);
  
  const { 
    data: datacenters = [],
    isLoading: isDatacentersLoading 
  } = useAllDataCenters((e) => ({ ...e }));
  const {
    data: hosts = [],
    isLoading: isHostsLoading 
  } = useHostsFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));
  const { data: nfsList = [] } = useAllNfsStorageDomains((e) => ({ ...e }));
  const { 
    data: fibres = [], 
    isLoading: isFibresLoading,
    isError: isFibresError, 
    isSuccess: isFibresSuccess
  } = useSearchFcFromHost(hostVo?.id, (e) => ({ ...e }));
  
  
  const isNfs = formState.storageType === "NFS";
  const isFibre = formState.storageType === "FCP";

  const resetFormStates = () => {
    setFormState(initialFormState);
    setHostVo({ id: "", name: "" });
    setStorageTypes([]);
    setNfsAddress("");
    setId("");
  };

  useEffect(() => {
    if (!isOpen) {
      resetFormStates();
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (datacenterId) {
      const selected = datacenters.find(dc => dc.id === datacenterId);
      setDataCenterVo({ id: selected?.id, name: selected?.name });
    } else if (datacenters.length > 0) {
      // datacenterId가 없다면 기본 데이터센터 선택
      const defaultDc = datacenters.find(dc => dc.name === "Default");
      const firstDc = defaultDc || datacenters[0];
      setDataCenterVo({ id: firstDc.id, name: firstDc.name });
    }
  }, [datacenterId, datacenters]);

  useEffect(() => {
    if (dataCenterVo.id) {
      setFormState((prev) => ({ ...initialFormState, domainType: prev.domainType }));
      setStorageTypes(storageTypeOptions(initialFormState.domainType));
      setNfsAddress("");
      setId("");
      // refetchFibres();
    }
  }, [dataCenterVo]);
  
  useEffect(() => {
    if (hosts && hosts.length > 0) {
      const firstH = hosts[0];
      setHostVo({ id: firstH.id, name: firstH.name });
    }
  }, [hosts]);

  useEffect(() => {
    const options = storageTypeOptions(formState.domainType);
    setStorageTypes(options);
    if (options.length > 0) {
      setFormState((prev) => ({ ...prev, storageType: options[0].value}));
    }
  }, [formState.domainType]);

  useEffect(() => {
    setNfsAddress("");
    setId("");    
  }, [formState.storageType]);

  const validateForm = () => {
    const nameError = checkName(formState.name);
    if (nameError) return nameError;
  
    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!hostVo.id) return `${Localization.kr.HOST}를 선택해주세요.`;

    if (isNfs && !nfsAddress) return "경로를 입력해주세요.";
    if (isNfs && (!nfsAddress.includes(':') || !nfsAddress.includes('/'))){
      return "주소입력이 잘못되었습니다."
    }    
    if(isNfs) {
      const duplicationNfs = nfsList.find(nfs => nfs?.originPath === nfsAddress);
      if (duplicationNfs) return `${nfsAddress}는 이미 등록되어 있는 NFS입니다`
    }
    if (isFibre && !id) return "id을 반드시 선택해주세요."; // 🔥 추가된 부분

    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return
    };

    const storageVo = isNfs
      ? (() => {
          const [storageAddress, storagePath] = nfsAddress.split(":");
          return { type: "NFS", address: storageAddress, path: storagePath };
        })()
      : (() => {
          const selectedFibre = fibres.find((f) => f.id === id);
          return {
            type: "FCP",
            id: selectedFibre.id,
            volumeGroupVo: { 
              id: selectedFibre.storageVo.volumeGroupVo.id, 
              logicalUnitVos: [
                { 
                  id: selectedFibre.storageVo.volumeGroupVo.logicalUnitVos[0].id,
                  serial: selectedFibre.storageVo.volumeGroupVo.logicalUnitVos[0].serial,
                  status: selectedFibre.storageVo.volumeGroupVo.logicalUnitVos[0].status,
                  vendorId: selectedFibre.storageVo.volumeGroupVo.logicalUnitVos[0].vendorId,
                  volumeGroupId: selectedFibre.storageVo.volumeGroupVo.logicalUnitVos[0].volumeGroupId,
                }
              ] 
            }
          };
        })();
        
    const dataToSubmit = {
      ...formState,
      id: isFibre ? id : "",
      type: formState.domainType,
      dataCenterVo,
      hostVo,
      storageVo
    };
  
    Logger.debug(`DomainModal > submitDomain ... dataToSubmit:`, dataToSubmit);
    importDomain(dataToSubmit);
  };  

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={Localization.kr.IMPORT}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px"}}
    >
      <div className="storage-domain-new-first">
        <div>
          <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
            value={dataCenterVo.id}
            loading={isDatacentersLoading}
            options={datacenters}
            onChange={handleSelectIdChange(setDataCenterVo, datacenters)}
          />
          <LabelSelectOptions id="domain-type" label={`도메인 기능`}
            value={formState.domainType}
            options={domainTypes}
            onChange={handleInputChange(setFormState, "domainType")}
          />
          <LabelSelectOptions id="storage-type" label="스토리지 유형"
            value={formState.storageType}
            options={storageTypes}
            onChange={handleInputChange(setFormState, "storageType")}
          />
          <LabelSelectOptionsID id="host" label={Localization.kr.HOST}
            value={hostVo.id}
            loading={isHostsLoading}
            options={hosts}
            onChange={handleSelectIdChange(setHostVo, hosts)}
          />
        </div>
        <hr/>

        <div className="domain-new-right">
          <LabelInput id="name" label={Localization.kr.NAME}
            value={formState.name}
            onChange={handleInputChange(setFormState, "name")}
            autoFocus
          />
          <LabelInput id="description" label={Localization.kr.DESCRIPTION}
            value={formState.description}
            onChange={handleInputChange(setFormState, "description")}
          />
          <LabelInput id="comment" label={Localization.kr.COMMENT}
            value={formState.comment}
            onChange={handleInputChange(setFormState, "comment")}
          />
        </div>
      </div>
      <hr/>

      {/* NFS 의 경우 */}
      {isNfs && (
        <DomainImportNfs
          nfsAddress={nfsAddress} setNfsAddress={setNfsAddress}
        />
      )}

      {/* Firbre 의 경우 */}
      {isFibre && (
        <DomainImportFibre
          fibres={fibres}
          id={id} setId={setId}
          isFibresLoading={isFibresLoading} isFibresError={isFibresError} isFibresSuccess={isFibresSuccess}
        />
      )}
      <hr />

      <div className="tab-content">
        <div className="storage-specific-content">
          <LabelInputNum id="warning" label={`${Localization.kr.DISK} 공간 부족 경고 표시 (%)`}
            value={formState.warning}
            onChange={handleInputChange(setFormState, "warning")}
          />
          <LabelInputNum id="spaceBlocker" label={`심각히 부족한 ${Localization.kr.DISK} 공간의 동작 차단 (GB)`}
            value={formState.spaceBlocker}
            onChange={handleInputChange(setFormState, "spaceBlocker")}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default DomainImportModal;


const domainTypes = [
  { value: "data", label: "데이터" },
  { value: "iso", label: "ISO" },
  { value: "export", label: Localization.kr.EXPORT },
];

const storageTypeOptions = (dType) => {
  switch (dType) {
    case "iso":
    case "export":
      return [{ value: "NFS", label: "NFS" }];
    default: // data
      return [
        { value: "NFS", label: "NFS" },
        { value: "FCP", label: "Fibre Channel" },
      ];
  }
};