import React, { useCallback, useMemo } from "react";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import useSearch                        from "@/hooks/useSearch";
import { LoadingFetch }                 from "@/components/common/Loading";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                        from "@/components/button/SearchBox";
import TablesOuter                      from "@/components/table/TablesOuter";
import TableRowClick                    from "@/components/table/TableRowClick";
import TableColumnsInfo                 from "@/components/table/TableColumnsInfo";
import {
  useHostDevicesFromVM
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

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
    isRefetching: isHostDevicesRefetching,
  } = useHostDevicesFromVM(vmId, (e) => ({ ...e }));
  
  const transformedData = useMemo(() => ([...hostDevices]?.map((e) => ({
    ...e,
    name: e?.name ?? Localization.kr.NOT_ASSOCIATED,
    capability: e?.capability ?? Localization.kr.NOT_ASSOCIATED,
    vendorName: e?.vendorName ?? Localization.kr.NOT_ASSOCIATED,
    productName: e?.productName ?? Localization.kr.NOT_ASSOCIATED,
    driver: e?.driver ?? Localization.kr.NOT_ASSOCIATED,
    // currentlyUsed: hostDevice?.currentlyUsed ?? Localization.kr.NOT_ASSOCIATED,
    // connectedToVM: hostDevice?.connectedToVM ?? Localization.kr.NOT_ASSOCIATED,
    // iommuGroup: hostDevice?.iommuGroup ?? Localization.kr.NOT_ASSOCIATED,
    // mdevType: hostDevice?.mdevType ?? Localization.kr.NOT_ASSOCIATED,
  }))), [hostDevices])

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          isLoading={isHostDevicesLoading} isRefetching={isHostDevicesRefetching} refetch={refetchHostDevices}
        />
        <LoadingFetch isLoading={isHostDevicesLoading} isRefetching={isHostDevicesRefetching} />
        {/* <HostActionButtons actionType = "default"/> */}
      </div>
      <TablesOuter target={"hostdevice"}
        columns={TableColumnsInfo.HOST_DEVICE_FROM_VM}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setHostDevicesSelected(selectedRows)}
        isLoading={isHostDevicesLoading} isRefetching={isHostDevicesRefetching} isError={isHostDevicesError} isSuccess={isHostDevicesSuccess}
      />
      <SelectedIdView items={hostDevicesSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.VM}>${vmsSelected[0]?.name}`}
        path={`vms-host_devices;name=${vmsSelected[0]?.name}`} 
      />
    </>
  );
};

export default VmHostDevices;
