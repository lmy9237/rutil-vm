import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import useUIState            from "@/hooks/useUIState";
import useGlobal             from "@/hooks/useGlobal";
import Loading               from "@/components/common/Loading";
import { ActionButton }      from "@/components/button/ActionButtons";
import { rvi24Close, RVI36, rvi36EditHover, rvi36TrashHover } from "@/components/icons/RutilVmIcons";
import {
  useDisksFromVM
} from "@/api/RQHook";
import Localization          from "@/utils/Localization";
import Logger                from "@/utils/Logger";
import LabelCheckbox from "@/components/label/LabelCheckbox";

const VmDiskModal = lazy(() => import("../VmDiskModal"));
const VmDiskConnectionModal = lazy(() => import("../VmDiskConnectionModal"));

const VmDisk = ({
  editMode = false,
  vm, vmName,
  dataCenterId,
  diskListState, setDiskListState,
  disabled = false,
}) => {
  const { setActiveModal } = useUIState();
  const { vmsSelected } = useGlobal();

  const { data: diskAttachments = [] } = useDisksFromVM(vm?.id);

  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [connOpen, setConnOpen] = useState(false);

  const hasBootableDisk = useMemo(() =>
    diskAttachments.some(d => d?.bootable), [diskAttachments]);

  const hasBootableDiskList = useMemo(() =>
    diskListState.some(d => d?.bootable), [diskListState]);

  const diskNameWthSuffix = () => {
    Logger.debug("VmDisk > diskNameWthSuffix ...");
    if (!vmName) return "";

    const existingNames = [
      ...diskAttachments.map(d => d?.diskImageVo?.alias),
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
    setDiskListState(normalized);  // ⬅️ 기존과 병합하지 않고 새로 설정
    setConnOpen(false);
  }, [setDiskListState]);

  const handleUpdateDisk = useCallback(() => setUpdateOpen(false), []);

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
    if (disk.isExisting) return `[기존${disk.bootable ? " & 부팅]" : "]"}`;
    if (disk.isCreated) return "[생성]";
    return "[연결]";
  };

  const renderDiskInfo = (disk, index) => {
    const label = getDiskLabel(disk);
    const size = disk?.size || disk?.virtualSize;

    return (
      <div key={index} className="disk-item f-btw mb-0.5">
        <div className="f-start">
          <span style={{ marginRight: "25px" }}>
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
              <div>
                <LabelCheckbox id="detachOnly" label="완전삭제" checked />
              </div>
              <RVI36
                iconDef={rvi24Close}
                className="btn-icon"
                currentColor="transparent"
                onClick={() => handleRemoveDisk(index, disk.isExisting)}  // ✅ 디스크의 상태 기준
              />
            </>
          ) : (
            <>
              {(disk.isCreated || disk.isExisting) && (
                <RVI36
                  iconDef={rvi36EditHover}
                  className="btn-icon"
                  currentColor="transparent"
                  onClick={() => setUpdateOpen(true)}
                />
              )}
              <RVI36
                iconDef={rvi36TrashHover}
                className="btn-icon"
                currentColor="transparent"
                onClick={() => handleRemoveDisk(index, disk.isExisting)}  // ✅ 디스크의 상태 기준
              />
            </>
          )}
        </div>
      </div>
    );
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
      </div>

      <div className="pb-3">
        {diskListState.length > 0 && diskListState.map(renderDiskInfo)}
      </div>

      <Suspense fallback={<Loading />}>
        {(createOpen || updateOpen) && (
          <VmDiskModal
            isOpen={true}
            diskType={false}
            vmId={vm?.id}
            editMode={!!updateOpen}
            vmName={updateOpen ? updateOpen.alias : diskNameWthSuffix()}
            dataCenterId={dataCenterId}
            hasBootableDisk={hasBootableDiskList}
            onCreateDisk={handleCreateDisk}
            onClose={() => {
              setCreateOpen(false);
              setUpdateOpen(false);
            }}
          />
        )}
        {connOpen && (
          <VmDiskConnectionModal
            isOpen={true}
            onClose={() => setConnOpen(false)}
            diskType={false}
            vmId={vm?.id}
            dataCenterId={dataCenterId}
            hasBootableDisk={hasBootableDisk}
            onSelectDisk={handleConnDisk}
            existingDisks={diskListState}
          />
        )}
      </Suspense>
    </>
  );
};

export default VmDisk;
