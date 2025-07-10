import React, { useState, useEffect } from "react";
import {
  useValidationToast, useProgressToast,
} from "@/hooks/useSimpleToast";
import useUIState                       from "@/hooks/useUIState";
import BaseModal                        from "@/components/modal/BaseModal";
import LabelInput                       from "@/components/label/LabelInput";
import LabelCheckbox                    from "@/components/label/LabelCheckbox";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import { 
  handleInputChange, handleInputCheck, handleSelectIdChange,
} from "@/components/label/HandleInput";
import { Input }                        from "@/components/ui/input"
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
  emptyIdNameVo,
  readString, readUint32, readBigUint64, toGiB
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
  contentType: "raw",
  wipeAfterDelete: false,
  // sharable: false,
};

const DiskUploadModal = ({ 
  isOpen,
  onClose,
}) => {
  const { validationToast } = useValidationToast();
  const { progressToast } = useProgressToast()
  // const { closeModal } = useUIState()
  const [formState, setFormState] = useState(initialFormState);
  const [file, setFile] = useState(null);

  const [dataCenterVo, setDataCenterVo] = useState(emptyIdNameVo());
  const [domainVo, setDomainVo] = useState(emptyIdNameVo());
  const [diskProfileVo, setDiskProfileVo] = useState(emptyIdNameVo());
  const [hostVo, setHostVo] = useState(emptyIdNameVo());

  const { mutate: uploadDisk } = useUploadDisk((progress) => {
    /*if (progress < 1) onClose()*/
    progressToast.in(`${Localization.kr.DISK} ${Localization.kr.UPLOAD} 준비중 ... `, progress)
  });

  // 전체 데이터센터 가져오기
  const {
    data: datacenters = [],
    isLoading: isDatacentersLoading,
  } = useAllActiveDataCenters((e) => ({ ...e }));

  // const filteredDatacenters = datacenters.filter((d) => d.status?.toUpperCase() === "UP");

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
        setDataCenterVo({ 
          id: defaultDc.id, 
          name: defaultDc.name 
        });
      } else {
        setDataCenterVo({ 
          id: datacenters[0].id, 
          name: datacenters[0].name 
        });
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
      validationToast.fail(error);
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
      isReady={!isDatacentersLoading && !isDomainsLoading && !isDiskProfilesLoading && !isHostsLoading}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "790px" }} 
    >
      {/* <div className="storage-upload-first f-btw fs-14">
        <p className="fs-16">파일 선택</p>
        <DiskInspector 
          setFormState={setFormState}
          onUpload={(e) => {
            Logger.debug(`DiskUploadModal > onUpload ...`)
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
      </div> */}

      <div  >
        <DiskInspector 
          setFormState={setFormState}
          onUpload={(e) => {
            const uploadedFile = e.target.files[0];
            if (!uploadedFile) return;

            setFile(uploadedFile);
            setFormState((prev) => ({
              ...prev,
              alias: onlyFileName(uploadedFile.name),
              description: uploadedFile.name,
              size: uploadedFile.size,
            }));
          }}
        />
      </div>


      <div>
        <div className="disk-option fs-16 fw-500">디스크 옵션</div>
          <div className="disk-new-img" style={{ paddingTop: "0.4rem" }}>
            <div>
              <LabelInput id="size" label={`${Localization.kr.SIZE_ACTUAL} (GiB)`}
                type="number"
                value={sizeToGB(formState.size)}
                onChange={handleInputChange(setFormState, "size", validationToast)}
                disabled
              />
              <LabelInput label={Localization.kr.ALIAS}
                value={formState.alias}
                onChange={handleInputChange(setFormState, "alias", validationToast)}
              />
              <LabelInput label={Localization.kr.DESCRIPTION}
                value={formState.description}
                onChange={handleInputChange(setFormState, "description", validationToast)}
              />
              <LabelSelectOptionsID
                label={Localization.kr.DATA_CENTER}
                value={dataCenterVo.id}
                loading={isDatacentersLoading}
                options={datacenters}
                onChange={handleSelectIdChange(setDataCenterVo, datacenters, validationToast)}
              />
              <LabelSelectOptionsID
                label={Localization.kr.DOMAIN}
                value={domainVo.id}
                loading={isDomainsLoading}
                options={domains}
                onChange={handleSelectIdChange(setDomainVo, domains, validationToast)}
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
                onChange={handleSelectIdChange(setDiskProfileVo, diskProfiles, validationToast)}
              />
              <LabelSelectOptionsID
                label={Localization.kr.HOST}
                value={hostVo.id}
                loading={isHostsLoading}
                options={hosts}
                onChange={handleSelectIdChange(setHostVo, hosts, validationToast)}
              />
            </div>
          
            <div className="disk-new-img-right f-end">
              <div className='img-checkbox-outer'>
                <LabelCheckbox label={Localization.kr.WIPE_AFTER_DELETE}
                  id="wipeAfterDelete"
                  checked={formState.wipeAfterDelete}
                  onChange={handleInputCheck(setFormState, "wipeAfterDelete", validationToast)}
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
const DiskInspector = ({
  onUpload=()=>{},
  setFormState,
}) => {
  const [imageInfo, setImageInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageInfo(null);
    setError(null);
    onUpload(event);

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target.result;
        if (buffer.byteLength === 0) {
          setError("Cannot read the selected file.");
          return;
        }

        const isQcow = readString(buffer.slice(0, 4)) === 'QFI\xfb';
        const info = {
          format: isQcow ? "qcow2" : "raw",
          actualSize: file.size,
          virtualSize: BigInt(0),
          backingFile: false,
          qcowCompat: Localization.kr.NOT_ASSOCIATED,
          content: Localization.kr.DATA,
        };

        if (isQcow) {
          const version = readUint32(buffer.slice(4, 8));
          info.qcowCompat = version === 2 
            ? '0.10' 
            : version === 3 
              ? '1.1'
              : Localization.kr.UNKNOWN;
          
          const backingFileOffset = readBigUint64(buffer.slice(8, 16));
          info.backingFile = backingFileOffset !== BigInt(0)
          info.virtualSize = readBigUint64(buffer.slice(24, 32));
        } else {
          // An ISO file contains 'CD001' at offset 0x8001
          // Ensure we have enough data to check
          if (buffer.byteLength >= 0x8001 + 5) {
              const isISO = readString(buffer.slice(0x8001, 0x8001 + 5)) === 'CD001';
              if (isISO) {
                  info.content = "iso";
              }
          }
          info.virtualSize = BigInt(file.size);
        }
        setImageInfo(info);
        setFormState((prev) => ({
          ...prev,
          contentType: info.content === "iso" ? "iso" : "data",
          virtualSize: parseInt(info.virtualSize ?? BigInt(0)),
          actualSize: parseInt(info.actualSize ?? BigInt(0)),
          format: isQcow ? "cow" : "raw",
        }));
      } catch (err) {
        setError(`파일 분석 실패: ${err.message}`);
        console.error(err);
      }
    };

    reader.onerror = () => {
      setError("파일 읽기 실패");
    };

    // Read just enough of the file to perform all checks (32774 bytes)
    const blob = file.slice(0, 0x8001 + 5);
    reader.readAsArrayBuffer(blob);
  };

  return (
    <>
    <div className="storage-upload-head">
      <div className="storage-upload-first fs-14 f-btw" >
        <p className="fs-16 w-[900px] ">파일 선택</p>
        <Input id="file"
          type="file"
          className="f-center h-full"
          accept=".iso,.qcow2,.vhd,.img,.raw"
          onChange={handleFileChange} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div className="f-end mb-4">
        {imageInfo && (
          <div
            className="upload-grid fs-default ml-auto w-[333px] grid grid-cols-2 gap-x-4 gap-y-3 p-4"
            style={{
              border: "1px solid #ccc",
            }}
          >
            <div>
              <div>{Localization.kr.FORMAT}:</div> {imageInfo.format}
            </div>
            <div>
              <div>{Localization.kr.SIZE}:</div> {toGiB(imageInfo.actualSize)} GiB
            </div>

            {imageInfo.format === "qcow2" && (
              <>
                <div>
                  <div>{Localization.kr.SIZE_VIRTUAL}:</div> {toGiB(imageInfo.virtualSize)} GiB
                </div>
                <div>
                  <div>QCOW2 {Localization.kr.COMPAT}:</div> {imageInfo.qcowCompat}
                </div>
                <div>
                  <div>{Localization.kr.BACKING_FILE}:</div> {imageInfo.backingFile ? Localization.kr.YES : Localization.kr.NO}
                </div>
                <div>
                  <div>{Localization.kr.CONTENTS}:</div> {imageInfo.content}
                </div>
              </>
            )}

            {imageInfo.format !== "qcow2" && (
              <>
                <div>
                  <div>{Localization.kr.CONTENTS}:</div> {imageInfo.content}
                </div>
                <div />
              </>
            )}
          </div>
        )}
      </div>


      {/* <div className="f-end mb-4">
        {imageInfo && (
          <div 
            className="fs-8 ml-auto w-[335px]"
            style={
            { border: '1px solid #ccc', padding: '10px' }
          }>
            <p className="row">
              <strong>{Localization.kr.FORMAT}</strong>: {imageInfo.format}
            </p>
            <p className="row">
              <strong>{Localization.kr.SIZE}</strong>: {toGiB(imageInfo.actualSize)} GiB
            </p>
            {imageInfo.format === "qcow2" && 
            <p className="row">
              <strong>{Localization.kr.SIZE_VIRTUAL}</strong>: {toGiB(imageInfo.virtualSize)} GiB
            </p>}
            <p className="row">
              <strong>{Localization.kr.CONTENTS}</strong>: {imageInfo.content}
            </p>
            {imageInfo.format === "qcow2" && <p className="row">
              <strong>QCOW2 {Localization.kr.COMPAT}</strong>: {imageInfo.qcowCompat}
            </p>}
            {imageInfo.format === "qcow2" && <p className="row">
              <strong>{Localization.kr.BACKING_FILE}</strong>: {imageInfo.backingFile ? Localization.kr.YES : Localization.kr.NO}
            </p>}
          </div>
        )}
      </div> */}

      

    </div>
    </>
  );
};
// const DiskInspector = ({ onUpload = () => {}, setFormState }) => {
//   const [imageInfo, setImageInfo] = useState(null);
//   const [error, setError] = useState(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setImageInfo(null);
//     setError(null);
//     onUpload(event);
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const buffer = e.target.result;
//         const isQcow = readString(buffer.slice(0, 4)) === 'QFI\xfb';

