import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VmActionButtons from "./VmActionButtons";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import VmModals from "../modal/vm/VmModals";
import { renderVmStatusIcon } from "../Icon";

const VmDupl = ({ vms = [], columns = [], actionType, status }) => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedVms, setSelectedVms] = useState([]);
  const selectedIds = (Array.isArray(selectedVms) ? selectedVms : [])
    .map((v) => v.id)
    .join(", ");

  const handleNameClick = (id) => navigate(`/computing/vms/${id}`);

  const openModal = (action) => setActiveModal(action);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <div onClick={(e) => e.stopPropagation()}>
        <VmActionButtons
          openModal={openModal}
          isEditDisabled={selectedVms.length !== 1}
          isDeleteDisabled={selectedVms.length === 0}
          status={selectedVms[0]?.status}
          selectedVms={selectedVms}
        />
        <span>id = {selectedIds || ""}</span>

        <TablesOuter
          columns={columns}
          data={vms.map((vm) => ({
            ...vm,
            icon: renderVmStatusIcon(vm.status),
            host: (
              <TableRowClick type="host" id={vm?.hostVo?.id}>
                {" "}
                {vm?.hostVo?.name}{" "}
              </TableRowClick>
            ),
            cluster: (
              <TableRowClick type="cluster" id={vm?.clusterVo?.id}>
                {vm?.clusterVo?.name}
              </TableRowClick>
            ),
            dataCenter: (
              <TableRowClick type="datacenter" id={vm?.dataCenterVo?.id}>
                {vm?.dataCenterVo?.name}{" "}
              </TableRowClick>
            ),
            ipv4: vm.ipv4 + " " + vm.ipv6,
            memoryUsage:
              vm.usageDto?.memoryPercent === null ||
              vm.usageDto?.memoryPercent === undefined
                ? ""
                : `${vm.usageDto.memoryPercent}%`,
            cpuUsage:
              vm.usageDto?.cpuPercent === null ||
              vm.usageDto?.cpuPercent === undefined
                ? ""
                : `${vm.usageDto.cpuPercent}%`,
            networkUsage:
              vm.usageDto?.networkPercent === null ||
              vm.usageDto?.networkPercent === undefined
                ? ""
                : `${vm.usageDto.networkPercent}%`,
          }))}
          shouldHighlight1stCol={true}
          onRowClick={(selectedRows) => setSelectedVms(selectedRows)}
          clickableColumnIndex={[1]}
          onClickableColumnClick={(row) => handleNameClick(row.id)}
          multiSelect={true}
        />

        {/* vm 모달 */}
        <VmModals
          activeModal={activeModal}
          vm={selectedVms[0]}
          selectedVms={selectedVms}
          onClose={closeModal}
        />
      </div>
    </>
  );
};

export default VmDupl;
