import React from "react";
import useGlobal               from "@/hooks/useGlobal";
import useSearch               from "@/hooks/useSearch";
import SelectedIdView from "../../../components/common/SelectedIdView";
import SearchBox from "../../../components/button/SearchBox";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";
import { checkZeroSizeToMbps } from "../../../util";
import { useNetworkInterfacesFromHost } from "../../../api/RQHook";
import { RVI16, rvi16TriangleDown, rvi16TriangleUp } from "@/components/icons/RutilVmIcons";

const HostNetworkAdapter = ({
  hostId
}) => {
  const { nicsSelecteed, setNicsSelected } = useGlobal()
  // const { data: host } = useHost(hostId);
  const { 
    data: hostNics = [],
    isLoading: isHostNicsLoading,
    isError: isHostNicsError,
    isSuccess: isHostNicsSuccess,
    refetch: refetchHostNics,
    isRefetching: isHostNicsRefetching,
  } = useNetworkInterfacesFromHost(hostId, (e) => ({ ...e }));

  const transformedData = hostNics
  .sort((a, b) => { return a.name.localeCompare(b.name) })
  .map((e) => ({
    ...e,
    id: e?.id,
    name: e?.name,
    bondingVo: {
      // ...e?.bondingVo,
      activeSlave: {
        id: e?.bondingVo?.activeSlave?.id, 
        name: e?.bondingVo?.activeSlave?.name
      },
      slaves: e?.bondingVo?.slaves?.map((slave) => ({
        id: slave.id,
        name: slave.name,
      })),
    },
    bridged: e?.bridged,
    ipv4BootProtocol: e?.bootProtocol,
    ipv4Address: e?.ip?.address,
    ipv4Gateway: e?.ip?.gateway,
    ipv4Netmask: e?.ip?.netmask,
    ipv6BootProtocol: e?.ipv6BootProtocol,
    ipv6Address: e?.ipv6?.address,
    ipv6Gateway: e?.ipv6?.gateway,
    ipv6Netmask: e?.ipv6?.netmask,
    macAddress: e?.macAddress,
    mtu: e?.mtu,
    autoNegotiation: "자동 협상",
    icon: <RVI16 iconDef={e?.status === "UP" ? rvi16TriangleUp() : rvi16TriangleDown()} className="mr-0.5" />,
    network: (
      <TableRowClick type="network" id={e?.networkVo?.id}>
        {e?.networkVo?.name}
      </TableRowClick>
    ),
    speed: checkZeroSizeToMbps(e?.speed),
    rxSpeed: checkZeroSizeToMbps(e?.rxSpeed),
    txSpeed: checkZeroSizeToMbps(e?.txSpeed),
    rxTotalSpeed: e?.rxTotalSpeed?.toLocaleString() || "0",
    txTotalSpeed: e?.txTotalSpeed?.toLocaleString() || "0",
    pkts: `${e?.rxTotalError} Pkts` || "1 Pkts",
  }));

  const { searchQuery, setSearchQuery, filteredData } = useSearch(transformedData);
  
  return (
    <>
      <div className="dupl-header-group f-start gap-2 w-full">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} refetch={refetchHostNics}/>
        {/*  */}
      </div>
      <TablesOuter target={"hostnic"}
        columns={TableColumnsInfo.NETWORK_ADAPTER_FROM_HOST}
        data={filteredData}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        shouldHighlight1stCol={true}
        multiSelect={true}
        onRowClick={(selectedRows) => setNicsSelected(selectedRows)}
        isLoading={isHostNicsLoading} isRefetching={isHostNicsRefetching} isError={isHostNicsError} isSuccess={isHostNicsSuccess}
      />
      <SelectedIdView items={nicsSelecteed}/>
    </>
  );
}

export default HostNetworkAdapter;