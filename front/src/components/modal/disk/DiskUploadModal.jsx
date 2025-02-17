import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import {
  useAllActiveDataCenters,
  useAllActiveDomainFromDataCenter,
  useAllDiskProfileFromDomain,
  useHostsFromDataCenter,
  useUploadDisk,
} from "../../../api/RQHook";
import "../domain/MDomain.css";

const FormGroup = ({ label, children }) => (
  <div className="img-input-box">
    <label>{label}</label>
    {children}
  </div>
);

const sizeToGB = (data) => Math.ceil(data / Math.pow(1024, 3));

const onlyFileName = (fileName) => {
  const lastDotIndex = fileName.lastIndexOf(".");
  return lastDotIndex > 0 ? fileName.slice(0, lastDotIndex) : fileName;
};

const DiskUploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [alias, setAlias] = useState("");
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [dataCenterVoId, setDataCenterVoId] = useState("");
  const [domainVoId, setDomainVoId] = useState("");
  const [diskProfileVoId, setDiskProfileVoId] = useState("");
  const [hostVoId, setHostVoId] = useState("");
  const [wipeAfterDelete, setWipeAfterDelete] = useState(false);
  const [sharable, setSharable] = useState(false);

  const { mutate: uploadDisk } = useUploadDisk();

  // 전체 데이터센터 가져오기
  const {
    data: datacenters = [],
    refetch: refetchDatacenters,
    isLoading: isDatacentersLoading,
  } = useAllActiveDataCenters((e) => ({ ...e }));

  // 선택한 데이터센터가 가진 도메인 가져오기
  const {
    data: domains = [],
    refetch: refetchDomains,
    isLoading: isDomainsLoading,
  } = useAllActiveDomainFromDataCenter(
    dataCenterVoId ? dataCenterVoId : undefined,
    (e) => ({ ...e })
  );

  // 선택한 도메인이 가진 디스크 프로파일 가져오기
  const {
    data: diskProfiles = [],
    refetch: diskProfilesRefetch,
    isLoading: isDiskProfilesLoading,
  } = useAllDiskProfileFromDomain(domainVoId ? domainVoId : undefined, (e) => ({
    ...e,
  }));

  const {
    data: hosts = [],
    refetch: refetchHosts,
    isLoading: isHostsLoading,
  } = useHostsFromDataCenter(
    dataCenterVoId ? dataCenterVoId : undefined,
    (e) => ({ ...e })
  );

  useEffect(() => {
    if (datacenters && datacenters.length > 0) {
      setDataCenterVoId(datacenters[0].id);
    }
  }, [datacenters]);

  useEffect(() => {
    if (domains && domains.length > 0) {
      setDomainVoId(domains[0].id);
    }
  }, [domains]);

  useEffect(() => {
    if (diskProfiles && diskProfiles.length > 0) {
      setDiskProfileVoId(diskProfiles[0].id);
    }
  }, [diskProfiles]);

  useEffect(() => {
    if (hosts && hosts.length > 0) {
      setHostVoId(hosts[0].id);
    }
  }, [hosts]);

  const validateForm = () => {
    if (!alias) return "별칭을 입력해주세요.";
    if (!size) return "크기를 입력해주세요.";
    if (!dataCenterVoId) return "데이터 센터를 선택해주세요.";
    if (!domainVoId) return "스토리지 도메인을 선택해주세요.";
    if (!diskProfileVoId) return "디스크 프로파일을 선택해주세요.";
    return null;
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    // const sizeToBytes = parseInt(formState.size, 10) * 1024 * 1024 * 1024; // GB -> Bytes 변환

    // const selectedDataCenter = datacenters.find((dc) => dc.id === dataCenterVoId);
    const selectedDomain = domains.find((dm) => dm.id === domainVoId);
    const selectedDiskProfile = diskProfiles.find(
      (dp) => dp.id === diskProfileVoId
    );
    // const selectedHost = hosts.find((h) => h.id === hostVoId);

    const dataToSubmit = {
      alias,
      size,
      description,
      storageDomainVo: { id: selectedDomain.id, name: selectedDomain.name },
      diskProfileVo: {
        id: selectedDiskProfile.id,
        name: selectedDiskProfile.name,
      },
      // hostVo: { id: selectedHost.id, name: selectedHost.name },
      wipeAfterDelete,
      sharable,
    };

    // 파일데이터를 비동기로 보내기 위해 사용하는 객체
    const diskData = new FormData();
    diskData.append("file", file); // file 추가
    diskData.append(
      "diskImage",
      new Blob([JSON.stringify(dataToSubmit)], { type: "application/json" })
    ); // JSON 데이터 추가

    console.log(`데이터 ${dataToSubmit}`);

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
      isOpen={isOpen}
      onClose={onClose}
      targetName={"디스크"}
      submitTitle={"업로드"}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="storage-disk-upload-popup modal"> */}
      <div className="popup-header">
        <h1>이미지 업로드</h1>
        <button onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} fixedWidth />
        </button>
      </div>
      <div className="storage-upload-first">
        <input
          type="file"
          id="file"
          accept=".iso"
          onChange={(e) => {
            const uploadedFile = e.target.files[0];
            if (uploadedFile) {
              setFile(uploadedFile); // 파일 저장
              setAlias(uploadedFile.name);
              setDescription(uploadedFile.name);
              setSize(Math.ceil(uploadedFile.size));
            }
          }}
        />
      </div>

      <div>
        <div className="disk-option">디스크 옵션</div>
        <div className="disk-new-img" style={{ paddingTop: "0.4rem" }}>
          <div className="disk-new-img-left">
            <FormGroup label="크기(GB)">
              <input
                type="number"
                min="0"
                value={sizeToGB(size)}
                onChange={(e) => setSize(e.target.value)}
                disabled
              />
            </FormGroup>

            <FormGroup label="별칭">
              <input
                type="text"
                value={onlyFileName(alias)}
                onChange={(e) => {
                  setAlias(e.target.value);
                }}
              />
            </FormGroup>

            <FormGroup label="설명">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormGroup>

            <FormGroup label="데이터 센터">
              {isDatacentersLoading ? (
                <p>데이터 센터를 불러오는 중...</p>
              ) : datacenters.length === 0 ? (
                <p>사용 가능한 데이터 센터가 없습니다.</p>
              ) : (
                <select
                  value={dataCenterVoId}
                  onChange={(e) => setDataCenterVoId(e.target.value)}
                >
                  {datacenters &&
                    datacenters.map((dc) => (
                      <option key={dc.id} value={dc.id}>
                        {dc.name}
                      </option>
                    ))}
                </select>
              )}
            </FormGroup>

            <FormGroup label="스토리지 도메인">
              <select
                value={domainVoId}
                onChange={(e) => setDomainVoId(e.target.value)}
              >
                {domains &&
                  domains.map((dm) => (
                    <option key={dm.id} value={dm.id}>
                      {dm.name} (USED {sizeToGB(dm.availableSize)}/ TOTAL{" "}
                      {sizeToGB(dm.diskSize)})
                    </option>
                  ))}
              </select>
            </FormGroup>

            <FormGroup label="디스크 프로파일">
              <select
                value={diskProfileVoId}
                onChange={(e) => setDiskProfileVoId(e.target.value)}
              >
                {diskProfiles &&
                  diskProfiles.map((dp) => (
                    <option key={dp.id} value={dp.id}>
                      {dp.name}
                    </option>
                  ))}
              </select>
            </FormGroup>

            <FormGroup label="호스트">
              <select
                value={hostVoId}
                onChange={(e) => setHostVoId(e.target.value)}
              >
                {hosts &&
                  hosts.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
              </select>
            </FormGroup>
          </div>

          <div className="disk-new-img-right">
            <div>
              <input
                type="checkbox"
                id="wipeAfterDelete"
                checked={wipeAfterDelete}
                onChange={(e) => setWipeAfterDelete(e.target.checked)}
              />
              <label htmlFor="wipeAfterDelete">삭제 후 초기화</label>
            </div>
            <div>
              <input
                type="checkbox"
                className="sharable"
                checked={sharable}
                onChange={(e) => setSharable(e.target.checked)}
              />
              <label htmlFor="sharable">공유 가능</label>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default DiskUploadModal;
