import { Suspense, useState } from "react";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import VmDeleteModal from "../../../components/modal/vm/VmDeleteModal";
import {
  renderUpDownStatusIcon,
  renderVmStatusIcon,
} from "../../../components/Icon";
import { useAllVmsFromNetwork } from "../../../api/RQHook";
import { convertBpsToMbps, convertBytesToMB } from "../../../util";
import FilterButton from "../../../components/button/FilterButton";
import ActionButton from "../../../components/button/ActionButton";

/**
 * @name NetworkVms
 * @description 네트워크에 종속 된 가상머신 목록
 *
 * @prop {string} networkId 네트워크 ID
 * @returns {JSX.Element} NetworkVms
 */
const NetworkVms = ({ networkId }) => {
  const {
    data: nics = [],
    isLoading: isNicsLoading,
    isError: isNicsError,
    isSuccess: isNicsSuccess,
  } = useAllVmsFromNetwork(networkId, (e) => ({ ...e }));

  const [activeFilter, setActiveFilter] = useState("running");
  const [selectedNics, setSelectedNics] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const selectedIds = (Array.isArray(selectedNics) ? selectedNics : [])
    .map((nic) => nic.id)
    .join(", ");

  // 필터링된 VM 데이터 계산
  const filteredVms = activeFilter === "running"
    ? nics.filter((nic) => nic?.vmViewVo?.status === "UP")
    : nics.filter((nic) => nic?.vmViewVo?.status !== "UP");

  const transformedFilteredData = filteredVms.map((nic) => {
    const vm = nic?.vmViewVo;
    return {
      ...nic,
      icon: renderVmStatusIcon(vm?.status),
      name: (
        <TableRowClick type="vms" id={vm?.id}>
          {vm?.name}
        </TableRowClick>
      ),
      fqdn: vm?.fqdn,
      ipAddress: vm?.ipv4 + "" + vm?.ipv6,
      vnicStatus: renderUpDownStatusIcon(nic?.status),
      vnic: nic?.name || "",
      vnicRx: (convertBpsToMbps(nic?.rxSpeed)),
      vnicTx: (convertBpsToMbps(nic?.txSpeed)),
      totalRx: nic?.rxTotalSpeed.toLocaleString(),
      totalTx: nic?.txTotalSpeed.toLocaleString(),
      Description: nic?.discription,
    };
  });

  const toggleDeleteModal = (isOpen) => setDeleteModalOpen(isOpen);

  const statusFilters = [
    { key: "running", label: "실행중" },
    { key: "stopped", label: "정지중" },
  ];

  console.log("...");
  return (
    <>
      <div className="header-right-btns">
        <ActionButton
          label="제거"
          actionType="default"
          onClick={() => toggleDeleteModal(true)}
          disabled={activeFilter !== "stopped" || !selectedNics.length} 
        />
      </div>

      <FilterButton options={statusFilters} activeOption={activeFilter} onClick={setActiveFilter} />
      <span>id = {selectedIds || ""}</span>

      <TablesOuter
        isLoading={isNicsLoading} isError={isNicsError} isSuccess={isNicsSuccess}
        columns={
          activeFilter === "running"
            ? TableColumnsInfo.VMS_UP_FROM_NETWORK
            : TableColumnsInfo.VMS_STOP_FROM_NETWORK
        }
        data={ transformedFilteredData }
        onRowClick={(rows) => {
          console.log("Selected Rows:", rows); // 선택된 데이터 확인
          setSelectedNics(Array.isArray(rows) ? rows : []);
        }}
      />

      {/* nic 를 삭제하는 코드를 넣어야함 */}
      {/* <Suspense>
        {isDeleteModalOpen && (
          <VmDeleteModal
            isOpen={isDeleteModalOpen}
            onRequestClose={() => toggleDeleteModal(false)}
            data={modalData}
            onClose={() => toggleDeleteModal(false)}
          />
        )}
      </Suspense> */}
    </>
  );
};

export default NetworkVms;
