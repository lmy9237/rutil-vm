import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "../BaseModal";
import { useFindDiskListFromDataCenter } from "../../../api/RQHook";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import TablesOuter from "../../table/TablesOuter";
import { convertBytesToGB } from "../../../util";

// 연결에서 수정은 vm disk edit 으로 넘어감
// type이 disk면 vm disk목록에서 연결, 다른건 가상머신 생성에서 디스크연결
const VmDiskConnectionModal = ({
  isOpen,
  vm,
  dataCenterId,
  type = "disk",
  existingDisks = [],
  onSelectDisk,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("img");
  // 중복 선택을 위한 배열
  const [selectedDiskIds, setSelectedDiskIds] = useState([]); // 디스크 아이디 목록
  const [selectedInterfaces, setSelectedInterfaces] = useState({}); // 인터페이스
  const [selectedReadOnly, setSelectedReadOnly] = useState({}); // 읽기전용
  const [selectedBootable, setSelectedBootable] = useState({}); // 부팅가능

  // 데이터센터 밑에 잇는 디스크 목록 검색
  const { data: disks = [], isLoading } = useFindDiskListFromDataCenter(
    dataCenterId,
    (e) => ({ ...e })
  );

  // 인터페이스 목록
  const interfaceList = [
    { value: "VIRTIO_SCSI", label: "VirtIO-SCSI" },
    { value: "VIRTIO", label: "VirtIO" },
    { value: "SATA", label: "SATA" },
  ];

  // 인터페이스 변경
  const handleInterfaceChange = (diskId, newInterface) => {
    setSelectedInterfaces((prev) => ({
      ...prev,
      [diskId]: newInterface, // diskId를 키로 새로운 인터페이스 값 저장
    }));
  };

  const handleFormSubmit = () => {
    if (selectedDiskIds.length > 0) {
      const selectedDisks = selectedDiskIds
        .map((diskId) => {
          const diskDetails = disks.find((disk) => disk?.id === diskId);

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

  useEffect(() => {
    if (isOpen) {
      // 기존 선택된 디스크 적용 (기존 데이터와 다를 경우만 설정)
      setSelectedDiskIds((prev) => {
        return JSON.stringify(prev) !== JSON.stringify(existingDisks)
          ? existingDisks
          : prev;
      });

      // 기존 디스크의 인터페이스 및 설정 유지 (초기 상태와 다를 경우만 설정)
      setSelectedInterfaces((prev) => {
        const newInterfaces = {};
        disks.forEach((disk) => {
          newInterfaces[disk.id] = "VIRTIO_SCSI";
        });
        return JSON.stringify(prev) !== JSON.stringify(newInterfaces)
          ? newInterfaces
          : prev;
      });

      setSelectedReadOnly((prev) => {
        const newReadOnly = {};
        disks.forEach((disk) => {
          newReadOnly[disk.id] = false;
        });
        return JSON.stringify(prev) !== JSON.stringify(newReadOnly)
          ? newReadOnly
          : prev;
      });

      setSelectedBootable((prev) => {
        const newBootable = {};
        disks.forEach((disk) => {
          newBootable[disk.id] = false;
        });
        return JSON.stringify(prev) !== JSON.stringify(newBootable)
          ? newBootable
          : prev;
      });
    }
  }, [isOpen, disks, existingDisks]);

  const handleCheckboxChange = (diskId) => {
    setSelectedDiskIds((prev) =>
      prev.includes(diskId)
        ? prev.filter((id) => id !== diskId)
        : [...prev, diskId]
    );
  };

  return (
    
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"가상 디스크"}
      submitTitle={"연결"}
      onSubmit={handleFormSubmit}
    >
      
      {/* <div className="storage-disk-new-popup modal"> */}
      <div className="disk-new-nav">
        <div
          id="storage-img-btn"
          onClick={() => setActiveTab("img")}
          className={activeTab === "img" ? "active" : ""}
        >
          이미지
        </div>
        <div
          id="storage-directlun-btn"
          onClick={() => setActiveTab("directlun")}
          className={activeTab === "directlun" ? "active" : ""}
        >
          직접 LUN
        </div>
      </div>

      {isLoading ? (
        <div>로딩중</div>
      ) : (
        <>
          <TablesOuter
            columns={
              activeTab === "img"
                ? TableColumnsInfo.VIRTUAL_DISK
                : TableColumnsInfo.VMS_STOP
            }
            data={disks.map((e) => ({
              ...e,
              virtualSize: e?.virtualSize / Math.pow(1024, 3) + " GB",

              actualSize:
                convertBytesToGB(e?.actualSize) < 1
                  ? "< 1 GB"
                  : convertBytesToGB(e?.actualSize) + " GB",
              storageDomain: e?.storageDomainVo?.name,
              status:
                e?.status === "UNINITIALIZED" ? "초기화되지 않음" : "UP",
              check: (
                <input
                  type="checkbox"
                  checked={selectedDiskIds.includes(e.id)}
                  onChange={() => handleCheckboxChange(e.id)} // 체크박스를 클릭해야 선택됨
                />
              ),
              interface: (
                <select
                  id={`interface-select-${e.id}`}
                  value={selectedInterfaces[e.id] || "VIRTIO_SCSI"}
                  onChange={(event) => {
                    handleInterfaceChange(e.id, event.target.value); //  디스크 ID를 전달
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
                  id={`readonly-${e.id}`}
                  checked={selectedReadOnly[e.id] || false} // 개별 디스크 상태 유지
                  onChange={() => {
                    setSelectedReadOnly((prev) => ({
                      ...prev,
                      [e.id]: !prev[e.id],
                    }));
                  }}
                  disabled={selectedInterfaces[e.id] === "SATA"}
                />
              ),
              bootable: (
                <input
                  type="checkbox"
                  id={`os-${e.id}`}
                  checked={selectedBootable[e.id] || false} // ✅ 개별 디스크 상태 유지
                  onChange={() => {
                    setSelectedBootable((prev) => ({
                      ...prev,
                      [e.id]: !prev[e.id],
                    }));
                  }}
                />
              ),
            }))}
          />
        </>
      )}

      <span>선택된 디스크 ID: {selectedDiskIds.join(", ") || ""}</span>
    </BaseModal>
  );
};

export default VmDiskConnectionModal;