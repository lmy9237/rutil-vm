import { useNavigate } from "react-router-dom";
import useGlobal from "../../hooks/useGlobal";
import useSearch from "../../hooks/useSearch";
import toast from "react-hot-toast";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import HostModals from "../modal/host/HostModals";
import HostActionButtons from "./HostActionButtons";
import SearchBox from "../button/SearchBox";
import { status2Icon, hostedEngineStatus2Icon } from "../icons/RutilVmIcons";
import { getStatusSortKey } from "../icons/GetStatusSortkey";
import SelectedIdView from "../common/SelectedIdView";
import Logger from "../../utils/Logger";

const HostDupl = ({
  hosts = [], columns = [], showSearchBox =true,
  clusterId,
  refetch, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { hostsSelected, setHostsSelected } = useGlobal();

  const transformedData = (!Array.isArray(hosts) ? [] : hosts).map((host) => ({
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

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = (id) => navigate(`/computing/hosts/${id}`);
  const handleRefresh = () =>  {
    Logger.debug(`HostDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
     <div className="dupl-header-group f-start">
        {showSearchBox && (<SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery}  onRefresh={handleRefresh}/>)}
        <HostActionButtons actionType = "default"/>
      </div>

      <TablesOuter
        columns={columns}
        data={filteredData} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        multiSelect={true}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setHostsSelected(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        onContextMenuItems={(row) => [
          <HostActionButtons actionType="context" status={row?.status} />,
        ]}
      />
      <SelectedIdView items={hostsSelected}/>

      {/* 호스트 모달창 */}
      <HostModals 
        host={hostsSelected[0]} 
        clusterId={clusterId} 
      />
      {/* <HostModals host={activeModal() === "edit" ? hostsSelected[0] : null} clusterId={clusterId} /> */}
    </div>
  );
};

export default HostDupl;
