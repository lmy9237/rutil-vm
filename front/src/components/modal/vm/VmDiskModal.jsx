import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import LabelInput from "../../label/LabelInput";
import LabelInputNum from "../../label/LabelInputNum";
import LabelSelectOptionsID from "../../label/LabelSelectOptionsID";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import LabelCheckbox from "../../label/LabelCheckbox";
import {
  useAllActiveDomainsFromDataCenter,
  useAllDiskProfilesFromDomain,
  useAddDiskFromVM,
  useEditDiskFromVM,
  useDiskAttachmentFromVm,
  useVm,
} from "../../../api/RQHook";
import { checkKoreanName, convertBytesToGB, convertGBToBytes } from "../../../util";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

// 이 모달은 가상머신 생성에서 디스크 생성, 편집에서 사용될 예정
// 또한 가상머신-디스크 에서 디스크 생성, 편집에서 사용될 예정

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
  bootable: true, // 부팅가능
  sharable: false, // 공유가능
  readOnly: false, // 읽기전용
  // cancelActive: false, // 취소 활성화
  backup: true, // 증분 백업사용
  shouldUpdateDisk: false,
};

// type은 vm이면 가상머신 생성할때 디스크 생성하는 창, disk면 가상머신 디스크 목록에서 생성하는
const VmDiskModal = ({
  isOpen,
  editMode = false,
  diskType = true,  // t=disk페이지에서 생성 f=vm만들때 같이 생성
  vmId,
  vmName, //가상머신 생성 디스크 이름
  diskAttachmentId,
  dataCenterId,
  hasBootableDisk=false, // 부팅가능한 디스크 여부
  initialDisk,
  onCreateDisk,
  onClose,  
}) => {
  const dLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;
  const [activeTab, setActiveTab] = useState("img");
  const handleTabClick = (tab) => { setActiveTab(tab) };

  const [formState, setFormState] = useState(initialFormState);
  const [storageDomainVo, setStorageDomainVo] = useState({ id: "", name: "" });
  const [diskProfileVo, setDiskProfileVo] = useState({ id: "", name: "" });

  const onSuccess = () => {
    onClose();
    toast.success(`${Localization.kr.VM} ${Localization.kr.DISK} ${dLabel} 완료`);
  };
  const { mutate: addDiskVm } = useAddDiskFromVM(onSuccess, () => onClose());
  const { mutate: editDiskVm } = useEditDiskFromVM(onSuccess, () => onClose());
  const { data: vm }  = useVm(vmId);
  
  // 디스크 데이터 가져오기
  const { data: diskAttachment } = useDiskAttachmentFromVm(vmId, diskAttachmentId);

  // 선택한 데이터센터가 가진 도메인 가져오기
  const { 
    data: domains = [], 
    isLoading: isDomainsLoading 
  } = useAllActiveDomainsFromDataCenter(dataCenterId || vm?.dataCenterVo?.id, (e) => ({ ...e }));

  // 선택한 도메인이 가진 디스크 프로파일 가져오기
  const { 
    data: diskProfiles = [], 
    isLoading: isDiskProfilesLoading, 
    isError: isDiskProfilesError,
    isSuccess: isDiskProfilesSuccess
  } = useAllDiskProfilesFromDomain(storageDomainVo.id, (e) => ({ ...e }));

  useEffect(() => {
    if (!editMode && isOpen && vmName) {
      setFormState((prev) => ({ ...prev, alias: vmName }));
    }
  }, [editMode, isOpen, vmName]); 

  useEffect(() => {
    if (!editMode && domains.length > 0 && !storageDomainVo.id) {
      setStorageDomainVo({ id: domains[0].id, name: domains[0].name });
    }
  }, [domains, editMode, storageDomainVo.id]);
  
  
  useEffect(() => {
    if (!editMode && diskProfiles && diskProfiles.length > 0) {
      setDiskProfileVo({id: diskProfiles[0].id, name: diskProfiles[0].id});
    }
  }, [diskProfiles, editMode]);

  useEffect(() => {
    if (!editMode && interfaceList.length > 0 && !formState.interface_) {
      setFormState((prev) => ({ ...prev, interface_: interfaceList[0].value }));
    }
  }, [interfaceList, editMode, formState.interface_]);

  useEffect(() => {
    if (!isOpen) {
      setFormState((prev) => ({
        ...initialFormState,
        alias: vmName || "",
        bootable: hasBootableDisk ? false : initialFormState.bootable
      }));
      setStorageDomainVo({ id: domains[0]?.id, name: domains[0]?.name });
      setDiskProfileVo({ id: diskProfiles[0]?.id, name: diskProfiles[0]?.name });
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
        bootable: hasBootableDisk ? false : diskAttachment?.bootable || true,
        sharable: diskAttachment?.diskImageVo?.sharable || false,
        readOnly: diskAttachment?.readOnly || false,
        // cancelActive: diskAttachment?.cancelActive || false,
        backup: diskAttachment?.diskImageVo?.backup || false,
        // shouldUpdateDisk: true
      });
      setStorageDomainVo({ id: diskAttachment?.diskImageVo?.storageDomainVo?.id || "", name: diskAttachment?.diskImageVo?.storageDomainVo?.name || "" });
      setDiskProfileVo({ id: diskAttachment?.diskImageVo?.diskProfileVo?.id || "", name: diskAttachment?.diskImageVo?.diskProfileVo?.name || "" });
    }
  }, [isOpen, editMode, diskAttachment, hasBootableDisk]);

  useEffect(() => {
    if (!editMode && initialDisk) {
      setFormState({
        id: initialDisk?.id || "",
        size: initialDisk?.size || "",
        appendSize: 0,
        alias: initialDisk?.alias || "",
        description: initialDisk?.description || "",
        interface_: initialDisk?.interface_ || "VIRTIO_SCSI",
        sparse: initialDisk?.sparse || false,
        active: initialDisk?.active || false,
        wipeAfterDelete: initialDisk?.wipeAfterDelete || false,
        bootable: hasBootableDisk ? false : initialDisk?.bootable || true,
        sharable: initialDisk?.sharable || false,
        readOnly: initialDisk?.readOnly || false,
        backup: initialDisk?.backup || false,
        // shouldUpdateDisk: true
      });
      setStorageDomainVo({ id: initialDisk?.diskImageVo?.storageDomainVo?.id || "", name: initialDisk?.diskImageVo?.storageDomainVo?.name || ""  });
      setDiskProfileVo({ id: initialDisk?.diskImageVo?.diskProfileVo?.id || ""});
    }
  }, [editMode, initialDisk, hasBootableDisk]);
  

  const handleInputChange = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleInputChangeCheck = (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  const handleSelectIdChange = (setVo, voList) => (e) => {
    const selected = voList.find((item) => item.id === e.target.value);
    if (selected) setVo({ id: selected.id, name: selected.name });
  }; 

  const validateForm = () => {
    if (!formState.alias) return `${Localization.kr.ALIAS}을 입력해주세요.`;
    if (checkKoreanName(formState.alias)) return `${Localization.kr.ALIAS}을 입력해주세요.`;
    if (!formState.size) return `크기를 입력해주세요.`;
    if (!storageDomainVo.id) return `${Localization.kr.DOMAIN}을 선택해주세요.`;
    if (!diskProfileVo.id) return `${Localization.kr.DISK_PROFILE}을 선택해주세요.`;
    return null;
  };

  const handleOkClick = () => {
    const error = validateForm();
    if (error) return toast.error(error);
 
    // const sizeToBytes = convertGBToBytes(parseInt(formState.size, 10));

    const selectedDomain = domains.find((dm) => dm.id === storageDomainVo.id);
    const selectedDiskProfile = diskProfiles.find((dp) => dp.id === diskProfileVo.id);
    
    const newDisk = {
      alias: formState.alias,
      size: formState.size,
      interface_: formState.interface_,
      sparse: formState.sparse,
      bootable: formState.bootable,
      readOnly: formState.readOnly,
      storageDomainVo: { id: selectedDomain.id },
      diskProfileVo: { id: selectedDiskProfile.id },
      isCreated: true, // 🚀 생성된 디스크는 isCreated: true
    };
    Logger.debug(`Form Data: ${JSON.stringify(newDisk, null, 2)}`);
    onCreateDisk(newDisk);
    onClose();
  };    


  const handleFormSubmit = () => {
    const error = validateForm();
    if (error) return toast.error(error);
 
    // GB -> Bytes 변환
    const sizeToBytes = convertGBToBytes(parseInt(formState.size, 10));
    // GB -> Bytes 변환 (기본값 0)
    const appendSizeToBytes = convertGBToBytes(parseInt(formState.appendSize || 0, 10)); 

    const selectedDomain = domains.find((dm) => dm.id === storageDomainVo.id);
    const selectedDiskProfile = diskProfiles.find((dp) => dp.id === diskProfileVo.id);
    Logger.debug(`Form Data: ${JSON.stringify(selectedDomain, null, 2)}`);

    // 전송 객체
    const dataToSubmit = {
      id: formState?.id,
      ...formState,
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
    
    Logger.debug(`데이터 : ${JSON.stringify(dataToSubmit, null, 2)}`); // 데이터를 확인하기 위한 로그

    editMode
      ? editDiskVm({ vmId, diskAttachmentId: formState?.id, diskAttachment: dataToSubmit })
      : addDiskVm({ vmId, diskData: dataToSubmit });
  };

  return (
    <BaseModal targetName={Localization.kr.DISK} submitTitle={dLabel}
      isOpen={isOpen} onClose={onClose}      
      onSubmit={diskType? handleFormSubmit : handleOkClick}
      contentStyle={{ width: "700px" }} 
    >
      {/* <div className="storage-disk-new-popup modal"> */}
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
              <span>Bootable Disk: {hasBootableDisk ? "true" : "false"}</span>

              <LabelInputNum label="크기(GB)"
                value={formState.size}
                autoFocus
                disabled={editMode}
                onChange={handleInputChange("size")}
              />
              {editMode && (
                <LabelInputNum label="추가크기(GB)"
                  value={formState.appendSize}
                  onChange={handleInputChange("appendSize")}
                />
              )}
              <LabelInput id="alias" label={Localization.kr.ALIAS}
                value={formState.alias} 
                onChange={handleInputChange("alias")}
              />
              <LabelInput id="description" label={Localization.kr.DESCRIPTION}
                value={formState.description} 
                onChange={handleInputChange("description")}
              />
              <LabelSelectOptions label="인터페이스"
                value={formState.interface_}
                disabled={editMode}
                options={interfaceList}
                onChange={handleInputChange("interface_")}
              />
              <LabelSelectOptionsID label={Localization.kr.DOMAIN}
                value={storageDomainVo.id}
                disabled={editMode}
                loading={isDomainsLoading}
                options={domains}
                onChange={handleSelectIdChange(setStorageDomainVo, domains)}
              />
              <LabelSelectOptionsID label={Localization.kr.DISK_PROFILE}
                value={diskProfileVo.id}
                loading={isDiskProfilesLoading}
                options={diskProfiles}
                onChange={handleSelectIdChange(setDiskProfileVo, diskProfiles)}
              />
              <LabelSelectOptions id="sparse" label={Localization.kr.SPARSE}
                value={String(formState.sparse)}
                disabled={editMode}
                options={sparseList}
                onChange={(e) => setFormState((prev) => ({...prev, sparse: e.target.value === "true", }))}
              />
            </div>

            <div className="disk-new-img-right">
              <div className='img-checkbox-outer'>
                <LabelCheckbox id="wipeAfterDelete" label={Localization.kr.WIPE_AFTER_DELETE}
                  checked={Boolean(formState.wipeAfterDelete)} 
                  onChange={handleInputChangeCheck("wipeAfterDelete")}
                />
              </div>
              <div className='img-checkbox-outer'>
                <LabelCheckbox id="bootable" label={Localization.kr.IS_BOOTABLE}
                  checked={!hasBootableDisk && Boolean(formState.bootable)}
                  disabled={hasBootableDisk} // 이미 부팅 디스크가 있으면 비활성화
                  onChange={handleInputChangeCheck("bootable")}
                />
              </div>
              <div className='img-checkbox-outer'>
                <LabelCheckbox id="sharable" label={Localization.kr.IS_SHARABLE}
                  checked={Boolean(formState.sharable)} 
                  disabled={editMode} 
                  onChange={handleInputChangeCheck("sharable")} 
                />
              </div>
              <div className='img-checkbox-outer'>
                <LabelCheckbox id="readOnly" label={Localization.kr.IS_READ_ONLY}
                  checked={Boolean(formState.readOnly)} 
                  disabled={editMode}
                  onChange={handleInputChangeCheck("readOnly")} 
                />
              </div>
              {/* 
              <LabelCheckbox 
                label="취소 활성화" 
                id="cancelActive" 
                checked={Boolean(formState.cancelActive)} 
                onChange={handleInputChangeCheck("cancelActive")}
                disabled={editMode}
              /> 
              */}
              <div className='img-checkbox-outer'>
                <LabelCheckbox 
                  label="증분 백업 사용" 
                  id="backup" 
                  checked={Boolean(formState.backup)} 
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
                  <span>설명</span>
                  <input type="text" />
                </div>
                <div className="img-select-box">
                  <label htmlFor="os">{Localization.kr.DATA_CENTER}</label>
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
                  <label htmlFor="shareable">{Localization.kr.IS_SHARABLE}</label>
                </div>
              </div>
            </div>
          </div>
        )} */}

    </BaseModal>
  );
};

export default VmDiskModal;
