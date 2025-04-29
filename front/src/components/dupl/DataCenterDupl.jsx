import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useGlobal from "../../hooks/useGlobal";
import useSearch from "../../hooks/useSearch";
import TablesOuter from "../table/TablesOuter";
import SearchBox from "../button/SearchBox"; // ✅ 검색창 추가
import DataCenterActionButtons from "./DataCenterActionButtons";
import TableRowClick from "../table/TableRowClick";
import { status2Icon } from "../icons/RutilVmIcons";
import Localization from "../../utils/Localization";
import SelectedIdView from "../common/SelectedIdView";
import Logger from "../../utils/Logger";
import { getStatusSortKey } from "../icons/GetStatusSortkey";

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
  refetch, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { datacentersSelected, setDatacentersSelected } = useGlobal();

  const transformedData = [...datacenters].map((dc) => {
    const status = dc?.status; // ✅ 먼저 선언해줌
    return {
      ...dc,
      _name: (
        <TableRowClick type="datacenter" id={dc?.id}>
          {dc?.name}
        </TableRowClick>
      ),
      icon: status2Icon(status),
      iconSortKey: getStatusSortKey(status), // ✅ 그 다음에 사용
      status: Localization.kr.renderStatus(status),
      storageType: dc?.storageType ? "로컬" : "공유됨",
      searchText: `${dc?.name} ${status} ${dc?.storageType ? "로컬" : "공유됨"}`,
    };
  });
  
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData, columns);

  const handleNameClick = useCallback((id) => {
    navigate(`/computing/datacenters/${id}/clusters`);
  }, [navigate])

  const handleRefresh = useCallback(() =>  {
    Logger.debug(`DataCenterDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch() 
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        <DataCenterActionButtons />
      </div>
      <TablesOuter target={"datacenter"}
        columns={columns}
        data={filteredData} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        multiSelect={true}
        onRowClick={(selectedRows) => setDatacentersSelected(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        /*onContextMenuItems={(row) => [
          <DataCenterActionButtons actionType="context"/>,
        ]}*/
      />
      <SelectedIdView items={datacentersSelected} />
    </>
  );
};

export default DataCenterDupl;
