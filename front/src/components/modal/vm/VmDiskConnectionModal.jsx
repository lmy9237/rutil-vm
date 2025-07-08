import { useMemo, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import BaseModal                        from "../BaseModal";
import {
  useConnDiskListFromVM,
  useAllAttachedDisksFromDataCenter,
  useVm,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
import { 
  checkZeroSizeToGiB,
} from "@/util";
import LabelCheckbox from "@/components/label/LabelCheckbox";
import useGlobal from "@/hooks/useGlobal";

/**
 * @name VmDiskConnectionModal
 * @description ...
 * 
 * @returns 
 */
const VmDiskConnectionModal = ({
  isOpen, 
  onClose,
  hasBootableDisk=false, // 부팅가능한 디스크 여부
}) => {
  const { validationToast } = useValidationToast();
  const { vmsSelected } = useGlobal();
  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const { data: vm } = useVm(vmId);

  const { 
    data: attDisks = [] 
  } = useAllAttachedDisksFromDataCenter(vm?.dataCenterVo?.id);
  const { mutate: connDiskListVm } = useConnDiskListFromVM(onClose, onClose);

  const [diskList, setDiskList] = useState([]);

  const getDiskId = (d) => d?.id || d?.diskImageVo?.id || "";

  const selectedDiskMap = useMemo(() => {
    const map = new Map();
    diskList.forEach((d) => map.set(getDiskId(d), d));
    return map;
  }, [diskList]);

  const toggleDisk = (disk) => {
    const id = getDiskId(disk);
    setDiskList((prev) =>
      selectedDiskMap.has(id)
        ? prev.filter((d) => getDiskId(d) !== id)
        : [...prev, { ...disk, interface_: "VIRTIO_SCSI", readOnly: false, bootable: false }]
    );
  };

  const handleUpdateDisk = (id, key, value) => {
    setDiskList((prev) =>
      prev.map((d) => (getDiskId(d) === id ? { ...d, [key]: value } : d))
    );
  };
  
  const validateForm = () => {
    Logger.debug(`VmDiskConnectionModal > validateForm ... `)
    if (diskList?.length === 0) return `${Localization.kr.DISK}를 ${Localization.kr.PLACEHOLDER_SELECT}!`
    return null
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    
    const selectedDiskLists = [...diskList].map((d) => {
      const diskDetails = attDisks.find((disk) => disk?.id === d?.id);
      if (!diskDetails) return null; // 선택된 디스크가 존재할 경우에만 추가
      
      return {
        interface_: d.interface_ || "VIRTIO_SCSI",
        readOnly: d.readOnly || false,
        bootable: d.bootable || false,
        diskImageVo: {
          id: d?.id,
        },
      };
    })

    Logger.debug("VmDiskConnectionModal > handleFormSubmit ... ", selectedDiskLists);
    connDiskListVm({ 
      vmId, 
      diskAttachmentList: selectedDiskLists
    })
  };

  return (
    <BaseModal targetName={`가상 ${Localization.kr.DISK}`} submitTitle={Localization.kr.CONNECTION}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleFormSubmit}
      contentStyle={{ width: "1000px"}} 
    >
     <div className="py-3">
      <div className="section-table-outer">
        <table>
          <thead>
            <tr>
              <th>선택</th>
              <th>{Localization.kr.ALIAS}</th>
              <th>{Localization.kr.DESCRIPTION}</th>
              <th>ID</th>
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
              const id = getDiskId(disk);
              const selected = selectedDiskMap.get(id);

              return (
                <tr key={disk.id || index}>
                  <td>
                    <LabelCheckbox id={`select-${id}`}
                      checked={!!selected}
                      onChange={() => toggleDisk(disk)}
                    />
                  </td>
                  <td>{disk.alias}</td>
                  <td>{disk.description}</td>
                  <td>{disk.id}</td>
                  <td>{checkZeroSizeToGiB(disk?.virtualSize)}</td>
                  <td>{checkZeroSizeToGiB(disk?.actualSize)}</td>
                  <td>{disk.storageDomainVo?.name || ""}</td>
                  <td>
                    <LabelSelectOptions id={`interface-select-${id}`}
                      value={selected?.interface_ || "VIRTIO_SCSI"}
                      options={interfaceOption}
                      onChange={(e) => handleUpdateDisk(id, "interface_", e.target.value)}
                    />
                  </td>
                  <td>
                    <LabelCheckbox id={`readonly-${id}`}
                      checked={selected?.readOnly || false}
                      onChange={() => handleUpdateDisk(id, "readOnly", !selected?.readOnly)}
                    />
                  </td>
                  <td>
                    <LabelCheckbox id={`bootable-${id}`}
                      checked={selected?.bootable || false}
                      disabled={hasBootableDisk}
                      onChange={() => handleUpdateDisk(id, "bootable", !selected?.bootable)}
                    />
                  </td>
                  <td>
                    {disk?.sharable ? "O" : "X"}
                  </td>
                </tr>
              )})
            ) : (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
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

export default VmDiskConnectionModal;


// 인터페이스 목록
const interfaceOption = [
  { value: "VIRTIO_SCSI", label: "VirtIO-SCSI" },
  { value: "VIRTIO",      label: "VirtIO" },
  { value: "SATA",        label: "SATA" },
];
