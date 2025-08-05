import React, { useEffect, useMemo, useCallback, useRef } from "react";
import CONSTANT                        from "@/Constants";
import useUIState                      from "@/hooks/useUIState";
import useGlobal                       from "@/hooks/useGlobal";
import useClickOutside                 from "@/hooks/useClickOutside";
import { Loading }                         from "@/components/common/Loading";
import SelectedIdView                  from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink          from "@/components/common/OVirtWebAdminHyperlink";
import SnapshotHostBackground          from "@/components/common/SnapshotHostBackground";
import TablesRow                       from "@/components/table/TablesRow";
import TablesOuter                     from "@/components/table/TablesOuter";
import TableRowClick                   from "@/components/table/TableRowClick";
import TableColumnsInfo                from "@/components/table/TableColumnsInfo";
import VmSnapshotActionButtons         from "@/components/dupl/VmSnapshotActionButtons";
import {
  RVI16,
  rvi16ChevronDown,
  rvi16ChevronRight,
  rvi16Desktop,
  rvi16DesktopFlag,
  rvi16Location,
  rvi16Lock,
  status2Icon,
} from "@/components/icons/RutilVmIcons";
import {
  useAllSnapshotsFromVm,
  useVm,
} from "@/api/RQHook";
import { convertBytesToMB }             from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";
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
  const { activeModal, setActiveModal } = useUIState()
  const {
    vmsSelected, setVmsSelected, 
    snapshotsSelected, setSnapshotsSelected
  } = useGlobal()

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
  } = useAllSnapshotsFromVm(vmId, (e) => ({ ...e }));

  const transformedData = useMemo(() => [...snapshots]?.map((snapshot) => ({
    ...snapshot,
    id: snapshot?.id,
    description: snapshot?.description,
    status: snapshot?.status,
    statusKr: Localization.kr.renderStatus(snapshot?.status),
    created: snapshot?.date ?? "현재",
    interface_: snapshot?.interface_,
    persistMemory: snapshot?.persistMemory ? "포함" : "비포함",
    _persistMemory: snapshot?.persistMemory 
      ? rvi16DesktopFlag(CONSTANT.color.blue1) 
      : rvi16Desktop(),
    cpuCore: `${snapshot?.vmVo?.cpuTopologyCnt} (${snapshot?.vmVo?.cpuTopologyCore}:${snapshot?.vmVo?.cpuTopologySocket}:${snapshot?.vmVo?.cpuTopologyThread})`,
    memorySize: convertBytesToMB(snapshot?.vmVo?.memorySize) + " MB" ?? "",
    memoryActual: convertBytesToMB(snapshot?.vmVo?.memoryGuaranteed) + " MB" ?? "",
    _status: status2Icon(snapshot?.status)
  })), [snapshots]);


  const hasLockedSnapshot = useMemo(() => (
    [...transformedData]?.some(snap => snap?.status?.toLowerCase() === "locked")
  ), [transformedData]) // NOTE: 하나 이상 잠겨있는 스냅샷이 있을 때 나머지 종작이 안됨
  
  const inPreview = useMemo(() => (
    [...transformedData]?.some(snap => {
    const status = snap?.status?.toLowerCase();
    return status === "in_preview" || status === "unknown";
  })
  ), [transformedData])

  const snapshotItemRef = useRef()
  useClickOutside(snapshotItemRef, (e) => {
    setSnapshotsSelected([])
  }, [".header-right-btns button", ".Overlay", "#right-click-menu-box"])
  
  useEffect(() => {
    setVmsSelected(vm)
  }, [vm])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <VmSnapshotActionButtons 
        hasLocked={hasLockedSnapshot}
        inPreview={inPreview}
      />
      <SnapshotHostBackground>
        <>
          <div ref={snapshotItemRef}
            className="split-item"
          >
            {/* 항상 현재 위치 표시 */}
              {!isSnapshotsLoading && transformedData?.length === 0 ? (
                <span className="snapshot-no-item-found f-center w-full h-full">
                  {Localization.kr.NO_INFO}
                </span>
              ) : (<>
              <div className="snapshot-item f-start">
                <RVI16 iconDef={rvi16ChevronDown()} />
                <div className="snapshot-label f-center fs-14">
                  <RVI16
                    iconDef={hasLockedSnapshot ? rvi16Lock() : rvi16Location()} 
                    className="mx-1.5"
                  />
                  {hasLockedSnapshot ? "잠겨있음" 
                    : inPreview ? "스냅샷 미리보기 상태"
                    : "현재 위치"}
                </div>
              </div>
              </>)}
  
            {isSnapshotsLoading && (<Loading/>)}

            {[...transformedData]?.filter((snapshot) => 
              !/(Active\sVM)|(before\sthe\spreview)/g.test(snapshot?.description) /* Active VM 뭐시기 뭐시기 제외 */
            ).map((snapshot) => (
              <div key={snapshot.id}
                className={`snapshot-item f-start ${snapshotsSelected[0]?.id === snapshot.id ? "selected" : ""}`}
                onClick={() => setSnapshotsSelected(snapshot)}
              >
                {/* 선택된 스냅샷이면 아래, 아니면 오른쪽 화살표 */}
                <RVI16 iconDef={
                  snapshotsSelected[0]?.id === snapshot.id 
                    ? rvi16ChevronDown()
                    : rvi16ChevronRight()
                  }
                  className="mx-1.5"
                />
                <div className='snapshot-label f-center'>
                  {snapshot?._status}
                  <RVI16 iconDef={snapshot?._persistMemory} className="mx-1.5" />
                  {snapshot?.description}
                </div>          
              </div>
            ))}
          </div>
          <div className="split-item">
            {snapshotsSelected.length > 0 ? (
              <TablesRow columns={TableColumnsInfo.SNAPSHOT_INFO_FROM_VM}
                data={snapshotsSelected[0]}
              />
            ) : (
              <></>
            )}
          </div>
        </>
      </SnapshotHostBackground>
      <SelectedIdView items={snapshotsSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.VM}>${vmsSelected[0]?.name}`}
        path={`vms-snapshots;name=${vmsSelected[0]?.name}`} 
      />
    </>
  );
};

export default VmSnapshots;
