import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import HostModals from "../modal/host/HostModals";
import HostActionButtons from "./HostActionButtons";
import SearchBox from "../button/SearchBox";
import useSearch from "../button/useSearch";
import { hostedEngineStatus2Icon, status2Icon } from "../icons/RutilVmIcons";

const HostDupl = ({
  isLoading, isError, isSuccess,
  hosts = [], columns = [], clusterId,  showSearchBox =true
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedHosts, setSelectedHosts] = useState([]);
  const selectedIds = (Array.isArray(selectedHosts) ? selectedHosts : []).map((host) => host.id).join(", ");

  const handleNameClick = (id) => navigate(`/computing/hosts/${id}`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);


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
     <div className="dupl-header-group">
        {showSearchBox && (
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}
        <HostActionButtons
          openModal={openModal}
          isEditDisabled={selectedHosts.length !== 1}
          isDeleteDisabled={selectedHosts.length === 0}
          status={selectedHosts[0]?.status}
          selectedHosts={selectedHosts || []}
        />

      </div>
      <span>ID: {selectedIds || ""}</span>
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
