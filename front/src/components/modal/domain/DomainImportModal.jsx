import React, { useState, useEffect, useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import { Separator }                    from "@/components/ui/separator"
import BaseModal                        from "@/components/modal/BaseModal";
import DomainImportNfs                  from "./import/DomainImportNfs";
import DomainImportFibre                from "./import/DomainImportFibre";
import LabelInputNum                    from "@/components/label/LabelInputNum";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import LabelInput                       from "@/components/label/LabelInput";
import { 
  handleInputChange, handleSelectIdChange,
} from "@/components/label/HandleInput";
import {
  useImportDomain,
  useHostsFromDataCenter,
  useSearchFcFromHost,
  useAllNfsStorageDomains,
  useAllStorageDomains,
  useAllDataCentersWithHosts,
} from "../../../api/RQHook";
import { checkName, emptyIdNameVo, useSelectFirstItemEffect, useSelectFirstNameItemEffect, useSelectItemEffect, useSelectItemOrDefaultEffect }                    from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

// 일반 정보
const initialFormState = {
  id: "",
  storageDomainType: "data", // 기본값 설정
  storageType: "nfs", // 기본값 설정
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
  const [dataCenterVo, setDataCenterVo] = useState(emptyIdNameVo());
  const [hostVo, setHostVo] = useState(emptyIdNameVo());
  const [storageTypes, setStorageTypes] = useState([]);
  const [nfsAddress, setNfsAddress] = useState(""); // nfs
  const [id, setId] = useState(""); // fibre 사용 id

  const isNfs = formState.storageType === "nfs";
  const isFibre = formState.storageType === "fcp";

  const { mutate: importDomain } = useImportDomain(onClose, onClose);
  
  const { data: domains = [] } = useAllStorageDomains((e) => ({ ...e }));

  const { 
    data: datacenters = [],
    isLoading: isDatacentersLoading 
  } = useAllDataCentersWithHosts((e) => ({ ...e }));

  const {
    data: hosts = [],
    isLoading: isHostsLoading 
  } = useHostsFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));

  const { 
    data: nfsList = [] 
  } = useAllNfsStorageDomains((e) => ({ ...e }));
  
  const { 
    data: fibres = [], 
    isLoading: isFibresLoading,
    isError: isFibresError, 
    isSuccess: isFibresSuccess
  } = useSearchFcFromHost(hostVo?.id, (e) => ({ ...e }));
  
  const getAvailableDomainTypes = useMemo(() => {
    const hasImportExport = domains.some(d => d.storageDomainType === "import_export");
    return [
      { value: "data", label: "데이터" },
      { value: "iso", label: "ISO" },
      ...(hasImportExport 
          ? [] 
          : [{ value: "import_export", label: Localization.kr.EXPORT }]
        )
    ];
  }, [domains]);

  // 데이터센터 지정
  useSelectItemOrDefaultEffect(datacenterId, false, datacenters, setDataCenterVo, "Default");
  useSelectItemEffect(hostVo?.id, false, hosts, setHostVo);

  const resetFormStates = () => {
    setFormState(initialFormState);
    setHostVo(emptyIdNameVo());
    setStorageTypes([]);
    setNfsAddress("");
    setId("");
  };

  useEffect(() => {
    if (!isOpen) {
      resetFormStates();
    }
  }, [isOpen]);


  useEffect(() => {
    if (dataCenterVo.id) {
      setFormState((prev) => ({ 
        ...initialFormState,
        storageDomainType: prev.storageDomainType
      }));
      setStorageTypes(storageTypeOptions(initialFormState.storageDomainType));
      setNfsAddress("");
      setId("");
    }
  }, [dataCenterVo]);

  useEffect(() => {
    const options = storageTypeOptions(formState.storageDomainType);
    setStorageTypes(options);
    if (options.length > 0) {
      setFormState((prev) => ({ ...prev, storageType: options[0].value}));
    }
  }, [formState.storageDomainType]);

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
          return { type: "nfs", address: storageAddress, path: storagePath };
        })()
      : (() => {
          const selectedFibre = fibres.find((f) => f.id === id);
          return {
            type: "fcp",
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
      storageDomainType: formState.storageDomainType,
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
      isReady={
        datacenters.length > 0 &&
        domains.length > 0 /* &&
        hosts.length > 0 &&
        (!isFibre || isFibresSuccess) */
      }
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px"}}
    >
      {/* ([...hosts].length === 0) && <div className="storage-domain-new-first">
        <Label>데이터센터 내 지정 할 호스트가 존재하지 않습니다.</Label>
      </div> */}
      <div className="storage-domain-new-first">
        <div>
          <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
            value={dataCenterVo.id}
            loading={isDatacentersLoading}
            options={datacenters}
            onChange={handleSelectIdChange(setDataCenterVo, datacenters, validationToast)}
          />
          <LabelSelectOptions id="domain-type" label={`도메인 기능`}
            value={formState.storageDomainType}
            options={getAvailableDomainTypes}
            onChange={handleInputChange(setFormState, "storageDomainType", validationToast)}
          />
          <LabelSelectOptions id="storage-type" label={`${Localization.kr.STORAGE} ${Localization.kr.TYPE}`}
            value={formState.storageType}
            options={storageTypes}
            onChange={handleInputChange(setFormState, "storageType", validationToast)}
          />
          <LabelSelectOptionsID id="host" label={Localization.kr.HOST}
            value={hostVo.id}
            loading={isHostsLoading}
            options={hosts}
            onChange={handleSelectIdChange(setHostVo, hosts, validationToast)}
          />
        </div>
        <Separator />
        <div className="domain-new-right">
          <LabelInput id="name" label={Localization.kr.NAME}
            value={formState.name}
            onChange={handleInputChange(setFormState, "name", validationToast)}
            autoFocus
          />
          <LabelInput id="description" label={Localization.kr.DESCRIPTION}
            value={formState.description}
            onChange={handleInputChange(setFormState, "description", validationToast)}
          />
          <LabelInput id="comment" label={Localization.kr.COMMENT}
            value={formState.comment}
            onChange={handleInputChange(setFormState, "comment", validationToast)}
          />
        </div>
      </div>
      <Separator />

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
      <Separator />
      <div className="tab-content">
        <div className="storage-specific-content">
          <LabelInputNum id="warning" label={`${Localization.kr.DISK} 공간 부족 경고 표시 (%)`}
            value={formState.warning}
            onChange={handleInputChange(setFormState, "warning", validationToast)}
          />
          <LabelInputNum id="spaceBlocker" label={`심각히 부족한 ${Localization.kr.DISK} 공간의 동작 차단 (GB)`}
            value={formState.spaceBlocker}
            onChange={handleInputChange(setFormState, "spaceBlocker", validationToast)}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default DomainImportModal;


const storageTypeOptions = (dType) => {
  switch (dType) {
    case "iso":
    case "import_export":
      return [{ value: "nfs", label: "NFS" }];
    default: // data
      return [
        { value: "nfs", label: "NFS" },
        { value: "fcp", label: "Fibre Channel" },
      ];
  }
};