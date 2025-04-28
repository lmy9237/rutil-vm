import { useState } from "react";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import { useAllVmsFromNetwork } from "../../../api/RQHook";
import { checkZeroSizeToMbps } from "../../../util";
import FilterButtons from "../../../components/button/FilterButtons";
import ActionButton from "../../../components/button/ActionButton";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";
import SelectedIdView from "../../../components/common/SelectedIdView";
import useGlobal from "../../../hooks/useGlobal";
import Localization from "../../../utils/Localization";
import useUIState from "../../../hooks/useUIState";

/**
 * @name NetworkVms
 * @description 네트워크에 종속 된 가상머신 목록
 *
 * @prop {string} networkId 네트워크 ID
 * @returns {JSX.Element} NetworkVms
 */
const NetworkVms = ({
  networkId
}) => {
  const { activeModal, setActiveModal } = useUIState()
  const { nicsSelected, setNicsSelected } = useGlobal()
  const {
    data: nics = [],
    isLoading: isNicsLoading,
    isError: isNicsError,
    isSuccess: isNicsSuccess,
  } = useAllVmsFromNetwork(networkId, (e) => ({ ...e }));

  const [activeFilter, setActiveFilter] = useState("running");

  // 필터링된 VM 데이터 계산
  const filteredVms = activeFilter === "running"
    ? [...nics].filter((nic) => nic?.vmViewVo?.status === "UP")
    : [...nics].filter((nic) => nic?.vmViewVo?.status !== "UP");

  const transformedFilteredData = [...filteredVms].map((nic) => {
    const vm = nic?.vmViewVo;
    return {
      ...nic,
      icon: status2Icon(vm?.status),
      _name: (
        <TableRowClick type="vm" id={vm?.id}>
          {vm?.name}
        </TableRowClick>
      ),
      fqdn: vm?.fqdn,
      ipAddress: vm?.ipv4 + "" + vm?.ipv6,
      vnicStatus: status2Icon(nic?.status),
      vnic: nic?.name || "",
      vnicRx: checkZeroSizeToMbps(nic?.rxSpeed),
      vnicTx: checkZeroSizeToMbps(nic?.txSpeed),
      totalRx: nic?.rxTotalSpeed.toLocaleString(),
      totalTx: nic?.txTotalSpeed.toLocaleString(),
      Description: nic?.discription,
    };
  });

  const statusFilters = [
    { key: "running", label: "실행중" },
    { key: "stopped", label: "정지중" },
  ];

  Logger.debug("NetworkVms...");
  return (
    <>
      <div className="header-right-btns no-search-box" style={{justifyContent:'space-between'}}>
        <FilterButtons options={statusFilters} activeOption={activeFilter} onClick={setActiveFilter} />
        <ActionButton label={Localization.kr.REMOVE}
          onClick={() => setActiveModal(null)}
          disabled={activeFilter !== "stopped" || !nicsSelected.length} 
        />
      </div>

      <TablesOuter
        columns={
          activeFilter === "running"
            ? TableColumnsInfo.VMS_UP_FROM_NETWORK
            : TableColumnsInfo.VMS_STOP_FROM_NETWORK
        }
        data={transformedFilteredData}
        onRowClick={(rows) => setNicsSelected(rows)}
        isLoading={isNicsLoading} isError={isNicsError} isSuccess={isNicsSuccess}
      />

      <SelectedIdView items={nicsSelected} />

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
