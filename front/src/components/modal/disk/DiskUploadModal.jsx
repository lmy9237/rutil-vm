import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import { useToast }                     from "@/hooks/use-toast";
import useUIState                       from "@/hooks/useUIState";
import BaseModal                        from "../BaseModal";
import LabelInput                       from "@/components/label/LabelInput";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import { 
  handleInputChange,
  handleSelectIdChange,
} from "@/components/label/HandleInput";
import {
  useAllActiveDataCenters,
  useAllActiveDomainsFromDataCenter,
  useAllDiskProfilesFromDomain,
  useHostsFromDataCenter,
  useUploadDisk,
} from "@/api/RQHook";
import { 
  checkName, 
  convertBytesToGB,
} from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import "../domain/MDomain.css";

const sizeToGB = (data) => Math.ceil(data / Math.pow(1024, 3));
const onlyFileName = (fileName) => {
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;
};

const initialFormState = {
  id: "",
  size: "",
  alias: "",
  description: "",
  wipeAfterDelete: false,
  // sharable: false,
};

const DiskUploadModal = ({ 
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  // const { closeModal } = useUIState()
  const [formState, setFormState] = useState(initialFormState);
  const [file, setFile] = useState(null);

  const [dataCenterVo, setDataCenterVo] = useState({id: "", name: "" });
  const [domainVo, setDomainVo] = useState({id: "", name: "" });
  const [diskProfileVo, setDiskProfileVo] = useState({id: "", name: "" });
  const [hostVo, setHostVo] = useState({id: "", name: "" });

  const { mutate: uploadDisk } = useUploadDisk((progress, toastId) => {
    /*if (progress < 1) onClose()*/
    toast.loading(`디스크 업로드 중 ... ${progress}%`, {
      id: toastId,
    });
    // TODO: 컴포넌트로 변경
  });

  // 전체 데이터센터 가져오기
  const {
    data: datacenters = [],
    isLoading: isDatacentersLoading,
  } = useAllActiveDataCenters((e) => ({ ...e }));

  // const filteredDatacenters = datacenters.filter((d) => d.status === "UP");

  // 선택한 데이터센터가 가진 도메인 가져오기
  const {
    data: domains = [],
    isLoading: isDomainsLoading,
  } = useAllActiveDomainsFromDataCenter(dataCenterVo?.id || undefined, (e) => ({ ...e }));

  // 선택한 도메인이 가진 디스크 프로파일 가져오기
  const {
    data: diskProfiles = [],
    isLoading: isDiskProfilesLoading,
  } = useAllDiskProfilesFromDomain(domainVo.id || undefined, (e) => ({...e}));
  const {
    data: hosts = [],
    isLoading: isHostsLoading,
  } = useHostsFromDataCenter(dataCenterVo?.id || undefined, (e) => ({ ...e }));

  useEffect(() => {
    if (!isOpen) return setFormState(initialFormState);
  }, [isOpen]);

  useEffect(() => {
    if (datacenters && datacenters.length > 0) {
    const defaultDc = datacenters.find(dc => dc.name === "Default"); // 만약 "Default"라는 이름이 있다면 우선 선택
      if (defaultDc) {
        setDataCenterVo({ id: defaultDc.id, name: defaultDc.name });
      } else {
        setDataCenterVo({ id: datacenters[0].id, name: datacenters[0].name });
      }
    }
  }, [datacenters]);

  useEffect(() => {
    if (domains.length > 0) {
      setDomainVo({id: domains[0].id});
    }
  }, [domains]);

  useEffect(() => {
    if (diskProfiles.length > 0) {
      setDiskProfileVo({id: diskProfiles[0].id});
    }
  }, [diskProfiles]);

  useEffect(() => {
    if (hosts && hosts.length > 0) {
      setHostVo({id: hosts[0].id});
    }
  }, [hosts]);

  const handleInputChangeCheck = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const validateForm = () => {
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
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error,
      });
      return;
    }

    const sizeToBytes = parseInt(formState.size, 10) * 1024 * 1024 * 1024;    

    const dataToSubmit = {
      ...formState,
      size: sizeToBytes,
      storageDomainVo: domainVo,
      diskProfileVo,
      // hostVo: { id: selectedHost.id, name: selectedHost.name },
    };

    // 파일데이터를 비동기로 보내기 위해 사용하는 객체
    const diskData = new FormData();
    diskData.append("file", file); // file 추가
    diskData.append("diskImage", new Blob([JSON.stringify(dataToSubmit)], { type: "application/json" })); // JSON 데이터 추가

    Logger.debug(`DiskUploadModal > handleFormSubmit ... diskData: `, diskData);
    uploadDisk(diskData);
    onClose();
  };

  return (
    <BaseModal targetName={Localization.kr.DISK} submitTitle={Localization.kr.UPLOAD}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "790px" }} 
    >
      <div className="storage-upload-first f-btw fs-14">
        <p className="fs-16">파일 선택</p>
        <div>
          <input id="file"
            type="file"
            accept=".iso,.qcow2,.vhd,.img,.raw"
            onChange={(e) => {
              const uploadedFile = e.target.files[0];
              if (!uploadedFile) return

              setFile(uploadedFile); // 파일 저장
              setFormState((prev) => ({
                ...prev,
                alias: onlyFileName(uploadedFile.name),
                description: uploadedFile.name,
                size: uploadedFile.size, // bytes 단위
              }));
            }}
          />
        </div>
      </div>

      <div>
        <div className="disk-option fs-16">디스크 옵션</div>
          <div className="disk-new-img" style={{ paddingTop: "0.4rem" }}>
            <div>
              <LabelInput id="size" label={Localization.kr.SIZE_ACTUAL}
                type="number"
                value={sizeToGB(formState.size)}
                onChange={handleInputChange(setFormState, "size")}
                disabled
              />
              <LabelInput label={Localization.kr.ALIAS}
                value={formState.alias}
                onChange={handleInputChange(setFormState, "alias")}
              />
              <LabelInput label={Localization.kr.DESCRIPTION}
                value={formState.description}
                onChange={handleInputChange(setFormState, "description")}
              />
              <LabelSelectOptionsID
                label={Localization.kr.DATA_CENTER}
                value={dataCenterVo.id}
                loading={isDatacentersLoading}
                options={datacenters}
                onChange={handleSelectIdChange(setDataCenterVo, datacenters)}
              />
              <LabelSelectOptionsID
                label="스토리지 도메인"
                value={domainVo.id}
                loading={isDomainsLoading}
                options={domains}
                onChange={handleSelectIdChange(setDomainVo, domains)}
                // onChange={(e) => {
                //   const selected = domains.find(d => d.id === e.target.value);
                //   if (selected) setDomainVo({ id: selected.id, name: selected.name });
                // }}
              />
              {/*<div className="input-select custom-select-wrapper">
                <label>스토리지 도메인</label>
                <select 
                  value={domainVo.id} 
                  onChange={handleSelectIdChange(setDomainVo, domains)}
                >
                  {isDomainsLoading ? (
                    <option>로딩중~</option>
                  ) : (
                    domains.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name} (사용가능: {convertBytesToGB(opt.availableSize)}, 총 {Localization.kr.SIZE_TOTAL}: {convertBytesToGB(opt.usedSize+opt.availableSize)})
                      </option>
                    ))
                  )}
                </select>
              </div> */}
              <LabelSelectOptionsID
                label="디스크 프로파일"
                value={diskProfileVo.id}
                loading={isDiskProfilesLoading}
                options={diskProfiles}
                onChange={handleSelectIdChange(setDiskProfileVo, diskProfiles)}
              />
              <LabelSelectOptionsID
                label={Localization.kr.HOST}
                value={hostVo.id}
                loading={isHostsLoading}
                options={hosts}
                onChange={handleSelectIdChange(setHostVo, hosts)}
              />
            </div>
          
            <div className="disk-new-img-right f-end">
              <div className='img-checkbox-outer'>
                <LabelCheckbox label={Localization.kr.WIPE_AFTER_DELETE}
                  id="wipeAfterDelete"
                  checked={formState.wipeAfterDelete}
                  onChange={handleInputChangeCheck("wipeAfterDelete")}
                />
              </div>
              {/* <div className='img-checkbox-outer'>
                <LabelCheckbox label={Localization.kr.IS_SHARABLE}
                  id="sharable"
                  className="sharable"
                  checked={sharable}
                  onChange={(e) => setSharable(e.target.checked)}
                />
                </div> */}
            </div>
          </div>
        </div>
    </BaseModal>
  );
};

export default DiskUploadModal;
