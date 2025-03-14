import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import VmModals from "../modal/vm/VmModals";
import VmActionButtons from "./VmActionButtons";
import { renderVmStatusIcon } from "../Icon";
import SearchBox from "../button/SearchBox"; // ✅ 검색창 추가
import useSearch from "../button/useSearch"; // ✅ 검색 기능 추가

/**
 * @name VmDupl
 * @description 가상 머신 목록을 표시하는 컴포넌트
 *
 * @param {Array} vms - 가상 머신 데이터 배열
 * @param {string[]} columns - 테이블 컬럼 정보
 * @returns {JSX.Element}
 */
const VmDupl = ({
  isLoading, isError, isSuccess,
  vms = [], columns = [],
  actionType, status, 
  onCloseModal = () => {},
  showSearchBox =true
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedVms, setSelectedVms] = useState([]);

  // ✅ 데이터 변환 (검색을 위한 `searchText` 필드 추가)
  const transformedData = vms.map((vm) => ({
    ...vm,
    icon: renderVmStatusIcon(vm?.status),
    name: (
      <TableRowClick type="vms" id={vm?.id}>
        {vm?.name}
      </TableRowClick>
    ),
    host: (
      <TableRowClick type="host" id={vm?.hostVo?.id}>
        {vm?.hostVo?.name}
      </TableRowClick>
    ),
    cluster: (
      <TableRowClick type="cluster" id={vm?.clusterVo?.id}>
        {vm?.clusterVo?.name}
      </TableRowClick>
    ),
    dataCenter: (
      <TableRowClick type="datacenter" id={vm?.dataCenterVo?.id}>
        {vm?.dataCenterVo?.name}
      </TableRowClick>
    ),
    ipv4: vm?.ipv4 + " " + vm?.ipv6,
    memoryUsage:
      vm?.usageDto?.memoryPercent === null ||
      vm?.usageDto?.memoryPercent === undefined
        ? ""
        : `${vm?.usageDto?.memoryPercent}%`,
    cpuUsage:
      vm?.usageDto?.cpuPercent === null ||
      vm?.usageDto?.cpuPercent === undefined
        ? ""
        : `${vm?.usageDto?.cpuPercent}%`,
    networkUsage:
      vm.usageDto?.networkPercent === null ||
      vm.usageDto?.networkPercent === undefined
        ? ""
        : `${vm?.usageDto?.networkPercent}%`,
    // ✅ 검색 필드 추가 (한글 포함)
    searchText: `${vm?.name} ${vm?.hostVo?.name || ""} ${vm?.clusterVo?.name || ""} ${vm?.dataCenterVo?.name || ""} ${vm?.ipv4} ${vm?.ipv6}`.toLowerCase(),
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = (id) => navigate(`/computing/vms/${id}`);

  // 모달 열기 / 닫기
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group">
        {showSearchBox && (
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}
        <VmActionButtons
          openModal={openModal}
          isEditDisabled={selectedVms?.length !== 1}
          isDeleteDisabled={selectedVms?.length === 0}
          status={selectedVms[0]?.status}
          selectedVms={selectedVms}
        />
      </div>

      {/* 테이블 컴포넌트 */}
      <TablesOuter
        isLoading={isLoading} 
        isError={isError} 
        isSuccess={isSuccess}
        columns={columns}
        data={filteredData} // ✅ 검색 필터링된 데이터 사용
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedVms(selectedRows)}
        // clickableColumnIndex={[1]}
        searchQuery={searchQuery} // ✅ 검색어 전달
        setSearchQuery={setSearchQuery} // ✅ 검색어 변경 가능하도록 추가
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        onContextMenuItems={(row) => [
          <VmActionButtons
            openModal={openModal}
            isEditDisabled={!row} 
            type='context'
            isContextMenu={true} 
          />
        ]}
      />

      {/* VM 모달 */}
      <Suspense>
        <VmModals
          activeModal={activeModal}
          vm={selectedVms[0]}
          selectedVms={selectedVms}
          onClose={() => {
            closeModal();
            onCloseModal && onCloseModal();
          }}
        />
      </Suspense>
    </div>
  );
};

export default VmDupl;
