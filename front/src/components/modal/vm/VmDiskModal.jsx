import { useState, useEffect, useCallback, useMemo } from "react";
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
  handleSelectIdChange
} from "@/components/label/HandleInput";
import {
  useAllActiveDomainsFromDataCenter,
  useAllDiskProfilesFromDomain,
  useAddDiskFromVM,
  useEditDiskFromVM,
  useDiskAttachmentFromVm,
  useVm,
} from "@/api/RQHook";
import { 
  checkKoreanName, convertBytesToGB, convertGBToBytes,
  emptyIdNameVo
} from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";


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
  backup: true, // 증분 백업사용
  shouldUpdateDisk: false,
};

/**
 * @name VmDiskModal
 * @description ...
 * 가상머신-디스크 에서 디스크 생성, 편집에서 사용될 예정
 * 
 * @param {*} param0 
 * @returns 
 */
const VmDiskModal = ({
  isOpen, 
  onClose,
  editMode = false,
  diskName,
  hasBootableDisk=false, // 부팅가능한 디스크 여부
}) => {
  const { validationToast } = useValidationToast();
  const dLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;

  const { vmsSelected, disksSelected } = useGlobal()
  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const diskId = useMemo(() => [...disksSelected][0]?.id, [disksSelected]);
  
  const [formState, setFormState] = useState(initialFormState);
  const [storageDomainVo, setStorageDomainVo] = useState(emptyIdNameVo());
  const [diskProfileVo, setDiskProfileVo] = useState(emptyIdNameVo());
  
  const { mutate: addDiskVm } = useAddDiskFromVM(onClose, onClose);
  const { mutate: editDiskVm } = useEditDiskFromVM(onClose, onClose);

  const { data: vm } = useVm(vmId);
  
  // 디스크 데이터 가져오기
  const {
    data: diskAttachment,
    isLoading: isDiskAttachmentsLoading
  } = useDiskAttachmentFromVm(vmId, diskId);

  // 선택한 데이터센터가 가진 도메인 가져오기
  const {
    data: domains = [], 
    isLoading: isDomainsLoading 
  } = useAllActiveDomainsFromDataCenter(vm?.dataCenterVo?.id, (e) => ({ ...e }));

  // 선택한 도메인이 가진 디스크 프로파일 가져오기
  const { 
    data: diskProfiles = [], 
    isLoading: isDiskProfilesLoading, 
  } = useAllDiskProfilesFromDomain(storageDomainVo.id, (e) => ({ ...e }));


  useEffect(() => {
    if (!editMode && isOpen && vm) {
      setFormState((prev) => ({ ...prev,
        alias: diskName || "",
        bootable: hasBootableDisk ? false : vm?.bootable || true,
       }));
    }
  }, [editMode, isOpen, vm]); 
  

  useEffect(() => {
    if (!editMode && domains.length > 0 && !storageDomainVo.id) {
      setStorageDomainVo({ 
        id: domains[0].id, 
        name: domains[0].name 
      });
    }
  }, [domains, editMode, storageDomainVo.id]);
  
  useEffect(() => {
    if (!editMode && diskProfiles && diskProfiles.length > 0) {
      setDiskProfileVo({
        id: diskProfiles[0].id, 
        name: diskProfiles[0].id
      });
    }
  }, [diskProfiles, editMode]);

  useEffect(() => {
    if (!editMode && interfaceList.length > 0 && !formState.interface_) {
      setFormState((prev) => ({ ...prev, interface_: interfaceList[0].value }));
    }
  }, [interfaceList, editMode, formState.interface_]);

  useEffect(() => {
    if (!isOpen) {
      setFormState(() => ({
        ...initialFormState,
        alias: diskName || "", 
        bootable: hasBootableDisk ? false : initialFormState.bootable
      }));
      setStorageDomainVo(emptyIdNameVo());
      setDiskProfileVo(emptyIdNameVo());
    } 
    if (editMode && diskAttachment) {
      const diskImage = diskAttachment?.diskImageVo;
      setFormState({
        id: diskAttachment?.id || "",
        size: convertBytesToGB (diskImage?.virtualSize),
        appendSize: 0,
        alias: diskImage?.alias || "",
        description: diskImage?.description || "",
        interface_: diskAttachment?.interface_ || "VIRTIO_SCSI",
        sparse: diskImage?.sparse || false,
        active: diskAttachment?.active || false,
        wipeAfterDelete: diskImage?.wipeAfterDelete || false,
        bootable: diskAttachment?.bootable || false,
        sharable: diskImage?.sharable || false,
        readOnly: diskAttachment?.readOnly || false,
        // cancelActive: diskAttachment?.cancelActive || false,
        backup: diskImage?.backup || false,
        // shouldUpdateDisk: true
      });
      setStorageDomainVo({ 
        id: diskImage?.storageDomainVo?.id, 
        name: diskImage?.storageDomainVo?.name
      });
      setDiskProfileVo({ 
        id: diskImage?.diskProfileVo?.id,
        name: diskImage?.diskProfileVo?.name 
      });
    }
  }, [isOpen, editMode, diskAttachment, hasBootableDisk]);

  useEffect(() => {
    if (!editMode && diskAttachment) {
      setFormState({
        id: diskAttachment?.id || "",
        size: diskAttachment?.size || "",
        appendSize: 0,
        alias: diskAttachment?.alias || "",
        description: diskAttachment?.description || "",
        interface_: diskAttachment?.interface_ || "VIRTIO_SCSI",
        sparse: diskAttachment?.sparse || false,
        active: diskAttachment?.active || false,
        wipeAfterDelete: diskAttachment?.wipeAfterDelete || false,
        bootable: hasBootableDisk ? false : diskAttachment?.bootable || true,
        sharable: diskAttachment?.sharable || false,
        readOnly: diskAttachment?.readOnly || false,
        backup: diskAttachment?.backup || false,
        // shouldUpdateDisk: true
      });
      setStorageDomainVo({ 
        id: diskAttachment?.diskImageVo?.storageDomainVo?.id, 
        name: diskAttachment?.diskImageVo?.storageDomainVo?.name  
      });
      setDiskProfileVo({ 
        id: diskAttachment?.diskImageVo?.diskProfileVo?.id
      });
    }
  }, [editMode, diskAttachment, hasBootableDisk]);


  const validateForm = useCallback(() => {
    Logger.debug(`VmDiskModal > validateForm ... `)
    if (!formState.alias) return `${Localization.kr.ALIAS}을 입력해주세요.`;
    if (checkKoreanName(formState.alias)) return `${Localization.kr.ALIAS}을 입력해주세요.`;
    if (!formState.size) return `크기를 입력해주세요.`;
    if (!storageDomainVo.id) return `${Localization.kr.DOMAIN}을 선택해주세요.`;
    if (!diskProfileVo.id) return `${Localization.kr.DISK_PROFILE}을 선택해주세요.`;
    return null;
  }, [formState, storageDomainVo, diskProfileVo]);


  // 가상머신 - 디스크 생성
  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
 
    // GB -> Bytes 변환
    const sizeToBytes = convertGBToBytes(parseInt(formState.size, 10));
    // GB -> Bytes 변환 (기본값 0)
    const appendSizeToBytes = convertGBToBytes(parseInt(formState.appendSize || 0, 10)); 

    const selectedDomain = domains.find((dm) => dm.id === storageDomainVo.id);
    const selectedDiskProfile = diskProfiles.find((dp) => dp.id === diskProfileVo.id);
    Logger.debug(`VmDiskModal > handleFormSubmit ... selectedDomain: `, selectedDomain);

    // 전송 객체
    const dataToSubmit = {
      ...formState,
      id: formState?.id,
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
  }, [formState, storageDomainVo, diskProfileVo]);

  return (
    <BaseModal targetName={Localization.kr.DISK} submitTitle={dLabel}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "700px" }} 
    >
      <div className="disk-new-img">
        <div>              
          <LabelInputNum label="크기(GB)"
            value={formState.size}
            autoFocus
            disabled={editMode}
            onChange={handleInputChange(setFormState, "size")}
          />
          {editMode && (
            <LabelInputNum label="추가크기(GB)"
              value={formState.appendSize}
              onChange={handleInputChange(setFormState, "appendSize")}
            />
          )}
          <LabelInput id="alias" label={Localization.kr.ALIAS}
            value={formState.alias} 
            onChange={handleInputChange(setFormState, "alias")}
          />
          <LabelInput id="description" label={Localization.kr.DESCRIPTION}
            value={formState.description} 
            onChange={handleInputChange(setFormState, "description")}
          />
          <LabelSelectOptions label="인터페이스"
            value={formState.interface_}
            disabled={editMode}
            options={interfaceList}
            onChange={handleInputChange(setFormState, "interface_")}
          />
          <LabelSelectOptionsID label={Localization.kr.DOMAIN}
            value={storageDomainVo.id}
            disabled={editMode}
            loading={isDomainsLoading}
            options={domains}
            onChange={handleSelectIdChange(setStorageDomainVo, domains)}
          />
          {storageDomainVo && (() => {
            const domainObj = domains.find((d) => d.id === storageDomainVo.id);
            if (!domainObj) return null;
            return (
              <div className="text-xs text-gray-500 f-end">
                사용 가능: {domainObj.availableSize} GiB {" / "} 총 용량: {domainObj.size} GiB
              </div>
            );
          })()}
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
        <br/>
        <div className="img-checkbox-outer f-end checkbox-outer">
          <LabelCheckbox id="wipeAfterDelete" label={Localization.kr.WIPE_AFTER_DELETE}
            checked={Boolean(formState.wipeAfterDelete)} 
            onChange={handleInputCheck(setFormState, "wipeAfterDelete", validationToast)}
          />
          <LabelCheckbox id="bootable" label={Localization.kr.IS_BOOTABLE}
            checked={diskAttachment?.bootable}
            disabled={hasBootableDisk} // 이미 부팅 디스크가 있으면 비활성화
            onChange={handleInputCheck(setFormState, "bootable", validationToast)}
          />
          <LabelCheckbox id="sharable" label={Localization.kr.IS_SHARABLE}
            checked={Boolean(formState.sharable)} 
            disabled={editMode} 
            onChange={handleInputCheck(setFormState, "sharable", validationToast)}
          />
          <LabelCheckbox id="readOnly" label={Localization.kr.IS_READ_ONLY}
            checked={Boolean(formState.readOnly)} 
            disabled={editMode}
            onChange={handleInputCheck(setFormState, "readOnly", validationToast)}
          />
          <LabelCheckbox id="backup" label="증분 백업 사용"               
            checked={Boolean(formState.backup)} 
            onChange={handleInputCheck(setFormState, "backup", validationToast)}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default VmDiskModal;

const interfaceList = [
  { value: "VIRTIO_SCSI", label: "VirtIO-SCSI" },
  { value: "VIRTIO", label: "VirtIO" },
  { value: "SATA", label: "SATA" },
];

const sparseList = [
  { value: "true", label: "씬 프로비저닝" },
  { value: "false", label: "사전 할당" },
];