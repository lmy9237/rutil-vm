import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import LabelInputNum from "../../label/LabelInputNum";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import LabelCheckbox from "../../label/LabelCheckbox";
import {
  useAllActiveDomainFromDataCenter,
  useAllDiskProfileFromDomain,
  useAddDiskFromVM,
  useEditDiskFromVM,
  useDiskAttachmentFromVm,
  useVmById,
} from "../../../api/RQHook";
import { checkKoreanName, convertBytesToGB } from "../../../util";


const interfaceList = [
  { value: "VIRTIO_SCSI", label: "VirtIO-SCSI" },
  { value: "VIRTIO", label: "VirtIO" },
  { value: "SATA", label: "SATA" },
];

const sparseList = [
  { value: "true", label: "씬 프로비저닝" },
  { value: "false", label: "사전 할당" },
];

const initialFormState = {
  id: "",
  size: "",
  appendSize: 0,
  alias: "",
  description: "",
  interface_: "VIRTIO_SCSI", // 인터페이스
  sparse: true, //할당정책: 씬
  active: true, // 디스크 활성화
  wipeAfterDelete: false, // 삭제 후 초기화
  bootable: false, // 부팅가능
  sharable: false, // 공유가능
  readOnly: false, // 읽기전용
  // cancelActive: false, // 취소 활성화
  backup: true, // 증분 백업사용
};

