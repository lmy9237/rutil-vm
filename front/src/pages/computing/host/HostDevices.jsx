import React from "react";
import useGlobal                        from "@/hooks/useGlobal";
import useSearch                        from "@/hooks/useSearch";
import { LoadingFetch }                 from "@/components/common/Loading";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                        from "@/components/button/SearchBox";
import TablesOuter                      from "@/components/table/TablesOuter";
import TableColumnsInfo                 from "@/components/table/TableColumnsInfo";
import {
  useHostDevicesFromHost
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";

/**
 * @name HostDevices
 * @description 호스트에 종속 된 장치 목록
 * (/computing/hosts/<hostId>/devices)
 *
 * @param {string} hostId 호스트 ID
 * @returns
 */
const HostDevices = ({
  hostId
}) => {
  const { 
    hostsSelected,
    hostDevicesSelected, setHostDevicesSelected
  } = useGlobal()
  const {
    data: hostDevices = [],
    isLoading: isHostDevicesLoading,
    isError: isHostDevicesError,
    isSuccess: isHostDevicesSuccess,
    refetch: refetchHostDevices,
    isRefetching: isHostDevicesRefetching,
  } = useHostDevicesFromHost(hostId, (e) => ({ ...e }));
  
  const transformedData = [...hostDevices]?.map((e) => ({ ...e }))
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
        columns={TableColumnsInfo.DEVICE_FROM_HOST}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setHostDevicesSelected(selectedRows)}
        isLoading={isHostDevicesLoading} isRefetching={isHostDevicesRefetching} isError={isHostDevicesError} isSuccess={isHostDevicesSuccess}
      />
      <SelectedIdView items={hostDevicesSelected}/>
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.HOST}>${hostsSelected[0]?.name}`}
        path={`hosts-devices;name=${hostsSelected[0]?.name}`} 
      />
    </>
  );
};

export default HostDevices;
