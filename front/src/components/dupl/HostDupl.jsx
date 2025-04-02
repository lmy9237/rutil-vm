import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import HostModals from "../modal/host/HostModals";
import HostActionButtons from "./HostActionButtons";
import SearchBox from "../button/SearchBox";
import useSearch from "../button/useSearch";
import { hostedEngineStatus2Icon, status2Icon } from "../icons/RutilVmIcons";
import SelectedIdView from "../common/SelectedIdView";
import Logger from "../../utils/Logger";

const HostDupl = ({
  hosts = [], columns = [], clusterId,
  showSearchBox =true,
  refetch, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedHosts, setSelectedHosts] = useState([]);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);
  const handleNameClick = (id) => navigate(`/computing/hosts/${id}`);
  const handleRefresh = () =>  {
    Logger.debug(`HostDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  // ✅ 데이터 변환 (검색을 위한 `searchText` 필드 추가)
  const transformedData = hosts.map((host) => ({
    ...host,
    _name: (
      <TableRowClick type="host" id={host?.id}>
        {host?.name}
      </TableRowClick>
    ),
    icon: status2Icon(host?.status),
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

  return (
    <>
     <div className="dupl-header-group f-start">
        {showSearchBox && (
          <SearchBox 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
            onRefresh={handleRefresh}
          />
        )}
        <HostActionButtons
          openModal={openModal}
          isEditDisabled={selectedHosts.length !== 1}
          isDeleteDisabled={selectedHosts.length === 0}
          status={selectedHosts[0]?.status}
          selectedHosts={selectedHosts || []}
        />
      </div>
      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={columns}
        data={filteredData} 
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedHosts(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        onContextMenuItems={(row) => [
          <HostActionButtons
            openModal={openModal}
            status={row?.status}
            selectedHosts={[row]}
            actionType="context"
            isContextMenu={true}
          />,
        ]}
      />
      <SelectedIdView items={selectedHosts}/>

      {/* 호스트 모달창 */}
      <HostModals
        activeModal={activeModal}
        host={selectedHosts[0]}
        selectedHosts={selectedHosts}
        clusterId={clusterId}
        onClose={closeModal}
      />
    </>
  );
};

export default HostDupl;
