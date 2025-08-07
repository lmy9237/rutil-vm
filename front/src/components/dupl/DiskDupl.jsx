import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import useSearch                        from "@/hooks/useSearch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { LoadingFetch }                 from "@/components/common/Loading";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                        from "@/components/button/SearchBox";
import TablesOuter                      from "@/components/table/TablesOuter";
import TableRowClick                    from "@/components/table/TableRowClick";
import DiskActionButtons                from "@/components/dupl/DiskActionButtons";
import { 
  RVI16,
  rvi16Template,
  rvi16Desktop,
  status2Icon
} from "@/components/icons/RutilVmIcons";
import { 
  useAllDiskContentTypes
} from "@/api/RQHook";
import { checkZeroSizeToGiB }           from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

const DiskDupl = ({
  disks = [], columns = [],
  refetch, isRefetching, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { activeModal } = useUIState();
  const { 
    disksSelected, setDisksSelected,
    diskProfilesSelected, setDiskProfilesSelected,
  } = useGlobal()
    
  const {
    data: diskContentTypes = [],
    isLoading: isDiskContentTypesLoading
  } = useAllDiskContentTypes((e) => ({ 
    ...e,
    id: e?.id,
    name: e?.kr
  }))


  // 데이터 변환: 검색이 가능하도록 `searchText` 추가
  const transformedData = [...disks].map((d) => {
    let diskData = {
      ...d,
      _alias: (
        <TableRowClick type="disk" id={d?.id} hideIcon>
          {d?.alias || d?.diskImageVo?.alias}
        </TableRowClick>
      ),
      icon: status2Icon(d.status),  
      storageDomain: (
        <TableRowClick type="domain" id={d?.storageDomainVo?.id}>
          {d?.storageDomainVo?.name}
        </TableRowClick>
      ),
      _sharable: d?.sharable ? "O" : "",
      _bootable: d?.bootable ? "O" : "",
      icon2: d?.readOnly ? "O" : "",
      _status: (d?.imageTransferRunning) 
        ? (`${d?.imageTransferPhaseKr} (${d?.imageTransferPercent.toFixed(2)}%)`)
        : Localization.kr.renderStatus(d?.status),
      sparse: d?.sparse ? Localization.kr.THIN_PROVISIONING : Localization.kr.PREALLOCATED,
      storageType: d?.storageTypeKr ?? d?.storageType, 
      type: d?.type,
      /*
      connect: [
        d?.connectVm?.name || d?.connectTemplate?.name,
      ].filter(Boolean).join(", "), 
      */
      connect: d?.vmAttached 
        ? <TableRowClick type="vm" id={d?.connectVm?.id}>
          {d?.connectVm?.name}
        </TableRowClick>
        : d?.templateAttached
          ? <TableRowClick type="template" id={d?.connectTemplate?.id}>
            {d?.connectTemplate?.name}
          </TableRowClick>
          : <></>,
      virtualSizeToGB: checkZeroSizeToGiB(d?.virtualSize),
      actualSizeToGB: checkZeroSizeToGiB(d?.actualSize),
      searchText: `[${d?.contentType}] ${d?.alias} ${d?.sparse} ${d?.virtualSize} ${d?.actualSize}` // ✅ 검색 필드 추가 (모든 데이터를 하나의 문자열로 만듦)
    };
    return diskData;
  });

  // 검색 기능 적용
  /*
  const [selectedContentType, setSelectedContentType] = useState("__all__");
  const contentTypeFilteredData = useMemo(() => {
    if (selectedContentType === "__all__") return filteredData;
    return filteredData.filter(disk => String(disk?.contentType) === selectedContentType);
  }, [filteredData, selectedContentType]); 
  */

  const {
    searchQuery, setSearchQuery, 
    filterType, setFilterType,
  } = useSearch(transformedData, "contentType");

  const handleNameClick = useCallback((id) => {
    navigate(`/storages/disks/${id}`)
  }, [navigate])

  useEffect(() => {
    Logger.debug(`DiskDupl > useEffect ... disksSelected: `, disksSelected)
    const diskProfileSelectedFound = [...disksSelected].map((e) => e?.diskProfileVo)
    setDiskProfilesSelected(diskProfileSelectedFound)
  }, [disksSelected])

  return (
    <>{/* v-start으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <div className="f-start disk-filter-option gap-4">
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
            isLoading={isLoading} isRefetching={isRefetching} refetch={refetch} 
          />
          <div className="h-full">
            <Select
              value={filterType}
              onValueChange={setFilterType}
              position="popper"
            >
              <SelectTrigger className="disk-select-box f-btw w-full text-left h-[28px]">
                <SelectValue placeholder="디스크 유형 필터" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                <SelectItem className="select-item-custom" value="all">전체</SelectItem>
                {diskContentTypes.map(opt => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <LoadingFetch isLoading={isLoading} isRefetching={isRefetching} />
        </div>

        <DiskActionButtons 
          hasConnectTemplate={disksSelected.some(disk => !!disk?.connectTemplate?.name)}
        />
      </div>
      <TablesOuter target={"disk"} columns={columns}
        data={transformedData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        filterType={filterType} setFilterType={setFilterType} filterAccessor="contentType" 
        onRowClick={(selectedRows) => {
          if (activeModal().length > 0) return
          setDisksSelected(selectedRows)
        }}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isRefetching={isRefetching} isError={isError} isSuccess={isSuccess}
      />
      <SelectedIdView items={disksSelected} />
      <OVirtWebAdminHyperlink name={`${Localization.kr.COMPUTING}>${Localization.kr.DISK}`} path="disks" />
    </>
  );
};

export default DiskDupl;
