import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import HostActionButtons      from "@/components/dupl/HostActionButtons";
import {
  status2Icon, hostedEngineStatus2Icon
} from "@/components/icons/RutilVmIcons";
import { getStatusSortKey }   from "@/components/icons/GetStatusSortkey";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";

const HostDupl = ({
  hosts = [], columns = [],
  refetch, isRefetching, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { hostsSelected, setHostsSelected } = useGlobal();

  const transformedData = [...hosts]?.map((host) => ({
    ...host,
    _name: (
      <TableRowClick type="host" id={host?.id}>
        {host?.name}
      </TableRowClick>
    ),
    icon: status2Icon(host?.status),
    iconSortKey: getStatusSortKey(host?.status),
    hostedEngine: hostedEngineStatus2Icon(host?.hostedEngineVM, host?.hostedEngine),
    status: host?.status,
    spmStatus: host?.spmStatus === "NONE" ? "보통" : host?.spmStatus,
    vmCnt: host?.vmSizeVo?.allCnt ?? "0",
    memoryUsage: host?.usageDto?.memoryPercent !== null ? `${host?.usageDto?.memoryPercent}%` : "",
    cpuUsage: host?.usageDto?.cpuPercent !== null ? `${host?.usageDto?.cpuPercent}%` : "",
    networkUsage: host?.usageDto?.networkPercent !== null ? `${host?.usageDto?.networkPercent}%` : "",
    cluster: <TableRowClick type="cluster" id={host?.clusterVo?.id}>{host?.clusterVo?.name}</TableRowClick>,
    dataCenter: <TableRowClick type="datacenter" id={host?.dataCenterVo?.id}>{host?.dataCenterVo?.name}</TableRowClick>,
    // ✅ 검색 필드 추가
    searchText: `${host?.name} ${host?.clusterVo?.name || ""} ${host?.dataCenterVo?.name || ""}`.toLowerCase(),
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = useCallback((id) => {
    navigate(`/computing/hosts/${id}`);
  }, [navigate])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetch} />
        <HostActionButtons actionType="default"/>
      </div>
      <TablesOuter target={"host"}
        columns={columns}
        data={filteredData} 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        multiSelect={true}
        onRowClick={(selectedRows) => setHostsSelected(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isRefetching={isRefetching} isError={isError} isSuccess={isSuccess}
      />
      <SelectedIdView items={hostsSelected}/>
      <OVirtWebAdminHyperlink 
        name={`${Localization.kr.COMPUTING}>${Localization.kr.HOST}`} 
        path="hosts"
      />
    </>
  );
};

export default HostDupl;
