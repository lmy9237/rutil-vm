import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import useUIState from "../../../hooks/useUIState";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import SearchBox from "../../../components/button/SearchBox";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import FilterButtons from "../../../components/button/FilterButtons";
import ActionButton from "../../../components/button/ActionButton";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import SelectedIdView from "../../../components/common/SelectedIdView";
import { checkZeroSizeToMbps } from "../../../util";
import { useAllVmsFromNetwork } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

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
  const {
    datacentersSelected,
    networksSelected,
    vmsSelected, setVmsSelected
  } = useGlobal()
  const { activeModal, setActiveModal } = useUIState()
  const {
    data: vms = [],
    isLoading: isNicsLoading,
    isError: isNicsError,
    isSuccess: isNicsSuccess,
    refetch: refetchNics,
    isRefetching: isNicsRefetching,
  } = useAllVmsFromNetwork(networkId, (e) => ({ ...e }));

  const [activeFilter, setActiveFilter] = useState("running");

  // 필터링된 VM 데이터 계산
  const filteredVms = activeFilter === "running"
    ? [...vms].filter((nic) => nic?.vmViewVo?.status === "UP")
    : [...vms].filter((nic) => nic?.vmViewVo?.status !== "UP");

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

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedFilteredData);
  const handleRefresh = useCallback(() =>  {
    Logger.debug(`NetworkVms > handleRefresh ... `)
    if (!refetchNics) return;
    refetchNics()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <FilterButtons options={statusFilters} activeOption={activeFilter} onClick={setActiveFilter} />
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        <div className="header-right-btns">
          <ActionButton label={Localization.kr.REMOVE}
            onClick={() => setActiveModal(null)}
            disabled={activeFilter !== "stopped" || !vmsSelected.length} 
          />
        </div>
      </div>

      <TablesOuter target={"vm"}
        columns={
          activeFilter === "running"
            ? TableColumnsInfo.VMS_UP_FROM_NETWORK
            : TableColumnsInfo.VMS_STOP_FROM_NETWORK
        }
        data={filteredData}
        onRowClick={(rows) => setVmsSelected(rows)}
        isLoading={isNicsLoading} isRefetching={isNicsRefetching} isError={isNicsError} isSuccess={isNicsSuccess}
      />
      <SelectedIdView items={vmsSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.NETWORK}>${Localization.kr.NETWORK}>${networksSelected[0]?.name}`}
        path={`networks-virtual_machines;name=${networksSelected[0]?.name};dataCenter=${datacentersSelected[0]?.name}`}
      />
    </>
  );
};

export default NetworkVms;
