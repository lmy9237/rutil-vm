import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import Loading from "../../../common/Loading";
import { useDisksFromVM } from "../../../../api/RQHook";
import ActionButton from "../../../button/ActionButton";
import { RVI24, rvi24ChevronDown, rvi24Error } from "../../../icons/RutilVmIcons";
const VmDiskModal = lazy(() => import("../VmDiskModal"));
const VmDiskConnectionModal = lazy(() => import("../VmDiskConnectionModal"));

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
  const [isConnectionPopupOpen, setIsConnectionPopupOpen] = useState(false);

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
    setDiskListState((prevDisks) => [...prevDisks, { ...newDisk, isCreated: true, }]);
  
    setIsCreatePopupOpen(false);
  }, [setDiskListState]);  
  
  // 디스크 연결 시 diskListState에 들어갈 값 (isCreated: false)
  const handleConnDisk = useCallback((connDisks) => {
    const normalizedDisks = Array.isArray(connDisks) ? connDisks.flat() : [connDisks];

    setDiskListState((prevDisks) => [...prevDisks, ...normalizedDisks]); // 평탄화된 배열 추가
    setIsConnectionPopupOpen(false);
  }, [setDiskListState]);

  
  const handleRemoveDisk = useCallback((index, isExisting) => {
    setDiskListState((prev) => prev.filter((_, i) => i !== index));
  }, [setDiskListState]);


  return (
    <>
      <div className="instance-image center py-2">
        <div className="font-bold">인스턴스 이미지</div>
        <div style={{ display: "flex", gap: "8px" }}>
          <ActionButton
            label="연결"
            actionType="default"
            onClick={() => setIsConnectionPopupOpen(true)}
          />
          <ActionButton
            label="생성"
            actionType="default"
            onClick={() => setIsCreatePopupOpen(true)}
          />
        </div>
      </div>

      <div className="disk-list-container">
        {diskListState.length > 0 && diskListState.map((disk, index) => (
          <div key={index} className="disk-item center mb-0.5">
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "25px" }}>
                <strong>{disk.isExisting ? "[기존] " : disk.isCreated ? "[생성] " : "[연결] "}</strong>
                  {disk?.alias} ({(disk?.size || disk?.virtualSize) + ' GB'}) {disk?.bootable ? "[부팅]" : ""} 
                  !임시노란색!
              </span>
            </div>
            {/*{disk?.storageDomainVo?.id} <- 연결되어있는 디스크아이디*/}
            <div className="flex">
              <button><RVI24 iconDef={rvi24ChevronDown} /></button>
              <button onClick={() => handleRemoveDisk(index, disk.isExisting)}><RVI24 iconDef={rvi24Error} /></button>
            </div>
            {/* 기존 디스크가 아닌 경우에만 삭제 버튼 표시(삭제예정정) */}
            {/* <div className="flex">
              {!disk.isExisting && (
                <button onClick={() => handleRemoveDisk(index, disk.isExisting)}><RVI24 iconDef={rvi24Error} /></button>
              )}
            </div> */}
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