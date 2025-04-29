import { useCallback, useState } from "react";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import { useAllVmsFromNetwork } from "../../../api/RQHook";
import { checkZeroSizeToMbps } from "../../../util";
import FilterButtons from "../../../components/button/FilterButtons";
import ActionButton from "../../../components/button/ActionButton";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import SelectedIdView from "../../../components/common/SelectedIdView";
import useGlobal from "../../../hooks/useGlobal";
import Localization from "../../../utils/Localization";
import useUIState from "../../../hooks/useUIState";
import Logger from "../../../utils/Logger";
import useSearch from "../../../hooks/useSearch";
import SearchBox from "../../../components/button/SearchBox";
import toast from "react-hot-toast";

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
  const { vmsSelected, setVmsSelected } = useGlobal()
  const { activeModal, setActiveModal } = useUIState()
  const {
    data: vms = [],
    isLoading: isNicsLoading,
    isError: isNicsError,
    isSuccess: isNicsSuccess,
    refetch: refetchVms,
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
    if (!refetchVms) return;
    refetchVms()
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
        isLoading={isNicsLoading} isError={isNicsError} isSuccess={isNicsSuccess}
      />
      <SelectedIdView items={vmsSelected} />
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
