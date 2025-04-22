import React, { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import SelectedIdView from "../../../components/common/SelectedIdView";
import SearchBox from "../../../components/button/SearchBox";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { useHostDevicesFromVM } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

/**
 * @name VmHostDevices
 * @description 가상머신에 종속 된 호스트장치 목록
 * (/computing/vms/<vmId>/devices)
 *
 * @param {string} vmId 가상머신 ID
 * @returns {JSX.Element} VmHostDevices
 */
const VmHostDevices = ({ 
  vmId
}) => {
  const { 
    vmsSelected, setVmsSelected,
    hostDevicesSelected, setHostDevicesSelected
  } = useGlobal()
  const {
    data: hostDevices = [],
    isLoading: isHostDevicesLoading,
    isError: isHostDevicesError,
    isSuccess: isHostDevicesSuccess,
    refetch: refetchHostDevices,
  } = useHostDevicesFromVM(vmId, (e) => ({ ...e }));
  
  const transformedData = useMemo(() => ([...hostDevices]?.map((e) => ({
    ...e,
    name: e?.name ?? "N/A",
    capability: e?.capability ?? "N/A",
    vendorName: e?.vendorName ?? "N/A",
    productName: e?.productName ?? "N/A",
    driver: e?.driver ?? "N/A",
    // currentlyUsed: hostDevice?.currentlyUsed ?? 'Unknown',
    // connectedToVM: hostDevice?.connectedToVM ?? 'Unknown',
    // iommuGroup: hostDevice?.iommuGroup ?? Localization.kr.NOT_ASSOCIATED,
    // mdevType: hostDevice?.mdevType ?? Localization.kr.NOT_ASSOCIATED,
  }))), [hostDevices])

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  const handleRefresh = useCallback(() => {
    Logger.debug(`HostDevices > handleRefresh ... `)
    if (!refetchHostDevices) return;
    refetchHostDevices()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  Logger.debug(`VmHostDevices ... `)
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh}/>
        {/* <HostActionButtons actionType = "default"/> */}
      </div>

      <TablesOuter target={"hostdevice"}
        columns={TableColumnsInfo.HOST_DEVICE_FROM_VM}
        data={filteredData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        shouldHighlight1stCol={true}
        multiSelect={true}
        onRowClick={(selectedRows) => setHostDevicesSelected(selectedRows)}
        refetch={refetchHostDevices}
        isLoading={isHostDevicesLoading} isError={isHostDevicesError} isSuccess={isHostDevicesSuccess}
      />
      
      <SelectedIdView items={hostDevicesSelected} />
    </div>
  );
};

export default VmHostDevices;
