import React, { useState, useEffect, useMemo } from "react";
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
  useIscsiFromHost,
  useFibreFromHost,
  useImportIscsiFromHost,
  useImportFcpFromHost,
} from "../../../api/RQHook";
import { checkName, checkZeroSizeToGiB } from "../../../util";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import useGlobal from "../../../hooks/useGlobal";
import { handleInputChange, handleSelectIdChange } from "../../label/HandleInput";

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

// iscsi 주소, 포트, 사용자 인증 이름, 암호 해서 검색
const searchFormState = {
  target: "",
  address: "",
  port: 3260,
};

const loginFormState = {
  chapName: "",
  chapPassword: "",
  useChap: false,
};

const DomainModal = ({
  isOpen, onClose, editMode=false
}) => {
  const dLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;

  const { datacentersSelected, domainsSelected, setDomainsSelected } = useGlobal()
  const domainId = useMemo(() => [...domainsSelected][0]?.id, [domainsSelected]);
  const datacenterId = useMemo(() => [...datacentersSelected][0]?.id, [datacentersSelected]);

  // const dLabel = activeModal() === "domain:update" 
  //   ? Localization.kr.UPDATE 
  //   : activeModal() === "domain:import" 
  //     ? Localization.kr.IMPORT 
  //     : Localization.kr.CREATE;
  // const editMode = activeModal() === "domain:update";
  // const importMode = activeModal() === "domain:import";

  const [formState, setFormState] = useState(initialFormState); // 일반정보
  const [formSearchState, setFormSearchState] = useState(searchFormState);
  
  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [hostVo, setHostVo] = useState({ id: "", name: "" });
  const [storageTypes, setStorageTypes] = useState([]);
  const [nfsAddress, setNfsAddress] = useState(""); // nfs
  const [lunId, setLunId] = useState(""); // iscsi, fibre 생성시 사용

  const [iscsiResults, setIscsiResults] = useState([]); // 검색결과
  const [fcResults, setFcResults] = useState([]); // 검색결과

  const resetFormStates = () => {
    setFormState(initialFormState);
    setFormSearchState(searchFormState);
    setHostVo({ id: "", name: "" });
    setStorageTypes([]);
    setNfsAddress("");
    setLunId("");
    setIscsiResults([]);
    setFcResults([]);
  };

  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.DOMAIN} ${dLabel} ${Localization.kr.FINISHED}`);
  };
  const { data: domain } = useStroageDomain(domainId);

  const { mutate: addDomain } = useAddDomain(onSuccess, () => onClose());
  const { mutate: editDomain } = useEditDomain(onSuccess, () => onClose()); // 편집은 단순 이름, 설명 변경정도
  // const { mutate: loginIscsiFromHost } = useLoginIscsiFromHost(); // 가져오기 iscsi 로그인
  const { mutate: importIscsiFromHost } = useImportIscsiFromHost(); // 가져오기 iscsi
  const { mutate: importFcpFromHost } = useImportFcpFromHost(); // 가져오기 fibre

  const { 
    data: datacenters = [],
    isLoading: isDatacentersLoading 
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
    abled: i?.logicalUnits[0]?.storageDomainId === "" ? "OK" : "NO",
    status: i?.logicalUnits[0]?.status,
    lunId: i?.logicalUnits[0]?.id,
    size: checkZeroSizeToGiB(i?.logicalUnits[0]?.size),
    paths: i?.logicalUnits[0]?.paths,
    vendorId: i?.logicalUnits[0]?.vendorId,
    productId: i?.logicalUnits[0]?.productId,
    serial: i?.logicalUnits[0]?.serial,
    target: i?.logicalUnits[0]?.target,
    address: i?.logicalUnits[0]?.address,
    port: i?.logicalUnits[0]?.port,
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

  useEffect(() => {
    if (!isOpen) return resetFormStates();
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
      setDataCenterVo({ id: domain?.dataCenterVo?.id, name: domain?.dataCenterVo?.name });
      setHostVo({ id: domain?.hostVo?.id, name: domain?.hostVo?.name });
      
      if (domain?.storageType === "nfs") { 
        setNfsAddress(domain?.storageAddress);
      } else {
        setLunId(domain?.hostStorageVo?.logicalUnits[0]?.id);
      }
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
    if (!editMode && dataCenterVo.id) {
      setFormState((prev) => ({
        ...initialFormState,
        domainType: prev.domainType,
      }));
      setStorageTypes(storageTypeOptions(initialFormState.domainType));
      setNfsAddress("");
      setLunId("");
      setIscsiResults([]);
      setFcResults([]);
      setFormSearchState(searchFormState);
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
    if (!editMode && options.length > 0) {
      setFormState((prev) => ({ ...prev, storageType: options[0].value}));
    }
  }, [formState.domainType, editMode]);

  useEffect(() => {
    setNfsAddress("");
    setLunId("");
    setIscsiResults([]); // iSCSI 검색 결과 초기화
    setFcResults([]); // FCP 검색 결과 초기화
    setFormSearchState();
  }, [formState.storageType]);


  const commonProps = {
    domain,
    lunId, setLunId,
    hostVo, setHostVo,
    formSearchState, setFormSearchState,
  };  

  const isNfs = formState.storageType === "nfs";
  const isIscsi = formState.storageType === "iscsi";
  const isFibre = formState.storageType === "fcp";

  const validateForm = () => {
    const nameError = checkName(formState.name);
    if (nameError) return nameError;

    if (isNfs && !editMode && (!nfsAddress.includes(':') || !nfsAddress.includes('/'))){
      return "주소입력이 잘못되었습니다."
    }
  
    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!hostVo) return `${Localization.kr.HOST}를 선택해주세요.`;
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

    let dataToSubmit;

    if (editMode) {
      dataToSubmit = { ...formState };
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
          <span>{datacentersSelected[0]?.name}</span>
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

      {/* ISCSI 의 경우 / 편집이 되기는 하지만 밑의 테이블 readonly 와 path 문제가 잇음*/}
      {isIscsi && (
        <DomainIscsi  
          editMode={editMode}
          iscsiResults={iscsiResults} setIscsiResults={setIscsiResults}
          lunId={lunId} setLunId={setLunId}
          hostVo={hostVo}
          formSearchState={formSearchState} setFormSearchState={setFormSearchState}
          // refetchIscsis={refetchIscsis}
          // isIscsisLoading={isIscsisLoading} isIscsisError={isIscsisError} isIscsisSuccess={isIscsisSuccess}
        />      
      )}

      {/* Firbre 의 경우 */}
      {isFibre && (
        <DomainFibre
          editMode={editMode}
          fcResults={fcResults} setFcResults={setFcResults}
          lunId={lunId} setLunId={setLunId}
          hostVo={hostVo}
          // isFibresLoading={isFibresLoading} isFibresError={isFibresError} isFibresSuccess={isFibresSuccess}
        />
      )}
      <hr />
      <div className="tab-content">
        <div className="storage-specific-content">
          <LabelInputNum id="warning" label="디스크 공간 부족 경고 표시 (%)"
            value={formState.warning}
            onChange={handleInputChange(setFormState, "warning")}
          />
          <LabelInputNum id="spaceBlocker" label="심각히 부족한 디스크 공간의 동작 차단 (GB)"
            value={formState.spaceBlocker}
            onChange={handleInputChange(setFormState, "spaceBlocker")}
          />
        </div>
      </div>
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
      return [{ value: "nfs", label: "NFS" }];
    default: // data
      return [
        { value: "nfs", label: "NFS" },
        { value: "iscsi", label: "ISCSI" },
        { value: "fcp", label: "Fibre Channel" },
      ];
  }
};