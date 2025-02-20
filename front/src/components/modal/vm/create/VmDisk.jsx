import { lazy, Suspense, useCallback, useState } from "react";
import Loading from "../../../common/Loading";
const VmDiskModal = lazy(() => import("../VmDiskModal"));
const VmDiskConnectionModal = lazy(() => import("../VmDiskConnectionModal"));

const VmDisk = ({
  editMode,
  vm,
  vmName,
  dataCenterId,
  diskListState,
  setDiskListState,
  disks,
}) => {
  const [isConnectionPopupOpen, setIsConnectionPopupOpen] = useState(false);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const newIndex = diskListState.length + 1;
  
  const handleRemoveDisk = useCallback((index, isExisting) => {
    if (isExisting && !window.confirm("이 디스크를 삭제하시겠습니까? 삭제하면 복구할 수 없습니다.")) {
      return;
    }
    setDiskListState((prev) => prev.filter((_, i) => i !== index));
  }, [setDiskListState]);

  const handleSelectDisk = useCallback((selectedDisks) => {
    setDiskListState((prevDisks) => [
      ...prevDisks,
      ...selectedDisks.map((disk) => ({ ...disk, isCreated: false })),
    ]);
    setIsConnectionPopupOpen(false);
  }, [setDiskListState]);

  const handleCreateDisk = useCallback((newDisk) => {
    setDiskListState((prevDisks) => [...prevDisks, { ...newDisk, isCreated: true }]);
    setIsCreatePopupOpen(false);
  }, [setDiskListState]);


  return (
    <>
      <div className="instance-image center">
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
              onSelectDisk={handleSelectDisk}
              onClose={() => setIsConnectionPopupOpen(false)}
            />
          )}
          {isCreatePopupOpen && (
            <VmDiskModal
              // editMode={editMode}
              isOpen={isCreatePopupOpen}
              dataCenterId={dataCenterId}
              type="vm"
              vmName={`${vmName}_disk${newIndex}`}
              onCreateDisk={handleCreateDisk}
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

      <div className="disk-list-container center">
        {diskListState.length > 0 &&
          diskListState.map((disk, index) => (
            <>
            <div key={index} className="disk-item">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "25px" }}>
                  <strong>{disk.isExisting ? "[기존]" : disk.isCreated ? "[생성]" : "[연결]"}{" "}</strong>
                    이름: {disk?.alias} ({disk?.size || disk?.virtualSize} GB) {disk?.bootable ? "[부팅]" : ""}
                </span>
              </div>
            </div>
            <button onClick={() => handleRemoveDisk(index, disk.isExisting)}>
              삭제
            </button>
          </>
          ))}
      </div>
    </>
  );
};

export default VmDisk