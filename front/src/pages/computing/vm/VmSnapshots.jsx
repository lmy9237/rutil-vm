import React, { Suspense, useState } from 'react';
import toast from 'react-hot-toast';
import useUIState from '../../../hooks/useUIState';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import VmSnapshotModal from '../../../components/modal/vm/VmSnapshotModal';
import { useSnapshotsFromVM, useVm } from '../../../api/RQHook';
import { convertBytesToMB } from '../../../util';
import TablesRow from '../../../components/table/TablesRow';
import ActionButton from '../../../components/button/ActionButton';
import { RVI16, rvi16ChevronDown, rvi16ChevronRight, rvi16Desktop, rvi16Location, rvi16Pause, RVI24, status2Icon } from '../../../components/icons/RutilVmIcons';
import Localization from '../../../utils/Localization';
import Loading from '../../../components/common/Loading';
import VmSnapshotDeleteModal from '../../../components/modal/vm/VmSnapshotDeleteModal';
import Logger from '../../../utils/Logger';
import useGlobal from '../../../hooks/useGlobal';


const VmSnapshots = ({
  vmId
}) => {
  const { activeModal, setActiveModal, } = useUIState()
  const { snapshotsSelected, setSnapshotsSelected } = useGlobal()

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


  const transformedData = (!Array.isArray(snapshots) ? [] : snapshots).map((snapshot) => ({
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


  const hasLockedSnapshot = transformedData.some(snap => snap.status === "locked");
  
  Logger.debug(`VmSnapshots ... `)
  return (
    <>
      <div className="header-right-btns no-search-box">
        <ActionButton actionType="default" label={Localization.kr.CREATE}
          disabled={hasLockedSnapshot} 
          onClick={() => setActiveModal("vmsnapshot:create")}
        />
        <ActionButton actionType="default" label="미리보기"          
          disabled={!snapshotsSelected} 
          onClick={() => setActiveModal("vmsnapshot:preview")}
        />
        <ActionButton actionType="default" label={Localization.kr.REMOVE}
          disabled={!snapshotsSelected} 
          onClick={() => setActiveModal("vmsnapshot:remove")}
        />
        <ActionButton actionType="default" label={Localization.kr.MOVE}          
          disabled={!snapshotsSelected} 
          onClick={() => setActiveModal("vmsnapshot:move")}
        />
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

          {/*스냅샷없을때*/}
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
            onClose={setActiveModal(null)}
            selectedVm={vm}
            // diskData={disks}
          />
        )}
        {activeModal() === "vmsnapshot:remove" && (
          <VmSnapshotDeleteModal 
            isOpen={activeModal() === "vmsnapshot:remove"}
            onClose={setActiveModal(null)}
            data={snapshotsSelected}
            vmId={vm.id}
          />
        )}
      </Suspense>
    </>
  );
};

export default VmSnapshots;