//         const info = {
//           format: isQcow ? "qcow2" : "raw",
//           actualSize: file.size,
//           virtualSize: BigInt(file.size),
//           backingFile: false,
//           qcowCompat: Localization.kr.NOT_ASSOCIATED,
//           content: Localization.kr.DATA,
//         };

//         if (isQcow) {
//           const version = readUint32(buffer.slice(4, 8));
//           info.qcowCompat = version === 2 ? '0.10' : version === 3 ? '1.1' : Localization.kr.UNKNOWN;
//           info.backingFile = readBigUint64(buffer.slice(8, 16)) !== BigInt(0);
//           info.virtualSize = readBigUint64(buffer.slice(24, 32));
//         }

//         setImageInfo(info);
//         setFormState((prev) => ({
//           ...prev,
//           contentType: info.content === "iso" ? "iso" : "data",
//           format: isQcow ? "cow" : "raw",
//         }));
//       } catch (err) {
//         setError(`파일 분석 실패: ${err.message}`);
//       }
//     };

//     reader.onerror = () => setError("파일 읽기 실패");
//     const blob = file.slice(0, 0x8001 + 5);
//     reader.readAsArrayBuffer(blob);
//   };

//   return (
//     <div className="storage-upload-first fs-14 f-btw" >
//     <p className="fs-16" style={{ width: "900px" }}>파일 선택</p>
//       <Input
//         id="file"
//         type="file"
//         accept=".iso,.qcow2,.vhd,.img,.raw"
//         onChange={handleFileChange}
//         style={{ marginBottom: "0.5rem" }}
//       />
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {imageInfo && (
//         <div className="fs-default" style={{ border: '1px solid #ccc', padding: '10px' }}>
//           <p className="row"><strong>{Localization.kr.FORMAT}</strong>: {imageInfo.format}</p>
//           <p className="row"><strong>{Localization.kr.SIZE}</strong>: {toGiB(imageInfo.actualSize)} GiB</p>
//           {imageInfo.format === "qcow2" && (
//             <>
//               <p className="row"><strong>{Localization.kr.SIZE_VIRTUAL}</strong>: {toGiB(imageInfo.virtualSize)} GiB</p>
//               <p className="row"><strong>QCOW2 {Localization.kr.COMPAT}</strong>: {imageInfo.qcowCompat}</p>
//               <p className="row"><strong>{Localization.kr.BACKING_FILE}</strong>: {imageInfo.backingFile ? Localization.kr.YES : Localization.kr.NO}</p>
//             </>
//           )}
//           <p className="row"><strong>{Localization.kr.CONTENTS}</strong>: {imageInfo.content}</p>
//         </div>
//       )}
//     </div>
//   );
// };



export default DiskUploadModal;
