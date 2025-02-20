import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import VmDiskModals from "../modal/vm/VmDiskModals";
import VmDiskActionButtons from "./VmDiskActionButtons";
import { renderTFStatusIcon } from "../Icon";
import { checkZeroSizeToGB } from "../../util";

/**
 * @name VmDiskDupl
 * @description ...
 *
 * @param {Array} vmDisks
 * @returns
 */
const VmDiskDupl = ({ 
  isLoading, isError, isSuccess,
  vmDisks = [], columns = [], vm,
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDisks, setSelectedDisks] = useState([]); // 다중 선택된 디스크
  const selectedIds = (Array.isArray(selectedDisks) ? selectedDisks : []).map((disk) => disk.id).join(", ");

  const handleNameClick = (id) => navigate(`/storages/disks/${id}`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <VmDiskActionButtons
        openModal={openModal}
        isEditDisabled={selectedDisks?.length !== 1}
        isDeleteDisabled={selectedDisks?.length === 0}
        status={selectedDisks[0]?.active ? "active" : "deactive"}
        selectedDisks={selectedDisks}
      />
      <span>ID: {selectedIds || ""}</span>
      
      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={columns}
        data={vmDisks.map((d) => {
          return {
            ...d,
            icon: renderTFStatusIcon(d?.active),
            alias: (
              <TableRowClick type="disks" id={d?.diskImageVo?.id}>
                {d?.diskImageVo?.alias}
              </TableRowClick>
            ),
            connectionvm: vm?.name || "",
            description: d?.diskImageVo?.description,
            bootable: d?.bootable ? "예" : "",
            readOnly: d?.readOnly ? "예" : "",
            sharable: d?.diskImageVo?.sharable ? "예" : "",
            status: d?.diskImageVo?.status,
            interface: d?.interface_,
            storageType: d?.diskImageVo?.storageType,
            sparse: d?.diskImageVo?.sparse ? "씬 프로비저닝" : "사전 할당",
            virtualSize: checkZeroSizeToGB(d?.diskImageVo?.virtualSize),
            actualSize: checkZeroSizeToGB(d?.diskImageVo?.actualSize),
            storageDomain: (
              <TableRowClick type="domains" id={d?.diskImageVo?.storageDomainVo?.id}>
                {d?.diskImageVo?.storageDomainVo?.name}
              </TableRowClick>
            ),
          };
        })}
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
          vmId={vm?.id}
          onClose={closeModal}
        />
      </Suspense>
    </div>
  );
};

export default VmDiskDupl;
