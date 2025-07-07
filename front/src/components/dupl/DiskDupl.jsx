import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUIState             from "@/hooks/useUIState";
import useGlobal              from "@/hooks/useGlobal";
import useSearch              from "@/hooks/useSearch";
import SelectedIdView         from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox              from "@/components/button/SearchBox";
import TablesOuter            from "@/components/table/TablesOuter";
import TableRowClick          from "@/components/table/TableRowClick";
import DiskActionButtons      from "@/components/dupl/DiskActionButtons";
import { status2Icon }        from "@/components/icons/RutilVmIcons";
import { checkZeroSizeToGiB } from "@/util";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import { useAllDiskContentTypes } from "@/api/RQHook";

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
    
  const diskIds = useMemo(() => (
    [...disks].map((d) => d.id)
  ), [disks]);

  
  const {
    data: diskContentTypes = [],
    isLoading: isDiskContentTypesLoading
  } = useAllDiskContentTypes((e) => ({ 
    ...e,
    id: e?.id,
    name: e?.kr
  }))

  const [selectedContentType, setSelectedContentType] = useState("__all__");

  // 데이터 변환: 검색이 가능하도록 `searchText` 추가
  const transformedData = [...disks].map((d) => {
    let diskData = {
      ...d,
      _alias: (
        <TableRowClick type="disk" id={d?.id}>
          {d?.alias || d?.diskImageVo?.alias}
        </TableRowClick>
      ),
      icon: status2Icon(d.status),  
      storageDomain: (
        <TableRowClick type="domain" id={d?.storageDomainVo?.id}>
          {d?.storageDomainVo?.name}
        </TableRowClick>
      ),
      sharable: d?.sharable ? "O" : "",
      icon1: d?.bootable ? "🔑" : "",
      icon2: d?.readOnly ? "🔒" : "",
      status: d?.status.toUpperCase(),
      sparse: d?.sparse ? "씬 프로비저닝" : "사전 할당",
      type: d?.type,
      connect: [
        d?.connectVm?.name || d?.connectTemplate?.name,
      ].filter(Boolean).join(", "),
      virtualSize: checkZeroSizeToGiB(d?.virtualSize),
      actualSize: checkZeroSizeToGiB(d?.actualSize),
    };

    // ✅ 검색 필드 추가 (모든 데이터를 하나의 문자열로 만듦)
    diskData.searchText = `[${diskData?.contentType}] ${diskData?.alias} ${diskData?.sparse} ${diskData?.virtualSize} ${diskData?.actualSize}`;
    return diskData;
  });

  // 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  
  // selectoption
  const contentTypeFilteredData = useMemo(() => {
    if (selectedContentType === "__all__") return filteredData;
    return filteredData.filter(disk => String(disk?.contentType) === selectedContentType);
  }, [filteredData, selectedContentType]);

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
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <div className="f-start disk-filter-option gap-4">
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetch} />
            <div className="h-full">
            <Select
              value={selectedContentType}
              onValueChange={setSelectedContentType}
              position="popper"
            >
              <SelectTrigger className="disk-select-box f-btw w-full text-left h-[28px]">
                <SelectValue placeholder="디스크 유형 필터" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                <SelectItem className="select-item-custom" value="__all__">전체</SelectItem>
                {diskContentTypes.map(opt => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
         </div>
        </div>

        <DiskActionButtons 
          hasConnectTemplate={disksSelected.some(disk => !!disk?.connectTemplate?.name)}
        />
      </div>
      <TablesOuter target={"disk"}
        columns={columns}
        data={contentTypeFilteredData}
        // data={contentTypeFilteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        multiSelect={true}
        /*shouldHighlight1stCol={true}*/
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
