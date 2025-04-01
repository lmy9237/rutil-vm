import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import DomainNfs from "./create/DomainNfs";
import DomainIscsi from "./create/DomainIscsi";
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
  useDataCenter,
  useIscsiFromHost,
  useFibreFromHost,
  useImportIscsiFromHost,
  useImportFcpFromHost,
  useImportDomain,
  useLoginIscsiFromHost,
} from "../../../api/RQHook";
import { checkName, convertBytesToGB } from "../../../util";
import Localization from "../../../utils/Localization";
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
  chapName: "",
  chapPassword: "",
  useChap: false,
};


const storageTypeOptions = (dType) => {
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
};

const DomainModal = ({
  isOpen,
  mode = "create",
  domainId,
  datacenterId,
  onClose,
}) => {
  const dLabel = mode === "edit" ? Localization.kr.UPDATE : mode === "import" ? Localization.kr.IMPORT : Localization.kr.CREATE;
  const editMode = mode === "edit";
  const importMode = mode === "import";

  const [formState, setFormState] = useState(initialFormState); // 일반정보
  const [formImportState, setFormImportState] = useState(importFormState); // 가져오기
  
  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [hostVo, setHostVo] = useState({ id: "", name: "" });
  const [storageTypes, setStorageTypes] = useState([]);
  const [nfsAddress, setNfsAddress] = useState("");
  const [lunId, setLunId] = useState(""); // iscsi, fibre 생성시 사용

  const [iscsiSearchResults, setIscsiSearchResults] = useState([]); // 검색결과
  const [fcpSearchResults, setFcpSearchResults] = useState([]); // 검색결과

  const { mutate: addDomain } = useAddDomain();
  const { mutate: editDomain } = useEditDomain(); // 편집은 단순 이름, 설명 변경정도
  const { mutate: importDomain } = useImportDomain(); // 가져오기

  // const { mutate: loginIscsiFromHost } = useLoginIscsiFromHost(); // 가져오기 iscsi 로그인
  const { mutate: importIscsiFromHost } = useImportIscsiFromHost(); // 가져오기 iscsi
  const { mutate: importFcpFromHost } = useImportFcpFromHost(); // 가져오기 fibre

  const { data: domain } = useStroageDomain(domainId);
  const { 
    data: dataCenters = [],
    isLoading: isDataCentersLoading 
  } = useAllDataCenters((e) => ({ ...e }));
  const { 
    data: hosts = [], 
    isLoading: isHostsLoading 
  } = useHostsFromDataCenter(dataCenterVo?.id || undefined, (e) => ({ ...e }));
  const {
    data: iscsis = [],
    refetch: refetchIscsis,
    isLoading: isIscsisLoading,
    isError: isIscsisError,
    isSuccess: isIscsisSuccess,
  } = useIscsiFromHost(hostVo?.id || undefined, (e) => ({ ...e }));
  const {
    data: fibres = [],
    refetch: refetchFibres,
    isLoading: isFibresLoading,
    isError: isFibresError, 
    isSuccess: isFibresSuccess
  } = useFibreFromHost(hostVo?.id || undefined, (e) => ({ ...e }));

  const transIscsiData = iscsis.map((i) => ({
    ...i,
    lun: i?.logicalUnits[0]?.id,
    address: i?.logicalUnits[0]?.address,
    abled: i?.logicalUnits[0]?.storageDomainId === "" ? "OK" : "NO",
    target: i?.logicalUnits[0]?.target,
    port: i?.logicalUnits[0]?.port,
    status: i?.logicalUnits[0]?.status,
    size: convertBytesToGB(i?.logicalUnits[0]?.size),
    paths: i?.logicalUnits[0]?.paths,
    productId: i?.logicalUnits[0]?.productId,
    vendorId: i?.logicalUnits[0]?.vendorId,
    serial: i?.logicalUnits[0]?.serial,
  }));

  const transFibreData = fibres.map((f) => ({
    ...f,
    status: f?.logicalUnits[0]?.status,
    size: f?.logicalUnits[0]?.size ? f.logicalUnits[0].size / 1024 ** 3 : f?.logicalUnits[0]?.size,
    paths: f?.logicalUnits[0]?.paths,
    productId: f?.logicalUnits[0]?.productId,
    vendorId: f?.logicalUnits[0]?.vendorId,
    serial: f?.logicalUnits[0]?.serial,
  }));

  const commonProps = {
    mode,
    domain,
    lunId,
    setLunId,
    hostVo,
    setHostVo,
    formImportState,
    setFormImportState,
  };  

  const isNfs = formState.storageType === "nfs" || domain?.storageType === "nfs";
  const isIscsi = formState.storageType === "iscsi" || domain?.storageType === "iscsi";
  const isFibre = formState.storageType === "fcp" || domain?.storageType === "fcp";

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setFormImportState(formImportState);
      setNfsAddress("");
      setLunId("");
    }
    if (editMode && domain) {
      setFormState({
        id: domain?.id,
        domainType: domain?.domainType,
        storageType: domain?.storageType,
        name: domain?.name,
        comment: domain?.comment,
        description: domain?.description,
        warning: domain?.warning,
        spaceBlocker: domain?.spaceBlocker,
      });
    
      if (domain?.dataCenterVo?.id) {
        setDataCenterVo({ id: domain?.dataCenterVo?.id, name: domain?.dataCenterVo?.name });
      }
    
      // ✅ hostVo가 유효할 때만 설정
      if (domain?.hostVo?.id) {
        setHostVo({ id: domain?.hostVo?.id, name: domain?.hostVo?.name });
      }
    
      // ✅ lunId도 정상적으로 설정
      if (domain?.hostStorageVo?.logicalUnits?.[0]?.id) {
        setLunId(domain?.hostStorageVo?.logicalUnits[0]?.id);
      }
    
      // NFS 주소 설정
      if (domain?.storageType === "nfs") {
        setNfsAddress(domain?.storageAddress);
      }
    }    
  }, [isOpen, editMode, domain]);

  useEffect(() => {
    if (mode === "edit" && !lunId && domain?.hostStorageVo?.logicalUnits?.[0]?.id) {
      setLunId(domain.hostStorageVo.logicalUnits[0].id);
    }
  }, [mode, domain, lunId, setLunId]);

  useEffect(() => {
    Logger.debug(`DomainModal.lunId: ${lunId}`);
    Logger.debug(`DomainModal.hostVo: ${JSON.stringify(hostVo)}`);
  }, [lunId, hostVo]);

  useEffect(() => {
    if (datacenterId) {
      setDataCenterVo({id: datacenterId});
    } else if (!editMode && dataCenters && dataCenters.length > 0) {
      setDataCenterVo({id: dataCenters[0].id});
    }
  }, [dataCenters, datacenterId, editMode]);

  useEffect(() => {
    if (!editMode && dataCenterVo.id) {
      setFormState((prev) => ({
        ...initialFormState,
        domainType: prev.domainType,
      }));
      setStorageTypes(storageTypeOptions(initialFormState.domainType));
      setNfsAddress("");
      setLunId("");
      setIscsiSearchResults([]);
      setFcpSearchResults([]);
      setFormImportState(importFormState);
    }
  }, [dataCenterVo, editMode]);
  

  useEffect(() => {
    if (!editMode && hosts && hosts.length > 0) {
      setHostVo({id: hosts[0].id, name: hosts[0].name});
    }
  }, [hosts, editMode]);

  useEffect(() => {
    if (formState.storageType === "iscsi" && hostVo?.id) {
      refetchIscsis();
    }
  }, [hostVo?.id, formState.storageType, refetchIscsis]);

  useEffect(() => {
    if (formState.storageType === "fibre" && hostVo?.id) {
      refetchFibres();
    }
  }, [hostVo?.id, formState.storageType, refetchFibres]);

  useEffect(() => {
    const options = storageTypeOptions(formState.domainType);
    setStorageTypes(options);

    // 기본 storageType을 options의 첫 번째 값으로 설정
    if (!editMode && options.length > 0) {
      setFormState((prev) => ({
        ...prev,
        storageType: options[0].value,
      }));
    }
  }, [formState.domainType, editMode]);

  useEffect(() => {
    // 스토리지 유형 변경 시 초기화할 상태 설정
    setNfsAddress("");
    setLunId("");
    setIscsiSearchResults([]); // iSCSI 검색 결과 초기화
    setFcpSearchResults([]); // FCP 검색 결과 초기화

    setFormImportState({
      target: "",
      address: "",
      port: 3260,
      chapName: "",
      chapPassword: "",
      useChap: false,
    });
  }, [formState.storageType]);

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    checkName(formState.name)

    if(isNfs && !editMode && (!nfsAddress.includes(':') || !nfsAddress.includes('/'))){
      return "주소입력이 잘못되었습니다."
    }
  
    if (!dataCenterVo.id) 
      return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!hostVo)
      return `${Localization.kr.HOST}를 선택해주세요.`;
    if (formState.storageType === "NFS" && !nfsAddress)
      return "경로를 입력해주세요.";
    if (formState.storageType !== "nfs" && lunId) {
      const selectedLogicalUnit =
        formState.storageType === "iscsi"
          ? iscsis.find((iLun) => iLun.id === lunId)
          : fibres.find((fLun) => fLun.id === lunId);
      if (selectedLogicalUnit?.abled === "NO")
        return "선택한 항목은 사용할 수 없습니다.";
    }
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const onSuccess = () => {
      toast.success(`도메인 ${dLabel} 완료`);
      onClose();
    };
    const onError = (err) => toast.error(`Error ${dLabel} domain: ${err}`);

    let dataToSubmit;

    // 편집: formState 데이터만 제출
    if (editMode) {
      dataToSubmit = {
        ...formState,
      };
      // 생성, 가져오기
    } else {
      const logicalUnit =
        formState.storageType === "iscsi"
          ? iscsis.find((iLun) => iLun.id === lunId)
          : formState.storageType === "fcp"
            ? fibres.find((fLun) => fLun.id === lunId)
            : null;

      const [storageAddress, storagePath] = nfsAddress.split(":");

      dataToSubmit = {
        ...formState,
        dataCenterVo,
        hostVo,
        logicalUnits: logicalUnit ? [logicalUnit.id] : [],
        ...(formState.storageType === "nfs" && { storageAddress, storagePath }),
      };
    }

    Logger.debug(`DomainModal > handleFormSubmit ... dataToSubmit: ${dataToSubmit}`);
    editMode
      ? editDomain(
          { domainId: formState.id, domainData: dataToSubmit },
          { onSuccess, onError }
        )
      : importMode
        ? importDomain(dataToSubmit, { onSuccess, onError })
        : addDomain(dataToSubmit, { onSuccess, onError });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={"도메인"}
      submitTitle={dLabel}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "700px"}}
    >
      <div className="storage-domain-new-first">
        <div>
          <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
            value={dataCenterVo.id}
            disabled={editMode}
            loading={isDataCentersLoading}
            options={dataCenters}
            onChange={(e) => {
              const selected = dataCenters.find(dc => dc.id === e.target.value);
              if (selected) setDataCenterVo({ id: selected.id, name: selected.name });
            }}
          />
          <LabelSelectOptions id="domain-type" label="도메인 기능"
            value={formState.domainType}
            disabled={editMode}
            options={domainTypes}
            onChange={handleInputChange("domainType")}
          />
          <LabelSelectOptions id="storage-type" label="스토리지 유형"
            value={formState.storageType}
            disabled={editMode}
            options={storageTypes}
            onChange={handleInputChange("storageType")}
          />
          <LabelSelectOptionsID id="host" label={Localization.kr.HOST}
            value={hostVo}
            disabled={editMode}
            loading={isHostsLoading}
            options={hosts}
            onChange={(e) => {
              const selected = hosts.find(h => h.id === e.target.value);
              if (selected) setHostVo({ id: selected.id, name: selected.name });
            }}
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
        <DomainNfs
          mode={mode}
          nfsAddress={nfsAddress}
          setNfsAddress={setNfsAddress}
          domain={domain}
        />
      )}

      {/* ISCSI 의 경우 */}
      {/* 편집이 되기는 하지만 밑의 테이블 readonly 와 path 문제가 잇음 */}
      {isIscsi && (
        <DomainIscsi
          {...commonProps}
          iscsis={transIscsiData}
          iscsiSearchResults={iscsiSearchResults}
          setIscsiSearchResults={setIscsiSearchResults}
          importIscsiFromHost={importIscsiFromHost}
          // loginIscsiFromHost={loginIscsiFromHost}
          refetchIscsis={refetchIscsis}
          isIscsisLoading={isIscsisLoading}
          isIscsisError={isIscsisError}
          isIscsisSuccess={isIscsisSuccess}
        />      
      )}

      {/* Firbre 의 경우 */}
      {isFibre && (
        <DomainFibre
          {...commonProps}
          fibres={transFibreData}
          fcpSearchResults={fcpSearchResults}
          setFcpSearchResults={setFcpSearchResults}
          importFcpFromHost={importFcpFromHost}
          isFibresLoading={isFibresLoading}
          isFibresError={isFibresError}
          isFibresSuccess={isFibresSuccess}
        />
      )}
      <hr />

      <div className="tab-content">
        <div className="storage-specific-content">
          <LabelInputNum id="warning" label="디스크 공간 부족 경고 표시(%)"
            value={formState.warning}
            onChange={handleInputChange("warning")}
          />
          <LabelInputNum id="spaceBlocker" label="심각히 부족한 디스크 공간의 동작 차단(GB)"
            value={formState.spaceBlocker}
            onChange={handleInputChange("spaceBlocker")}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default DomainModal;
