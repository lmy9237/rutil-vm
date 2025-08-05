import React from "react";
import Tippy from "@tippyjs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleDown, faArrowCircleUp, faPlug, faPlugCircleXmark} from "@fortawesome/free-solid-svg-icons";
import useUIState                       from "@/hooks/useUIState";
import useGlobal                        from "@/hooks/useGlobal";
import useSearch                        from "@/hooks/useSearch";
import { LoadingFetch }                 from "@/components/common/Loading";
import SelectedIdView                   from "@/components/common/SelectedIdView";
import OVirtWebAdminHyperlink           from "@/components/common/OVirtWebAdminHyperlink";
import SearchBox                        from "@/components/button/SearchBox";
import TableColumnsInfo                 from "@/components/table/TableColumnsInfo";
import TablesOuter                      from "@/components/table/TablesOuter";
import TableRowClick                    from "@/components/table/TableRowClick";
import NicActionButtons                 from "@/components/dupl/VmNicActionButtons";
import VmNicModals                      from "@/components/modal/vm/VmNicModals";
import {
  useNetworkInterfacesFromVM
} from "@/api/RQHook";
import {
  checkZeroSizeToMbps
} from "@/util";
import Localization                     from "@/utils/Localization";
import "./Vm.css"

/**
 * @name VmNics2
 * @description 가상에 종속 된 네트워크 인터페이스 목록
 * (/computing/vms/<VM_ID>/nics)
 * 
 * @param {string} vmId 가상머신 ID
 * @returns
 */
const VmNics2 = ({ 
  vmId
}) => {
  const {
    vmsSelected,
    nicsSelected, setNicsSelected
  } = useGlobal()

  const {
    data: nics = [],
    isLoading: isVmNicsLoading,
    isError: isVmNicsError,
    isSuccess: isVmNicsSuccess,
    isRefetching: isVmNicsRefetching,
    refetch: refetchVmNics,
  } = useNetworkInterfacesFromVM(vmId, (e) => ({ ...e }));

  const transformedData = nics
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((nic) => ({
      ...nic,
      id: nic?.id,
      name: nic?.name,
      _status: nic?.statusKr,
      _linked: 
        <FontAwesomeIcon
          icon={Boolean(nic?.linked) ? faArrowCircleUp : faArrowCircleDown}
          style={{ color: Boolean(nic?.linked) ? "#21c50b" : "#e80c0c", marginLeft: "0.3rem" }}
          fixedWidth
        />,
      // nic?.linked ? "연결됨": "연결해제됨",
      _plugged: 
        <FontAwesomeIcon
          icon={Boolean(nic?.plugged) ? faPlug : faPlugCircleXmark}
          style={{ color: Boolean(nic?.plugged) ? "#21c50b" : "#e80c0c", marginLeft: "0.3rem" }}
          fixedWidth
        />,
      // nic?.plugged ? "연결됨" : "연결 해제됨",
      ipv4: nic?.ipv4 || "해당 없음",
      ipv6: nic?.ipv6 || "해당 없음",
      macAddress : nic?.macAddress,
      network: (
        <TableRowClick type="network" id={nic?.networkVo?.id}>
          {nic?.networkVo?.name}
        </TableRowClick>
      ),
      vnicProfile : (
        <TableRowClick type="vnicProfile" id={nic?.vnicProfileVo?.id}>
          {nic?.vnicProfileVo?.name}
        </TableRowClick>
      ),
      interface_: nic?.interface_,
      portMirroring: nic?.portMirroring || "비활성화됨",
      guestInterfaceName: nic?.guestInterfaceName,
      speed: (
        <Tippy
          content={
            <div className="v-start w-full tooltip-content">
              <div>{Localization.kr.SPEED_RX}: {checkZeroSizeToMbps(nic?.rxSpeed)}</div>
              <div>{Localization.kr.SPEED_TX}: {checkZeroSizeToMbps(nic?.txSpeed)}</div>
              <div>{Localization.kr.TOTAL_BYTE_RX}: {nic?.rxTotalSpeed?.toLocaleString() ?? "0"}</div>
              <div>{Localization.kr.TOTAL_BYTE_TX}: {nic?.txTotalSpeed?.toLocaleString() ?? "0"}</div>
              <div>Rx 오류: {nic?.rxTotalError ?? "0"}</div>
              <div>Tx 오류: {nic?.txTotalError ?? "0"}</div>
            </div>
          }
          placement="top"
          animation="shift-away"
          theme="dark-tooltip"
          arrow={true}
          delay={[200, 0]}
          appendTo={() => document.body}
        >
          <div>{checkZeroSizeToMbps(nic?.speed) || "0"}</div>
        </Tippy>
      ),
      rxSpeed: checkZeroSizeToMbps(nic?.rxSpeed),
      txSpeed: checkZeroSizeToMbps(nic?.txSpeed),
      rxTotalSpeed: nic?.rxTotalSpeed?.toLocaleString() || "0",
      txTotalSpeed: nic?.txTotalSpeed?.toLocaleString() || "0",
      pkts: `${nic?.rxTotalError}` || "1",    
      searchText: `${nic?.id} ${nic?.name}`.toLowerCase(),
  }));

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);

  return (
    <>
      <div className="dupl-header-group f-start gap-4 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
          isLoading={isVmNicsLoading} isRefetching={isVmNicsRefetching} refetch={refetchVmNics}
        />
        <LoadingFetch isLoading={isVmNicsLoading} isRefetching={isVmNicsRefetching} />
        <NicActionButtons />
      </div>
      <TablesOuter target={"nic"} 
        columns={TableColumnsInfo.NICS2_FROM_VM}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        shouldHighlight1stCol={true}
        onRowClick={(selectedRows) => setNicsSelected(selectedRows)}
        isLoading={isVmNicsLoading} isRefetching={isVmNicsRefetching} isError={isVmNicsError} isSuccess={isVmNicsSuccess}
      />
      <SelectedIdView items={nicsSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.COMPUTING}>${Localization.kr.VM}>${vmsSelected[0]?.name}`}
        path={`vms-network_interfaces;name=${vmsSelected[0]?.name}`} 
      />
      <VmNicModals type="vm" resourceId={vmId} />
    </>
    
  );
};


export default VmNics2;
