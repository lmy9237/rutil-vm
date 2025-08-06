import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "../BaseModal";
import LabelInputNum                    from "@/components/label/LabelInputNum";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import { 
  formReducer,
  handleCheckboxChange,
  handleFieldChange,
  handleIdChange,
  useSelectFirstItem
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
  checkKoreanName, checkZeroSizeToGiB, convertBytesToGB, convertGBToBytes,
  emptyIdNameVo,
} from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import LabelInput from "@/components/label/LabelInput";
import LabelCheckbox from "@/components/label/LabelCheckbox";


const initialFormState = {
  id: "",
  size: 0,
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

  storageDomainVo: emptyIdNameVo(),
  diskProfileVo: emptyIdNameVo(),
};


/**
 * @name VmDiskModal2
 * @description ...
 * 가상머신-디스크 에서 디스크 생성, 편집에서 사용될 예정
 * 
 * @param {*} 
 * @returns 
 */
const VmDiskModal2 = ({
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

  const [formState, dispatch] = useReducer(formReducer, initialFormState);

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
  } = useAllDiskProfilesFromDomain(formState.storageDomainVo.id, (e) => ({ ...e }));

  useSelectFirstItem(dispatch, domains, "storageDomainVo");
  useSelectFirstItem(dispatch, diskProfiles, "diskProfileVo");

  useEffect(() => {
    if (isOpen) {
      if (!editMode) {
        dispatch({
          type: 'SET_ALL',
          payload: {
            alias: vmName || "",
            bootable: !hasBootableDisk,
          },
        });
      } else if (editMode && diskAttachment) {
        dispatch({
          type: 'SET_ALL',
          payload: {
            id: diskAttachment.id,
            alias: diskAttachment.diskImageVo?.alias,
            size: convertBytesToGB(diskAttachment.diskImageVo?.virtualSize),
            appendSize: 0,
            description: diskAttachment.diskImageVo?.description,
            interface_: diskAttachment.interface_ || "virtio_scsi",
            sparse: diskAttachment.diskImageVo?.sparse,
            active: diskAttachment.active,
            wipeAfterDelete: diskAttachment.diskImageVo?.wipeAfterDelete,
            bootable: diskAttachment.bootable,
            sharable: diskAttachment.diskImageVo?.sharable,
            readOnly: diskAttachment.readOnly,
            backup: diskAttachment.diskImageVo?.backup,
            storageDomainVo: diskAttachment.diskImageVo?.storageDomainVo || emptyIdNameVo(),
            diskProfileVo: diskAttachment.diskImageVo?.diskProfileVo || emptyIdNameVo(),
          },
        });
      }
    } else {
      dispatch({ 
        type: 'RESET', 
        payload: { 
          alias: vmName || "", 
          bootable: !hasBootableDisk 
        } 
      });
    }
  }, [isOpen, editMode, diskAttachment, vmName]);


  const validateForm = useCallback(() => {
    if (!formState.alias || checkKoreanName(formState.alias)) return `${Localization.kr.ALIAS}을 입력해주세요.`;
    if (!formState.size) return `크기를 입력해주세요.`;
    if (!formState.storageDomainVo.id) return `${Localization.kr.DOMAIN}을 선택해주세요.`;
    if (!formState.diskProfileVo.id) return `${Localization.kr.DISK_PROFILE}을 선택해주세요.`;
    return null;
  }, [formState]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const error = validateForm();
      if (error) return validationToast.fail(error);

      const selectedDomain = domains.find((dm) => dm.id === formState.storageDomainVo.id);
      const selectedDiskProfile = diskProfiles.find((dp) => dp.id === formState.diskProfileVo.id);
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
        editDiskVm({ 
          vmId, 
          diskAttachmentId: formState.id, 
          diskAttachment: diskData 
        });
      } else if (onCreateDisk) {
        Logger.debug("VmDiskModal > diskData ...", newDisk);
        onCreateDisk(newDisk);
        onClose();
      } else {
        addDiskVm({ vmId, diskData });
      }
    },
    [formState, vmId, onCreateDisk]
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
          onChange={handleFieldChange(dispatch, "size", validationToast)}
        />
        {editMode && 
          <LabelInputNum label="추가크기(GB)" 
            value={formState.appendSize} 
            onChange={handleFieldChange(dispatch, "appendSize", validationToast)} 
          />
        }
         <LabelInput id="alias" label={Localization.kr.ALIAS} 
          value={formState.alias} 
          onChange={handleFieldChange(dispatch, "alias", validationToast)} 
        />
        <LabelInput id="description" label={Localization.kr.DESCRIPTION} 
          value={formState.description} 
          onChange={handleFieldChange(dispatch, "description", validationToast)} 
        />
        <LabelSelectOptions label="인터페이스"
          value={formState.interface_}
          disabled={editMode}
          options={interfaceList}
          onChange={handleFieldChange(dispatch, "interface_", validationToast)}
        />
        <LabelSelectOptionsID label={Localization.kr.DOMAIN} 
          value={formState.storageDomainVo.id} 
          disabled={editMode} 
          loading={isDomainsLoading} 
          options={domains} 
          onChange={handleIdChange(dispatch, "storageDomainVo", domains, validationToast)}
        />
        {formState.storageDomainVo && (() => {
          const domainObj = domains.find((d) => d.id === formState.storageDomainVo.id);
          if (!domainObj) return null;
          return (
            <div className="text-xs text-gray-500 f-end">
              사용 가능: {checkZeroSizeToGiB(domainObj.availableSize)} {" / "} 총 용량: {checkZeroSizeToGiB(domainObj.size)}
            </div>
          );
        })()}
        <LabelSelectOptionsID label={Localization.kr.DISK_PROFILE} 
          value={formState.diskProfileVo.id} 
          loading={isDiskProfilesLoading} 
          options={diskProfiles} 
          onChange={handleIdChange(dispatch, "diskProfileVo", diskProfiles, validationToast)}
        />
       <LabelSelectOptions id="sparse" label={Localization.kr.SPARSE} 
          value={String(formState.sparse)} 
          disabled={editMode} 
          options={sparseList} 
          onChange={handleFieldChange(dispatch, "sparse", validationToast)}
        />
        <div className="img-checkbox-outer f-end checkbox-outer">
          <LabelCheckbox id="wipeAfterDelete" label={Localization.kr.WIPE_AFTER_DELETE} 
            checked={formState.wipeAfterDelete} 
            onChange={handleCheckboxChange(dispatch, "wipeAfterDelete", validationToast)} 
          />
          <LabelCheckbox id="bootable" label={Localization.kr.IS_BOOTABLE} 
            checked={formState.bootable} 
            disabled={hasBootableDisk} 
            onChange={handleCheckboxChange(dispatch, "bootable", validationToast)} 
          />
          <LabelCheckbox id="sharable" label={Localization.kr.IS_SHARABLE} 
            checked={formState.sharable} 
            disabled={editMode || formState.sparse} 
            onChange={handleCheckboxChange(dispatch, "sharable", validationToast)} 
          />
          <LabelCheckbox id="readOnly" label={Localization.kr.IS_READ_ONLY} 
            checked={formState.readOnly} 
            disabled={editMode} 
            onChange={handleCheckboxChange(dispatch, "readOnly", validationToast)} 
          />
          <LabelCheckbox id="backup" label="증분 백업 사용" 
            checked={formState.backup} 
            // disabled={!formState.sparse}  // 스토리지 도메인 상태에 따라 달라지는거 같기도
            onChange={handleCheckboxChange(dispatch, "backup", validationToast)} 
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default VmDiskModal2;

const interfaceList = [
  { value: "virtio_scsi", label: "VirtIO-SCSI" },
  { value: "virtio", label: "VirtIO" },
  { value: "sata", label: "SATA" },
];

const sparseList = [
  { value: "true", label: Localization.kr.THIN_PROVISIONING },
  { value: "false", label: Localization.kr.PREALLOCATED },
];