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
  useDomainById,
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
import { checkKoreanName } from "../../../util";
import Localization from "../../../utils/Localization";

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

const DomainModal = ({
  isOpen,
  mode = "create",
  domainId,
  datacenterId,
  onClose,
}) => {
  const dLabel =
    mode === "edit" ? "편집" : mode === "import" ? "가져오기" : "생성";
  const editMode = mode === "edit";
  const importMode = mode === "import";

  const { mutate: addDomain } = useAddDomain();
  const { mutate: editDomain } = useEditDomain(); // 편집은 단순 이름, 설명 변경정도
  const { mutate: importDomain } = useImportDomain(); // 가져오기

  const { mutate: loginIscsiFromHost } = useLoginIscsiFromHost(); // 가져오기 iscsi 로그인
  const { mutate: importIscsiFromHost } = useImportIscsiFromHost(); // 가져오기 iscsi
  const { mutate: importFcpFromHost } = useImportFcpFromHost(); // 가져오기 fibre

  const [formState, setFormState] = useState(initialFormState); // 일반정보
  const [formImportState, setFormImportState] = useState(importFormState); // 가져오기
  const [dataCenterVoId, setDataCenterVoId] = useState("");
  const [hostVoName, setHostVoName] = useState("");
  const [hostVoId, setHostVoId] = useState("");
  const [storageTypes, setStorageTypes] = useState([]);
  const [nfsAddress, setNfsAddress] = useState("");
  const [lunId, setLunId] = useState(""); // iscsi, fibre 생성시 사용
  const [iscsiSearchResults, setIscsiSearchResults] = useState([]); // 검색결과
  const [fcpSearchResults, setFcpSearchResults] = useState([]); // 검색결과

  const { data: domain } = useDomainById(domainId);
  const { data: dataCenters = [], isLoading: isDatacentersLoading } =
    useAllDataCenters((e) => ({ ...e }));
  const { data: dataCenter } = useDataCenter(datacenterId);
  const { data: hosts = [], isLoading: isHostsLoading } =
    useHostsFromDataCenter(dataCenterVoId, (e) => ({ ...e }));
  const {
    data: iscsis = [],
    refetch: refetchIscsis,
    isLoading: isIscsisLoading,
  } = useIscsiFromHost(hostVoId, (e) => {
    const unit = e?.logicalUnits[0];
    return {
      ...e,
      abled: unit?.storageDomainId === "" ? "OK" : "NO",
      target: unit?.target,
      address: unit?.address,
      port: unit?.port,
      status: unit?.status,
      size: unit?.size ? unit?.size / 1024 ** 3 : unit?.size,
      paths: unit?.paths,
      productId: unit?.productId,
      vendorId: unit?.vendorId,
      serial: unit?.serial,
    };
  });
  const {
    data: fibres = [],
    refetch: refetchFibres,
    isLoading: isFibresLoading,
  } = useFibreFromHost(hostVoId, (e) => {
    const unit = e?.logicalUnits[0];
    return {
      ...e,
      status: unit?.status,
      size: unit?.size ? unit.size / 1024 ** 3 : unit?.size,
      paths: unit?.paths,
      productId: unit?.productId,
      vendorId: unit?.vendorId,
      serial: unit?.serial,
    };
  });

  const isNfs =
    formState.storageType === "nfs" || domain?.storageType === "nfs";
  const isIscsi =
    formState.storageType === "iscsi" || domain?.storageType === "iscsi";
  const isFibre =
    formState.storageType === "fcp" || domain?.storageType === "fcp";

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setFormImportState(formImportState);
    }
    if (editMode && domain) {
      setFormState({
        id: domain.id,
        domainType: domain.domainType,
        storageType: domain.storageType,
        name: domain.name,
        comment: domain.comment,
        description: domain.description,
        warning: domain.warning,
        spaceBlocker: domain.spaceBlocker,
      });
      setDataCenterVoId(domain?.dataCenterVo?.id);
      setHostVoId(domain?.hostVo?.id);
      setHostVoName(domain?.hostVo?.name);
      setNfsAddress(domain?.storageAddress);
      setLunId(domain?.hostStorageVo?.logicalUnits[0]?.id);

      if (setFormState.storageType === "nfs") {
        setNfsAddress(domain?.storageAddress);
      } else if (
        setFormState.storageType === "iscsi" ||
        setFormState.storageType === "fcp"
      ) {
        setLunId(domain?.hostStorageVo?.logicalUnits[0]?.id);
      }
    }
  }, [, editMode, domain]);

  useEffect(() => {
    if (datacenterId) {
      setDataCenterVoId(datacenterId);
    } else if (!editMode && dataCenters && dataCenters.length > 0) {
      setDataCenterVoId(dataCenters[0].id);
    }
  }, [dataCenters, datacenterId, editMode]);

  useEffect(() => {
    if (dataCenterVoId) {
      setFormState((prev) => ({
        ...initialFormState, // 초기 상태로 리셋
        domainType: prev.domainType, // 유지할 값 (원래 설정된 데이터 유지)
      }));
      // 관련된 상태 초기화
      setStorageTypes(storageTypeOptions(initialFormState.domainType));
      setNfsAddress("");
      setLunId("");
      setIscsiSearchResults([]);
      setFcpSearchResults([]);
      setFormImportState(importFormState);
    }
  }, [dataCenterVoId]);

  useEffect(() => {
    if (!editMode && hosts && hosts.length > 0) {
      setHostVoId(hosts[0].id);
      setHostVoName(hosts[0].name);
    }
  }, [hosts, editMode]);

  useEffect(() => {
    if (formState.storageType === "iscsi" && hostVoId) {
      refetchIscsis();
    }
  }, [hostVoId, formState.storageType, refetchIscsis]);

  useEffect(() => {
    if (formState.storageType === "fibre" && hostVoId) {
      refetchFibres();
    }
  }, [hostVoId, formState.storageType, refetchFibres]);

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
    if (!checkKoreanName(formState.name))
      return "이름이 유효하지 않습니다.";
    if (!formState.name)
      return "이름을 입력해주세요.";
    if (!dataCenterVoId) 
      return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!hostVoName)
      return "호스트를 선택해주세요.";
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

    const selectedDataCenter = dataCenters.find(
      (dc) => dc.id === dataCenterVoId
    );
    const selectedHost = hosts.find((h) => h.name === hostVoName);

    const onSuccess = () => {
      onClose();
      toast.success(`도메인 ${dLabel} 완료`);
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
      console.log();

      dataToSubmit = {
        ...formState,
        dataCenterVo: {
          id: selectedDataCenter.id,
          name: selectedDataCenter.name,
        },
        hostVo: { id: selectedHost.id, name: selectedHost.name },
        logicalUnits: logicalUnit ? [logicalUnit.id] : [],
        ...(formState.storageType === "nfs" && { storageAddress, storagePath }),
      };
    }

    console.log("Data to submit:", dataToSubmit);

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
      contentStyle={{ width: "1000px", height: "700px" }}
    >
     
        <div className="popup-content-outer">
          <div className="storage-domain-new-first">
            <div>
              <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
                value={dataCenterVoId}
                onChange={(e) => setDataCenterVoId(e.target.value)}
                disabled={editMode}
                loading={isDatacentersLoading}
                options={dataCenters}
              />
              <LabelSelectOptions
                label="도메인 기능"
                value={formState.domainType}
                onChange={handleInputChange("domainType")}
                disabled={editMode}
                options={domainTypes}
              />
              <LabelSelectOptions
                label="스토리지 유형"
                value={formState.storageType}
                onChange={handleInputChange("storageType")}
                disabled={editMode}
                options={storageTypes}
              />
              <LabelSelectOptionsID
                label="호스트"
                value={hostVoId}
                onChange={(e) => setHostVoId(e.target.value)}
                disabled={editMode}
                loading={isHostsLoading}
                options={hosts}
              />

              {/* 호스트 이름이 들어가야함 */}
              {/* <div className="domain-new-select center">
                <label>호스트</label>
                <select
                  label="호스트"
                  value={hostVoName}
                  onChange={(e) => setHostVoName(e.target.value)}
                  disabled={editMode}
                >
                  {isHostsLoading ? (
                    <option key="loading">호스트를 불러오는 중...</option>
                  ) : (
                    hosts.map((h) => (
                      <option key={h.name} value={h.name}>
                        {h.name} : {h.id}
                      </option>
                    ))
                  )}
                </select>
              </div> */}
            </div>

            <div className="domain-new-right">
              <LabelInput
                label="이름"
                id="name"
                value={formState.name}
                onChange={handleInputChange("name")}
                autoFocus
              />
              <LabelInput
                label="설명"
                id="description"
                value={formState.description}
                onChange={handleInputChange("description")}
              />
              <LabelInput
                label="코멘트"
                id="comment"
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
          {isIscsi && (
            <DomainIscsi
              mode={mode}
              domain={domain}
              iscsis={iscsis}
              iscsiSearchResults={iscsiSearchResults}
              setIscsiSearchResults={setIscsiSearchResults}
              lunId={lunId}
              setLunId={setLunId}
              hostVoId={hostVoId}
              hostVoName={hostVoName}
              setHostVoName={setHostVoName}
              isIscsisLoading={isIscsisLoading}
              importIscsiFromHost={importIscsiFromHost}
              loginIscsiFromHost={loginIscsiFromHost}
              formImportState={formImportState} // ✅ formImportState 전달
              setFormImportState={setFormImportState} // ✅ 상태 업데이트 함수 전달
              refetchIscsis={refetchIscsis}
            />
          )}

          {/* Firbre 의 경우 */}
          {isFibre && (
            <DomainFibre
              mode={mode}
              domain={domain}
              fibres={fibres}
              fcpSearchResults={fcpSearchResults}
              setFcpSearchResults={setFcpSearchResults}
              lunId={lunId}
              setLunId={setLunId}
              hostVoId={hostVoId}
              importFcpFromHost={importFcpFromHost}
              // handleRowClick={handleRowClick}
              formImportState={formImportState}
              setFormImportState={setFormImportState}
            />
          )}
          <hr />
          <div className="tab-content">
            <div className="storage-specific-content">
              <LabelInputNum
                label="디스크 공간 부족 경고 표시(%)"
                id="warning"
                value={formState.warning}
                onChange={handleInputChange("warning")}
                className="domain-num-box center"
              />
              <LabelInputNum
                label="심각히 부족한 디스크 공간의 동작 차단(GB)"
                id="spaceBlocker"
                value={formState.spaceBlocker}
                onChange={handleInputChange("spaceBlocker")}
                className="domain-num-box center"
              />
            </div>
          </div>
        </div>
     
    </BaseModal>
  );
};

export default DomainModal;
