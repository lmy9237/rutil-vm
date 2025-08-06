import { useCallback, useState } from "react";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import useSearch                        from "@/hooks/useSearch";
import { Loading, LoadingFetch }        from "@/components/common/Loading";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import { ActionButton }                 from "@/components/button/ActionButtons";
import SearchBox                        from "@/components/button/SearchBox";
import FilterButtons                    from "@/components/button/FilterButtons";
import TableColumnsInfo                 from "@/components/table/TableColumnsInfo";
import TablesOuter                      from "@/components/table/TablesOuter";
import TableRowClick                    from "@/components/table/TableRowClick";
import { status2Icon }                  from "@/components/icons/RutilVmIcons";
import {
  useAllVmsFromNetwork
} from "@/api/RQHook";
import {
  checkZeroSizeToMbps
} from "@/util";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

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
    ? [...vms].filter((nic) => nic?.vmVo?.status === "up")
    : [...vms].filter((nic) => nic?.vmVo?.status !== "up");

  const transformedData = [...vms].map((nic) => {
    const vm = nic?.vmVo;
    return {
      ...nic,
      icon: status2Icon(vm?.status),
      _name: (
        <TableRowClick type="vm" id={vm?.id} hideIcon>
          {vm?.name}
        </TableRowClick>
      ),
      fqdn: vm?.fqdn,
      ipAddress: `${nic?.ipv4 || ""} ${nic?.ipv6 || ""}`,
      vnicStatus: status2Icon(nic?.status),
      vnic: nic?.name || "",
      vnicRx: checkZeroSizeToMbps(nic?.rxSpeed),
      vnicTx: checkZeroSizeToMbps(nic?.txSpeed),
      totalRx: nic?.rxTotalSpeed.toLocaleString(),
      totalTx: nic?.txTotalSpeed.toLocaleString(),
      description: vm?.description,
    };
  });

  const vmStatusFilters = [
    { key: "up",   label: "실행 중", icon: status2Icon("up") },
    { key: "down", label: "정지 중", icon: status2Icon("down") },
  ];
  const {
    searchQuery, setSearchQuery, 
    filterType, setFilterType,
    filteredData
  } = useSearch(transformedData, "vmVo.status", "up");

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
          isLoading={isNicsLoading} isRefetching={isNicsRefetching} refetch={refetchNics}
        />
        <FilterButtons options={vmStatusFilters} activeOption={filterType} onClick={setFilterType} />
        <LoadingFetch isLoading={isNicsLoading} isRefetching={isNicsRefetching} />
        {/* 
        <FilterButtons options={vmStatusFilters} activeOption={activeFilter} onClick={setActiveFilter} />
        <div className="header-right-btns">
          <ActionButton label={Localization.kr.REMOVE}
            onClick={() => setActiveModal(null)}
            disabled={activeFilter !== "stopped" || !vmsSelected.length} 
          />
        </div> */}
      </div>

      <TablesOuter target={"vm"}
        columns={
          activeFilter === "running"
            ? TableColumnsInfo.VMS_UP_FROM_NETWORK
            : TableColumnsInfo.VMS_STOP_FROM_NETWORK
        }
        data={filteredData}
        onRowClick={(rows) => setVmsSelected(rows)}
        selectedRowIds={vmsSelected.map((vm) => vm.id)}
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
