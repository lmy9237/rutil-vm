import React, { useState } from "react";
import useUIState from "../../../hooks/useUIState";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import SelectedIdView from "../../../components/common/SelectedIdView";
import { useHostDevicesFromVM } from "../../../api/RQHook";
import useGlobal from "../../../hooks/useGlobal";
import Logger from "../../../utils/Logger";

/**
 * @name VmHostDevices
 * @description 가상머신에 종속 된 호스트장치 목록
 * (/computing/vms/<vmId>/devices)
 *
 * @param {string} vmId 가상머신 ID
 * @returns {JSX.Element} VmHostDevices
 */
const VmHostDevices = ({ vmId }) => {
  const { activeModal, setActiveModal, } = useUIState()
  const { hostDevicesSelected, setHostDevicesSelected } = useGlobal()
  const {
    data: hostDevices = [],
    isLoading: isHostDevicesLoading,
    isError: isHostDevicesError,
    isSuccess: isHostDevicesSuccess,
  } = useHostDevicesFromVM(vmId, (e) => ({ ...e }));

  Logger.debug(`VmHostDevices ... `)
  return (
    <>
      <div className="header-right-btns">
        {/* <button onClick={() => setActiveModal('add')}>장치 추가</button>
        <button onClick={() => setActiveModal('delete')} className='disabled'>장치 삭제</button> */}
        {/* <button className='disabled'>vGPU 관리</button> */}
        {/* <button onClick={() => openPopup('view_cpu')}>View CPU Pinning</button> */}
      </div>

      <TablesOuter
        isLoading={isHostDevicesLoading}
        isError={isHostDevicesError}
        isSuccess={isHostDevicesSuccess}
        columns={TableColumnsInfo.HOST_DEVICE_FROM_VM}
        data={hostDevices.map((hostDevice) => ({
          ...hostDevice,
          name: hostDevice?.name ?? "Unknown",
          capability: hostDevice?.capability ?? "Unknown",
          vendorName: hostDevice?.vendorName ?? "Unknown",
          productName: hostDevice?.productName ?? "Unknown",
          driver: hostDevice?.driver ?? "Unknown",
          // currentlyUsed: hostDevice?.currentlyUsed ?? 'Unknown',
          // connectedToVM: hostDevice?.connectedToVM ?? 'Unknown',
          // iommuGroup: hostDevice?.iommuGroup ?? Localization.kr.NOT_ASSOCIATED,
          // mdevType: hostDevice?.mdevType ?? Localization.kr.NOT_ASSOCIATED,
        }))}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setHostDevicesSelected(selectedRows)}
        multiSelect={true}
      />
      
      <SelectedIdView items={hostDevicesSelected} />

      {/* 모달창 */}
    </>
  );
};

export default VmHostDevices;
