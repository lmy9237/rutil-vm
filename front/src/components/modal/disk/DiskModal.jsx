import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import LabelInputNum from "../../label/LabelInputNum";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import LabelCheckbox from "../../label/LabelCheckbox";
import {
  useDiskById,
  useAddDisk,
  useEditDisk,
  useAllActiveDataCenters,
  useAllActiveDomainFromDataCenter,
  useAllDiskProfileFromDomain,
} from "../../../api/RQHook";
import { checkName, convertBytesToGB } from "../../../util";
import Localization from "../../../utils/Localization";

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

const sparseList = [
  { value: "true", label: "씬 프로비저닝" },
  { value: "false", label: "사전 할당" },
];

const DiskModal = ({ isOpen, editMode = false, diskId, onClose }) => {
  const dLabel = editMode ? "편집" : "생성";
  const [formState, setFormState] = useState(initialFormState);

  const [dataCenterVo, setDataCenterVo] = useState({ id: "", name: "" });
  const [domainVo, setDomainVo] = useState({ id: "", name: "" });
  const [diskProfileVo, setDiskProfileVo] = useState({ id: "", name: "" });

  const { mutate: addDisk } = useAddDisk();
  const { mutate: editDisk } = useEditDisk();

  const { data: disk } = useDiskById(diskId);
  
  console.log("diskId: ", diskId);
  const { 
    data: datacenters = [], 
    isLoading: isDatacentersLoading 
  } = useAllActiveDataCenters((e) => ({ ...e }));
  const { 
    data: domains = [], 
    isLoading: isDomainsLoading 
  } = useAllActiveDomainFromDataCenter(dataCenterVo?.id || undefined, (e) => ({ ...e }));

  const { 
    data: diskProfiles = [], 
    isLoading: isDiskProfilesLoading 
  } = useAllDiskProfileFromDomain(domainVo?.id || undefined, (e) => ({ ...e }));


  const [activeTab, setActiveTab] = useState("img");
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (!isOpen) return setFormState(initialFormState);
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
      setDataCenterVo({id: disk?.dataCenterVo?.id, name: disk?.dataCenterVo?.name});
      setDomainVo({id: disk?.storageDomainVo?.id, name: disk?.storageDomainVo?.name});
      setDiskProfileVo({id: disk?.diskProfileVo?.id, name: disk?.diskProfileVo?.name});
    }
  }, [isOpen, editMode, disk]);

  useEffect(() => {
    if (!editMode && datacenters && datacenters.length > 0) {
      setDataCenterVo({id: datacenters[0].id});
    }
  }, [datacenters, editMode]);

  useEffect(() => {
    if (!editMode && domains.length > 0) {
      setDomainVo({id: domains[0].id});
    }
  }, [domains, editMode]);

  useEffect(() => {
    if (!editMode && diskProfiles.length > 0) {
      setDiskProfileVo({id: diskProfiles[0].id});
    }
  }, [diskProfiles, editMode]);

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleInputChangeCheck = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const validateForm = () => {
    checkName(formState.alias);

    if (!formState.size) return "크기를 입력해주세요.";
    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!domainVo.id) return "스토리지 도메인을 선택해주세요.";
    if (!diskProfileVo.id) return "디스크 프로파일을 선택해주세요.";
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

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

    const onSuccess = () => {
      onClose();
      toast.success(`디스크 ${dLabel} 완료`);
    };
    const onError = (err) => toast.error(`Error ${dLabel} disk: ${err}`);

    console.log("Form Data: ", dataToSubmit); // 데이터를 확인하기 위한 로그

    editMode
      ? editDisk(
          { diskId: formState.id, diskData: dataToSubmit },
          { onSuccess, onError }
        )
      : addDisk(dataToSubmit, { onSuccess, onError });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={"디스크"}
      submitTitle={dLabel}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "640px" }}
    >
      <div className="disk-new-nav">
        <div
          id="storage_img_btn"
          onClick={() => handleTabClick("img")}
          className={activeTab === "img" ? "active" : ""}
        >
          이미지
        </div>
        {/* <div id="storage_directlun_btn" onClick={() => handleTabClick('directlun')} className={activeTab === 'directlun' ? 'active' : ''} >
          직접 LUN
        </div> */}
      </div>

      {/*이미지*/}
      {activeTab === "img" && (
        <div className="disk-new-img">
          <div className="disk-new-img-left">
            <LabelInputNum
              label="크기(GB)"
              value={formState.size}
              onChange={handleInputChange("size")}
              autoFocus={true}
              disabled={editMode}
            />
            {editMode && (
              <LabelInputNum
                label="추가크기(GB)"
                value={formState.appendSize}
                onChange={handleInputChange("appendSize")}
              />
            )}
            <LabelInput label={Localization.kr.ALIAS}
              value={formState.alias}
              onChange={handleInputChange("alias")}
            />
            <LabelInput label={Localization.kr.ALIAS}
              value={formState.description}
              onChange={handleInputChange("description")}
            />
            <LabelSelectOptionsID 
              label={Localization.kr.DATA_CENTER}
              value={dataCenterVo.id}
              disabled={editMode}
              loading={isDatacentersLoading}
              options={datacenters}
              onChange={(e) => {
                const selected = datacenters.find(dc => dc.id === e.target.value);
                if (selected) setDataCenterVo({ id: selected.id, name: selected.name });
              }}
            />
            <LabelSelectOptionsID
              label="스토리지 도메인"
              value={domainVo.id}
              disabled={editMode}
              loading={isDomainsLoading}
              options={domains}
              onChange={(e) => {
                const selected = domains.find(d => d.id === e.target.value);
                if (selected) setDomainVo({ id: selected.id, name: selected.name });
              }}
            />
            <LabelSelectOptions id="sparse" label={Localization.kr.SPARSE}
              value={String(formState.sparse)}
              onChange={(e) => setFormState((prev) => ({...prev, sparse: e.target.value === "true"}))}
              disabled={editMode}
              options={sparseList}
            />
            <LabelSelectOptionsID
              label="디스크 프로파일"
              value={diskProfileVo.id}
              loading={isDiskProfilesLoading}
              options={diskProfiles}
              onChange={(e) => {
                const selected = diskProfiles.find(dp => dp.id === e.target.value);
                if (selected) setDiskProfileVo({ id: selected.id, name: selected.name });
              }}
            />
          </div>
          <div className="disk-new-img-right">
            <div className="img-checkbox-outer">
              <LabelCheckbox label={Localization.kr.WIPE_AFTER_DELETE}
                id="wipeAfterDelete"
                checked={formState.wipeAfterDelete}
                onChange={handleInputChangeCheck("wipeAfterDelete")}
              />
            </div>
            {/* <div className="img-checkbox-outer">
              <LabelCheckbox label={Localization.kr.IS_SHARABLE}
                id="sharable"
                checked={formState.sharable}
                onChange={handleInputChangeCheck("sharable")}
                disabled={editMode}
              />
            </div> */}
            <div className="img-checkbox-outer">
              <LabelCheckbox
                label="증분 백업 사용"
                id="backup"
                checked={formState.backup}
                onChange={handleInputChangeCheck("backup")}
              />
            </div>
          </div>
        </div>
      )}

      {/* 직접LUN */}
      {/* {activeTab === 'directlun' && (
        <div id="storage-directlun-outer">
          <div id="storage-lun-first">
            <div className="disk-new-img-left">
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
            <div className="disk-new-img-right">
              <div>
                <input type="checkbox" className="shareable" />
                <label htmlFor="shareable">{Localization.kr.IS_SHARABLE}</label>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </BaseModal>
  );
};

export default DiskModal;
