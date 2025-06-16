import { useEffect, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import LabelSelectOptions               from "@/components/label/LabelSelectOptions";
import BaseModal                        from "../BaseModal";
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

/**
 * @name VmDiskConnectionModal
 * @description ...
 * 연결에서 수정은 vm disk edit 으로 넘어감
 * type이 disk면 vm disk목록에서 연결, 다른건 가상머신 생성에서 디스크연결
 * 
 * @returns 
 */
const VmDiskConnectionModal = ({
  isOpen, onClose,
  diskType = true,  // t=disk페이지에서 생성 f=vm만들때 같이 생성
  vmId,
  dataCenterId,
  hasBootableDisk=false, // 부팅가능한 디스크 여부
  onSelectDisk,
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
  const [interfaceList, setInterfaceList] = useState({}); // 인터페이스
  const [readOnlyList, setReadOnlyList] = useState({}); // 읽기전용
  const [bootableList, setBootableList] = useState({}); // 부팅가능

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

  console.log("$ attDisks", attDisks)

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


  
  // 가상머신 생성 - 디스크 연결
  const handleOkClick = (e) => {
    e.preventDefault();

    const selectedDiskLists = diskList.map((disk) => ({
      id: disk.id,  // 추가!
      isCreated: false,
      isExisting: false,
      deleted: false,
      alias: disk.alias,
      size: convertBytesToGB(disk.virtualSize),
      interface_: interfaceList[disk.id] || "VIRTIO_SCSI",
      readOnly: readOnlyList[disk.id] || false,
      bootable: bootableList[disk.id] || false,
      diskImageVo: {
        id: disk.id,
      },
    }));

    onSelectDisk(selectedDiskLists); // 선택된 디스크를 VmDisk에 전달
    console.log("$ selectedDiskLists", selectedDiskLists)
    onClose()
  };
  
  const validateForm = () => {
    Logger.debug(`VmDiskConnectionModal > validateForm ... `)
    if (diskList?.length === 0) return `${Localization.kr.DISK}를 ${Localization.kr.PLACEHOLDER_SELECT}!`
    return null
  }

  // 가상머신 - 디스크 연결하기
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      validationToast.fail(error);
      return;
    }
    
    Logger.debug(`VmDiskConnectionModal > handleFormSubmit ... `)
    const selectedDiskLists = [...diskList].map((d) => {
      const diskDetails = attDisks.find((disk) => disk?.id === d?.id);
      if (!diskDetails) return null; // 선택된 디스크가 존재할 경우에만 추가
      return {
        interface_: interfaceList[d?.id] || "VIRTIO_SCSI",
        readOnly: readOnlyList[d?.id] || false,
        bootable: bootableList[d?.id] || false,
        diskImageVo: {
          id: d?.id,
        },
        isCreated: false, // 🚀 연결된 디스크는 isCreated: false
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
      onSubmit={diskType ? handleFormSubmit : handleOkClick}
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
              attDisks?.map((disk, index) => (
                <tr key={disk.id || index}>
                  <td>
                    <input type="checkbox"
                      checked={diskList.some(d => d.id === disk.id)}
                      disabled={false}
                      onChange={() => handleCheckboxChange(disk)}
                    />
                  </td>
                  <td>{disk.alias}</td>
                  <td>{disk.description}</td>
                  <td>{checkZeroSizeToGiB(disk?.virtualSize)}</td>
                  <td>{checkZeroSizeToGiB(disk?.actualSize)}</td>
                  <td>{disk.storageDomainVo?.name || ""}</td>
                  <td>
                    <LabelSelectOptions
                      id={`interface-select-${disk.id}`}
                      value={disk.interface_}
                      options={interfaceOption}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDiskList(prev =>
                          prev.map(d => d.id === disk.id ? { ...d, interface_: value } : d)
                        );
                      }}
                    />

                    {/* <LabelSelectOptions className="w-full"
                      id={`interface-select-${disk.id}`}
                      value={interfaceList[disk.id] || "VIRTIO_SCSI"}
                      options={interfaceOption || []}                      
                      onChange={(selected) => {
                        setInterfaceList((prev) => ({...prev, [disk?.id]: selected.target.value}))
                      }}
                    /> */}
                  </td>
                  <td>
                    <input type="checkbox" id={`readonly-${disk?.id}`}
                      checked={readOnlyList[disk?.id] || false} // 개별 디스크 상태 유지
                      onChange={() => {
                        setReadOnlyList((prev) => ({ ...prev, [disk?.id]: !prev[disk?.id] }));
                      }}
                      // disabled={selectedInterfaces[attDisk.id] === "SATA"}
                    />
                  </td>
                  <td>
                    <input type="checkbox" id={`os-${disk?.id}`}
                      checked={bootableList[disk?.id] || false} // 개별 디스크 상태 유지
                      onChange={() => {
                        setBootableList((prev) => ({ ...prev, [disk?.id]: !prev[disk?.id] }));
                      }}
                      disabled={hasBootableDisk}
                    />
                  </td>
                  <td>
                    {disk?.sharable ? "O" : "X"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
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
