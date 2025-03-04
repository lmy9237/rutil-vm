import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DiskModals from "../modal/disk/DiskModals";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import DiskActionButtons from "./DiskActionButtons";
import { icon } from "../Icon";
import { checkZeroSizeToGB } from "../../util";

const DiskDupl = ({
  isLoading, isError, isSuccess,
  disks = [], columns = [], type = "disk",  showSearchBox = false,
}) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDisks, setSelectedDisks] = useState([]); // 다중 선택된 디스크
  const selectedIds = (Array.isArray(selectedDisks) ? selectedDisks : [])
    .map((disk) => disk.id)
    .join(", ");

  const handleNameClick = (id) => navigate(`/storages/disks/${id}`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  console.log("...")
  return (
    <div onClick={(e) => e.stopPropagation()}>
      {/* 테이블 외부 클릭 방지 */}
      <DiskActionButtons
        openModal={openModal}
        isEditDisabled={selectedDisks?.length !== 1}
        isDeleteDisabled={selectedDisks?.length === 0}
        status={selectedDisks[0]?.status}
      />
      <span style={{fontSize:"12px"}}>ID: {selectedIds}</span>
      {/* 타입값을 줘서 vmdisk와 disk구분해야할듯  */}
      <TablesOuter
        isLoading={isLoading} isError={isError} isSuccess={isSuccess}
        columns={columns} data={disks.map((d) => {
          if (type === "disk") {
            return {
              ...d,
              alias: d?.alias || d?.diskImageVo?.alias,
              icon: icon(d.status),
              storageDomain: (
                <TableRowClick type="domains" id={d?.storageDomainVo?.id}>
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
          } else if (type === "vm") {
            return {
              ...d,
              alias: d?.alias || d?.diskImageVo?.alias,
              icon: icon(d.status),
              storageDomain: (
                <TableRowClick
                  type="domains"
                  id={d?.diskImageVo?.storageDomainVo?.id}
                >
                  {d?.diskImageVo?.storageDomainVo?.name}
                </TableRowClick>
              ),
              storageType: d?.diskImageVo?.storageType,
            };
          }
        })}
        shouldHighlight1stCol={true}
        showSearchBox={showSearchBox}
        onRowClick={(selectedRows) => setSelectedDisks(selectedRows)}
        clickableColumnIndex={[0]}
        onClickableColumnClick={(row) => handleNameClick(row.id)}
        multiSelect={true}
        onContextMenuItems={(row) => [
          // 마우스 버튼
          <DiskActionButtons
            openModal={openModal}
            isEditDisabled={!row}
            type="context"
          />,
        ]}
      />
      {/* 디스크 모달창 */}
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
