import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TablesOuter from "../table/TablesOuter";
import SearchBox from "../button/SearchBox"; // ✅ 검색창 추가
import DataCenterActionButtons from "./DataCenterActionButtons";
import DataCenterModals from "../modal/datacenter/DataCenterModals";
import useSearch from "../button/useSearch";
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
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);
  const [selectedDataCenters, setSelectedDataCenters] = useState([]);

  const transformedData = datacenters.map((dc) => {
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
        {showSearchBox && (
          <SearchBox 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            onRefresh={handleRefresh}
          />
        )}
        <DataCenterActionButtons 
          openModal={openModal}
          isEditDisabled={selectedDataCenters.length !== 1}
          isDeleteDisabled={selectedDataCenters.length === 0}
        />
      </div>

      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        data={filteredData} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onRowClick={(selectedRows) => setSelectedDataCenters(selectedRows)}
        // clickableColumnIndex={[1]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        columns={columns}
        onContextMenuItems={(row) => [
          <DataCenterActionButtons
            openModal={(action) => {
              setSelectedDataCenters([row]);
              openModal(action);
            }}
            isEditDisabled={false}
            isDeleteDisabled={false}
            selectedDataCenters={[row]}
            actionType="context"
          />,
        ]}
      />
      <SelectedIdView items={selectedDataCenters} />

      {/* 데이터센터 모달창 */}
      <DataCenterModals
        activeModal={activeModal}
        dataCenter={activeModal === "edit" ? selectedDataCenters[0] : null}
        selectedDataCenters={selectedDataCenters}
        onClose={closeModal}
      />
    </div>
  );
};

export default DataCenterDupl;
