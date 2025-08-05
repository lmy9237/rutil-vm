import { Suspense, useCallback, useMemo, useState } from "react";
import Loading               from "@/components/common/Loading";
import { ActionButton }      from "@/components/button/ActionButtons";
import { RVI36, rvi36TrashHover } from "@/components/icons/RutilVmIcons";
import Localization          from "@/utils/Localization";
import Logger                from "@/utils/Logger";
import VmDiskModal           from "@/components/modal/vm/VmDiskModal";
import VmDiskConnectionModal from "@/components/modal/vm/VmDiskConnectionModal";

const VmDisk = ({
  vm, vmName,
  dataCenterId,
  diskListState, setDiskListState,
  disabled = false,
}) => {
  const [createOpen, setCreateOpen] = useState(null);
  const [updateOpen, setUpdateOpen] = useState(null);
  const [connOpen, setConnOpen] = useState(false);

  const hasBootableDisk = useMemo(() =>
    diskListState.some(d => d?.bootable), [diskListState]);

  const diskNameWthSuffix = () => {
    Logger.debug("VmDisk > diskNameWthSuffix ...");
    if (!vmName) return "";

    const existingNames = [
      ...diskListState.map(d => d?.diskImageVo?.alias),
      ...diskListState.map(d => d?.alias),
    ];

    const regex = new RegExp(`^${vmName}_Disk(\\d+)$`);
    const existingIndexes = existingNames
      .map(name => name?.match(regex)?.[1])
      .filter(Boolean)
      .map(Number);

    const nextIndex = existingIndexes.length ? Math.max(...existingIndexes) + 1 : 1;
    return `${vmName}_Disk${nextIndex}`;
  };

  const handleCreateDisk = useCallback((newDisk) => {
    setDiskListState(prev => [...prev, { ...newDisk, isCreated: true }]);
    setCreateOpen(false);
  }, [setDiskListState]);

  const handleConnDisk = useCallback((connDisks) => {
    const normalized = Array.isArray(connDisks) ? connDisks.flat() : [connDisks];
    const connectedIds = normalized.map(d => d.diskImageVo?.id || d.id);

    setDiskListState((prev) => {
      const createdDisks = prev.filter(d => d.isCreated);
      const existingDisks = prev.filter(d => d.isExisting && !connectedIds.includes(d.diskImageVo?.id || d.id));
      const updatedConnected = normalized.map(d => ({
        ...d,
        isCreated: false,
        isExisting: false,
      }));

      return [...createdDisks, ...existingDisks, ...updatedConnected];
    });

    setConnOpen(false);
  }, [setDiskListState]);

  const handleUpdateDisk = useCallback(() => 
    setUpdateOpen(false)
  , []);

  const handleRemoveDisk = useCallback((index, isExisting) => {
    if (isExisting) {
      setDiskListState(prev =>
        prev.map((disk, i) =>
          i === index ? { ...disk, deleted: !disk.deleted } : disk
        )
      );
    } else {
      setDiskListState(prev =>
        prev.filter((_, i) => i !== index)
      );
    }
  }, [setDiskListState]);

  const getDiskLabel = (disk) => {
    const type = disk.isExisting ? "기존" : disk.isCreated ? "생성" : "연결";
    const boot = disk.bootable ? " & 부팅" : "";
    return `[${type}${boot}]`;
  };

  return (
    <>
      <div className="instance-image center py-4">
        <div className="font-bold">가상 {Localization.kr.DISK}</div>
        <div className="f-end">
          <ActionButton label={Localization.kr.CONNECTION} actionType="default"
            className="instance-disk-btn" onClick={() => setConnOpen(true)} disabled={disabled} />
          <ActionButton label={Localization.kr.CREATE} actionType="default"
            className="instance-disk-btn" onClick={() => setCreateOpen(true)} disabled={disabled} />
        </div>
        {/* <div>{hasBootableDisk === true ? "T" : "F"}</div> */}
      </div>

      <div className="pb-3">
        {diskListState.length > 0 && diskListState.map((disk, index) => {
          const label = getDiskLabel(disk);
          const size = disk?.size || disk?.virtualSize;

          return (
            <div key={index} className="disk-item f-btw mb-0.5 mb-3">
              <div className="f-start">
                <span >
                  {disk.deleted ? (
                    <del style={{ textDecorationColor: 'red' }}>
                      <strong>{label}</strong>&nbsp;{disk.alias}&nbsp;({size} GB) <strong style={{ color: 'red' }}>[삭제]</strong>
                    </del>
                  ) : (
                    <>
                      <strong>{label}</strong>&nbsp;{disk.alias}&nbsp;({size} GB)
                    </>
                  )}
                </span>
              </div>
              <div className="f-end">
                {disk.deleted ? (
                  <>
                    {/* <div>
                      <LabelCheckbox id={`detachOnly-${index}`}
                        label="완전삭제"
                        checked={disk.detachOnly || false}
                        onChange={(e) => {
                          setDiskListState(prev =>
                            prev.map((d, i) =>
                              i === index ? { ...d, detachOnly: checked } : d
                            )
                          );
                        }}
                      />
                    </div> */}
                    {/* <div>완전 삭제</div> */}

                    <button className="instance-disk-btn ml-0" onClick={() => handleRemoveDisk(index, disk.isExisting)}>삭제 취소</button>  
                    {/* <RVI36 className="btn-icon"
                      iconDef={rvi24Close}
                      currentColor="transparent"
                      onClick={() => handleRemoveDisk(index, disk.isExisting)}
                    /> */}
                  </>
                ) : (
                  <>
                    {/* {(disk.isCreated || disk.isExisting) && (
                      <RVI36 className="btn-icon"
                        iconDef={rvi36EditHover}                        
                        currentColor="transparent"
                        onClick={() => {
                          if (disk.isCreated) {
                            setCreateOpen(true); // 생성 모달 열기
                          } else if (disk.isExisting) {
                            setUpdateOpen(disk); // 수정 모달 열기
                          }
                        }}
                      />
                    )} */}
                    {vm?.status !== "up" &&
                      <>
                        <RVI36 className="btn-icon cursor-pointer"
                          iconDef={rvi36TrashHover}                      
                          currentColor="transparent"
                          onClick={() => handleRemoveDisk(index, disk.isExisting)}
                        />
                      </>
                    }                    
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Suspense fallback={<Loading />}>
        {createOpen && (
          <VmDiskModal isOpen={true}
            onClose={() => setCreateOpen(false)}
            vmName={diskNameWthSuffix()}
            dataCenterId={dataCenterId}
            hasBootableDisk={hasBootableDisk}
            onCreateDisk={handleCreateDisk}
          />
        )}
        {/* {updateOpen && (
          <VmDiskModal isOpen={true}
            onClose={() => setUpdateOpen(false)}
            editMode
            vmData={vm}
            dataCenterId={dataCenterId}
            hasBootableDisk={hasBootableDisk}
            initialDisk={updateOpen}
            onCreateDisk={handleCreateDisk}
          />
        )} */}
        {connOpen && (
          <VmDiskConnectionModal
            isOpen={true}
            onClose={() => setConnOpen(false)}
            vmDiskType={false}
            diskData={handleConnDisk}
            dataCenterId={dataCenterId}
            hasBootableDisk={hasBootableDisk}
            existingDisks={diskListState}
          />
        )}
      </Suspense>
    </>
  );
};

export default VmDisk;
