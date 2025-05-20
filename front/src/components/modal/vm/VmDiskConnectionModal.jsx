import { useState } from "react";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import BaseModal from "../BaseModal";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import TablesOuter from "../../table/TablesOuter";
import { checkZeroSizeToGiB, convertBytesToGB } from "../../../util";
import { useConnDiskListFromVM, useAllAttachedDisksFromDataCenter } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";
import SelectedIdView from "../../common/SelectedIdView";
import useGlobal from "../../../hooks/useGlobal";

// 인터페이스 목록
const interfaceList = [
  { value: "VIRTIO_SCSI", label: "VirtIO-SCSI" },
  { value: "VIRTIO",      label: "VirtIO" },
  { value: "SATA",        label: "SATA" },
];

/**
 * @name VmDiskConnectionModal
 * @description ...
 * 연결에서 수정은 vm disk edit 으로 넘어감
 * type이 disk면 vm disk목록에서 연결, 다른건 가상머신 생성에서 디스크연결
 * 
 * @param {*} param0 
 * @returns 
 */
const VmDiskConnectionModal = ({
  isOpen,
  onClose,
  diskType = true,  // t=disk페이지에서 생성 f=vm만들때 같이 생성
  vmId,
  dataCenterId,
  hasBootableDisk, // 부팅가능한 디스크 여부
  onSelectDisk,
  existingDisks,
}) => {
  const {
    disksSelected, setDisksSelected
  } = useGlobal()

  const [selectedDisks, setSelectedDisks] = useState([]); // 디스크 목록
  const [selectedInterfaces, setSelectedInterfaces] = useState({}); // 인터페이스
  const [selectedReadOnly, setSelectedReadOnly] = useState({}); // 읽기전용
  const [selectedBootable, setSelectedBootable] = useState({}); // 부팅가능
  const [activeTab, setActiveTab] = useState("img");
  const existingDiskIds = new Set(existingDisks?.map(disk => disk.id));

  const {
    mutate: connDiskListVm
  } = useConnDiskListFromVM();
  
  // 기존에 연결된 디스크 ID 목록 생성

  // 데이터센터 밑에 잇는 디스크 목록 검색
  const { 
    data: attDisks = [],
    isLoading: isAttDisksLoading,
    isError: isAttDisksError,
    isSuccess: isAttDisksSuccess,
    isRefetching: isAttDisksRefetching,
  } = useAllAttachedDisksFromDataCenter(dataCenterId, (e) => ({ ...e }));

  const transformedData = [...attDisks].map((attDisk) => ({
    ...attDisk,
    alias: attDisk?.alias,  // alias 추가
    virtualSize: checkZeroSizeToGiB(attDisk?.virtualSize),
    actualSize: checkZeroSizeToGiB(attDisk?.actualSize),
    storageDomain: attDisk?.storageDomainVo?.name,
    sharable: attDisk?.sharable ? "O" : "X",
    status: attDisk?.status === "UNINITIALIZED" 
      ? "초기화되지 않음" 
      : "UP",
    check: (
      attDisk?.id && <input type="checkbox"
        checked={selectedDisks.includes(attDisk?.id)}
        disabled={existingDiskIds.has(attDisk?.id)}
        onChange={() => handleCheckboxChange(attDisk?.id)}
      />
    ),
    interface: (
      attDisk?.id && <select id={`interface-select-${attDisk?.id}`} 
        value={selectedInterfaces[attDisk?.id] || "VIRTIO_SCSI"}
        onChange={(event) => {
          handleInterfaceChange(attDisk?.id, event.target.value); //  디스크 ID를 전달
        }}
      >
        {interfaceList.map((iface) => (
          <option key={iface.value} value={iface.value}>
            {iface.label}
          </option>
        ))}
      </select>
    ),
    /*
    // TODO: 컴포넌트로 빼면 옵션값이 테이블셀 안에 가려져서 안보이는 문제
    interface: ( 
      <LabelSelectOptions
        id={`interface-select-${attDisk.id}`}
        value={selectedInterfaces[attDisk.id] || "VIRTIO_SCSI"}
        onChange={(event) => handleInterfaceChange(attDisk.id, event.target.value)}
        options={interfaceList}
        className="w-full"
      />
    ),
    */
    readonly: (
      attDisk?.id && <input type="checkbox" id={`readonly-${attDisk?.id}`}
        checked={selectedReadOnly[attDisk?.id] || false} // 개별 디스크 상태 유지
        onChange={() => {
          setSelectedReadOnly((prev) => ({
            ...prev,
            [attDisk?.id]: !prev[attDisk?.id],
          }));
        }}
        // disabled={selectedInterfaces[attDisk.id] === "SATA"}
      />
    ),
    bootable: (
      attDisk?.id && <input type="checkbox" id={`os-${attDisk?.id}`}
        checked={selectedBootable[attDisk?.id] || false} // ✅ 개별 디스크 상태 유지
        onChange={() => {
          setSelectedBootable((prev) => ({
            ...prev,
            [attDisk?.id]: !prev[attDisk?.id],
          }));
        }}
        disabled={hasBootableDisk}
      />
    ),
  }));

  // 인터페이스 변경
  const handleInterfaceChange = (diskId, newInterface) => {
    Logger.debug(`VmDiskConnectionModal > handleInterfaceChange ... `)
    setSelectedInterfaces((prev) => ({
      ...prev,
      [diskId]: newInterface, // diskId를 키로 새로운 인터페이스 값 저장
    }));
  };
  
  // 가상머신 생성 - 디스크 연결
  const handleOkClick = () => {
    if (selectedDisks?.length === 0) {
      toast.error("디스크를 선택하세요!");
      return;
    }

    const selectedDiskLists = [...selectedDisks].map((d) => {
      const diskDetails = [...attDisks]?.find((disk) => disk?.id === d?.id);
      if (!diskDetails) return null;
      return {
        id: d?.id,
        alias: diskDetails.alias,  // 디스크 이름 추가
        size: convertBytesToGB(diskDetails.virtualSize), // GB 변환
        interface_: selectedInterfaces[d?.id] || "VIRTIO_SCSI",
        readOnly: selectedReadOnly[d?.id] || false,
        bootable: selectedBootable[d?.id] || false,
        isCreated: false, // 🚀 연결된 디스크 표시
      };
    }).filter(Boolean);
    onSelectDisk(selectedDiskLists); // 선택된 디스크를 VmDisk에 전달
    onClose()
  };
  

  // 가상머신 - 디스크 연결하기
  const handleFormSubmit = () => {
    if (selectedDisks?.length === 0) {
      toast.error("디스크를 선택하세요!");
      return;
    }
    
    const selectedDiskLists = [...selectedDisks].map((d) => {
      const diskDetails = attDisks.find((disk) => disk?.id === d?.id);
      if (!diskDetails) return null; // 선택된 디스크가 존재할 경우에만 추가
      return {
        interface_: selectedInterfaces[d?.id] || "VIRTIO_SCSI",
        readOnly: selectedReadOnly[d?.id] || false,
        bootable: selectedBootable[d?.id] || false,
        diskImageVo: {
          id: d?.id,
        },
        isCreated: false, // 🚀 연결된 디스크는 isCreated: false
      };
    })

    Logger.debug("VmDiskConnectionModal > handleFormSubmit ... ", selectedDiskLists);
    connDiskListVm({ vmId, diskAttachmentList: selectedDiskLists})
    // closeModal();
  };

  const handleCheckboxChange = (diskId) => {
    Logger.debug(`VmDiskConnectionModal > handleCheckboxChange ... diskId: ${diskId}`)
    setSelectedDisks((prev) =>
      prev.includes(diskId)
        ? prev.filter((id) => id !== diskId)
        : [...prev, diskId]
    );
  };

  return (
    <BaseModal targetName={`가상 ${Localization.kr.DISK}`}
      submitTitle={Localization.kr.CONNECTION}
      isOpen={isOpen} onClose={onClose}
      onSubmit={diskType
        ? handleFormSubmit
        : handleOkClick
      }
      contentStyle={{ width: "1000px"}} 
    >
      <div className="disk-new-nav">
        <div id="storage-img-btn"
          onClick={() => setActiveTab("img")}
          className={activeTab === "img" ? "active" : ""}
        >
          이미지 
        </div>
        {/* <div
          id="storage-directlun-btn"
          onClick={() => setActiveTab("directlun")}
          className={activeTab === "directlun" ? "active" : ""}
        >
          직접 LUN
        </div> */}
      </div>
      <br/>
      <>
        <TablesOuter target={"disk"}
          columns={activeTab === "img" 
            ? TableColumnsInfo.VIRTUAL_DISK
            : TableColumnsInfo.VMS_STOP
          }
          data={transformedData}
          onRowClick={(row) => setDisksSelected(row)}
          isLoading={isAttDisksLoading} isRefetching={isAttDisksRefetching} isErzror={isAttDisksError} isSuccess={isAttDisksSuccess}
        />
        <SelectedIdView items={disksSelected} />
      </>
    </BaseModal>
  );
};

export default VmDiskConnectionModal;