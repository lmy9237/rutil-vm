import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import Loading from "../../../common/Loading";
import { useDisksFromVM } from "../../../../api/RQHook";
const VmDiskModal = lazy(() => import("../VmDiskModal"));
const VmDiskConnectionModal = lazy(() => import("../VmDiskConnectionModal"));

// 편집기능이 있는 컴포넌트

const VmDisk = ({
  editMode=false,
  vm,
  vmName,
  dataCenterId,
  diskListState,
  setDiskListState,
}) => {  
  // 가상머신 디스크 목록 가져오기
  const { data: diskAttachments = [] } = useDisksFromVM(vm?.id);
  
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isConnectionPopupOpen, setIsConnectionPopupOpen] = useState(false);
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [selectedDiskAttachmentId, setSelectedDiskAttachmentId] = useState(null);

  // 부팅가능한 디스크 있는지 검색
  const hasBootableDisk = useMemo(() => diskAttachments?.some((diskAttachment) => diskAttachment?.bootable === true), [diskAttachments]);
  const hasBootableDiskList = useMemo(() => diskListState?.some((d) => d?.bootable === true), [diskListState]);
 
  // 새 디스크 인덱스 계산
  const getNextDiskIndex = useMemo(() => {
    const existingDiskNames = [
      ...diskAttachments.map((d) => d?.diskImageVo?.alias),
      ...diskListState.map((d) => d?.alias)
    ];
    
    const regex = new RegExp(`^${vmName}_Disk(\\d+)$`);
    const existingIndexes = existingDiskNames
      .map(name => {
        const match = name?.match(regex);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(index => index > 0);

      return existingIndexes.length > 0 ? Math.max(...existingIndexes) + 1 : 1;
  }, [diskAttachments, diskListState, vmName]);


  // 디스크 생성시 DiskListState에 들어갈 값(isCreated true)
  const handleCreateDisk = useCallback((newDisk) => {
    console.log("handleCreateDisk - 전달된 새 디스크 데이터:", newDisk);
    setDiskListState((prevDisks) => [...prevDisks, { ...newDisk, isCreated: true, shouldUpdateDisk: false }]);
    setIsCreatePopupOpen(false);
  }, [setDiskListState]);
  

  // 디스크 편집시 표시될 값 입력 필요
  const handleEditDisk = useCallback((editDisk) => {
    console.log("handleEditDisk - 편집된 디스크 데이터:", editDisk);
    setDiskListState((prevDisks) =>
      prevDisks.map((disk) => disk.alias === editDisk.alias ? { ...disk, ...editDisk, shouldUpdateDisk: true } : disk)
    );
    setIsEditPopupOpen(false);
  }, [setDiskListState]);
  
  
  const openEditModal = (disk) => {
    setSelectedDisk(disk);
    if (editMode && disk.id) {
      // 기존 가상머신의 디스크 (ID 존재) → 편집 모드
      setSelectedDiskAttachmentId(disk.id);
    } else {
      // 생성된 디스크(ID 없음) → 새 디스크 생성 모달처럼 작동
      const tempDisk = diskListState.find((d) => d.alias === disk.alias);
      setSelectedDisk(tempDisk || disk);
      setSelectedDiskAttachmentId(null);
    }
    setIsEditPopupOpen(true);
  };  

  // 디스크 연결시 DiskListState에 들어갈 값(isCreate false)
  const handleConnDisk = useCallback((connDisks) => {
    setDiskListState((prevDisks) => [...prevDisks, {...connDisks, shouldUpdateDisk: true }]); // 여러 개의 디스크 추가 가능
    setIsConnectionPopupOpen(false);
  }, [setDiskListState]);
  
  

  const handleRemoveDisk = useCallback((index, isExisting) => {
    // 디스크 delete modal  추가해야할듯 (완전삭제 포함)
    if (isExisting && !window.confirm("이 디스크를 삭제하시겠습니까? 삭제하면 복구할 수 없습니다.")) {
      return;
    }
    setDiskListState((prev) => prev.filter((_, i) => i !== index));
  }, [setDiskListState]);


  return (
    <>
      <div className="instance-image center px-2">
        <div className="font-bold">인스턴스 이미지</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setIsConnectionPopupOpen(true)}>연결</button>
          <button onClick={() => setIsCreatePopupOpen(true)}>생성</button>
        </div>
      </div>

      <div className="disk-list-container">
        {diskListState.length > 0 && diskListState.map((disk, index) => (
          <div key={index} className="disk-item center mb-0.5">
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "25px" }}>
                <strong>{disk.isExisting ? "[기존] " : disk.isCreated ? "[생성] " : "[연결] "}</strong>
                  {disk?.alias} ({(disk?.size || disk?.virtualSize) + ' GB'}) {disk?.bootable ? "[부팅]" : ""} 
              </span>
            </div>
            <div className="flex">
              {(disk.isCreated || disk.isExisting) && <button onClick={() => openEditModal(disk)}>편집</button>}
              <button onClick={() => handleRemoveDisk(index, disk.isExisting)}>삭제</button>
            </div>
          </div>          
        ))}
      </div>

      <Suspense fallback={<Loading/>}>
        {isCreatePopupOpen && (
          <VmDiskModal
            isOpen={isCreatePopupOpen}
            diskType={false}
            vmId={vm?.id || ""}
            vmName={`${vmName}_Disk${getNextDiskIndex}`}
            dataCenterId={dataCenterId}
            hasBootableDisk={hasBootableDiskList}
            onCreateDisk={handleCreateDisk}
            onClose={() => setIsCreatePopupOpen(false)}
          />
        )}
        {isEditPopupOpen && selectedDisk && (
          <VmDiskModal
            isOpen={isEditPopupOpen}
            diskType={false}
            editMode={Boolean(selectedDisk.id)}  // ID가 있으면 true, 없으면 false
            vmId={vm?.id || ""}
            dataCenterId={dataCenterId}
            diskAttachmentId={selectedDiskAttachmentId}
            hasBootableDisk={hasBootableDisk || hasBootableDiskList}
            initialDisk={selectedDisk}
            onCreateDisk={handleEditDisk}
            onClose={() => setIsEditPopupOpen(false)}
          />
        )}
        {isConnectionPopupOpen && (
          <VmDiskConnectionModal
            isOpen={isConnectionPopupOpen}
            diskType={false}
            vmId={vm?.id || ""}
            dataCenterId={dataCenterId}
            hasBootableDisk={hasBootableDisk}
            onSelectDisk={handleConnDisk}
            existingDisks={diskListState}
            onClose={() => setIsConnectionPopupOpen(false)}
          />
        )}
      </Suspense>
    </>
  );
};

export default VmDisk;