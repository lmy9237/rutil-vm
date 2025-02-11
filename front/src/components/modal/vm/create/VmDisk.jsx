import { lazy, Suspense, useEffect, useState } from "react";
import Loading from "../../../common/Loading";
// import VmDiskModal from "../VmDiskModal"
// import VmDiskConnectionModal from "../VmDiskConnectionModal"
const VmDiskModal = lazy(() => import("../VmDiskModal"));
const VmDiskConnectionModal = lazy(() => import("../VmDiskConnectionModal"));

const VmDisk = ({
  editMode,
  vm,
  dataCenterId,
  diskListState,
  setDiskListState,
  disks,
}) => {
  const [isConnectionPopupOpen, setIsConnectionPopupOpen] = useState(false);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  useEffect(() => {
    if (!editMode) {
      setDiskListState([]);
    }
  }, [editMode, setDiskListState]);

  console.log("disk", diskListState);

  // 디스크 편집 핸들러
  const handleEditDisk = (diskId) => {
    setDiskListState((prevDisks) =>
      prevDisks.filter((disk) => disk.id !== diskId)
    );
  };

  // 디스크 삭제 핸들러
  // const handleRemoveDisk = (index) => {
  //   setDiskListState((prev) => prev.filter((_, i) => i !== index));
  // };

  const handleRemoveDisk = (index, isExisting) => {
    if (isExisting) {
      // 기존 디스크인 경우 삭제 확인 모달 띄우기
      const isConfirmed = window.confirm(
        "이 디스크를 삭제하시겠습니까? 삭제하면 복구할 수 없습니다."
      );
      if (!isConfirmed) return; // 취소하면 삭제하지 않음
    }

    setDiskListState((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 0.28rem",
        }}
      >
        <div className="font-bold">인스턴스 이미지</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setIsConnectionPopupOpen(true)}>연결</button>
          <button onClick={() => setIsCreatePopupOpen(true)}>생성</button>
        </div>

        <Suspense fallback={<Loading/>}>
          {isConnectionPopupOpen && (
            <VmDiskConnectionModal
              isOpen={isConnectionPopupOpen}
              vm={vm}
              dataCenterId={dataCenterId}
              type="vm"
              existingDisks={diskListState.map((disk) => disk.id)} // 기존 연결된 디스크 전달
              onSelectDisk={(selectedDisks) => {
                setDiskListState((prevDisks) => [
                  ...prevDisks,
                  ...selectedDisks.map((disk) => ({
                    ...disk,
                    isCreated: false,
                  })), // 연결된 디스크 추가
                ]);
              }}
              onClose={() => setIsConnectionPopupOpen(false)}
            />
          )}
          {isCreatePopupOpen && (
            <VmDiskModal
              // editMode={editMode}
              isOpen={isCreatePopupOpen}
              dataCenterId={dataCenterId}
              type="vm"
              onCreateDisk={(newDisk) => {
                setDiskListState((prevDisks) => [
                  ...prevDisks,
                  { ...newDisk, isCreated: true }, // 생성된 디스크 추가
                ]);
                setIsCreatePopupOpen(false);
              }}
              onClose={() => setIsCreatePopupOpen(false)}
            />
          )}
          {isEditPopupOpen && (
            <VmDiskModal
              editMode={true}
              isOpen={isEditPopupOpen}
              dataCenterId={dataCenterId}
              type="vm"
              onCreateDisk={(newDisk) => {
                // 새로 생성된 디스크를 기존 목록에 추가
                setDiskListState((prevDisks) => [...prevDisks, newDisk]);
                setIsEditPopupOpen(false);
              }}
              onClose={() => setIsEditPopupOpen(false)}
            />
          )}
        </Suspense>
      </div>

      <div
        className="disk-list-container"
        style={{
          marginTop: "12px",
          borderBottom: "1px solid gray",
          paddingBottom: "8px",
        }}
      >
        {diskListState.length > 0 &&
          diskListState.map((disk, index) => (
            <div key={index} className="disk-item">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "10px" }}>
                  <strong>
                    {disk.isExisting
                      ? "[기존]"
                      : disk.isCreated
                        ? "[생성]"
                        : "[연결]"}{" "}
                  </strong>
                  이름: {disk?.alias} ({disk?.size || disk?.virtualSize} GB)
                  {disk?.bootable ? " [부팅]" : ""}
                </span>
                <button
                  onClick={() => handleRemoveDisk(index, disk.isExisting)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default VmDisk