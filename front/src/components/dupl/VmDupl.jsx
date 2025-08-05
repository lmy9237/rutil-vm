import { useCallback,useMemo } from "react"
import { useNavigate } from "react-router-dom";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import { 
  hostedEngineStatus2Icon,
  status2Icon
} from "@/components/icons/RutilVmIcons";
import { getStatusSortKey }   from "@/components/icons/GetStatusSortkey";
import VmActionButtons        from "@/components/dupl/VmActionButtons";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import { Checkbox } from "@/components/ui/checkbox";

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
  refetch, isRefetching, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { activeModal } = useUIState();
  const {
    vmsSelected, setVmsSelected
  } = useGlobal();

  const transformedData = [...vms].filter(vm => !!vm?.id).map((vm) => ({
    ...vm,
    checkbox: (
      <Checkbox
        checked={vmsSelected.some((selected) => selected.id === vm.id)}
        onClick={(e) => e.stopPropagation()}
        onCheckedChange={(checked) => {
          const isSelected = vmsSelected.some((v) => v.id === vm.id);
          const updated = isSelected
            ? vmsSelected.filter((v) => v.id !== vm.id)
            : [...vmsSelected, vm];
          setVmsSelected(updated);
        }}
      />
    ),
    // checkbox: (
    //   <input
    //     type="checkbox"
    //     checked={vmsSelected.some((selected) => selected.id === vm.id)}
    //     onClick={(e) => e.stopPropagation()} 
    //     onChange={() => {
    //       const isSelected = vmsSelected.some((v) => v.id === vm.id);
    //       const updated = isSelected
    //         ? vmsSelected.filter((v) => v.id !== vm.id)
    //         : [...vmsSelected, vm];
    //       setVmsSelected(updated);
    //     }}
    //   />
    // ),
    icon: (
      <div className="f-center" style={{ gap: "4px" }}>
        {status2Icon(vm?.status)}
        {vm?.nextRun === true && status2Icon("NEXT_RUN")}
        {(vm?.statusDetail === "noerr" || vm?.statusDetail === "none") ? "" : vm?.statusDetail}
      </div>
    ),
    iconSortKey: getStatusSortKey(vm?.status), 
    _name: (
      <>
      {/* {hostedEngineStatus2Icon(vm?.hostedEngineVm)} */} 
      <TableRowClick type="vm" id={vm?.id}>
        {vm?.name}
      </TableRowClick>
      </>
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
        : vm.status?.toUpperCase() === "UP"
        ? "0%"
        : "",      
    snapshotExist: vm?.snapshotVos?.length > 0 ? "O" : "X",
    // ✅ 검색 필드 추가 (한글 포함)
    searchText: `${vm?.name} ${vm?.hostVo?.name || ""} ${vm?.clusterVo?.name || ""} ${vm?.dataCenterVo?.name || ""} ${vm?.ipv4} ${vm?.ipv6}`.toLowerCase(),
  }));

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  // 컬럼에 체크박스추가
  const updatedColumns = useMemo(() => {
  return columns.map(col => {
    if (col.accessor === "checkbox") { 
      return {
        ...col,
        header: (
          // <input
          //   type="checkbox"
          //   checked={filteredData.length > 0 && filteredData.every(vm => vmsSelected.some(v => v.id === vm.id))}
          //   onChange={(e) => {
          //     if (e.target.checked) {
          //       const toAdd = filteredData.filter(vm => !vmsSelected.some(v => v.id === vm.id));
          //       setVmsSelected([...vmsSelected, ...toAdd]);
          //     } else {
          //       const remaining = vmsSelected.filter(v => !filteredData.some(vm => vm.id === v.id));
          //       setVmsSelected(remaining);
          //     }
          //   }}
          //   onClick={(e) => e.stopPropagation()}
          // />
          <Checkbox
            checked={
              filteredData.length > 0 &&
              filteredData.every(vm => vmsSelected.some(v => v.id === vm.id))
            }
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={(checked) => {
              if (checked) {
                const toAdd = filteredData.filter(vm => !vmsSelected.some(v => v.id === vm.id));
                setVmsSelected([...vmsSelected, ...toAdd]);
              } else {
                const remaining = vmsSelected.filter(v => !filteredData.some(vm => vm.id === v.id));
                setVmsSelected(remaining);
              }
            }}
          />
        )
      };
    }
    return col;
  });
}, [columns, filteredData, vmsSelected]);

  const handleNameClick = useCallback((id) => {
    navigate(`/computing/vms/${id}`);
  }, [navigate])

  return (
    <>
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetch} />
        <VmActionButtons />
      </div>
      <TablesOuter target={"vm"}
        columns={updatedColumns}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        onRowClick={(selectedRows) => {
          if (activeModal().length > 0 || activeModal().includes("vm:migration")) return
          setVmsSelected(selectedRows)
        }}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isRefetching={isRefetching} isError={isError} isSuccess={isSuccess}
         selectedRowIds={vmsSelected.map(vm => vm.id)}
      />
      <SelectedIdView items={vmsSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.VM}`}
        path="vms"
      />
    </>
  );
};

export default VmDupl;
