import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUIState from "../../hooks/useUIState";
import useSearch from "../../hooks/useSearch"; // ✅ 검색 기능 추가
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import DiskActionButtons from "./DiskActionButtons";
import SearchBox from "../button/SearchBox"; // ✅ 검색창 추가
import { status2Icon } from "../icons/RutilVmIcons";
import SelectedIdView from "../common/SelectedIdView";
import { checkZeroSizeToGiB } from "../../util";
import { useCdromsDisks } from "../../api/RQHook";
import Logger from "../../utils/Logger";
import useGlobal from "../../hooks/useGlobal";

const DiskDupl = ({
  disks = [], columns = [],
  refetch, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { 
    disksSelected, setDisksSelected,
    diskProfilesSelected, setDiskProfilesSelected,
  } = useGlobal()
    
  const diskIds = useMemo(() => ([...disks].map((d) => d.id)
  ), [disks]);

  const {
    data: cdromsMap = [] 
  } = useCdromsDisks(diskIds);
  
  // ✅ 데이터 변환: 검색이 가능하도록 `searchText` 추가
  const transformedData = [...disks].map((d) => {
    const cdromObj = cdromsMap.find((item) => item.diskId === d.id);
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
      /*
      connect: (
        <>
        <TableRowClick
          type={d?.connectVm?.id ? "vm" : "template"}
          id={d?.connectVm?.id || d?.connectTemplate?.id}
        >
          {d?.connectVm?.name || d?.connectTemplate?.name}
        </TableRowClick>
        <span>{(cdromObj?.cdroms || []).map((cd) => cd.name).join(', ')}</span>
        </>
      ),
      */
      connect: [
        d?.connectVm?.name || d?.connectTemplate?.name,
        ...(cdromObj?.cdroms || []).map(cd => cd.name)
      ].filter(Boolean).join(", "),
      virtualSize: checkZeroSizeToGiB(d?.virtualSize),
      actualSize: checkZeroSizeToGiB(d?.actualSize),
    };

    // ✅ 검색 필드 추가 (모든 데이터를 하나의 문자열로 만듦)
    diskData.searchText = `${diskData.alias} ${diskData.sparse} ${diskData.virtualSize} ${diskData.actualSize}`;
    return diskData;
  });

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const handleNameClick = useCallback((id) => {
    navigate(`/storages/disks/${id}`)
  }, [navigate])

  const handleRefresh = useCallback(() =>  {
    Logger.debug(`DiskDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  useEffect(() => {
    Logger.debug(`DiskDupl > useEffect ... disksSelected: `, disksSelected)
    const diskProfileSelectedFound = [...disksSelected].map((e) => e?.diskProfileVo)
    setDiskProfilesSelected(diskProfileSelectedFound)
  }, [disksSelected])

  return (
    <>{/* v-start으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        <DiskActionButtons />
      </div>
      <TablesOuter target={"disk"}
        columns={columns}
        data={filteredData} // ✅ 검색된 데이터만 표시
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        multiSelect={true}
        /*shouldHighlight1stCol={true}*/
        onRowClick={(selectedRows) => setDisksSelected(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
      />
      <SelectedIdView items={disksSelected} />
    </>
  );
};

export default DiskDupl;
