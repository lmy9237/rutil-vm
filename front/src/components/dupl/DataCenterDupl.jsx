import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TablesOuter from "../table/TablesOuter";
import DataCenterActionButtons from "./DataCenterActionButtons";
import DataCenterModals from "../modal/datacenter/DataCenterModals";
import { renderDataCenterStatus, renderDatacenterStatusIcon } from "../Icon";
import TableRowClick from "../table/TableRowClick";
import useSearch from "../button/useSearch";

const DataCenterDupl = ({
  isLoading, isError, isSuccess,
  datacenters = [], columns = [],  showSearchBox = true,
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDataCenters, setSelectedDataCenters] = useState([]);


  const transformedData = datacenters.map((dc) => ({
    ...dc,
    _name: (
      <TableRowClick type="datacenter" id={dc?.id}>
        {dc?.name}
      </TableRowClick>
    ),
    icon: renderDatacenterStatusIcon(dc?.status),
    status: renderDataCenterStatus(dc?.status),
    storageType: dc?.storageType ? "로컬" : "공유됨",
    searchText: `${dc?.name} ${dc?.status} ${dc?.storageType ? "로컬" : "공유됨"}`,
  }));
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData, columns);


  const selectedIds = (
    Array.isArray(selectedDataCenters) ? selectedDataCenters : []
  )
    .map((dc) => dc.id)
    .join(", ");

  const handleNameClick = (id) =>
    navigate(`/computing/datacenters/${id}/clusters`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  //버튼 활성화 조건
  const status =
    selectedDataCenters.length === 0
      ? "none"
      : selectedDataCenters.length === 1
        ? "single"
        : "multiple";

  return (
    <>
      <DataCenterActionButtons openModal={openModal} status={status} />
      <span>ID: {selectedIds}</span>

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
            openModal={openModal}
            status={row?.status}
            selectedDataCenters={[row]}
            actionType="context"
          />,
        ]}
      />

      {/* 데이터센터 모달창 */}
      <DataCenterModals
        activeModal={activeModal}
        dataCenter={activeModal === "edit" ? selectedDataCenters[0] : null}
        selectedDataCenters={selectedDataCenters}
        onClose={closeModal}
      />
    </>
  );
};

export default DataCenterDupl;
