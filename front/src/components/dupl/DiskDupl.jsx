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

  
  // TODO
  const diskContentTypeOptions = [
    { id: "0", name: "DATA" },
    { id: "1", name: "OVFS" },
    { id: "2", name: "MEMD" },
    { id: "3", name: "MEMM" },
    { id: "4", name: "ISOF" },
    { id: "5", name: "HEVD" },
    { id: "6", name: "HESD" },
    { id: "7", name: "HEMD" },
    { id: "8", name: "HECI" },
    { id: "9", name: "SCRD" },
    { id: "-1", name: "UNKNOWN" }
  ];
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
      sparse: d?.sparse ? "씬 프로비저닝" : "사전 할당",
      type: d?.type,
      connect: [
        d?.connectVm?.name || d?.connectTemplate?.name,
      ].filter(Boolean).join(", "),
      virtualSize: checkZeroSizeToGiB(d?.virtualSize),
      actualSize: checkZeroSizeToGiB(d?.actualSize),
    };

    // ✅ 검색 필드 추가 (모든 데이터를 하나의 문자열로 만듦)
    diskData.searchText = `${diskData.alias} ${diskData.sparse} ${diskData.virtualSize} ${diskData.actualSize}`;
    return diskData;
  });

  // 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  
  // selectoption
  const contentTypeFilteredData = useMemo(() => {
    if (!selectedContentType) return filteredData;
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
      <div className="dupl-header-group f-start gap-4 w-full">
        <div className="disk-filter-option flex">
          <div className="mr-3">
            <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetch} />
          </div>
          <Select
            value={selectedContentType}
            onValueChange={setSelectedContentType}
            position="popper"
          >
            <SelectTrigger className="disk-select-box f-btw w-full text-left">
              <SelectValue placeholder="디스크 타입 필터" />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
            <SelectItem className="select-item-custom" value="__all__">전체</SelectItem>
              {diskContentTypeOptions.map(opt => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DiskActionButtons 
          hasConnectTemplate={disksSelected.some(disk => !!disk?.connectTemplate?.name)}
        />
      </div>
      <TablesOuter target={"disk"}
        columns={columns}
        data={filteredData}
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
