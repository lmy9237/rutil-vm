import { useEffect, useMemo, useState } from "react";
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
  convertBytesToGB,
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
  isOpen, onClose,
  vmDiskType=false,
  diskData,
  dataCenterId,
  hasBootableDisk = false,
  existingDisks = [],
}) => {
  const { validationToast } = useValidationToast();
  const { vmsSelected, disksSelected } = useGlobal();
  const vmId = useMemo(() => [...vmsSelected][0]?.id, [vmsSelected]);
  const diskId = useMemo(() => [...disksSelected][0]?.id, [disksSelected]);

  const { data: vm } = useVm(vmId);
  const { mutate: connDiskListVm } = useConnDiskListFromVM(onClose, onClose);

  // 디스크 연결할 수 있는 목록
  const { 
    data: attDisks = [] 
  } = useAllAttachedDisksFromDataCenter(dataCenterId || vm?.dataCenterVo?.id);

  const [diskList, setDiskList] = useState([]);

  const getDiskId = (d) => d?.id || d?.diskImageVo?.id || "";

  useEffect(() => {
    if (!isOpen) return;

    attDisks.map((disk) => ({
      ...disk,
      interface_: disk?.interface_ || "virtio_scsi",
      readOnly: disk?.readOnly || false,
      bootable: disk?.bootable || false,
    }));

    // setDiskList(initList.filter((d) => existingDisks.some(e => getDiskId(e) === getDiskId(d))));
  }, [isOpen, attDisks, existingDisks]);

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
        : [...prev, { ...disk, interface_: "virtio_scsi", readOnly: false, bootable: false }]
    );
  };

  const handleUpdateDisk = (id, key, value) => {
    setDiskList((prev) =>
      prev.map((d) => (getDiskId(d) === id ? { ...d, [key]: value } : d))
    );
  };

  const validateForm = () => {
    if (diskList.length === 0) return `${Localization.kr.DISK}를 ${Localization.kr.PLACEHOLDER_SELECT}!`;
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }

    const payload = diskList.map((d) => {
      if (!vmDiskType) {
        return {
          id: d.id,
          isCreated: false,
          isExisting: false,
          deleted: false,
          alias: d.alias,
          size: convertBytesToGB(d.virtualSize),
          interface_: d.interface_ || "virtio_scsi",
          readOnly: d.readOnly || false,
          bootable: d.bootable || false,
          diskImageVo: { id: d.id },
        };
      } else {
        return {
          interface_: d.interface_ || "virtio_scsi",
          readOnly: d.readOnly || false,
          bootable: d.bootable || false,
          diskImageVo: { id: d.id },
        };
      }
    });

    Logger.debug("VmDiskConnectionUnifiedModal > payload", payload);
    
    if (!vmDiskType) {
      diskData(payload);
      onClose();
    } else {
      connDiskListVm({ vmId, diskAttachmentList: payload });
    }
  };

  return (
    <BaseModal targetName={`가상 ${Localization.kr.DISK}`} submitTitle={Localization.kr.CONNECTION}
      isOpen={isOpen} onClose={onClose}
      onSubmit={handleSubmit}
      contentStyle={{ width: "1100px" }}>
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
              {attDisks.length > 0 ? (
                attDisks.map((disk, idx) => {
                  const id = getDiskId(disk);
                  const selected = selectedDiskMap.get(id);
                   return (
                    <tr key={id || idx}>
                      <td>
                        <LabelCheckbox id={`select-${id}`}
                          checked={!!selected} 
                          onChange={(checked) => toggleDisk(disk)} 
                        />
                      </td>
                      <td>{disk.alias}</td>
                      <td>{disk.description}</td>
                      <td>{disk.id}</td>
                      <td>{checkZeroSizeToGiB(disk.virtualSize)}</td>
                      <td>{checkZeroSizeToGiB(disk.actualSize)}</td>
                      <td>{disk.storageDomainVo?.name || ""}</td>
                      <td>
                        <LabelSelectOptions id={`interface-${id}`} 
                          value={selected?.interface_ || "virtio_scsi"}
                          options={interfaceOption}
                          disabled={!selected}
                          onChange={(e) => handleUpdateDisk(id, "interface_", e.target.value)}
                        />                       
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <LabelCheckbox id={`readonly-${id}`}
                            checked={selected?.readOnly || false}
                            disabled={!selected}
                            onChange={(checked) => handleUpdateDisk(id, "readOnly", !selected?.readOnly)} 
                          />
                        </div>
                      </td>
                      <td>
                        <LabelCheckbox id={`bootable-${id}`} 
                          checked={selected?.bootable || false}
                          disabled={hasBootableDisk || !selected}
                          onChange={(checked) => handleUpdateDisk(id, "bootable", !selected?.bootable)} 
                        />
                      </td>
                      <td style={{ textAlign: 'center' }}>{disk?.sharable ? "O" : "X"}</td>
                    </tr>
                  );
                  // return (
                  //   <tr key={id || idx} onClick={() => toggleDisk(disk)} style={{ cursor: "pointer" }}>
                  //     <td>
                  //       <LabelCheckbox id={`select-${id}`}
                  //         checked={!!selected} 
                  //         onClick={(e) => e.stopPropagation()}
                  //         onChange={(checked) => toggleDisk(disk)} 
                  //       />
                  //     </td>
                  //     <td>{disk.alias}</td>
                  //     <td>{disk.description}</td>
                  //     <td>{disk.id}</td>
                  //     <td>{checkZeroSizeToGiB(disk.virtualSize)}</td>
                  //     <td>{checkZeroSizeToGiB(disk.actualSize)}</td>
                  //     <td>{disk.storageDomainVo?.name || ""}</td>
                  //     <td>
                  //       <LabelSelectOptions id={`interface-${id}`} 
                  //         value={selected?.interface_ || "virtio_scsi"}
                  //         options={interfaceOption}
                  //         disabled={!selected}
                  //         onChange={(e) => handleUpdateDisk(id, "interface_", e.target.value)}
                  //       />                       
                  //     </td>
                  //     <td>
                  //       {/* 오류 */}
                  //       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  //         <LabelCheckbox id={`readonly-${id}`}
                  //           checked={selected?.readOnly || false}
                  //           disabled={!selected}
                  //           onChange={(checked) => handleUpdateDisk(id, "readOnly", !selected?.readOnly)} 
                  //         />
                  //       </div>
                  //     </td>
                  //     <td>
                  //       <LabelCheckbox id={`bootable-${id}`} 
                  //         checked={selected?.bootable || false}
                  //         disabled={hasBootableDisk || !selected}
                  //         onChange={(checked) => handleUpdateDisk(id, "bootable", !selected?.bootable)} 
                  //       />
                  //     </td>
                  //     <td style={{ textAlign: 'center' }}>{disk?.sharable ? "O" : "X"}</td>
                  //   </tr>
                  // );
                })
              ) : (
                <tr><td colSpan="11" style={{ textAlign: "center" }}>데이터가 없습니다.</td></tr>
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

const interfaceOption = [
  { value: "virtio_scsi", label: "VirtIO-SCSI" },
  { value: "virtio", label: "VirtIO" },
  { value: "sata", label: "SATA" },
];
