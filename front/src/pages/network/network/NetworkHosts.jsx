import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TablesOuter from "../../../components/table/TablesOuter";
import TableRowClick from "../../../components/table/TableRowClick";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { checkZeroSizeToMbps } from "../../../util";
import FilterButton from "../../../components/button/FilterButton";
import ActionButton from "../../../components/button/ActionButton";
import Localization from "../../../utils/Localization";
import {
  useConnectedHostsFromNetwork,
  useDisconnectedHostsFromNetwork,
} from "../../../api/RQHook";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";
import SelectedIdView from "../../../components/common/SelectedIdView";


/**
 * @name NetworkHosts
 * @description 네트워크에 종속 된 호스트 목록
 *
 * @param {string} networkId 네트워크 ID
 * @returns {JSX.Element} NetworkHosts
 *
 */
const NetworkHosts = ({ networkId }) => {
  const navigate = useNavigate();
  const {
    data: connectedHosts = [],
    isLoading: isConnectedHostsLoading,
    isError: isConnectedHostsError,
    isSuccess: isConnectedHostsSuccess,
  } = useConnectedHostsFromNetwork(networkId, (e) => ({ ...e }));

  const {
    data: disconnectedHosts = [],
    isLoading: isDisconnectedHostsLoading,
    isError: isDisconnectedHostsError,
    isSuccess: isDisconnectedHostsSuccess,
  } = useDisconnectedHostsFromNetwork(networkId, (e) => ({ ...e }));

  const [activeFilter, setActiveFilter] = useState("connected");
  const [selectedHost, setSelectedHost] = useState(null);

  const selectedHostId = (Array.isArray(selectedHost) ? selectedHost : []).map((host) => host.id).join(", ");
  // const buttonClass = (filter) =>
  //   `filter_button ${activeFilter === filter ? "active" : ""}`;

  const transformHostData = (hosts) => {
    return hosts.map((host) => ({
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
      networkDeviceStatus: status2Icon(host?.hostNicVos[0]?.status),
      networkDevice: host?.hostNicVos[0]?.name,
      speed: checkZeroSizeToMbps(host?.hostNicVos[0]?.speed),
      rx: checkZeroSizeToMbps(host?.hostNicVos[0]?.rxSpeed),
      tx: checkZeroSizeToMbps(host?.hostNicVos[0]?.txSpeed),
      totalRx: host?.hostNicVos[0]?.rxTotalSpeed.toLocaleString(),
      totalTx: host.hostNicVos[0].txTotalSpeed.toLocaleString(),
    }));
  };

  const connectionFilters = [
    { key: "connected", label: "연결됨" },
    { key: "disconnected", label: "연결 해제" },
  ];

  Logger.debug("...");
  return (
    <>
      <div className="header-right-btns">
      <ActionButton
  label={`${Localization.kr.HOST} 네트워크 설정`}
  actionType="default"
  onClick={() => {
    if (selectedHostId) {
      navigate(`/computing/hosts/${selectedHostId}/nics`);
    }
  }}
  disabled={!selectedHostId}
/>
      </div>
      <FilterButton options={connectionFilters} activeOption={activeFilter} onClick={setActiveFilter} />

      <TablesOuter
        isLoading={activeFilter === "connected" ? isConnectedHostsLoading: isDisconnectedHostsLoading}
        isError={ activeFilter === "connected" ? isConnectedHostsError : isDisconnectedHostsError }
        isSuccess={ activeFilter === "connected" ? isConnectedHostsSuccess : isDisconnectedHostsSuccess }
        columns={
          activeFilter === "connected"
            ? TableColumnsInfo.HOSTS_FROM_NETWORK
            : TableColumnsInfo.HOSTS_DISCONNECT_FROM_NETWORK
        }
        data={
          activeFilter === "connected"
            ? transformHostData(connectedHosts)
            : transformHostData(disconnectedHosts)
        }
        onRowClick={(row) => setSelectedHost(row)}
        // onContextMenuItems={(row) => [
        //   <div className='right-click-menu-box'>
        //     <button
        //     onClick={() => setIsModalOpen(true)}
        //     className='right-click-menu-btn'
        //     disabled={!selectedHost} // selectedHost가 없으면 버튼 비활성화
        //   >
        //     호스트 네트워크 설정
        //   </button>
        // </div>
        // ]}
      />

      <SelectedIdView items={selectedHost} />
    </>
  );
};

export default NetworkHosts;
