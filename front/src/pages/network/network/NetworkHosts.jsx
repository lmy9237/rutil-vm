import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobal from "../../../hooks/useGlobal";
import useSearch from "../../../hooks/useSearch";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import SelectedIdView from "../../../components/common/SelectedIdView";
import SearchBox from "../../../components/button/SearchBox";
import TablesOuter from "../../../components/table/TablesOuter";
import TableRowClick from "../../../components/table/TableRowClick";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import { checkZeroSizeToMbps } from "../../../util";
import FilterButtons from "../../../components/button/FilterButtons";
import ActionButton from "../../../components/button/ActionButton";
import Localization from "../../../utils/Localization";
import {
  useConnectedHostsFromNetwork,
  useDisconnectedHostsFromNetwork,
} from "../../../api/RQHook";
import Logger from "../../../utils/Logger";
import toast from "react-hot-toast";


/**
 * @name NetworkHosts
 * @description 네트워크에 종속 된 호스트 목록
 *
 * @param {string} networkId 네트워크 ID
 * @returns {JSX.Element} NetworkHosts
 *
 */
const NetworkHosts = ({ 
  networkId
}) => {
  const navigate = useNavigate();
  const {
    datacentersSelected,
    networksSelected,
    hostsSelected, setHostsSelected,
  } = useGlobal()
  const [activeFilter, setActiveFilter] = useState("connected");

  const {
    data: connectedHosts = [],
    isLoading: isConnectedHostsLoading,
    isError: isConnectedHostsError,
    isSuccess: isConnectedHostsSuccess,
    refetch: refetchConnectedHosts,
  } = useConnectedHostsFromNetwork(networkId, (e) => ({ ...e }));

  const {
    data: disconnectedHosts = [],
    isLoading: isDisconnectedHostsLoading,
    isError: isDisconnectedHostsError,
    isSuccess: isDisconnectedHostsSuccess,
    refetch: refetchDisconnectedHosts,
  } = useDisconnectedHostsFromNetwork(networkId, (e) => ({ ...e }));

  const selectedHostId = [...hostsSelected][0]?.id

  const connectionFilters = [
    { key: "connected", label: "연결됨" },
    { key: "disconnected", label: "연결 해제" },
  ];
  
  const transformHostData = (hosts) => {
    return hosts.map((host) => {
      const baseData = {
        ...host,
        icon: status2Icon(host?.status),
        host: ( 
          <TableRowClick type="host" id={host?.id}>
            {host?.name}
          </TableRowClick>
        ),
        cluster: (
          <TableRowClick type="cluster" id={host?.clusterVo?.id}>
            {host?.clusterVo?.name}
          </TableRowClick>
        ),
        dataCenter: (
          <TableRowClick type="datacenter" id={host?.dataCenterVo?.id}>
            {host?.dataCenterVo?.name}
          </TableRowClick>
        ),
      };
  
      if (activeFilter === "connected") {
        return {
          ...baseData,
          networkDeviceStatus: status2Icon(host?.hostNicVos[0]?.status),
          networkDevice: host?.hostNicVos[0]?.name,
          speed: checkZeroSizeToMbps(host?.hostNicVos[0]?.speed),
          rx: checkZeroSizeToMbps(host?.hostNicVos[0]?.rxSpeed),
          tx: checkZeroSizeToMbps(host?.hostNicVos[0]?.txSpeed),
          totalRx: host?.hostNicVos[0]?.rxTotalSpeed?.toLocaleString?.() || "0",
          totalTx: host?.hostNicVos[0]?.txTotalSpeed?.toLocaleString?.() || "0",
        };
      }
  
      return baseData;
    });
  };  
  // ✅ 검색 기능 적용
  const { searchQuery, setSearchQuery, filteredData } = useSearch(
    activeFilter === "connected"
      ? transformHostData(connectedHosts)
      : transformHostData(disconnectedHosts)
  );
  const handleRefresh = useCallback(() =>  {
    Logger.debug(`NetworkHosts > handleRefresh ... `)
    activeFilter === "connected" ? refetchConnectedHosts() : refetchDisconnectedHosts()
    import.meta.env.DEV && toast.success("다시 조회 중 ...")
  }, [])

  return (
    <>{/* v-start w-full으로 묶어짐*/}
      <div className="dupl-header-group f-start gap-4 w-full">
        <FilterButtons options={connectionFilters} activeOption={activeFilter} onClick={setActiveFilter} />
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} onRefresh={handleRefresh} />
        <div className="header-right-btns">
          <ActionButton
            label={`${Localization.kr.HOST} ${Localization.kr.NETWORK} 설정`}
            actionType="default"
            onClick={() => {
              if (selectedHostId) {
                navigate(`/computing/hosts/${selectedHostId}/nics`);
              }
            }}
            disabled={!selectedHostId}
          />
        </div>
      </div>

      <TablesOuter target={"host"}
        columns={
          activeFilter === "connected"
            ? TableColumnsInfo.HOSTS_FROM_NETWORK
            : TableColumnsInfo.HOSTS_DISCONNECT_FROM_NETWORK
        }
        data={filteredData}
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        multiSelect={true}
        shouldHighlight1stCol={true}
        onRowClick={(row) => setHostsSelected(row)}
        refetch={activeFilter === "connected" ? refetchConnectedHosts : refetchDisconnectedHosts}
        isLoading={activeFilter === "connected" ? isConnectedHostsLoading: isDisconnectedHostsLoading}
        isError={activeFilter === "connected" ? isConnectedHostsError : isDisconnectedHostsError }
        isSuccess={activeFilter === "connected" ? isConnectedHostsSuccess : isDisconnectedHostsSuccess }
      />
      <SelectedIdView items={hostsSelected} />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.NETWORK}>${Localization.kr.NETWORK}>${networksSelected[0]?.name}`}
        path={`networks-hosts;name=${networksSelected[0]?.name};dataCenter=${datacentersSelected[0]?.name}`}
      />
    </>
  );
};

export default NetworkHosts;
