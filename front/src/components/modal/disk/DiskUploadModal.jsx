import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import {
  useAllActiveDataCenters,
  useAllActiveDomainFromDataCenter,
  useAllDiskProfileFromDomain,
  useHostsFromDataCenter,
  useUploadDisk,
} from "../../../api/RQHook";
import "../domain/MDomain.css";
import LabelInput from "../../label/LabelInput";
import LabelCheckbox from "../../label/LabelCheckbox";
import Localization from "../../../utils/Localization";
import { checkName, convertBytesToGB } from "../../../util";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import Logger from "../../../utils/Logger";

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

const DiskUploadModal = ({ isOpen, onClose }) => {
  const [formState, setFormState] = useState(initialFormState);
  const [file, setFile] = useState(null);

  const [dataCenterVo, setDataCenterVo] = useState({id: "", name: "" });
  const [domainVo, setDomainVo] = useState({id: "", name: "" });
  const [diskProfileVo, setDiskProfileVo] = useState({id: "", name: "" });
  const [hostVo, setHostVo] = useState({id: "", name: "" });

  const { mutate: uploadDisk } = useUploadDisk();

  // 전체 데이터센터 가져오기
  const {
    data: datacenters = [],
    isLoading: isDatacentersLoading,
  } = useAllActiveDataCenters((e) => ({ ...e }));

  // 선택한 데이터센터가 가진 도메인 가져오기
  const {
    data: domains = [],
    isLoading: isDomainsLoading,
  } = useAllActiveDomainFromDataCenter(dataCenterVo?.id || undefined, (e) => ({ ...e }));

  // 선택한 도메인이 가진 디스크 프로파일 가져오기
  const {
    data: diskProfiles = [],
    isLoading: isDiskProfilesLoading,
  } = useAllDiskProfileFromDomain(domainVo.id || undefined, (e) => ({...e}));
  const {
    data: hosts = [],
    isLoading: isHostsLoading,
  } = useHostsFromDataCenter(dataCenterVo?.id || undefined, (e) => ({ ...e }));

  useEffect(() => {
    if (!isOpen) return setFormState(initialFormState);
  }, [isOpen]);

  useEffect(() => {
    if (datacenters && datacenters.length > 0) {
      setDataCenterVo({id: datacenters[0].id});
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

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleInputChangeCheck = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const validateForm = () => {
    checkName(formState.alias)
    
    if (!formState.size) return "크기를 입력해주세요.";
    if (!dataCenterVo.id) return `${Localization.kr.DATA_CENTER}를 선택해주세요.`;
    if (!domainVo.id) return "스토리지 도메인을 선택해주세요.";
    if (!diskProfileVo.id) return "디스크 프로파일을 선택해주세요.";
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const sizeToBytes =  parseInt(formState.size, 10) * 1024 * 1024 * 1024;    

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
    diskData.append(
      "diskImage",
      new Blob([JSON.stringify(dataToSubmit)], { type: "application/json" })
    ); // JSON 데이터 추가

    Logger.debug(`디스크 업로드 데이터 ${diskData}`);

    uploadDisk(diskData, {
      onSuccess: () => {
        onClose(); // 성공 시 모달 닫기
        toast.success("디스크 업로드 완료");
      },
      onError: (error) => {
        toast.error("Error editing Host:", error);
      },
    });
  };

  return (
    <BaseModal
      isOpen={isOpen} onClose={onClose}
      targetName={"디스크"}
      submitTitle={"업로드"}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "790px" }} 
    >      
      <div className="storage-upload-first f-btw">
        <p>파일 선택</p>
        <div>
          <input
            type="file"
            id="file"
            accept=".iso"
            onChange={(e) => {
              const uploadedFile = e.target.files[0];
              if (uploadedFile) {
                setFile(uploadedFile); // 파일 저장
                setFormState((prev) => ({
                  ...prev,
                  alias: onlyFileName(uploadedFile.name),
                  description: uploadedFile.name,
                  size: uploadedFile.size, // bytes 단위
                }));
              }
            }}
          />
        </div>
      </div>

      <div>
        <div className="disk-option">디스크 옵션</div>
          <div className="disk-new-img" style={{ paddingTop: "0.4rem" }}>
            <div className="disk-new-img-left">
              <LabelInput
                label="크기(GB)"
                id="size"
                type="number"
                value={sizeToGB(formState.size)}
                onChange={handleInputChange("size")}
                disabled
              />
              <LabelInput label={Localization.kr.ALIAS}
                value={formState.alias}
                onChange={handleInputChange("alias")}
              />
              <LabelInput
                label="설명"
                value={formState.description}
                onChange={handleInputChange("description")}
              />
              <LabelSelectOptionsID
                label={Localization.kr.DATA_CENTER}
                value={dataCenterVo.id}
                loading={isDatacentersLoading}
                options={datacenters}
                onChange={(e) => {
                  const selected = datacenters.find(dc => dc.id === e.target.value);
                  if (selected) setDataCenterVo({ id: selected.id, name: selected.name });
                }}
              />
              {/* <LabelSelectOptionsID
                label="스토리지 도메인"
                value={domainVo.id}
                loading={isDomainsLoading}
                options={domains}
                onChange={(e) => {
                  const selected = domains.find(d => d.id === e.target.value);
                  if (selected) setDomainVo({ id: selected.id, name: selected.name });
                }}
              /> */}
              <div className='input-select'>
                <label className="">스토리지 도메인</label>
                <select 
                  value={domainVo.id} 
                  onChange={(e) => {
                    const selected = domains.find(d => d.id === e.target.value);
                    if (selected) setDomainVo({ id: selected.id, name: selected.name });
                  }}
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
              </div>

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
              <LabelSelectOptionsID
                label={Localization.kr.HOST}
                value={hostVo.id}
                loading={isHostsLoading}
                options={hosts}
                onChange={(e) => {
                  const selected = hosts.find(h => h.id === e.target.value);
                  if (selected) setHostVo({ id: selected.id, name: selected.name });
                }}
              />
            </div>
          
            <div className="disk-new-img-right">
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
