import { useEffect, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import BaseModal                        from "../../BaseModal";
import {
  useConnDiskListFromVM,
  useAllAttachedDisksFromDataCenter,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import { 
  checkZeroSizeToGiB,
  convertBytesToGB,
} from "@/util";
import LabelCheckbox from "@/components/label/LabelCheckbox";

/**
 * @name VmCreateDiskConnectionModal
 * @description ...
 * 
 * @returns 
 */
const VmCreateDiskConnectionModal = ({
  isOpen, onClose,
  vmData,
  diskData,
  dataCenterId,
  hasBootableDisk=false, // 부팅가능한 디스크 여부  
  existingDisks,
}) => {
  const { validationToast } = useValidationToast();

  // 데이터센터 밑에 잇는 디스크 목록 검색
  const { 
    data: attDisks = [],
    isLoading: isAttDisksLoading
  } = useAllAttachedDisksFromDataCenter(dataCenterId, (e) => ({ ...e }));

  const { mutate: connDiskListVm } = useConnDiskListFromVM();

  const [diskList, setDiskList] = useState([]); // 디스크 목록

  const getDiskId = (d) => d?.id || d?.diskImageVo?.id || ""
  
  const handleCheckboxChange = (disk) => {
    const diskId = getDiskId(disk);
    setDiskList((prev) => {
      const isAlreadySelected = prev.some(d => getDiskId(d) === diskId);
      return isAlreadySelected
        ? prev.filter(d => getDiskId(d) !== diskId)
        : [...prev, disk];
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    const initialDiskList = attDisks
      .filter(d => existingDisks.some(exist => exist?.diskImageVo?.id === d.id || exist?.id === d.id))
      .map(disk => {
        const existing = existingDisks.find(e => e.diskImageVo?.id === disk.id || e.id === disk.id);
        return {
          ...disk,
          interface_: existing?.interface_ || "VIRTIO_SCSI",
          readOnly: existing?.readOnly || false,
          bootable: existing?.bootable || false,
        };
      });

    setDiskList(initialDiskList);
  }, [isOpen, attDisks, existingDisks]);

  
  const validateForm = () => {
    Logger.debug(`VmDiskConnectionModal > validateForm ... `)
    if (diskList?.length === 0) return `${Localization.kr.DISK}를 ${Localization.kr.PLACEHOLDER_SELECT}!`
    return null
  }

  // 가상머신 생성 - 디스크 연결
  const handleOkClick = (e) => {
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    e.preventDefault();

    const selectedDiskLists = diskList.map(disk => ({
      id: disk.id,
      isCreated: false,
      isExisting: false,
      deleted: false,
      alias: disk.alias,
      size: convertBytesToGB(disk.virtualSize),
      interface_: disk.interface_ || "VIRTIO_SCSI",
      readOnly: disk.readOnly || false,
      bootable: disk.bootable || false,
      diskImageVo: { 
        id: disk.id 
      },
    }));

    Logger.debug("VmDiskConnectionModal > handleDropBetweenNetworkToNic ... selectedDiskLists", selectedDiskLists);
    diskData(selectedDiskLists); // 선택된 디스크를 VmDisk에 전달
    onClose()
  };
  

  return (
    <BaseModal targetName={`가상 ${Localization.kr.DISK}`} submitTitle={Localization.kr.CONNECTION}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleOkClick}
      contentStyle={{ width: "1000px"}} 
    >
     <div className="py-3">
      <div className="section-table-outer ">
        <table>
          <thead>
            <tr>
              <th>선택</th>
              <th>{Localization.kr.ALIAS}</th>
              <th>{Localization.kr.DESCRIPTION}</th>
              <th>{Localization.kr.SIZE_VIRTUAL}</th>
              <th>{Localization.kr.SIZE_ACTUAL}</th>
              <th>{Localization.kr.DOMAIN}</th>
              <th>인터페이스</th>
              <th>{Localization.kr.IS_READ_ONLY}</th>
              <th>{Localization.kr.IS_BOOTABLE}</th>
              <th>{Localization.kr.IS_SHARABLE}</th>
            </tr>
          </thead>
          <tbody>
            {attDisks.length > 0 ? (attDisks?.map((disk, index) => {
              const selectedDisk = diskList.find(d => d.id === disk.id);
                return (
                <tr key={disk.id || index}>
                  <td>
                    <LabelCheckbox id={`select-${disk.id}`}
                      checked={!!selectedDisk}
                      onChange={() => handleCheckboxChange(disk)}
                    />
                  </td>
                  <td>{disk.alias}</td>
                  <td>{disk.description}</td>
                  <td>{checkZeroSizeToGiB(disk?.virtualSize)}</td>
                  <td>{checkZeroSizeToGiB(disk?.actualSize)}</td>
                  <td>{disk.storageDomainVo?.name || ""}</td>
                  <td>
                    <LabelSelectOptions id={`interface-select-${disk.id}`}
                      value={selectedDisk?.interface_ || "VIRTIO_SCSI"}
                      options={interfaceOption}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDiskList(prev =>
                          prev.map(d => d.id === disk.id ? { ...d, interface_: value } : d)
                        );
                      }}
                    />
                  </td>
                  <td>
                    <LabelCheckbox id={`readonly-${disk.id}`}
                      checked={selectedDisk?.readOnly || false}
                      onChange={() => {
                        const updated = !selectedDisk?.readOnly;
                        setDiskList(prev =>
                          prev.map(d => d.id === disk.id ? { ...d, readOnly: updated } : d)
                        );
                      }}
                      // disabled={selectedInterfaces[attDisk.id] === "SATA"}
                    />
                  </td>
                  <td>
                    <LabelCheckbox id={`bootable-${disk.id}`}
                      checked={selectedDisk?.bootable || false}
                      disabled={hasBootableDisk}
                      onChange={() => {
                        const updated = !selectedDisk?.bootable;
                        setDiskList(prev =>
                          prev.map(d => d.id === disk.id ? { ...d, bootable: updated } : d)
                        );
                      }}
                    />
                  </td>
                  <td>
                    {disk?.sharable ? "O" : "X"}
                  </td>
                </tr>
              )})
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", height: "150px" }}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    <SelectedIdView items={diskList} />
    </BaseModal>
  );
};

export default VmCreateDiskConnectionModal;


// 인터페이스 목록
const interfaceOption = [
  { value: "VIRTIO_SCSI", label: "VirtIO-SCSI" },
  { value: "VIRTIO",      label: "VirtIO" },
  { value: "SATA",        label: "SATA" },
];
