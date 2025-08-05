import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import useSearch                        from "@/hooks/useSearch";
import { LoadingFetch }                 from "@/components/common/Loading";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                        from "@/components/button/SearchBox";
import TablesOuter                      from "@/components/table/TablesOuter";
import TableRowClick                    from "@/components/table/TableRowClick";
import HostActionButtons                from "@/components/dupl/HostActionButtons";
import {
  status2Icon, hostedEngineStatus2Icon
} from "@/components/icons/RutilVmIcons";
import { getStatusSortKey }             from "@/components/icons/GetStatusSortkey";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const HostDupl = ({
  hosts = [], columns = [],
  refetch, isRefetching, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { activeModal } = useUIState();
  const { hostsSelected, setHostsSelected } = useGlobal();

  const transformedData = [...hosts]?.map((host) => ({
    ...host,
    _name: (
      <TableRowClick type="host" id={host?.id} hideIcon>
        {host?.name}
      </TableRowClick>
    ),
    ha: host?.hostedActive === true ? "Y" : "N", //TODO: 값이 확실한지 모르겠음
    icon: status2Icon(host?.status),
    iconSortKey: getStatusSortKey(host?.status),
    _hostedEngine: hostedEngineStatus2Icon(
      host?.hostedEngineVM,
      host?.hostedEngine,
      host?.hostedEngine?.score === 0 /* HA점수가 0일 때 사용 불가능 */
    ),
    _status: host?.statusKr || "알 수 없음",
    spmStatus: host?.spmStatusKr || (host?.spmStatus === "NONE" ? "보통" : host?.spmStatus),
    vmCnt: host?.vmSizeVo?.allCnt ?? "0",
    memoryUsage: host?.usageDto?.memoryPercent !== null ? `${host?.usageDto?.memoryPercent}%` : "",
    cpuUsage: host?.usageDto?.cpuPercent !== null ? `${host?.usageDto?.cpuPercent}%` : "",
    networkUsage: host?.usageDto?.networkPercent !== null ? `${host?.usageDto?.networkPercent}%` : "",
    upTime: host?.status?.toUpperCase() === "INSTALLING" ? Localization.kr.NOT_ASSOCIATED : host?.upTime,
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
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
          isLoading={isLoading} isRefetching={isRefetching} refetch={refetch}
        />
        <LoadingFetch isLoading={isLoading} isRefetching={isRefetching} />
        <HostActionButtons actionType="default"/>
      </div>
      <TablesOuter target={"host"}
        columns={columns}
        data={filteredData} 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        onRowClick={(selectedRows) => {
          if (activeModal().length > 0 || activeModal().includes("vm:migration")) return
          setHostsSelected(selectedRows)
        }}
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
