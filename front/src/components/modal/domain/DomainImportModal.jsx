import React, { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelInputNum from "../../label/LabelInputNum";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import LabelInput from "../../label/LabelInput";
import { checkName } from "../../../util";
import Localization from "../../../utils/Localization";
import DomainNfsImport from "./import/DomainNfsImport";
import DomainFibreImport from "./import/DomainFibreImport";
import DomainIscsiImport from "./import/DomainIscsiImport";
import {
  useAllDataCenters,
  useHostsFromDataCenter,
  useImportIscsiFromHost,
  useImportFcpFromHost,
  useImportDomain,
  useLoginIscsiFromHost,
} from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

const domainTypes = [
  { value: "data", label: "데이터" },
  { value: "iso", label: "ISO" },
  { value: "export", label: "내보내기" },
];

// 일반 정보
const initialFormState = {
  id: "",
  domainType: "data", // 기본값 설정
  storageType: "nfs", // 기본값 설정
  name: "",
  comment: "",
  description: "",
  warning: "10",
  spaceBlocker: "5",
};

// import = 가져오기
// nfs 는 같음, iscsi 주소, 포트, 사용자 인증 이름, 암호 해서 검색
const importFormState = {
  target: "",
  address: "",
  port: 3260,
};

const loginFormState = {
  chapName: "",
  chapPassword: "",
  useChap: false,
};

const DomainImportModal = ({
  isOpen,
  datacenterId,
  onClose,
}) => {
  const [formState, setFormState] = useState(initialFormState); // 일반정보
  const [formImportState, setFormImportState] = useState(importFormState); // 가져오기
  const [formLoginState, setFormLoginState] = useState(loginFormState); // 로그인
  
  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [hostVo, setHostVo] = useState({ id: "", name: "" });
  const [storageTypes, setStorageTypes] = useState([]);

  const [nfsAddress, setNfsAddress] = useState("");
  const [lunId, setLunId] = useState(""); // iscsi, fibre 생성시 사용

  const [iscsiResults, setIscsiResults] = useState([]); // 검색결과
  const [fcResults, setFcResults] = useState([]); // 검색결과
  
  const isNfs = formState.storageType === "nfs"
  const isIscsi = formState.storageType === "iscsi"
  const isFibre = formState.storageType === "fcp"

  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.DOMAIN} 가져오기 완료`);
  };
  
  const { mutate: importDomain } = useImportDomain(onSuccess, () => onClose()); // 가져오기
  const { mutate: importIscsiFromHostAPI } = useImportIscsiFromHost(
    (data) => {
      setIscsiResults(data); // <-- 여기서 직접 설정
    },
    (error) => {
      toast.error("iSCSI 가져오기 실패:", error);
    }
  );  
  const { mutate: importFcpFromHost } = useImportFcpFromHost(onSuccess, () => onClose()); // 가져오기 fibre

  const { 
    data: dataCenters = [],
    isLoading: isDataCentersLoading 
  } = useAllDataCenters((e) => ({ ...e }));
  const { 
    data: hosts = [], 
    isLoading: isHostsLoading 
  } = useHostsFromDataCenter(dataCenterVo?.id, (e) => ({ ...e }));
  
  // const {
  //   data: fibres = [],
  //   refetch: refetchFibres,
  //   isLoading: isFibresLoading,
  //   isError: isFibresError, 
  //   isSuccess: isFibresSuccess
  // } = useFibreFromHost(hostVo?.id, (e) => ({ ...e }));

  const transFibreData = fcResults.map((f) => ({
    ...f,
    id: f?.id,
    name: f?.name,
  }));

  const resetFormStates = () => {
    setFormState(initialFormState);
    setFormImportState(importFormState);
    setFormLoginState(loginFormState);
    setNfsAddress("");
    setLunId("");
    setIscsiResults([]);
    setFcResults([]);
  };
  
  useEffect(() => {
    if (isOpen) {
      resetFormStates();
    }
  }, [isOpen]);


  useEffect(() => {
    if (datacenterId) {
      setDataCenterVo({id: datacenterId});
    } else if (dataCenters && dataCenters.length > 0) {
      const defaultDc = dataCenters.find(dc => dc.name === "Default"); // 만약 "Default"라는 이름이 있다면 우선 선택
      if (defaultDc) {
        setDataCenterVo({ id: defaultDc.id, name: defaultDc.name });
      } else {
        setDataCenterVo({ id: dataCenters[0].id, name: dataCenters[0].name });
      }
    }
  }, [dataCenters, datacenterId]);

  useEffect(() => {
    if (hosts && hosts.length > 0) {
      setHostVo({id: hosts[0].id, name: hosts[0].name});
    }
  }, [hosts]);

  
  const storageTypeOptions = useCallback((dType) => {
    switch (dType) {
      case "iso":
      case "export":
        return [{ value: "nfs", label: "NFS" }];
      default: // data
        return [
          { value: "nfs", label: "NFS" },
          { value: "iscsi", label: "ISCSI" },
          { value: "fcp", label: "Fibre Channel" },
        ];
    }
  }, []);
  

  useEffect(() => {
    Logger.debug(`DomainImportModal > useEffect ... 스토리지유형 설정`)
    const options = storageTypeOptions(formState.domainType);
    setStorageTypes(options);

    // 기본 storageType을 options의 첫 번째 값으로 설정
    if (options.length > 0) {
      setFormState((prev) => ({ ...prev, storageType: options[0].value }));
    }
  }, [formState.domainType]);

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ 
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSelectIdChange = (setVo, voList) => (e) => {
    const selected = voList.find((item) => item.id === e.target.value);
    if (selected) setVo({ id: selected.id, name: selected.name });
  }; 

  const validateForm = () => {
    const nameError = checkName(formState.name);
    if (nameError) return nameError;

    if(isNfs && (!nfsAddress.includes(':') || !nfsAddress.includes('/'))){
      return "주소입력이 잘못되었습니다."
    }
  
    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!hostVo.id) return `${Localization.kr.HOST}를 선택해주세요.`;
    if (formState.storageType === "NFS" && !nfsAddress) return "경로를 입력해주세요.";
    if (formState.storageType !== "nfs" && lunId) {
      const selectedLogicalUnit =
        formState.storageType === "iscsi"
          ? iscsiResults.find((iLun) => iLun.id === lunId)
          : fcResults.find((fLun) => fLun.id === lunId);
      if (selectedLogicalUnit?.abled === "NO")
        return "선택한 항목은 사용할 수 없습니다.";
    }
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);
  
    const logicalUnit =
      formState.storageType === "iscsi"
        ? iscsiResults.find((iLun) => iLun.id === lunId)
        // : formState.storageType === "fcp"
        //   ? fibres.find((fLun) => fLun.id === lunId)
          : null;
    
    const [storageAddress, storagePath] = nfsAddress.split(":");

    const dataToSubmit = {
      ...formState,
      dataCenterVo,
      hostVo,
      logicalUnits: logicalUnit ? [logicalUnit.id] : [],
      ...(formState.storageType === "nfs" && { storageAddress, storagePath }),
    };

    Logger.debug(`DomainModal > handleFormSubmit ... dataToSubmit: `, dataToSubmit);
    importDomain(dataToSubmit)
  };

  return (
    <BaseModal targetName={Localization.kr.DOMAIN} submitTitle={"가져오기"}
      isOpen={isOpen} onClose={onClose}      
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "730px"}}
    >
      <div className="storage-domain-new-first">
        <div>
          <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
            value={dataCenterVo.id}
            loading={isDataCentersLoading}
            options={dataCenters}
            onChange={handleSelectIdChange(setDataCenterVo, dataCenters)}
          />
          <LabelSelectOptions id="domain-type" label={`도메인 유형`}
            value={formState.domainType}
            options={domainTypes}
            onChange={handleInputChange("domainType")}
          />
          <LabelSelectOptions id="storage-type" label="스토리지 유형"
            value={formState.storageType}
            options={storageTypes}
            onChange={handleInputChange("storageType")}
          />
          <LabelSelectOptionsID id="host" label={Localization.kr.HOST}
            value={hostVo.id}
            loading={isHostsLoading}
            options={hosts}
            onChange={handleSelectIdChange(setHostVo, hosts)}
          />
        </div>

        <div className="domain-new-right">
          <LabelInput id="name" label={Localization.kr.NAME}
            value={formState.name}
            onChange={handleInputChange("name")}
            autoFocus
          />
          <LabelInput id="description" label={Localization.kr.DESCRIPTION}
            value={formState.description}
            onChange={handleInputChange("description")}
          />
          <LabelInput id="comment" label={Localization.kr.COMMENT}
            value={formState.comment}
            onChange={handleInputChange("comment")}
          />
        </div>
      </div>
  
      {/* NFS 의 경우 */}
      {isNfs && (
        <DomainNfsImport
          nfsAddress={nfsAddress} setNfsAddress={setNfsAddress}
        />
      )}

      {/* ISCSI 의 경우 */}
      {isIscsi && (
        <DomainIscsiImport 
          iscsiResults={iscsiResults} setIscsiResults={setIscsiResults}
          lunId={lunId} setLunId={setLunId}
          hostVo={hostVo} setHostVo={setHostVo}
          formImportState={formImportState} setFormImportState={setFormImportState}
          importIscsiFromHostAPI={importIscsiFromHostAPI}
          // loginIscsiFromHostAPI={}
          // loginIscsiFromHost={loginIscsiFromHost}
          // refetchIscsis={} 
          // isIscsisLoading={} 
          // isIscsisError={} 
          // isIscsisSuccess={}
        />      
      )}

      {/* Firbre 의 경우 */}
      {isFibre && (
        <DomainFibreImport
          lunId={lunId} setLunId={setLunId}
          hostVo={hostVo} setHostVo={setHostVo}
          formImportState={formImportState} setFormImportState={setFormImportState}
          fcResults={fcResults} setFcResults={setFcResults}
          // refetchFc={} 
          // isFcLoading={} 
          // isFcError={} 
          // isFcSuccess={}
        />
      )}
      <hr />

      <div className="tab-content">
        <div className="storage-specific-content">
          <LabelInputNum id="warning" label="디스크 공간 부족 경고 표시 (%)"
            value={formState.warning}
            onChange={handleInputChange("warning")}
          />
          <LabelInputNum id="spaceBlocker" label="심각히 부족한 디스크 공간의 동작 차단 (GB)"
            value={formState.spaceBlocker}
            onChange={handleInputChange("spaceBlocker")}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default React.memo(DomainImportModal);
