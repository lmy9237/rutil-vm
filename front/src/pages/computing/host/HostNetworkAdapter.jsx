import React from "react";
import { useNetworkInterfacesFromHost } from "../../../api/RQHook";
import { checkZeroSizeToMbps } from "../../../util";
import TablesOuter from "../../../components/table/TablesOuter";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TableRowClick from "../../../components/table/TableRowClick";

const HostNetworkAdapter = ({ hostId }) => {
  // const { data: host } = useHost(hostId);
  const { 
    data: hostNics = [],
    isLoading: isHostNicsLoading,
    isError: isHostNicsError,
    isSuccess: isHostNicsSuccess,
    refetch: refetchHostNics,
  } = useNetworkInterfacesFromHost(hostId, (e) => ({ ...e }));

  const transformedData = hostNics.map((e) => ({
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
    status: e?.status,
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
  
  return (
    <div onClick={(e) => e.stopPropagation()}>
      {/* <div className="dupl-header-group f-start">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh}/>
      </div> */}
      <br/>
      <TablesOuter target={"hostnic"}
        columns={TableColumnsInfo.NETWORK_ADAPTER_FROM_HOST}
        data={transformedData}
        shouldHighlight1stCol={true}
        multiSelect={true}
        refetch={refetchHostNics}
        isLoading={isHostNicsLoading} isError={isHostNicsError} isSuccess={isHostNicsSuccess}
      />
      {/* <SelectedIdView items={hostDevicesSelected}/> */}
    </div>
  );
}

export default HostNetworkAdapter;