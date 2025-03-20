import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import VmDiskModals from "../modal/vm/VmDiskModals";
import VmDiskActionButtons from "./VmDiskActionButtons";
import { renderTFStatusIcon } from "../Icon";
import { checkZeroSizeToGB } from "../../util";
import { useVmById } from "../../api/RQHook";
import SearchBox from "../button/SearchBox";
import useSearch from "../button/useSearch";

/**
 * @name VmDiskDupl
 * @description ...
 *
 * @param {Array} vmDisks
 * @returns
 */
const VmDiskDupl = ({ 
  isLoading, isError, isSuccess,
  vmDisks = [], columns = [], vmId,  showSearchBox =true
}) => {
  const { 
    data: vm
    
  }  = useVmById(vmId);
  
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDisks, setSelectedDisks] = useState([]); // 다중 선택된 디스크
  const selectedIds = (Array.isArray(selectedDisks) ? selectedDisks : []).map((disk) => disk.id).join(", ");

  const handleNameClick = (id) => navigate(`/storages/disks/${id}`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  const transformedData = vmDisks.map((d) => {
    const diskImage = d?.diskImageVo;
    return {
      ...d,
      icon: renderTFStatusIcon(d?.active),
      _alias: (
        <TableRowClick type="disks" id={diskImage?.id}>
          {diskImage?.alias}
        </TableRowClick>
      ),
      connectionvm: vm?.name || "",
      description: diskImage?.description,
      bootable: d?.bootable ? "예" : "",
      readOnly: d?.readOnly ? "예" : "",
      sharable: diskImage?.sharable ? "예" : "",
      status: diskImage?.status,
      interface: d?.interface_,
      storageType: diskImage?.storageType,
      sparse: diskImage?.sparse ? "씬 프로비저닝" : "사전 할당",
      virtualSize: checkZeroSizeToGB(diskImage?.virtualSize),
      actualSize: checkZeroSizeToGB(diskImage?.actualSize),
      storageDomain: (
        <TableRowClick type="domains" id={diskImage?.storageDomainVo?.id}>
          {diskImage?.storageDomainVo?.name}
        </TableRowClick>
      ),
      // ✅ 검색을 위한 text 필드 추가
      searchText: `${diskImage?.alias} ${diskImage?.storageDomainVo?.name || ""} ${vm?.name || ""}`.toLowerCase(),
    };
  });

  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="dupl-header-group">
        {showSearchBox && (
          <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        )}
        <VmDiskActionButtons
          openModal={openModal}
          isEditDisabled={selectedDisks?.length !== 1}
          isDeleteDisabled={selectedDisks?.length === 0}
          status={selectedDisks[0]?.active ? "active" : "deactive"}
          selectedDisks={selectedDisks}
        />
      </div>
      <span style={{fontSize:"16px"}}>ID: {selectedIds || ""}</span>
      
      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={columns}
        data={filteredData}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setSelectedDisks(selectedRows)}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        // onContextMenuItems={(row) => [ // 마우스 버튼
        //   <VmDiskActionButtons
        //     openModal={openModal}
        //     isEditDisabled={!row}
        //     type='context'
        //   />
        // ]}
      />
      {/* 디스크 모달창 */}
      <Suspense>
        <VmDiskModals
          activeModal={activeModal}
          disk={selectedDisks[0]}
          selectedDisks={selectedDisks}
          vmId={vmId}
          onClose={closeModal}
        />
      </Suspense>
    </div>
  );
};

export default VmDiskDupl;
