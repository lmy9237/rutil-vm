import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DiskModals from "../modal/disk/DiskModals";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import DiskActionButtons from "./DiskActionButtons";
import { icon } from "../Icon";
import { checkZeroSizeToGB } from "../../util";
import SearchBox from "../button/SearchBox"; // ✅ 검색창 추가
import useSearch from "../button/useSearch"; // ✅ 검색 기능 추가

const DiskDupl = ({
  isLoading, isError, isSuccess,
  disks = [], columns = [], type = "disk", showSearchBox = true
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDisks, setSelectedDisks] = useState([]);

  // ✅ 데이터 변환: 검색이 가능하도록 `searchText` 추가
  const transformedData = disks.map((d) => {
    let diskData = {
      ...d,
      _alias: (
        <TableRowClick type="disk" id={d?.id}>
          {d?.alias || d?.diskImageVo?.alias}
        </TableRowClick>
      ),
      icon: icon(d.status),
      storageDomain: (
        <TableRowClick type="domain" id={d?.storageDomainVo?.id}>
          {d?.storageDomainVo?.name}
        </TableRowClick>
      ),
      sharable: d?.sharable ? "O" : "",
      icon1: d?.bootable ? "🔑" : "",
      icon2: d?.readOnly ? "🔒" : "",
      sparse: d?.sparse ? "씬 프로비저닝" : "사전 할당",
      connect: (
        <TableRowClick
          type={d?.connectVm?.id ? "vms" : "templates"}
          id={d?.connectVm?.id || d?.connectTemplate?.id}
        >
          {d?.connectVm?.name || d?.connectTemplate?.name}
        </TableRowClick>
      ),
      virtualSize: checkZeroSizeToGB(d?.virtualSize),
      actualSize: checkZeroSizeToGB(d?.actualSize),
    };

    // ✅ 검색 필드 추가 (모든 데이터를 하나의 문자열로 만듦)
    diskData.searchText = `${diskData.alias} ${diskData.sparse} ${diskData.virtualSize} ${diskData.actualSize}`;

    return diskData;
  });

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  const selectedIds = (
    Array.isArray(selectedDisks) ? selectedDisks : []
  ).map((d) => d.id).join(", ");

  const handleNameClick = (id) => navigate(`/storages/disks/${id}`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group">
        {/* 검색창 추가 */}
        {showSearchBox && (
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}

        <span>ID: {selectedIds}</span>
        <DiskActionButtons
          openModal={openModal}
          isEditDisabled={selectedDisks.length !== 1}
          isDeleteDisabled={selectedDisks.length === 0}
          status={selectedDisks[0]?.status}
        />
      </div>
      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        data={filteredData} // ✅ 검색된 데이터만 표시
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRowClick={(selectedRows) => setSelectedDisks(selectedRows)}
        // clickableColumnIndex={[0]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        columns={columns}
        onContextMenuItems={(row) => [
          <DiskActionButtons
            openModal={openModal}
            status={row?.status}
            selectedDisks={[row]}
            actionType="context"
          />,
        ]}
      />

      <DiskModals
        activeModal={activeModal}
        selectedDisks={selectedDisks}
        disk={activeModal === "edit" ? selectedDisks[0] : null}
        onClose={closeModal}
      />
    </div>
  );
};

export default DiskDupl;
