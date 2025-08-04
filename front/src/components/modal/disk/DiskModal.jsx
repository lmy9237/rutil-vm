import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import LabelInput                       from "@/components/label/LabelInput";
import LabelInputNum                    from "@/components/label/LabelInputNum";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import { 
  handleInputChange, 
  handleInputCheck, 
  handleSelectIdChange,
} from "../../label/HandleInput";
import {
  useDisk,
  useAddDisk,
  useEditDisk,
  useAllActiveDataCenters,
  useAllActiveDomainsFromDataCenter,
  useAllDiskProfilesFromDomain,
} from "../../../api/RQHook";
import { checkName, checkZeroSizeToGiB, convertBytesToGB, emptyIdNameVo, useSelectFirstItemEffect, useSelectItemEffect, useSelectItemOrDefaultEffect }  from "../../../util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const initialFormState = {
  id: "",
  size: "",
  appendSize: 0,
  alias: "",
  description: "",
  wipeAfterDelete: false,
  sharable: false,
  backup: true,
  sparse: true, //할당정책: 씬
  bootable: false,
  logicalName: "",
  readOnly: false, // vm 읽기전용
  cancelActive: false, // vm 취소 활성화
};

const DiskModal = ({ 
  isOpen, 
  onClose,
  editMode = false, 
}) => {
  const { validationToast } = useValidationToast();
  const dLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;
  const { 
    disksSelected, 
    domainsSelected, 
    datacentersSelected,
   } = useGlobal();
  const diskId = useMemo(() => [...disksSelected][0]?.id, [disksSelected]);
  const domainId = useMemo(() => [...domainsSelected][0]?.id, [domainsSelected]);
  const datacenterId = useMemo(() => [...datacentersSelected][0]?.id, [datacentersSelected])

  const [formState, setFormState] = useState(initialFormState);
  const [dataCenterVo, setDataCenterVo] = useState(emptyIdNameVo());
  const [domainVo, setDomainVo] = useState(emptyIdNameVo());
  const [diskProfileVo, setDiskProfileVo] = useState(emptyIdNameVo());
  
  const { data: disk } = useDisk(diskId);
  const { mutate: addDisk } = useAddDisk(onClose, onClose);
  const { mutate: editDisk } = useEditDisk(onClose, onClose);

  const { 
    data: datacenters = [], 
    isLoading: isDatacentersLoading,
    isSuccess: isDatacentersSuccess,
  } = useAllActiveDataCenters((e) => ({ ...e }));
  const { 
    data: domains = [], 
    isLoading: isDomainsLoading,
    isSuccess: isDomainsSuccess,
  } = useAllActiveDomainsFromDataCenter(dataCenterVo?.id || undefined, (e) => ({ ...e }));

  const { 
    data: diskProfiles = [], 
    isLoading: isDiskProfilesLoading,
    isSuccess: isDiskProfilesSuccess,
  } = useAllDiskProfilesFromDomain(domainVo?.id || undefined, (e) => ({ ...e }));

  const [activeTab, setActiveTab] = useState("img");
  const handleTabClick = useCallback((tab) => { setActiveTab(tab) }, []);

  useEffect(() => {
    Logger.debug(`DiskModal > useEffect ... domainsSelected: `, domainsSelected[0]);
    if (!isOpen) {
      setFormState(initialFormState);
      setDataCenterVo(emptyIdNameVo());
      setDomainVo(emptyIdNameVo());
      return;
    }
    if (editMode && disk) {
      setFormState({
        id: disk?.id,
        size: convertBytesToGB(disk?.virtualSize),
        appendSize: 0,
        alias: disk?.alias,
        description: disk?.description,
        wipeAfterDelete: Boolean(disk?.wipeAfterDelete),
        sharable: Boolean(disk?.sharable),
        backup: Boolean(disk?.backup),
        sparse: Boolean(disk?.sparse),
      });
      setDataCenterVo({
        id: disk?.dataCenterVo?.id, 
        name: disk?.dataCenterVo?.name
      });
      setDomainVo({
        id: disk?.storageDomainVo?.id, 
        name: disk?.storageDomainVo?.name
      });
      setDiskProfileVo({
        id: disk?.diskProfileVo?.id, 
        name: disk?.diskProfileVo?.name
      });
    }
  }, [isOpen, editMode, disk, domainsSelected]);

  // 데이터센터 지정
  useSelectItemOrDefaultEffect(datacenterId, editMode, datacenters, setDataCenterVo, "Default")

  // 도메인 지정
  useSelectItemEffect(domainId, editMode, domains, setDomainVo);

  // domainVo가 변경될 때 diskProfile 초기화 및 재선택
  useEffect(() => {
    if (!editMode && domainVo.id && diskProfiles.length > 0) {
      const firstProfile = diskProfiles[0];
      setDiskProfileVo({
        id: firstProfile.id, 
        name: firstProfile.name
      });
    }
  }, [domainVo.id, diskProfiles, editMode]);

  
  const handleInputSize = (field) => (e) => {
    const value = e.target.value;
  
    if (field === "size" || field === "appendSize") {
      if (value === "" || /^\d*$/.test(value)) {
        setFormState((prev) => ({ ...prev, [field]: value }));
      } else {
        validationToast.fail(`숫자만 입력해주세요.`)
      }
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    Logger.debug(`DiskModal > validateForm ... `); // 데이터를 확인하기 위한 로그
    const nameError = checkName(formState.alias);
    if (nameError) return nameError;

    if (!formState.size) return "크기를 입력해주세요.";
    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!domainVo.id) return `${Localization.kr.DOMAIN}을 선택해주세요.`;
    if (!diskProfileVo.id) return `${Localization.kr.DISK_PROFILE}을 선택해주세요.`;
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    // GB -> Bytes 변환
    const sizeToBytes =  parseInt(formState.size, 10) * 1024 * 1024 * 1024;
    // GB -> Bytes 변환 (기본값 0)
    const appendSizeToBytes = parseInt(formState.appendSize || 0, 10) * 1024 * 1024 * 1024; 

    const dataToSubmit = {
      ...formState,
      size: sizeToBytes,
      appendSize: appendSizeToBytes,
      dataCenterVo,
      storageDomainVo: domainVo,
      diskProfileVo,
    };

    Logger.debug(`DiskModal > handleFormSubmit ... dataToSubmit: `, dataToSubmit); // 데이터를 확인하기 위한 로그
    editMode
      ? editDisk({ diskId: formState.id, diskData: dataToSubmit })
      : addDisk(dataToSubmit);
  };

  return (
    <BaseModal targetName={Localization.kr.DISK} submitTitle={dLabel}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      isReady={
        isDatacentersSuccess &&
        isDomainsSuccess &&
        isDiskProfilesSuccess
      }
      contentStyle={{ width: "640px" }}
    >
      <div className="disk-new-img">
        <div>
          <LabelInputNum label="크기(GB)"
            value={formState.size}
            autoFocus={true}
            disabled={editMode}
            onChange={handleInputSize("size")}
          />
          {editMode && (
            <LabelInputNum label="추가크기(GB)"
              value={formState.appendSize}
              onChange={handleInputSize("appendSize")}
            />
          )}
          <LabelInput label={Localization.kr.ALIAS}
            value={formState.alias}
            onChange={handleInputChange(setFormState, "alias", validationToast)}
          />
          <LabelInput label={Localization.kr.DESCRIPTION}
            value={formState.description}
            onChange={handleInputChange(setFormState, "description", validationToast)}
          />
          <LabelSelectOptionsID label={Localization.kr.DATA_CENTER}
            value={dataCenterVo.id}
            disabled={editMode}
            loading={isDatacentersLoading}
            options={datacenters}
            onChange={handleSelectIdChange(setDataCenterVo, datacenters, validationToast)}
          />
          <LabelSelectOptionsID label={Localization.kr.DOMAIN}
            value={domainVo.id}
            disabled={editMode}
            loading={isDomainsLoading}
            options={domains}
            onChange={handleSelectIdChange(setDomainVo, domains, validationToast)}
          />
          {domainVo && (() => {
            const domainObj = domains.find((d) => d.id === domainVo.id);
            if (!domainObj) return null;
            return (
              <div className="text-xs text-gray-500 f-end">
                사용 가능: {checkZeroSizeToGiB(domainObj.availableSize)} {" / "} 총 용량: {checkZeroSizeToGiB(domainObj.size)}
              </div>
            );
          })()}
          <LabelSelectOptions id="sparse" label={Localization.kr.SPARSE} // 할당 정책
            value={String(formState.sparse)}
            onChange={(e) => {
              const sparseValue = e.target.value === "true";
              import.meta.env.DEV && validationToast.debug(`field: sparse: value: ${sparseValue}`)
              setFormState((prev) => ({
                ...prev,
                sparse: sparseValue,
                backup: sparseValue ? prev.backup : false, // sparse 끄면 backup도 false로 넘어감
              }));
            }}
            disabled={editMode}
            options={sparseList}
          />
          <LabelSelectOptionsID label={Localization.kr.DISK_PROFILE} 
            value={diskProfileVo.id}
            loading={isDiskProfilesLoading}
            options={diskProfiles}
            onChange={handleSelectIdChange(setDiskProfileVo, diskProfiles, validationToast)}
          />
        </div>
        <div className="disk-new-img-right f-end">
          <div className="img-checkbox-outer">
            <LabelCheckbox id="wipeAfterDelete" label={Localization.kr.WIPE_AFTER_DELETE}
              checked={formState.wipeAfterDelete}
              onChange={handleInputCheck(setFormState, "wipeAfterDelete", validationToast)}
            />
          </div>
          {/* <div className="img-checkbox-outer">
            <LabelCheckbox id="sharable" label={Localization.kr.IS_SHARABLE}
              checked={formState.sharable}
              disabled={editMode}
              onChange={handleInputChangeCheck("sharable")}
            />
          </div> */}
          <div className="img-checkbox-outer">
            <LabelCheckbox id="backup" label="증분 백업 사용"
              checked={formState.backup}
              disabled={!formState.sparse} // 사전할당일 때 비활성화
              onChange={handleInputCheck(setFormState, "backup", validationToast)}
            />
          </div>
        </div>
      </div>
     
      {/* 직접LUN */}
      {/* {activeTab === 'directlun' && (
        <div id="storage-directlun-outer">
          <div id="storage-lun-first">
            <div>
              <div className="img-input-box">
                <span>{Localization.kr.ALIAS}</span>
                <input type="text" />
              </div>
              <div className="img-input-box">
                <span>{Localization.kr.DESCRIPTION}</span>
                <input type="text" />
              </div>
              <div className="img-select-box">
                <label htmlFor="os">{Localization.kr.DATA_CENTER}</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div className="img-select-box">
                <label htmlFor="os">{Localization.kr.HOST}</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
              <div className="img-select-box">
                <label htmlFor="os">스토리지 타입</label>
                <select id="os">
                  <option value="linux">Linux</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </BaseModal>
  );
};

export default DiskModal;

const sparseList = [
  { value: "true", label: Localization.kr.THIN_PROVISIONING },
  { value: "false", label: Localization.kr.PREALLOCATED },
];