// type은 vm이면 가상머신 생성할때 디스크 생성하는 창, disk면 가상머신 디스크 목록에서 생성하는
const VmDiskModal = ({
  isOpen,
  editMode = false,
  vmId,
  diskAttachmentId,
  dataCenterId,
  diskType = true,  // t=disk페이지에서 생성 f=vm만들때 같이 생성
  onClose,

  vmName, //가상머신 생성 디스크 이름
  onCreateDisk,
}) => {
  const dLabel = editMode ? "편집" : "생성";
  const [activeTab, setActiveTab] = useState("img");
  const handleTabClick = (tab) => { setActiveTab(tab) };

  const [formState, setFormState] = useState(initialFormState);
  const [storageDomainVo, setStorageDomainVo] = useState({ id: "", name: "" });
  const [diskProfileVo, setDiskProfileVo] = useState({ id: "", name: "" });

  const { mutate: addDiskVm } = useAddDiskFromVM();
  const { mutate: editDiskVm } = useEditDiskFromVM();
  const { data: vm }  = useVmById(vmId);

  // 디스크 데이터 가져오기
  const { data: diskAttachment } = 
    useDiskAttachmentFromVm(vmId, diskAttachmentId);

  // 선택한 데이터센터가 가진 도메인 가져오기
  const { data: domains = [], isLoading: isDomainsLoading } = 
    useAllActiveDomainFromDataCenter(vm?.dataCenterVo?.id || dataCenterId, (e) => ({ ...e }));

  // 선택한 도메인이 가진 디스크 프로파일 가져오기
  const { data: diskProfiles = [], isLoading: isDiskProfilesLoading, } = 
    useAllDiskProfileFromDomain(storageDomainVo.id, (e) => ({ ...e }));

  useEffect(() => {
    if (!isOpen) {
      setFormState(initialFormState);
      setStorageDomainVo({ id: "", name: "" });
      setDiskProfileVo({ id: "", name: "" });
    } 
    if (editMode && diskAttachment) {
      setFormState({
        id: diskAttachment?.id || "",
        size: convertBytesToGB (diskAttachment?.diskImageVo?.virtualSize),
        appendSize: 0,
        alias: diskAttachment?.diskImageVo?.alias || "",
        description: diskAttachment?.diskImageVo?.description || "",
        interface_: diskAttachment?.interface_ || "VIRTIO_SCSI",
        sparse: diskAttachment?.diskImageVo?.sparse || false,
        active: diskAttachment?.active || false,
        wipeAfterDelete: diskAttachment?.diskImageVo?.wipeAfterDelete || false,
        bootable: diskAttachment?.bootable || false,
        sharable: diskAttachment?.diskImageVo?.sharable || false,
        readOnly: diskAttachment?.readOnly || false,
        // cancelActive: diskAttachment?.cancelActive || false,
        backup: diskAttachment?.diskImageVo?.backup || false,
      });
      setStorageDomainVo({ id: diskAttachment?.diskImageVo?.storageDomainVo?.id || "", name: diskAttachment?.diskImageVo?.storageDomainVo?.name || "" });
      setDiskProfileVo({ id: diskAttachment?.diskImageVo?.diskProfileVo?.id || "", name: diskAttachment?.diskImageVo?.diskProfileVo?.name || "" });
    }
  }, [isOpen, editMode, diskAttachment]);

  useEffect(() => {
    if (vmName) {
      setFormState((prev) => ({ ...prev, alias: vmName }));
    }
  }, [vmName]);

  useEffect(() => {
    if (!editMode && domains && domains.length > 0) {
      const firstDomain = domains[0];
      setStorageDomainVo({id: firstDomain.id, name: firstDomain.name});
    }
  }, [domains, editMode]);
  

  useEffect(() => {
    if (!editMode && diskProfiles && diskProfiles.length > 0) {
      setDiskProfileVo({id: diskProfiles[0].id});
    }
  }, [diskProfiles, editMode]);

  useEffect(() => {
    if (!editMode && interfaceList.length > 0 && !formState.interface_) {
      setFormState((prev) => ({ ...prev, interface_: interfaceList[0].value }));
    }
  }, [interfaceList, editMode, formState.interface_]);

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleInputChangeCheck = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const validateForm = () => {
    if (!formState.alias) return "별칭을 입력해주세요.";
    if (checkKoreanName(formState.alias)) return "별칭을 입력해주세요.";
    if (!formState.size) return "크기를 입력해주세요.";
    if (!storageDomainVo.id) return "스토리지 도메인을 선택해주세요.";
    if (!diskProfileVo.id) return "디스크 프로파일을 선택해주세요.";
    return null;
  };

  // vm disk에서 생성 (가상머신 생성x)
  const handleOkClick = () => {
    const error = validateForm();
    if (error) return toast.error(error);
    
    const newDisk = {
      alias: formState.alias,
      size: formState.size,
      interface_: formState.interface_,
      sparse: formState.sparse,
      bootable: formState.bootable,
      readOnly: formState.readOnly,
      storageDomainVo: { id: storageDomainVo.id },
      diskProfileVo: { id: diskProfileVo.id },
      isCreated: true, // 🚀 생성된 디스크는 isCreated: true
    };
    onCreateDisk(newDisk);
    onClose();
  };

  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);

    const sizeToBytes = parseInt(formState.size, 10) * 1024 * 1024 * 1024; // GB -> Bytes 변환
    const appendSizeToBytes =
      parseInt(formState.appendSize || 0, 10) * 1024 * 1024 * 1024; // GB -> Bytes 변환 (기본값 0)

    const selectedDomain = domains.find((dm) => dm.id === storageDomainVo.id);
    const selectedDiskProfile = diskProfiles.find((dp) => dp.id === diskProfileVo.id);
    console.log("Form Data: ", selectedDomain);

    // 전송 객체
    const dataToSubmit = {
      // id: disk?.id,
      ...formState,
      // bootable: formState.bootable,
      // readOnly: formState.readOnly,
      // passDiscard: formState.passDiscard,
      // interface_: formState.interface_,
      diskImageVo: {
        id:formState?.id,
        alias: formState.alias,
        size: sizeToBytes,
        appendSize: appendSizeToBytes,
        description: formState.description,
        wipeAfterDelete: formState.wipeAfterDelete,
        backup: formState.backup,
        sparse: Boolean(formState.sparse),
        storageDomainVo: { id: selectedDomain?.id, name: selectedDomain?.name },
        diskProfileVo: { id: selectedDiskProfile?.id, name: selectedDiskProfile?.name },
      },
    };

    const onSuccess = () => {
      onClose();
      toast.success(`가상머신 디스크 ${dLabel} 완료`);
    };
    const onError = (err) => toast.error(`Error ${dLabel} disk: ${err}`);

    console.log("Form Data: ", dataToSubmit); // 데이터를 확인하기 위한 로그

    editMode
      ? editDiskVm(
          {
            vmId,
            diskAttachmentId: formState?.id,
            diskAttachment: dataToSubmit,
          },
          { onSuccess, onError }
        )
      : addDiskVm(
          { vmId, diskData: dataToSubmit },
          { onSuccess, onError }
        );
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      targetName={"디스크"}
      submitTitle={dLabel}
      onSubmit={diskType? handleFormSubmit : handleOkClick}
      contentStyle={{ width: "780px", height: "570px" }} 
    >
      {/* <div className="storage-disk-new-popup modal"> */}
      <div className="popup-content-outer">
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
                className="img-input-box"
                label="크기(GB)"
                value={formState.size}
                onChange={handleInputChange("size")}
                autoFocus={true}
                disabled={editMode}
              />
              {editMode && (
                <LabelInputNum
                  className="img-input-box"
                  label="추가크기(GB)"
                  value={formState.appendSize}
                  onChange={handleInputChange("appendSize")}
                />
              )}
              <LabelInput className="img-input-box" label="별칭" value={formState.alias} onChange={handleInputChange("alias")}/>
              <LabelInput className="img-input-box" label="설명" value={formState.description} onChange={handleInputChange("description")}/>

              <LabelSelectOptions
                className="img-input-box"
                label="인터페이스"
                value={formState.interface_}
                onChange={handleInputChange("interface_")}
                disabled={editMode}
                options={interfaceList}
              />
              <LabelSelectOptionsID
                className="img-input-box"
                label="스토리지 도메인"
                value={storageDomainVo.id}
                onChange={(e) => {
                  const selectedDomain = domains.find((domain) => domain.id === e.target.value);
                  setStorageDomainVo({
                    id: e.target.value,
                    name: selectedDomain ? selectedDomain.name : "",
                  });
                }}
                disabled={editMode}
                loading={isDomainsLoading}
                options={domains}
              />
              <LabelSelectOptions
                className="img-input-box"
                label="할당 정책"
                value={String(formState.sparse)}
                // value={formState.sparse ? "true" : "false"}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    sparse: e.target.value === "true",
                  }))
                }
                disabled={editMode}
                options={sparseList}
              />
              <LabelSelectOptionsID
                className="img-input-box"
                label="디스크 프로파일"
                value={diskProfileVo.id}
                onChange={(e) => {
                  const selectedDiskProfile = domains.find((dp) => dp.id === e.target.value);
                  setDiskProfileVo({
                    id: e.target.value,
                    name: selectedDiskProfile ? selectedDiskProfile.name : "",
                  });
                }}
                loading={isDiskProfilesLoading}
                options={diskProfiles}
              />
            </div>

            <div className="disk-new-img-right">
              <LabelCheckbox label="삭제 후 초기화" id="wipeAfterDelete" checked={Boolean(formState.wipeAfterDelete)} onChange={handleInputChangeCheck("wipeAfterDelete")}/>
              <LabelCheckbox label="부팅 가능" id="bootable" checked={Boolean(formState.bootable)} onChange={handleInputChangeCheck("bootable")} />
              {/* disabled={!formState.bootable}  */}
              <LabelCheckbox label="공유 가능" id="sharable" checked={Boolean(formState.sharable)} onChange={handleInputChangeCheck("sharable")} disabled={editMode} />
              <LabelCheckbox label="읽기 전용" id="readOnly" checked={Boolean(formState.readOnly)} onChange={handleInputChangeCheck("readOnly")} disabled={editMode}/>
              {/* <LabelCheckbox label="취소 활성화" id="cancelActive" checked={Boolean(formState.cancelActive)} onChange={handleInputChangeCheck("cancelActive")} disabled={editMode}/> */}
              <LabelCheckbox label="증분 백업 사용" id="backup" checked={Boolean(formState.backup)} onChange={handleInputChangeCheck("backup")} />
            </div>
          </div>
        )}
        {/* 직접LUN */}
        {/* {activeTab === 'directlun' && (
          <div id="storage-directlun-outer">
            <div id="storage-lun-first">
              <div className="disk-new-img-left">
                <div className="img-input-box">
                  <span>별칭</span>
                  <input type="text" />
                </div>
                <div className="img-input-box">
                  <span>설명</span>
                  <input type="text" />
                </div>
                <div className="img-select-box">
                  <label htmlFor="os">데이터 센터</label>
                  <select id="os">
                    <option value="linux">Linux</option>
                  </select>
                </div>
                <div className="img-select-box">
                  <label htmlFor="os">호스트</label>
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
                  <label htmlFor="shareable">공유 가능</label>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </BaseModal>
  );
};

export default VmDiskModal;
