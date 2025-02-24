import { lazy, Suspense, useCallback, useState } from "react";
import Loading from "../../../common/Loading";
import { useDisksFromVM } from "../../../../api/RQHook";
const VmDiskModal = lazy(() => import("../VmDiskModal"));
const VmDiskConnectionModal = lazy(() => import("../VmDiskConnectionModal"));

const VmDisk = ({
  vm,
  vmName,
  dataCenterId,
  diskListState,
  setDiskListState,
  // disks,
}) => {  
  // 가상머신 디스크 목록 가져오기
  const { data: diskAttachments = [] } = useDisksFromVM(vm?.id);
  
  // 부팅가능한 디스크 있는지 검색
  const hasBootableDisk = diskAttachments?.some((diskAttachment) => diskAttachment?.bootable === true);
  const diskCount = diskAttachments.filter((da) => {
    return da && vm?.name && da?.diskImageVo?.alias && da?.diskImageVo?.alias?.includes(`${vm?.name}_D`)
  })?.length+1 || 0;

  // 가상머신 생성일때(id없음) 디스크 인덱스 증가
  // const newIndex = diskListState.length + 1;
  const newIndex = diskListState.filter((d) => {
    return d && vmName && d?.diskImageVo?.alias?.includes(`${vmName}_D`)
  })?.length+1 || 0;
  
  const [isConnectionPopupOpen, setIsConnectionPopupOpen] = useState(false);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  
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

  const handleEditDisk = useCallback((editDisk) => {
    setIsEditPopupOpen(false);
  }, [setDiskListState]);

  const handleRemoveDisk = useCallback((index, isExisting) => {
    if (isExisting && !window.confirm("이 디스크를 삭제하시겠습니까? 삭제하면 복구할 수 없습니다.")) {
      return;
    }
    setDiskListState((prev) => prev.filter((_, i) => i !== index));
  }, [setDiskListState]);

  return (
    <>
      <div className="instance-image center">
        <div className="font-bold">인스턴스 이미지</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setIsConnectionPopupOpen(true)}>연결</button>
          <button onClick={() => setIsCreatePopupOpen(true)}>생성</button>
        </div>
      </div>
      <div><span>diskListState.length:{diskListState.length} diskAttachments: {diskAttachments.length}</span></div>

      <div className="disk-list-container">
        {diskListState.length > 0 && diskListState.map((disk, index) => (
          <>
            <div key={index} className="disk-item center mb-0.5">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "25px" }}>
                  <strong>{disk.isExisting ? "[기존]" : disk.isCreated ? "[생성]" : "[연결]"}{" "}</strong>
                    이름: {disk?.alias} ({disk?.size || disk?.virtualSize} GB) {disk?.bootable ? "[부팅]" : ""} {disk.isExisting ? disk.id: ""}
                </span>
              </div>
              <button onClick={() => handleEditDisk()}>편집</button>
              <button onClick={() => handleRemoveDisk(index, disk.isExisting)}>삭제</button>
            </div>
          </>
        ))}
      </div>
      <Suspense fallback={<Loading/>}>
        {isConnectionPopupOpen && (
          <VmDiskConnectionModal
            isOpen={isConnectionPopupOpen}
            vm={vm}
            dataCenterId={dataCenterId}
            diskType={false}
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
            diskType={false}            
            vmName={`${vmName}_Disk${diskAttachments.length === 0 ? newIndex: diskCount}`}
            // vmtype이 vm이면 newIndex로 vmtype이 disk에서 이뤄지면 diskcount
            onCreateDisk={handleCreateDisk}
            onClose={() => setIsCreatePopupOpen(false)}
          />
        )}
        {isEditPopupOpen && (
          <VmDiskModal
            editMode={true}
            isOpen={isEditPopupOpen}
            dataCenterId={dataCenterId}
            diskType={false}
            onCreateDisk={(newDisk) => {
              // 새로 생성된 디스크를 기존 목록에 추가
              setDiskListState((prevDisks) => [...prevDisks, newDisk]);
              setIsEditPopupOpen(false);
            }}
            onClose={() => setIsEditPopupOpen(false)}
          />
        )}
      </Suspense>
    </>
  );
};

export default VmDisk