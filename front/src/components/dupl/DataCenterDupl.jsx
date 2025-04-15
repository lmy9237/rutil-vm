import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useUIState from "../../hooks/useUIState";
import useGlobal from "../../hooks/useGlobal";
import useSearch from "../../hooks/useSearch";
import TablesOuter from "../table/TablesOuter";
import SearchBox from "../button/SearchBox"; // ✅ 검색창 추가
import DataCenterActionButtons from "./DataCenterActionButtons";
import DataCenterModals from "../modal/datacenter/DataCenterModals";
import TableRowClick from "../table/TableRowClick";
import { status2Icon } from "../icons/RutilVmIcons";
import Localization from "../../utils/Localization";
import SelectedIdView from "../common/SelectedIdView";
import Logger from "../../utils/Logger";
import { getStatusSortKey } from "../icons/GetStatusSortkey";

const DataCenterDupl = ({
  datacenters = [], columns = [], showSearchBox = true,
  refetch, isLoading, isError, isSuccess,
}) => {
  const navigate = useNavigate();
  const { activeModal, setActiveModal } = useUIState();
  const { datacentersSelected, setDatacentersSelected } = useGlobal();

  const transformedData = (!Array.isArray(datacenters) ? [] : datacenters).map((dc) => {
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

  const handleNameClick = (id) => navigate(`/computing/datacenters/${id}/clusters`);
  const handleRefresh = () =>  {
    Logger.debug(`DataCenterDupl > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group f-start">
        {showSearchBox && (<SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />)}
        <DataCenterActionButtons actionType="default" />
      </div>

      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        data={filteredData} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onRowClick={(selectedRows) => setDatacentersSelected(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        columns={columns}
        onContextMenuItems={(row) => [
          <DataCenterActionButtons actionType="context" />,
        ]}
      />
      <SelectedIdView items={datacentersSelected} />

      {/* 데이터센터 모달창 */}
      <DataCenterModals dataCenter={activeModal() === "edit" ? datacentersSelected[0] : null} />
    </div>
  );
};

export default DataCenterDupl;
