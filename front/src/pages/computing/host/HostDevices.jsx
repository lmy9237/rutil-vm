import React, { useCallback } from "react";
import toast from "react-hot-toast";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import SelectedIdView from "../../../components/common/SelectedIdView";
import SearchBox from "../../../components/button/SearchBox";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { useHostDevicesFromHost } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

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
  const { hostsSelected, setHostsSelected, hostDevicesSelected, setHostDevicesSelected} = useGlobal()
  const {
    data: hostDevices = [],
    isLoading: isHostDevicesLoading,
    isError: isHostDevicesError,
    isSuccess: isHostDevicesSuccess,
    refetch: refetchHostDevices,
  } = useHostDevicesFromHost(hostId, (e) => ({ ...e }));
  
  const transformedData = [...hostDevices]?.map((e) => ({ ...e }))
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  
  const handleRefresh = useCallback(() => {
    Logger.debug(`HostDevices > handleRefresh ... `)
    if (!refetchHostDevices) return;
    refetchHostDevices()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh}/>
      {/* <HostActionButtons actionType = "default"/> */}
      <TablesOuter target={"hostdevice"}
        columns={TableColumnsInfo.DEVICE_FROM_HOST}
        data={filteredData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        shouldHighlight1stCol={true}
        multiSelect={true}
        onRowClick={(selectedRows) => setHostDevicesSelected(selectedRows)}
        refetch={refetchHostDevices}
        isLoading={isHostDevicesLoading} isError={isHostDevicesError} isSuccess={isHostDevicesSuccess}
      />
      <SelectedIdView items={hostDevicesSelected}/>
    </>
  );
};

export default HostDevices;
