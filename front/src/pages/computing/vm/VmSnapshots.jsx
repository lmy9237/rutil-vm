import React, { Suspense, useEffect, useMemo } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import Loading from "../../../components/common/Loading";
import TablesRow from "../../../components/table/TablesRow";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VmSnapshotModal from "../../../components/modal/vm/VmSnapshotModal";
import VmSnapshotDeleteModal from "../../../components/modal/vm/VmSnapshotDeleteModal";
import VmSnapshotActionButtons from "../../../components/dupl/VmSnapshotActionButtons";
import {
  RVI16,
  rvi16ChevronDown,
  rvi16ChevronRight,
  rvi16Desktop,
  rvi16Location,
  rvi16Pause,
  RVI24,
  status2Icon,
} from "../../../components/icons/RutilVmIcons";
import Localization from "../../../utils/Localization";
import { useSnapshotsFromVM, useVm } from "../../../api/RQHook";
import { convertBytesToMB } from "../../../util";
import Logger from "../../../utils/Logger";



const VmSnapshots = ({
  vmId
}) => {
  const { activeModal, setActiveModal, } = useUIState()
  const { setVmsSelected, snapshotsSelected, setSnapshotsSelected } = useGlobal()

  const {
    data: vm,
    isLoading: isVmLoading,
    isError: isVmError,
    isSuccess: isVmSuccess,
  } = useVm(vmId);

  const {
    data: snapshots = [],
    isLoading: isSnapshotsLoading,
    isError: isSnapshotsError,
    isSuccess: isSnapshotsSuccess
  } = useSnapshotsFromVM(vmId, (e) => ({ ...e }));


  const transformedData = [...snapshots].map((snapshot) => ({
    ...snapshot,
    id: snapshot?.id,
    description: snapshot?.description,
    status: snapshot?.status,
    created: snapshot?.date ?? "현재",
    interface_: snapshot?.interface_,
    persistMemory: snapshot?.persistMemory ? "true" : "false",
    cpuCore: `${snapshot?.vmViewVo?.cpuTopologyCnt} (${snapshot?.vmViewVo?.cpuTopologyCore}:${snapshot?.vmViewVo?.cpuTopologySocket}:${snapshot?.vmViewVo?.cpuTopologyThread})`,
    memorySize: convertBytesToMB(snapshot?.vmViewVo?.memorySize) + " MB" ?? "",
    memoryActual: convertBytesToMB(snapshot?.vmViewVo?.memoryGuaranteed) + " MB" ?? "",
    _status: status2Icon(snapshot?.status)
  }));


  const hasLockedSnapshot = useMemo(() => {
    transformedData.some(snap => snap.status === "locked")
  }, [transformedData])
  
  useEffect(() => {
    setVmsSelected(vm)
  }, [vm])

  Logger.debug(`VmSnapshots ... `)
  return (
    <>
      <div className="header-right-btns no-search-box">
        <VmSnapshotActionButtons hasLocked={hasLockedSnapshot} />
      </div>

      <div className='center'>
        <div className=" vm-snap-item">
          {/* <div className="snapshot-item f-start">
            <RVI16 iconDef={rvi16ChevronDown} />
            <div className="snapshot-label">VM 스냅샷 {new Date().toLocaleString()}</div>
          </div> */}

          {/* 항상 현재 위치 표시 */}
          <div className="snapshot-item f-start">
            <RVI16 iconDef={rvi16ChevronDown} />
            <div className='snapshot-label  f-center'>
              <RVI16 iconDef={rvi16Location} className="mx-1.5" />
              현재 위치
            </div>
          </div>
   
          {isSnapshotsLoading && (<Loading/>)}

          {/* TODO: 스냅샷 없을때 */}
          {!isSnapshotsLoading && transformedData?.length === 0 && (<></>)}

          {transformedData?.length > 0 && transformedData?.map((snapshot) => (
            <div
              key={snapshot.id}
              className="snapshot-item f-start"
              onClick={() => setSnapshotsSelected(snapshot)}
              style={{ cursor: 'pointer', padding: '4px 26px', background: snapshotsSelected[0]?.id === snapshot.id ? '#E2E5EB' : 'none' }}
            >
               {/* 선택된 스냅샷이면 아래, 아니면 오른쪽 화살표 */}
              <RVI16 iconDef={snapshotsSelected[0]?.id === snapshot.id? rvi16ChevronDown : rvi16ChevronRight}  className="mx-1.5"/>
              <div className='snapshot-label f-center'>
                [상태:
                  <div className="f-center mx-0.5">
                    {snapshot?._status}
                  </div> 
                ]
                <RVI16 iconDef={rvi16Desktop} className="mx-1.5" />
                {snapshot?.description}
              </div>          
            </div>
          ))}
        </div>
        
        <div className="vm-snap-item">
          {snapshotsSelected.length > 0 ? (
            <TablesRow
              columns={TableColumnsInfo.SNAPSHOT_INFO_FROM_VM}
              data={snapshotsSelected}
            />
          ) : (
            <></>
          )}
        </div>
      </div>

      <Suspense>
        {activeModal() === "vmsnapshot:create" && (
          <VmSnapshotModal
            isOpen={activeModal() === "vmsnapshot:create"}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal() === "vmsnapshot:preview" && (
          Logger.warn("'스냅샷 미리보기' 기능 준비중 ...")
        )}
        {activeModal() === "vmsnapshot:move" && (
          Logger.warn("'스냅샷 이동' 기능 준비중 ...")
        )}
        {activeModal() === "vmsnapshot:remove" && (
          <VmSnapshotDeleteModal isOpen={activeModal() === "vmsnapshot:remove"}
            onClose={() => setActiveModal(null)}
            data={snapshotsSelected}
            vmId={vm.id}
          />
        )}
      </Suspense>
    </>
  );
};

export default VmSnapshots;
