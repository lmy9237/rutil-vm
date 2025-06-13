import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import useUIState            from "@/hooks/useUIState";
import useGlobal             from "@/hooks/useGlobal";
import Loading               from "@/components/common/Loading";
import { ActionButton }      from "@/components/button/ActionButtons";
import { RVI36, rvi36EditDisabled, rvi36EditHover, rvi36Trash, rvi36TrashDisabled, rvi36TrashHover } from "@/components/icons/RutilVmIcons";
import {
  useDisksFromVM
} from "@/api/RQHook";
import Localization          from "@/utils/Localization";
import Logger                from "@/utils/Logger";
import LabelCheckbox from "@/components/label/LabelCheckbox";


const VmDiskModal = lazy(() => import("../VmDiskModal"));
const VmDiskConnectionModal = lazy(() => import("../VmDiskConnectionModal"));

const VmDisk = ({
  editMode=false,
  vm, vmName,
  dataCenterId,
  diskListState, setDiskListState,
  disabled = false,// 기본템플릿이 아닐때는 버튼 disabled처리
}) => {
  const { setActiveModal } = useUIState()
  const {
    vmsSelected,
  } = useGlobal()
  // 가상머신 디스크 목록 가져오기
  const {
    data: diskAttachments = []
  } = useDisksFromVM(vm?.id);
  
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isConnectionPopupOpen, setIsConnectionPopupOpen] = useState(false);

  // 부팅가능한 디스크 있는지 검색
  const hasBootableDisk = useMemo(() => 
    diskAttachments?.some((diskAttachment) => diskAttachment?.bootable === true)
  , [diskAttachments]);
  
  const hasBootableDiskList = useMemo(() => 
    diskListState?.some((d) => d?.bootable === true)
  , [diskListState]);

  const diskNameWthSuffix = () => { /* NOTE: useMemo 불가능 */
    Logger.debug(`VmDisk > diskNameWthSuffix ... `)
    if (vmName === "" || vmName === undefined || vmName === null) {
      return ""
    }
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
    const i = existingIndexes.length > 0 ? Math.max(...existingIndexes) + 1 : 1;

    return `${vmName}_Disk${i}`
  }

  // 디스크 생성시 DiskListState에 들어갈 값(isCreated true)
  const handleCreateDisk = useCallback((newDisk) => {
    setDiskListState((prevDisks) => 
      [...prevDisks, { ...newDisk, isCreated: true, }]
    );
    setIsCreatePopupOpen(false);
  }, [setDiskListState]);  
  
  const [editDisk, setEditDisk] = useState(null);

  // 디스크 연결 시 diskListState에 들어갈 값 (isCreated: false)
  const handleConnDisk = useCallback((connDisks) => {
    const normalizedDisks = Array.isArray(connDisks) ? connDisks.flat() : [connDisks];

    setDiskListState((prevDisks) => [...prevDisks, ...normalizedDisks]); // 평탄화된 배열 추가
    setIsConnectionPopupOpen(false);
  }, [setDiskListState]);

  
  const handleUpdateDisk = useCallback((index, isExisting) => {
    // setDiskListState((prev) => prev.filter((_, i) => i !== index));
  }, [setDiskListState]);
  
  // const handleRemoveDisk = useCallback((index, isExisting) => {
  //   setDiskListState((prev) => prev.filter((_, i) => i !== index));
  // }, [setDiskListState]);

  // const handleRemoveDisk = useCallback((index, isExisting) => {
  //   setDiskListState(prev =>
  //     prev.map((disk, i) =>
  //       i === index ? { ...disk, deleted: true } : disk
  //     )
  //   );
  // }, [setDiskListState]);
  const handleRemoveDisk = useCallback((index, isExisting) => {
    setDiskListState(prev =>
      prev.map((disk, i) =>
        i === index ? { ...disk, deleted: !disk.deleted } : disk
      )
    );
  }, [setDiskListState]);



  return (
    <>
      <div className="instance-image center py-4">
        <div className="font-bold">가상 디스크</div>
        <div className="f-end">
          <ActionButton label={Localization.kr.CONNECTION}
            actionType="default"
            className="instance-disk-btn"
            onClick={() => setIsConnectionPopupOpen(true)}
            disabled={disabled}
          />
          <ActionButton label={Localization.kr.CREATE}
            actionType="default"
            className="instance-disk-btn"
            onClick={() => setIsCreatePopupOpen(true)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="pb-3">
        {diskListState.length > 0 && diskListState.map((disk, index) => (
          <div key={index} className="disk-item f-btw  mb-0.5">
            <div className="f-start">
              <span style={{ marginRight: "25px" }}>
                {disk.deleted 
                  ?
                  <>
                    <del>
                      <strong>{
                        disk.isExisting 
                          ? `[기존${disk?.bootable ? " & 부팅]":"]"}`
                          : disk.isCreated 
                          ? "[생성] " 
                          : "[연결] "}
                      </strong>
                      &nbsp;{disk?.alias}&nbsp;
                      ({(disk?.size || disk?.virtualSize) + ' GB'})
                    </del>
                    </>
                  : 
                  <>
                    <strong>{
                        disk.isExisting 
                          ? `[기존${disk?.bootable ? " & 부팅]":"]"}`
                          : disk.isCreated 
                          ? "[생성] " 
                          : "[연결] "}
                      </strong>
                      &nbsp;{disk?.alias}&nbsp;
                      ({(disk?.size || disk?.virtualSize) + ' GB'})
                    </>
                  }
              </span>
            </div>

            <div className="f-end">
              <RVI36 
                iconDef={rvi36EditHover}
                className="btn-icon"
                currentColor="transparent"
                onClick={() => handleUpdateDisk(index, disk.isExisting)}
              />
              <RVI36
                iconDef={disk.deleted ? rvi36Trash : rvi36TrashHover}
                className="btn-icon"
                currentColor="transparent"
                onClick={() => handleRemoveDisk(index, disk.isExisting)}
              />
              {/* <RVI36 
                iconDef={rvi36TrashHover}
                className="btn-icon"
                currentColor="transparent"
                onClick={() => handleRemoveDisk(index, disk.isExisting)}
              /> */}
              <LabelCheckbox id="detachOnly" label={"완전삭제"}
                checked={true}
                // onChange={handleInputCheck(setFormState, "wipeAfterDelete", validationToast)}
              />
            </div>
          </div>     
        ))}
      </div>
      
      <Suspense fallback={<Loading/>}>
        {(isCreatePopupOpen || editDisk) && (
          <VmDiskModal
            isOpen={true}
            diskType={false}
            vmId={vm?.id}
            editMode={!!editDisk}
            vmName={editDisk ? editDisk.alias : `${diskNameWthSuffix()}`}
            dataCenterId={dataCenterId}
            hasBootableDisk={hasBootableDiskList}
            onCreateDisk={handleCreateDisk}
            onClose={() => {
              setIsCreatePopupOpen(false);
              setEditDisk(null); // 닫을 때 상태 초기화
            }}
          />
        )}
        {isConnectionPopupOpen && (
          <VmDiskConnectionModal 
            isOpen={true}
            diskType={false}
            vmId={vm?.id} dataCenterId={dataCenterId}
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