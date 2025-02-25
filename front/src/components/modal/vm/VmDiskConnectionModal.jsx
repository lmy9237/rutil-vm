import { useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import { useConnDiskFromVM, useFindDiskListFromDataCenter } from "../../../api/RQHook";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import { checkZeroSizeToGB, convertBytesToGB } from "../../../util";
import TablesOuter from "../../table/TablesOuter";

// 인터페이스 목록
const interfaceList = [
  { value: "VIRTIO_SCSI", label: "VirtIO-SCSI" },
  { value: "VIRTIO", label: "VirtIO" },
  { value: "SATA", label: "SATA" },
];

// 연결에서 수정은 vm disk edit 으로 넘어감
// type이 disk면 vm disk목록에서 연결, 다른건 가상머신 생성에서 디스크연결
const VmDiskConnectionModal = ({
  isOpen,
  vmId,
  dataCenterId,
  onClose,
  hasBootableDisk,
  diskType = true,  // t=disk페이지에서 생성 f=vm만들때 같이 생성

  existingDisks = [],
  onSelectDisk,
}) => {
  const { mutate: connDiskVm } = useConnDiskFromVM();
  // const { } = useConnDiskFromVM(vmId, )
  // 데이터센터 밑에 잇는 디스크 목록 검색
  const { 
    data: attDisks=[],
    isLoading: isAttDisksLoading,
    isError: isAttDisksError,
    isSuccess: isAttDisksSuccess,
  } = useFindDiskListFromDataCenter(dataCenterId, (e) => ({ ...e }));

  const [activeTab, setActiveTab] = useState("img");
  const [selectedDisks, setSelectedDisks] = useState([]); // 디스크 목록
  const [selectedInterfaces, setSelectedInterfaces] = useState({}); // 인터페이스
  const [selectedReadOnly, setSelectedReadOnly] = useState({}); // 읽기전용
  const [selectedBootable, setSelectedBootable] = useState({}); // 부팅가능

  // 인터페이스 변경
  const handleInterfaceChange = (diskId, newInterface) => {
    setSelectedInterfaces((prev) => ({
      ...prev,
      [diskId]: newInterface, // diskId를 키로 새로운 인터페이스 값 저장
    }));
  };

  // 가상머신 생성&편집 - 디스크 연결하기
  const handleFormSubmit = () => {
    if (selectedDisks.length > 0) {
      const selectedDiskLists = selectedDisks.map((diskId) => {
        const diskDetails = attDisks.find((disk) => disk?.id === diskId);
        if (!diskDetails) return null; // 선택된 디스크가 존재할 경우에만 추가

        return {
          id: diskId,
          alias: diskDetails?.alias,
          interface_: selectedInterfaces[diskId] || "VIRTIO_SCSI",
          readOnly: selectedReadOnly[diskId] || false,
          bootable: selectedBootable[diskId] || false,
          virtualSize: convertBytesToGB(diskDetails?.virtualSize),
          storageDomain: diskDetails?.storageDomainVo?.name,
          isCreated: false, // 🚀 연결된 디스크는 isCreated: false
        };
      })
      const onSuccess = () => {
        onClose();
        toast.success(`가상머신 디스크 연결 완료`);
      };
      const onError = (err) => toast.error(`Error 연결 disk: ${err}`);
  
      console.log("Form Data: ", selectedDiskLists);

      // connDiskVm({ vmId: vmId, diskAttachment: }, { onSuccess, onError })
      onClose();
    } else {
      toast.error("디스크를 선택하세요!");
    }
  };

  
  const handleOkClick = () => {
    if (selectedDisks.length > 0) {
      const selectedDiskLists = selectedDisks.map((diskId) => {
        const diskDetails = attDisks.find((disk) => disk?.id === diskId);
        if (!diskDetails) return null; // 선택된 디스크가 존재할 경우에만 추가

        return {
          id: diskId,
          alias: diskDetails?.alias,
          interface_: selectedInterfaces[diskId] || "VIRTIO_SCSI",
          readOnly: selectedReadOnly[diskId] || false,
          bootable: selectedBootable[diskId] || false,
          virtualSize: convertBytesToGB(diskDetails?.virtualSize),
          storageDomain: diskDetails?.storageDomainVo?.name,
          isCreated: false, // 🚀 연결된 디스크는 isCreated: false
        };
      })
      .filter(Boolean);

      onSelectDisk(selectedDisks);
      onClose();
    } else {
      toast.error("디스크를 선택하세요!");
    }
  };

  // useEffect(() => {
  //   if (isOpen && attDisks.length > 0) {
  //     // 기존 선택된 디스크 적용 (기존 데이터와 다를 경우만 설정)
  //     setSelectedDisks((prev) => {
  //       return JSON.stringify(prev) !== JSON.stringify(existingDisks)
  //         ? existingDisks
  //         : prev;
  //     });
  //     // 기존 디스크의 인터페이스 및 설정 유지 (초기 상태와 다를 경우만 설정)
  //     setSelectedInterfaces((prev) => {
  //       const newInterfaces = {};
  //       attDisks.forEach((disk) => {
  //         newInterfaces[disk.id] = "VIRTIO_SCSI";
  //       });
  //       return JSON.stringify(prev) !== JSON.stringify(newInterfaces)
  //         ? newInterfaces
  //         : prev;
  //     });
  //     setSelectedReadOnly((prev) => {
  //       const newReadOnly = {};
  //       attDisks.forEach((disk) => {
  //         newReadOnly[disk.id] = false;
  //       });
  //       return JSON.stringify(prev) !== JSON.stringify(newReadOnly)
  //         ? newReadOnly
  //         : prev;
  //     });
  //     setSelectedBootable((prev) => {
  //       const newBootable = {};
  //       attDisks.forEach((disk) => {
  //         newBootable[disk.id] = false;
  //       });
  //       return JSON.stringify(prev) !== JSON.stringify(newBootable)
  //         ? newBootable
  //         : prev;
  //     });
  //   }
  // }, [isOpen, attDisks, existingDisks]);

  const handleCheckboxChange = (diskId) => {
    setSelectedDisks((prev) =>
      prev.includes(diskId)
        ? prev.filter((id) => id !== diskId)
        : [...prev, diskId]
    );
  };

  return (
    <BaseModal 
      isOpen={isOpen} onClose={onClose}
      targetName={"가상 디스크"}
      submitTitle={"연결"}
      onSubmit={diskType? handleFormSubmit : handleOkClick}
      contentStyle={{ width: "850px", height: "590px" }} 
    >
      <div className="popup-content-outer">
        <div className="disk-new-nav">
          <div
            id="storage-img-btn"
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
        <span> vm: {vmId}<br/>size: {attDisks.length}<br/> dc: {dataCenterId}<br/></span>
          <>
            <TablesOuter
              columns={activeTab === "img" ? TableColumnsInfo.VIRTUAL_DISK : TableColumnsInfo.VMS_STOP}
              isLoading={isAttDisksLoading} isError={isAttDisksError} isSuccess={isAttDisksSuccess}
              data={attDisks.length > 0 ? attDisks.map((attDisk) => ({
                ...attDisk,
                alias: attDisk?.alias,  // alias 추가
                virtualSize: checkZeroSizeToGB(attDisk?.virtualSize),
                actualSize: checkZeroSizeToGB(attDisk?.actualSize),
                storageDomain: attDisk?.storageDomainVo?.name,
                status: attDisk?.status === "UNINITIALIZED" ? "초기화되지 않음" : "UP",
              
                check: (
                  <input
                    type="checkbox"
                    checked={selectedDisks.includes(attDisk.id)}
                    onChange={() => handleCheckboxChange(attDisk.id)}
                  />
                ),
                interface: (
                  <select
                    id={`interface-select-${attDisk.id}`}
                    value={selectedInterfaces[attDisk.id] || "VIRTIO_SCSI"}
                    onChange={(event) => {
                      handleInterfaceChange(attDisk.id, event.target.value); //  디스크 ID를 전달
                    }}
                  >
                    {interfaceList.map((iface) => (
                      <option key={iface.value} value={iface.value}>
                        {iface.label}
                      </option>
                    ))}
                  </select>
                ),
                readonly: (
                  <input
                    type="checkbox"
                    id={`readonly-${attDisk.id}`}
                    checked={selectedReadOnly[attDisk.id] || false} // 개별 디스크 상태 유지
                    onChange={() => {
                      setSelectedReadOnly((prev) => ({
                        ...prev, [attDisk.id]: !prev[attDisk.id],
                      }));
                    }}
                    // disabled={selectedInterfaces[attDisk.id] === "SATA"}
                  />
                ),
                bootable: (
                  <input
                    type="checkbox"
                    id={`os-${attDisk.id}`}
                    checked={selectedBootable[attDisk.id] || false} // ✅ 개별 디스크 상태 유지
                    onChange={() => {
                      setSelectedBootable((prev) => ({
                        ...prev, [attDisk.id]: !prev[attDisk.id],
                      }));
                    }}
                    disabled={hasBootableDisk}
                  />
                ),
              })):[]
            }
            />
          </>
        <span>선택된 디스크 ID: {selectedDisks.join(", ") || ""}</span>
      </div>
    </BaseModal>
  );
};

export default VmDiskConnectionModal;