import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import DomainNfs from "./create/DomainNfs";
import DomainFibre from "./create/DomainFibre";
import LabelInputNum from "../../label/LabelInputNum";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import LabelInput from "../../label/LabelInput";
import {
  useAddDomain,
  useAllDataCenters,
  useStroageDomain,
  useEditDomain,
  useHostsFromDataCenter,
  useFibreFromHost,
} from "../../../api/RQHook";
import { checkName } from "../../../util";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import useGlobal from "../../../hooks/useGlobal";
import { handleInputChange, handleSelectIdChange } from "../../label/HandleInput";
import DomainCheckModal from "./DomainCheckModal";

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

const DomainModal = ({
  isOpen, onClose, editMode=false
}) => {
  const dLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;

  const { datacentersSelected, domainsSelected } = useGlobal()
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

  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.DOMAIN} ${dLabel} ${Localization.kr.FINISHED}`);
  };
  const { data: domain } = useStroageDomain(domainId);
  const { mutate: addDomain } = useAddDomain(onSuccess, () => onClose());
  const { mutate: editDomain } = useEditDomain(onSuccess, () => onClose()); // 편집은 단순 이름, 설명 변경정도
  const { 
    data: datacenters = [],
    isLoading: isDatacentersLoading 
  } = useAllDataCenters((e) => ({ ...e }));
  const {
    data: hosts = [],
    isLoading: isHostsLoading 
  } = useHostsFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));
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
        domainType: domain?.type,
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
    const nameError = checkName(formState.name);
    if (nameError) return nameError;
  
    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!hostVo.id) return `${Localization.kr.HOST}를 선택해주세요.`;

    if (isNfs && !nfsAddress) return "경로를 입력해주세요.";
    if (isNfs && !editMode && (!nfsAddress.includes(':') || !nfsAddress.includes('/'))){
      return "주소입력이 잘못되었습니다."
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
    if (error) return toast.error(error);
  
    if(isFibre && !editMode) {
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

    const onSubmitSuccess = () => {
      onClose();  // 🔥 모달 닫기
      toast.success(`${Localization.kr.DOMAIN} ${dLabel} ${Localization.kr.FINISHED}`);
    };
  
    editMode
      ? editDomain({ domainId: formState.id, domainData: dataToSubmit }, { onSuccess: onSubmitSuccess })
      : addDomain(dataToSubmit, { onSuccess: onSubmitSuccess });
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
            onChange={handleSelectIdChange(setDataCenterVo, datacenters)}
          />
          <LabelSelectOptions id="domain-type" label={`도메인 기능`}
            value={formState.domainType}
            disabled={editMode}
            options={domainTypes}
            onChange={handleInputChange(setFormState, "domainType")}
          />
          <LabelSelectOptions id="storage-type" label="스토리지 유형"
            value={formState.storageType}
            disabled={editMode}
            options={storageTypes}
            onChange={handleInputChange(setFormState, "storageType")}
          />
          <LabelSelectOptionsID id="host" label={Localization.kr.HOST}
            value={hostVo.id}
            disabled={editMode}
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
        <DomainNfs
          editMode={editMode}
          nfsAddress={nfsAddress} setNfsAddress={setNfsAddress}
        />
      )}

      {/* Firbre 의 경우 */}
      {isFibre && hostVo?.id && (
        <DomainFibre
          editMode={editMode}
          domain={editMode? domain : ""} 
          fibres={fibres}
          lunId={lunId} setLunId={setLunId}
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
  { value: "data", label: "데이터" },
  { value: "iso", label: "ISO" },
  { value: "export", label: "내보내기" },
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