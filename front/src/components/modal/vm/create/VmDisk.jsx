import { lazy, Suspense, useCallback, useState } from "react";
import Loading from "../../../common/Loading";
import { useDisksFromVM } from "../../../../api/RQHook";
const VmDiskModal = lazy(() => import("../VmDiskModal"));
const VmDiskConnectionModal = lazy(() => import("../VmDiskConnectionModal"));

const VmDisk = ({
  editMode=false,
  vm,
  vmName,
  dataCenterId,
  diskListState,
  setDiskListState,
  // disks,
}) => {  
  // 가상머신 디스크 목록 가져오기
  const { data: diskAttachments = [] } = useDisksFromVM(vm?.id);
  
  const [isConnectionPopupOpen, setIsConnectionPopupOpen] = useState(false);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  // 부팅가능한 디스크 있는지 검색
  const hasBootableDisk = diskAttachments?.some((diskAttachment) => diskAttachment?.bootable === true);
  // const diskCount = diskAttachments.filter((da) => {
  //   return da && vm?.name && da?.diskImageVo?.alias && da?.diskImageVo?.alias?.includes(`${vm?.name}_D`)
  // })?.length+1 || 0;
  const newIndex = diskListState.filter((d) => {
    return d && d?.diskImageVo?.alias?.includes(`${vmName}_D`)
  })?.length+1 || 0;
  

  
  const handleCreateDisk = useCallback((newDisk) => {
    setDiskListState((prevDisks) => [...prevDisks, { ...newDisk, isCreated: true }]);
    setIsCreatePopupOpen(false);
  }, [setDiskListState]);

  const handleConnDisk = useCallback((selectedDisks) => {
    setDiskListState((prevDisks) => [...prevDisks, ...selectedDisks]);
  setIsConnectionPopupOpen(false);
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
                    이름: {disk?.alias} ({disk?.size || disk?.virtualSize} GB) {disk?.bootable ? "[부팅]" : ""} 
                    {/* {disk.isExisting ? disk.id: ""} */}
                </span>
              </div>
              <button onClick={() => setIsEditPopupOpen(true)}>편집</button>
              <button onClick={() => handleRemoveDisk(index, disk.isExisting)}>삭제</button>
            </div>
          </>
        ))}
      </div>
      <Suspense fallback={<Loading/>}>
        {isConnectionPopupOpen && (
          <VmDiskConnectionModal
            isOpen={isConnectionPopupOpen}
            vmId={vm?.id || ""}
            dataCenterId={dataCenterId}
            diskType={false}
            existingDisks={diskListState.map((disk) => disk.id)}
            onSelectDisk={handleConnDisk} // 선택된 디스크 처리
            onClose={() => setIsConnectionPopupOpen(false)}
          />
        )}
        {isCreatePopupOpen && (
          <VmDiskModal
            isOpen={isCreatePopupOpen}
            vmId={vm?.id || ""}
            dataCenterId={dataCenterId}
            diskType={false}            
            vmName={`${vmName}_Disk${newIndex}`}
            // vmName={`${vmName}_Disk${diskListState.length+1}`}
            // vmName={editMode? `${vmName}_Disk${diskCount}` : `${vmName}_Disk${newIndex}`}
            onCreateDisk={handleCreateDisk}
            onClose={() => setIsCreatePopupOpen(false)}
          />
        )}
        {isEditPopupOpen && (
          <VmDiskModal
            editMode={true}
            isOpen={isEditPopupOpen}
            vmId={vm?.id || ""}
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