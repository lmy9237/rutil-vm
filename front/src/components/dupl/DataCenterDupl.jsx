import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useGlobal               from "@/hooks/useGlobal";
import useSearch               from "@/hooks/useSearch";
import SelectedIdView          from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink  from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox               from "@/components/button/SearchBox";
import TablesOuter             from "@/components/table/TablesOuter";
import TableRowClick           from "@/components/table/TableRowClick";
import DataCenterActionButtons from "@/components/dupl/DataCenterActionButtons";
import { getStatusSortKey }    from "@/components/icons/GetStatusSortkey";
import { status2Icon }         from "@/components/icons/RutilVmIcons";
import Localization            from "@/utils/Localization";
import Logger                  from "@/utils/Logger";

/**
 * @name DataCenterDupl
 * @description ...
 * 
 * @param {Array} datacenters
 * @param {string[]} columns
 * 
 * @returns
 */
const DataCenterDupl = ({
  datacenters = [], columns = [],
  refetch, isRefetching, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const {
    datacentersSelected, setDatacentersSelected
  } = useGlobal();

  const transformedData = [...datacenters].map((dc) => {
    const status = dc?.status; //  먼저 선언해줌
    return {
      ...dc,
      _name: (
        <TableRowClick type="datacenter" id={dc?.id}>
          {dc?.name}
        </TableRowClick>
      ),
      icon: status2Icon(status),
      iconSortKey: getStatusSortKey(status), // 그 다음에 사용
      status: Localization.kr.renderStatus(status),
      storageType: dc?.storageType ? "로컬" : "공유됨",
      searchText: `${dc?.name} ${status} ${dc?.storageType ? "로컬" : "공유됨"}`,
    };
  });
  
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData, columns);

  const handleNameClick = useCallback((id) => {
    navigate(`/computing/datacenters/${id}/clusters`);
  }, [navigate])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start align-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetch} />
        <DataCenterActionButtons />
      </div>
      <TablesOuter target={"datacenter"}
        columns={columns}
        data={filteredData} 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        multiSelect={true}
        onRowClick={(selectedRows) => setDatacentersSelected(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isRefetching={isRefetching} isError={isError} isSuccess={isSuccess}
      />
      <SelectedIdView items={datacentersSelected} />
      <OVirtWebAdminHyperlink name={`${Localization.kr.COMPUTING}>${Localization.kr.DATA_CENTER}`} path="dataCenters" />
    </>
  );
};

export default DataCenterDupl;
