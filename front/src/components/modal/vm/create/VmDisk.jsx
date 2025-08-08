import { Suspense, useCallback, useMemo, useState } from "react";
import { Loading }               from "@/components/common/Loading";
import { ActionButton }      from "@/components/button/ActionButtons";
import { RVI36, rvi36TrashHover } from "@/components/icons/RutilVmIcons";
import Localization          from "@/utils/Localization";
import Logger                from "@/utils/Logger";
import VmDiskModal           from "@/components/modal/vm/VmDiskModal";
import VmDiskConnectionModal from "@/components/modal/vm/VmDiskConnectionModal";
import { Checkbox } from "@/components/ui/checkbox";
import { useValidationToast } from "@/hooks/useSimpleToast";
import LabelCheckbox from "@/components/label/LabelCheckbox";

const VmDisk = ({
  vm, vmName,
  dataCenterId,
  diskListState, setDiskListState,
  disabled = false,
}) => {
  const { validationToast } = useValidationToast();

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

  // 디스크 생성
  const handleCreateDisk = useCallback((newDisk) => {
    setDiskListState(prev => [...prev, { 
      ...newDisk, 
      isCreated: true
    }]);
    setCreateOpen(false);
  }, [setDiskListState]);

  // 디스크 연결
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
        prev.map((disk, i) => {
          if (i !== index) return disk;
          if (disk.deleted) {  // 이미 삭제상태였다면(삭제취소), 복구하면서 detachOnly 제거
            // 삭제 취소 (복구)
            import.meta.env.DEV && validationToast?.debug(`삭제취소`)
            const { detachOnly, ...rest } = disk;
            return { ...rest, deleted: false };
          }
          // 삭제로 변경(처음 클릭)
          import.meta.env.DEV && validationToast?.debug(`디스크 삭제`)
          return { ...disk, deleted: true, detachOnly: true };
        })
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

  // console.log("$ disk", diskListState)

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
                <span>
                  {disk.deleted ? (
                    <del style={{ textDecorationColor: 'red' }}>
                      <strong>{label}</strong>&nbsp;{disk.alias}&nbsp;({size} GB) 
                      {/* <strong style={{ color: 'red' }}>{disk.detachOnly===true ? `[${Localization.kr.REMOVE}]` : `[완전 ${Localization.kr.REMOVE}]`}</strong> */}
                    </del>
                  ) : (
                    <>
                    {/* 기존 디스크 목록 불러오기 */}
                      <strong>{label}</strong>&nbsp;{disk.alias}&nbsp;({size} GB)
                    </>
                  )}
                </span>
              </div>
              <div className="f-end">
                {disk.deleted ? (
                  <>
                    <LabelCheckbox
                      id={`detachOnly-${index}`}
                      label="완전 삭제"
                      checked={disk.detachOnly === false} // true면 단순 삭제, false면 완전 삭제
                      onChange={(checked) => {
                        const isChecked = checked === true; // "indeterminate" 대비
                        import.meta.env.DEV && validationToast?.debug(`checked: ${isChecked}`);
                        setDiskListState(prev =>
                          prev.map((d, i) =>
                            i === index ? { ...d, detachOnly: !isChecked } : d
                          )
                        );
                      }}
                    />
                    <button onClick={() => handleRemoveDisk(index, disk.isExisting)} className="instance-disk-btn ml-2" >
                      {Localization.kr.REMOVE} {Localization.kr.CANCEL}
                    </button>  
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
                    <RVI36 className="btn-icon cursor-pointer"
                      iconDef={rvi36TrashHover}                      
                      currentColor="transparent"
                      onClick={() => handleRemoveDisk(index, disk.isExisting)}
                    />
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
