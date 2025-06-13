import React, { useState, useEffect, useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import DomainNfs                        from "./create/DomainNfs";
import DomainFibre                      from "./create/DomainFibre";
import DomainCheckModal                 from "./DomainCheckModal";
import LabelInputNum                    from "@/components/label/LabelInputNum";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import LabelInput                       from "@/components/label/LabelInput";
import { 
  handleInputChange, handleSelectIdChange
} from "@/components/label/HandleInput";
import {
  useAddDomain,
  useAllDataCenters,
  useStorageDomain,
  useEditDomain,
  useHostsFromDataCenter,
  useFibreFromHost,
  useAllNfsStorageDomains,
} from "@/api/RQHook";
import { checkName }                    from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

// 일반 정보
const initialFormState = {
  id: "",
  domainType: "DATA", // 기본값 설정
  storageType: "NFS", // 기본값 설정
  name: "",
  comment: "",
  description: "",
  warning: "10",
  spaceBlocker: "5",
};

const DomainModal = ({
  isOpen,
  onClose,
  editMode=false
}) => {
  const { validationToast } = useValidationToast();
  // const { closeModal } = useUIState()
  const { 
    datacentersSelected, domainsSelected,
  } = useGlobal()
  const dLabel = editMode 
    ? Localization.kr.UPDATE 
    : Localization.kr.CREATE;

  const domainId = useMemo(() => [...domainsSelected][0]?.id, [domainsSelected]);
  const datacenterId = useMemo(() => [...datacentersSelected][0]?.id, [datacentersSelected]);

  const [formState, setFormState] = useState(initialFormState); // 일반정보
  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [hostVo, setHostVo] = useState({ id: "", name: "" });
  const [storageTypes, setStorageTypes] = useState([]);
  const [nfsAddress, setNfsAddress] = useState(""); // nfs
  const [lunId, setLunId] = useState(""); // fibre 사용

  const [isDomainCheckOpen, setDomainCheckOpen] = useState(false);
  const [isOverwrite, setIsOverwrite] = useState(false);
  const [selectedLunData, setSelectedLunData] = useState(null); // overwrite 일때 넘겨줄 값

  const isNfs = formState.storageType === "NFS";
  const isFibre = formState.storageType === "FCP";

  const { data: domain } = useStorageDomain(domainId);
  const { mutate: addDomain } = useAddDomain(onClose, onClose);
  const { mutate: editDomain } = useEditDomain(onClose, onClose); // 편집은 단순 이름, 설명 변경정도
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
    refetch: refetchFibres,
    isLoading: isFibresLoading,
    isError: isFibresError, 
    isSuccess: isFibresSuccess
  } = useFibreFromHost(hostVo?.id || undefined, (e) => ({ ...e }));

  const resetFormStates = () => {
    setFormState(initialFormState);
    setHostVo({ id: "", name: "" });
    setStorageTypes([]);
    setNfsAddress("");
    setLunId("");
  };

  useEffect(() => {
    if (!isOpen) {
      resetFormStates();
      return;
    }
    if (editMode && domain) {
      const storage = domain?.storageVo;
      setFormState({
        id: domain?.id,
        domainType: domain?.storageDomainType,
        storageType: storage?.type,
        name: domain?.name,
        comment: domain?.comment,
        description: domain?.description,
        warning: domain?.warning,
        spaceBlocker: domain?.spaceBlocker,
      });
      setDataCenterVo({ 
        id: domain?.dataCenterVo?.id, 
        name: domain?.dataCenterVo?.name 
      });
      setHostVo({ 
        id: domain?.hostVo?.id,
        name: domain?.hostVo?.name 
      });
      
      if (storage.type === "NFS") { 
        setNfsAddress(`${storage?.address}:${storage?.path}`);
      } else if(storage.type === "FCP") {
        setLunId(storage?.volumeGroupVo?.logicalUnitVos[0]?.id);
      }
    } else {
      resetFormStates();
    }
  }, [isOpen, editMode, domain]);

  useEffect(() => {
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
    if (!editMode && hosts && hosts.length > 0 && !hostVo.id) {
      const firstH = hosts[0];
      setHostVo({ id: firstH.id, name: firstH.name });
    }
  }, [hosts, editMode, hostVo.id]);

  useEffect(() => {
    if (!editMode && dataCenterVo.id) {
      setFormState((prev) => ({ ...initialFormState, domainType: prev.domainType }));
      setStorageTypes(storageTypeOptions(initialFormState.domainType));
      setNfsAddress("");
      setLunId("");
      if (hostVo?.id) {
        refetchFibres();
      }
    }
  }, [dataCenterVo, editMode, hostVo?.id, refetchFibres]);
  
  useEffect(() => {
    if (!editMode && isFibre && hostVo?.id) {
      refetchFibres();
    }
  }, [hostVo?.id, isFibre, editMode, refetchFibres]);

  useEffect(() => {
    const options = storageTypeOptions(formState.domainType);
    setStorageTypes(options);
    if (!editMode && options.length > 0) {
      setFormState((prev) => ({ ...prev, storageType: options[0].value}));
    }
  }, [formState.domainType, editMode]);

  useEffect(() => {
    if(!editMode){
      setNfsAddress("");
      setLunId("");
    }
  }, [editMode, formState.storageType]);

  const validateForm = () => {
    Logger.debug(`DomainModal > validateForm ... `)
    const nameError = checkName(formState.name);
    if (nameError) return nameError;
  
    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!hostVo.id) return `${Localization.kr.HOST}를 선택해주세요.`;

    if (isNfs && !nfsAddress) return "경로를 입력해주세요.";
    if (isNfs && !editMode && (!nfsAddress.includes(':') || !nfsAddress.includes('/'))){
      return "주소입력이 잘못되었습니다."
    }
    if(isNfs && !editMode) {
      const duplicationNfs = nfsList.find(nfs => nfs?.originPath === nfsAddress);
      if (duplicationNfs) return `${nfsAddress}는 이미 등록되어 있는 NFS입니다`
    }

    if (isFibre) {
      if (!lunId) return "LUN을 반드시 선택해주세요."; // 🔥 추가된 부분
      const selectedLogicalUnit = fibres
        .map(f => f.logicalUnitVos[0])
        .find(lun => lun?.id === lunId);
        
      if (!selectedLogicalUnit) return "선택한 LUN 정보가 올바르지 않습니다."; // 추가 방어로직
      if (!editMode && selectedLogicalUnit.storageDomainId !== "") {
        return "이미 다른 도메인에서 사용 중인 LUN은 선택할 수 없습니다."; // 더 명확한 메시지
      }
    }

    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
  
    Logger.debug(`DomainModal > handleFormSubmit ... `)
    if (isFibre && !editMode) {
      const selectedLogicalUnit = fibres
        .map(f => f.logicalUnitVos[0])
        .find(lun => lun?.id === lunId);

      if (selectedLogicalUnit.status === "USED") {
        setSelectedLunData(selectedLogicalUnit);
        setIsOverwrite(true);
        setDomainCheckOpen(true); // 확인 모달 열기
        return;
      }
    }

    submitDomain(); // 바로 제출
  };

  const submitDomain = () => {
    const [storageAddress, storagePath] = nfsAddress.split(":");
    const logicalUnit = fibres
      .map(f => f.logicalUnitVos[0])
      .find(lun => lun?.id === lunId);
  
    const storageVo = isNfs
      ? { type: "NFS", address: storageAddress, path: storagePath }
      : {
          type: "FCP",
          volumeGroupVo: { logicalUnitVos: [{ id: logicalUnit.id }] }
        };
  
    const dataToSubmit = {
      ...formState,
      type: formState.domainType,
      dataCenterVo,
      hostVo,
      storageVo
    };
  
    Logger.debug(`DomainModal > submitDomain ... dataToSubmit:`, dataToSubmit);
    editMode
      ? editDomain({ domainId: formState.id, domainData: dataToSubmit })
      : addDomain(dataToSubmit);
  };
  

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={dLabel}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px"}}
    >
      <div className="storage-domain-new-first">
        <div>
          <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
            value={dataCenterVo.id}
            disabled={editMode}
            loading={isDatacentersLoading}
            options={datacenters}
            onChange={handleSelectIdChange(setDataCenterVo, datacenters, validationToast)}
          />
          <LabelSelectOptions id="domain-type" label={`도메인 기능`}
            value={formState.domainType}
            disabled={editMode}
            options={domainTypes}
            onChange={handleInputChange(setFormState, "domainType", validationToast)}
          />
          <LabelSelectOptions id="storage-type" label=""
            value={formState.storageType}
            disabled={editMode}
            options={storageTypes}
            onChange={handleInputChange(setFormState, "storageType", validationToast)}
          />
          <LabelSelectOptionsID id="host" label={Localization.kr.HOST}
            value={hostVo.id}
            disabled={editMode}
            loading={isHostsLoading}
            options={hosts}
            onChange={handleSelectIdChange(setHostVo, hosts, validationToast)}
          />
        </div>
        <hr/>

        <div className="domain-new-right">
          <LabelInput id="name" label={Localization.kr.NAME}
            value={formState.name}
            onChange={handleInputChange(setFormState, "name", validationToast)}
            required={true}
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
      <hr/>

      {/* NFS 의 경우 */}
      {isNfs && (
        <DomainNfs editMode={editMode} nfsAddress={nfsAddress} setNfsAddress={setNfsAddress} />
      )}

      {/* Fibre 의 경우 */}
      {editMode ? (
        <>
        {isFibre && (
          <DomainFibre
            editMode={true}
            domain={domain} 
            fibres={fibres}
            lunId={lunId} setLunId={setLunId}
            isFibresLoading={isFibresLoading} isFibresError={isFibresError} isFibresSuccess={isFibresSuccess}
          />
        )}
        </>
      ):(
        <>
        {isFibre && hostVo?.id && (
          <DomainFibre
            domain={""} 
            fibres={fibres}
            lunId={lunId} setLunId={setLunId}
            isFibresLoading={isFibresLoading} isFibresError={isFibresError} isFibresSuccess={isFibresSuccess}
          />
        )}
        </>
      )}
      <hr />

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
            
      <DomainCheckModal
        isOpen={isDomainCheckOpen}
        onClose={() => {
          setDomainCheckOpen(false);
          setIsOverwrite(false);
          setSelectedLunData(null);
        }}
        domain={selectedLunData}
        onApprove={() => {
          setDomainCheckOpen(false);
          submitDomain(); // 승인했으면 최종 등록
        }}
      />
    </BaseModal>
  );
};

export default DomainModal;


const domainTypes = [
  { value: "DATA", label: "데이터" },
  { value: "ISO", label: "ISO" },
  { value: "EXPORT", label: Localization.kr.EXPORT },
];

const storageTypeOptions = (dType) => {
  switch (dType) {
    case "ISO":
    case "EXPORT":
      return [{ value: "NFS", label: "NFS" }];
    default: // data
      return [
        { value: "NFS", label: "NFS" },
        { value: "FCP", label: "Fibre Channel" },
      ];
  }
};