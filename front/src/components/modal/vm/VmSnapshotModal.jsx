import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import BaseModal from "../BaseModal";
import TablesOuter from "../../table/TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import { useAddSnapshotFromVM, useDisksFromVM } from "../../../api/RQHook";
import "./MVm.css";

const VmSnapshotModal = ({ isOpen, data, vmId, onClose }) => {
  const [selectedDisks, setSelectedDisks] = useState([]); // 체크된 디스크 목록
  const [isLoading, setIsLoading] = useState(false); // 로딩표시
  const [alias, setAlias] = useState(""); // 스냅샷 ID
  const [description, setDescription] = useState(""); // 스냅샷 설명
  const [persistMemory, setPersistMemory] = useState(false); // 메모리 저장 여부
  const handleDiskSelection = (disk, isChecked) => {
    setSelectedDisks(
      (prev) =>
        isChecked
          ? [...prev, disk] // 체크되면 추가
          : prev.filter((d) => d.id !== disk.id) // 체크 해제되면 제외
    );
  };

  const { mutate: addSnapshotFromVM } = useAddSnapshotFromVM();

  const { data: disks = [] } = useDisksFromVM(
    vmId && isOpen ? vmId : null,
    (e) => ({
      id: e.id,
      alias: e.diskImageVo?.alias || "Unknown Disk",
      description: e.diskImageVo?.description || "No Description",
      imageId: e.diskImageVo?.imageId || "",
      storageDomainVo: e.diskImageVo?.storageDomainVo || {},
      snapshot_check: (
        <input
          type="checkbox"
          checked={selectedDisks.some((disk) => disk.id === e.id)} // 체크 상태 유지
          onChange={(event) => handleDiskSelection(e, event.target.checked)}
        />
      ),
    })
  );

  useEffect(() => {
    if (isOpen && vmId) {
      console.log("🚀 Fetching disks for vmId:", vmId);
    }
  }, [isOpen, vmId]);

  const handleFormSubmit = () => {
    setIsLoading(true);

    const dataToSubmit = {
      alias,
      description: description || "Default description",
      persistMemory,
      diskAttachmentVos:
        selectedDisks.length > 0
          ? selectedDisks.map((disk) => ({
              id: disk.id,
              interface_: "IDE",
              logicalName: disk.alias,
              diskImageVo: {
                id: disk.id,
                alias: disk.alias,
                description: disk.description,
                format: "COW",
                imageId: disk.imageId,
                storageDomainVo: disk.storageDomainVo,
              },
            }))
          : [], // 체크된 디스크가 없으면 빈 배열
    };

    addSnapshotFromVM(
      { vmId, snapshotData: dataToSubmit },
      {
        onSuccess: () => {
          setIsLoading(false);
          setSelectedDisks([]); // ✅ 선택된 디스크 초기화
          onClose();
          toast.success("스냅샷 생성 완료");
        },
        onError: (error) => {
          setIsLoading(false);
          toast.error("Error adding snapshot:", error);
        },
      }
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={"스냅샷"}
      submitTitle={isLoading ? "...스냅샷 생성 중" : "생성"}
      onSubmit={handleFormSubmit}
    >
      {/* <div className="snapshot-new-popup modal"> */}
      <div className="p-1">
        <div className="host-textbox">
          <label htmlFor="description">설명</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)} // 사용자 입력 관리
          />
        </div>
        <div>
          <div className="font-bold">포함할 디스크 :</div>
          <div className="snapshot-new-table">
            <TablesOuter
              columns={TableColumnsInfo.SNAPSHOT_NEW}
              data={disks} // 디스크 데이터 삽입
              onRowClick={() => console.log("Row clicked")}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default VmSnapshotModal;
