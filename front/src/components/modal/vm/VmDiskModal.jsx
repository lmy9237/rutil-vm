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
  useAllDiskProfilesFromDomain,
  useAddDiskFromVM,
  useEditDiskFromVM,
  useDiskAttachmentFromVm,
  useVm,
  useAllActiveDomainsFromDataCenter,
} from "@/api/RQHook";
import { 
  checkKoreanName, convertBytesToGB, convertGBToBytes,
  emptyIdNameVo,
  useSelectFirstItemEffect
} from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";


const initialFormState = {
  id: "",
  size: "",
  appendSize: 0,
  alias: "",
  description: "",
  interface_: "virtio_scsi", // 인터페이스
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
  isOpen, onClose,
  editMode = false,
  vmData, vmName,
  dataCenterId,
  hasBootableDisk = false,
  initialDisk,
  onCreateDisk,
}) => {
  const { validationToast } = useValidationToast();
  const { vmsSelected, disksSelected } = useGlobal();
  const dLabel = editMode ? Localization.kr.UPDATE : Localization.kr.CREATE;
  const vmId = vmData?.id || vmsSelected[0]?.id;
  const diskId = useMemo(() => [...disksSelected][0]?.id, [disksSelected]);

  const { data: vm } = useVm(vmId);
  const { mutate: addDiskVm } = useAddDiskFromVM(onClose, onClose);
  const { mutate: editDiskVm } = useEditDiskFromVM(onClose, onClose);

  const [formState, setFormState] = useState(initialFormState);
  const [storageDomainVo, setStorageDomainVo] = useState(emptyIdNameVo());
  const [diskProfileVo, setDiskProfileVo] = useState(emptyIdNameVo());

  const { 
    data: diskAttachment 
  } = useDiskAttachmentFromVm(vmId, diskId ?? initialDisk?.id);

  const { 
    data: domains = [], 
    isLoading: isDomainsLoading 
  } = useAllActiveDomainsFromDataCenter( dataCenterId || vm?.dataCenterVo?.id, (e) => ({ ...e }));

  const { 
    data: diskProfiles = [], 
    isLoading: isDiskProfilesLoading 
  } = useAllDiskProfilesFromDomain(storageDomainVo.id, (e) => ({ ...e }));

  useSelectFirstItemEffect(domains, setStorageDomainVo);
  useSelectFirstItemEffect(diskProfiles, setDiskProfileVo);

  useEffect(() => {
    if (!editMode && isOpen) {
      setFormState((prev) => ({
        ...prev,
        alias: vmName || vmData?.name || "",
        bootable: hasBootableDisk ? false : true,
        // bootable: hasBootableDisk ? false : initialDisk?.bootable || true,
      }));
    }
  }, [editMode, isOpen]);

  useEffect(() => {
    if (!editMode && interfaceList.length > 0 && !formState.interface_) {
      setFormState((prev) => ({ ...prev, interface_: interfaceList[0].value }));
    }
  }, [interfaceList, editMode, formState.interface_]);

  useEffect(() => {
    if (!isOpen) {
      setFormState(() => ({
        ...initialFormState,
        alias: vmName || "", 
        bootable: hasBootableDisk ? false : initialFormState.bootable
      }));
      setStorageDomainVo(emptyIdNameVo());
      setDiskProfileVo(emptyIdNameVo());
    } 
    if (editMode && diskAttachment) {
      const d = diskAttachment;
      const img = diskAttachment.diskImageVo;
      setFormState({
        id: d.id,
        size: convertBytesToGB(img?.virtualSize),
        appendSize: 0,
        alias: img?.alias,
        description: img?.description,
        interface_: d.interface_ || "virtio_scsi",
        sparse: img?.sparse,
        active: d.active,
        wipeAfterDelete: img?.wipeAfterDelete,
        bootable: d.bootable,
        sharable: img?.sharable,
        readOnly: d.readOnly,
        backup: img?.backup,
      });
      setStorageDomainVo(img?.storageDomainVo);
      setDiskProfileVo(img?.diskProfileVo);
    }
  }, [isOpen, editMode, diskAttachment]);

  const validateForm = useCallback(() => {
    if (!formState.alias || checkKoreanName(formState.alias)) return `${Localization.kr.ALIAS}을 입력해주세요.`;
    if (!formState.size) return `크기를 입력해주세요.`;
    if (!storageDomainVo.id) return `${Localization.kr.DOMAIN}을 선택해주세요.`;
    if (!diskProfileVo.id) return `${Localization.kr.DISK_PROFILE}을 선택해주세요.`;
    return null;
  }, [formState, storageDomainVo, diskProfileVo]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const error = validateForm();
      if (error) return validationToast.fail(error);

      const selectedDomain = domains.find((dm) => dm.id === storageDomainVo.id);
      const selectedDiskProfile = diskProfiles.find((dp) => dp.id === diskProfileVo.id);
      const sizeBytes = convertGBToBytes(parseInt(formState.size, 10));
      const appendBytes = convertGBToBytes(parseInt(formState.appendSize || 0, 10));

      const diskData = {
        ...formState,
        id: formState.id,
        diskImageVo: {
          id: formState.id,
          alias: formState.alias,
          size: sizeBytes,
          appendSize: appendBytes,
          description: formState.description,
          wipeAfterDelete: formState.wipeAfterDelete,
          backup: formState.backup,
          sparse: formState.sparse,
          storageDomainVo: { id: selectedDomain?.id },
          diskProfileVo: { id: selectedDiskProfile?.id },
        },
      };

      const newDisk = {
        alias: formState.alias,
        size: formState.size,
        interface_: formState.interface_,
        sparse: formState.sparse,
        bootable: formState.bootable,
        readOnly: formState.readOnly,
        storageDomainVo: { id: selectedDomain.id },
        diskProfileVo: { id: selectedDiskProfile.id },
        isCreated: true,
      };

      if (editMode) {
        editDiskVm({ vmId, diskAttachmentId: formState.id, diskAttachment: diskData });
      } else if (onCreateDisk) {
        console.log("$ diskDAta", newDisk);
        onCreateDisk(newDisk);
        onClose();
      } else {
        addDiskVm({ vmId, diskData });
      }
    },
    [formState, storageDomainVo, diskProfileVo, vmId, onCreateDisk]
  );

  return (
    <BaseModal targetName={Localization.kr.DISK} submitTitle={dLabel}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleSubmit}
      contentStyle={{ width: "650px" }}
    >
      <div className="disk-new-img">
        <LabelInputNum label="크기(GB)" 
          value={formState.size} 
          autoFocus 
          disabled={editMode} 
          onChange={handleInputChange(setFormState, "size", validationToast)} 
        />
        {editMode && 
          <LabelInputNum label="추가크기(GB)" 
            value={formState.appendSize} 
            onChange={handleInputChange(setFormState, "appendSize", validationToast)} 
          />
        }
        <LabelInput id="alias" label={Localization.kr.ALIAS} 
          value={formState.alias} 
          onChange={handleInputChange(setFormState, "alias", validationToast)} 
        />
        <LabelInput id="description" label={Localization.kr.DESCRIPTION} 
          value={formState.description} 
          onChange={handleInputChange(setFormState, "description", validationToast)} 
        />
        <LabelSelectOptions label="인터페이스"
          value={formState.interface_}
          disabled={editMode}
          options={interfaceList}
          onChange={handleInputChange(setFormState, "interface_", validationToast)}
        />
        <LabelSelectOptionsID label={Localization.kr.DOMAIN} 
          value={storageDomainVo.id} 
          disabled={editMode} 
          loading={isDomainsLoading} 
          options={domains} 
          onChange={handleSelectIdChange(setStorageDomainVo, domains, validationToast)} 
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
          onChange={handleSelectIdChange(setDiskProfileVo, diskProfiles, validationToast)} 
        />
        <LabelSelectOptions id="sparse" label={Localization.kr.SPARSE} 
          value={String(formState.sparse)} 
          disabled={editMode} 
          options={sparseList} 
          onChange={(e) => setFormState((prev) => ({ ...prev, sparse: e.target.value === "true" }))} 
        />
        <div className="img-checkbox-outer f-end checkbox-outer">
          <LabelCheckbox id="wipeAfterDelete" label={Localization.kr.WIPE_AFTER_DELETE} 
            checked={formState.wipeAfterDelete} 
            onChange={handleInputCheck(setFormState, "wipeAfterDelete", validationToast)} 
          />
          <LabelCheckbox id="bootable" label={Localization.kr.IS_BOOTABLE} 
            checked={formState.bootable} 
            disabled={hasBootableDisk} 
            onChange={handleInputCheck(setFormState, "bootable", validationToast)} 
          />
          <LabelCheckbox id="sharable" label={Localization.kr.IS_SHARABLE} 
            checked={formState.sharable} 
            disabled={editMode || formState.sparse} 
            onChange={handleInputCheck(setFormState, "sharable", validationToast)} 
          />
          <LabelCheckbox id="readOnly" label={Localization.kr.IS_READ_ONLY} 
            checked={formState.readOnly} 
            disabled={editMode} 
            onChange={handleInputCheck(setFormState, "readOnly", validationToast)} 
          />
          <LabelCheckbox id="backup" label="증분 백업 사용" 
            checked={formState.backup} 
            onChange={handleInputCheck(setFormState, "backup", validationToast)} 
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default VmDiskModal;

const interfaceList = [
  { value: "virtio_scsi", label: "VirtIO-SCSI" },
  { value: "virtio", label: "VirtIO" },
  { value: "sata", label: "SATA" },
];

const sparseList = [
  { value: "true", label: Localization.kr.THIN_PROVISIONING },
  { value: "false", label: Localization.kr.PREALLOCATED },
];