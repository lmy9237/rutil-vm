import React, { useEffect, useMemo, useCallback, useRef } from "react";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import useClickOutside from "../../../hooks/useClickOutside";
import Loading from "../../../components/common/Loading";
import TablesRow from "../../../components/table/TablesRow";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VmSnapshotActionButtons from "../../../components/dupl/VmSnapshotActionButtons";
import {
  RVI16,
  rvi16ChevronDown,
  rvi16ChevronRight,
  rvi16Desktop,
  rvi16Location,
  status2Icon,
} from "../../../components/icons/RutilVmIcons";
import { useSnapshotsFromVM, useVm } from "../../../api/RQHook";
import { convertBytesToMB } from "../../../util";
import SelectedIdView from "../../../components/common/SelectedIdView";
import "./VmSnapshots.css"

/**
 * @name VmSnapshots
 * 
 * @param {string} vmId 가상머신ID 
 * @returns {JSX.Element} VmSnapshots
 */
const VmSnapshots = ({
  vmId
}) => {
  const { activeModal, setActiveModal, } = useUIState()
  const { setVmsSelected, snapshotsSelected, setSnapshotsSelected } = useGlobal()

  const {
    data: vm = [],
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

  const transformedData = useMemo(() => [...snapshots]?.map((snapshot) => ({
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
  })), [snapshots]);


  const hasLockedSnapshot = useMemo(() => {
    [...transformedData]?.some(snap => snap.status === "locked")
  }, [transformedData]) // NOTE: 하나 이상 잠겨있는 스냅샷이 있을 때 나머지 종작이 안됨
  
  const snapshotItemRef = useRef()
  useClickOutside(snapshotItemRef, (e) => {
    setSnapshotsSelected([])
  }, [".header-right-btns button", ".Overlay", "#right-click-menu-box"])
  
  useEffect(() => {
    setVmsSelected(vm)
  }, [vm])

  return (
    <div 
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="header-right-btns no-search-box">
        <VmSnapshotActionButtons hasLocked={hasLockedSnapshot} />
      </div>
      <div  className="snapshot-group-outer f-btw">
        <div  className="snapshot-group">
          <div ref={snapshotItemRef}
            className="vm-snap-item"
          >
            {/* 항상 현재 위치 표시 */}
            <div className="snapshot-item f-start">
              <RVI16 iconDef={rvi16ChevronDown} />
              <div className="snapshot-label f-center">
                <RVI16 iconDef={rvi16Location} className="mx-1.5" />
                현재 위치
              </div>
            </div>
    
            {isSnapshotsLoading && (<Loading/>)}

            {/* TODO: 스냅샷 없을때 */}
            {!isSnapshotsLoading && transformedData?.length === 0 && (<></>)}

            {[...transformedData]?.map((snapshot) => (
              <div key={snapshot.id}
                className={`snapshot-item f-start ${snapshotsSelected[0]?.id === snapshot.id ? "selected" : ""}`}
                onClick={() => setSnapshotsSelected(snapshot)}
              >
                {/* 선택된 스냅샷이면 아래, 아니면 오른쪽 화살표 */}
                <RVI16 iconDef={
                  snapshotsSelected[0]?.id === snapshot.id 
                    ? rvi16ChevronDown 
                    : rvi16ChevronRight()
                  }
                  className="mx-1.5"
                />
                <div className='snapshot-label f-center'>
                  {snapshot?._status}
                  <RVI16 iconDef={rvi16Desktop} className="mx-1.5" />
                  {snapshot?.description}
                </div>          
              </div>
            ))}
          </div>
          
          <div className="vm-snap-item">
            {snapshotsSelected.length > 0 ? (
              <TablesRow columns={TableColumnsInfo.SNAPSHOT_INFO_FROM_VM}
                data={snapshotsSelected[0]}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <SelectedIdView items={snapshotsSelected} />
    </div>
  );
};

export default VmSnapshots;
