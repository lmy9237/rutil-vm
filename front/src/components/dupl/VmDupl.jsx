import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUIState from "../../hooks/useUIState";
import useSearch from "../../hooks/useSearch"; // ✅ 검색 기능 추가
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import VmModals from "../modal/vm/VmModals";
import VmActionButtons from "./VmActionButtons";
import SearchBox from "../button/SearchBox"; // ✅ 검색창 추가
import { hostedEngineStatus2Icon, status2Icon } from "../icons/RutilVmIcons";
import SelectedIdView from "../common/SelectedIdView";
import { getStatusSortKey } from "../icons/GetStatusSortkey";
import { openNewTab } from "../../navigation";
import Logger from "../../utils/Logger";
import useGlobal from "../../hooks/useGlobal";

/**
 * @name VmDupl
 * @description 가상 머신 목록을 표시하는 컴포넌트
 *
 * @param {Array} vms - 가상 머신 데이터 배열
 * @param {string[]} columns - 테이블 컬럼 정보
 * @returns {JSX.Element}
 */
const VmDupl = ({
  vms = [], columns = [],
  actionType, status, 
  showSearchBox=true,
  onCloseModal,
  refetch, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal } = useUIState();
  const { vmsSelected, setVmsSelected } = useGlobal();

  // ✅ 데이터 변환 (검색을 위한 `searchText` 필드 추가)
  const transformedData = (!Array.isArray(vms) ? [] : vms).map((vm) => ({
    ...vm,
    icon: status2Icon(vm?.status),
    iconSortKey: getStatusSortKey(vm?.status), 
    engine: hostedEngineStatus2Icon(vm?.hostedEngineVm),
    nextRun: vm?.nextRun === true ? "!" : "", //  재시작여부 / 다음 실행시 새로운 설정이 적용되는 서버
    _name: (
      <TableRowClick type="vm" id={vm?.id}>
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
      vm?.usageDto?.memoryPercent === null || vm?.usageDto?.memoryPercent === undefined
        ? ""
        : `${vm?.usageDto?.memoryPercent}%`,
    cpuUsage:
      vm?.usageDto?.cpuPercent === null || vm?.usageDto?.cpuPercent === undefined
        ? ""
        : `${vm?.usageDto?.cpuPercent}%`,
    networkUsage:
      vm.usageDto?.networkPercent !== null && vm.usageDto?.networkPercent !== undefined
        ? `${vm.usageDto.networkPercent}%`
        : vm.status === "UP"
        ? "0%"
        : "",      
    // ✅ 검색 필드 추가 (한글 포함)
    searchText: `${vm?.name} ${vm?.hostVo?.name || ""} ${vm?.clusterVo?.name || ""} ${vm?.dataCenterVo?.name || ""} ${vm?.ipv4} ${vm?.ipv6}`.toLowerCase(),
  }));

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = (id) => navigate(`/computing/vms/${id}`);
  const handleRefresh = () =>  {
    Logger.debug(`VmDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  Logger.debug("VmDupl > ... ")
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        {showSearchBox && (<SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />)}
        <VmActionButtons />
      </div>

      {/* 테이블 컴포넌트 */}
      <TablesOuter
        columns={columns}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setVmsSelected(selectedRows)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        onContextMenuItems={(row) => {
          const vmId = row?.id;
          const openModalFromContext = (type) => {
            if (type === "console") {
              openNewTab("console", vmId); 
            } else {
              setActiveModal(type); 
            }
          };
        
          return [
            <VmActionButtons actionType="context" />,
          ];
        }}        
      />

      <SelectedIdView items={vmsSelected} />

      {/* VM 모달 */}
      <Suspense>
        <VmModals vm={vmsSelected[0]}
          onClose={() => {
            setActiveModal(null);
            setVmsSelected([])
            onCloseModal && onCloseModal();
          }}
        />
      </Suspense>
    </div>
  );
};

export default VmDupl;
