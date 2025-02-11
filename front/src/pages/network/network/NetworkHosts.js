import React, { Suspense, useEffect, useState } from 'react';
import Loading from '../../../components/common/Loading';
import TablesOuter from "../../../components/table/TablesOuter";
import TableRowClick from '../../../components/table/TableRowClick';
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { renderHostStatusIcon, renderUpDownStatusIcon } from '../../../components/Icon';
import {
  useConnectedHostsFromNetwork,
  useDisconnectedHostsFromNetwork,
  useNetworkInterfaceFromHost
} from "../../../api/RQHook";
import { convertBytesToMB } from '../../../util';

const NetworkHostModal = React.lazy(() => import('../../../components/modal/network/NetworkHostModal'));

/**
 * @name NetworkHosts
 * @description 네트워크에 종속 된 호스트 목록
 *
 * @param {string} networkId 네트워크 ID
 * @returns
 *
 */
const NetworkHosts = ({ networkId }) => {
  const {
    data: connectedHosts = [],
    isLoading: isConnectedHostsLoading,
    isError: isConnectedHostsError,
    isSuccess: isConnectedHostsSuccess,
  } = useConnectedHostsFromNetwork(networkId, (e) => ({
    ...e
  }));
  
  const {
    data: disconnectedHosts = [], 
    isLoading: isDisconnectedHostsLoading,
    isError: isDisconnectedHostsError,
    isSuccess: isDisconnectedHostsSuccess,
  } = useDisconnectedHostsFromNetwork(networkId, (e) => ({ 
    ...e
  }));

  const [activeFilter, setActiveFilter] = useState("connected");
  const [selectedHost, setSelectedHost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedHostId = (Array.isArray(selectedHost) ? selectedHost : []).map((host) => host.id).join(', ');
  const buttonClass = (filter) => `filter_button ${activeFilter === filter ? "active" : ""}`;

  const transformHostData = (hosts) => {
    return hosts.map((host) => ({
      ...host,
      icon: renderHostStatusIcon(host?.status),
      host: <TableRowClick type="host" id={host?.id}>{host?.name}</TableRowClick>,
      cluster: <TableRowClick type="cluster" id={host?.clusterVo?.id}>{host?.clusterVo?.name}</TableRowClick>,
      dataCenter: <TableRowClick type="datacenter" id={host?.dataCenterVo?.id}>{host?.dataCenterVo?.name}</TableRowClick>,
      networkDeviceStatus: renderUpDownStatusIcon(host?.hostNicVos?.[0]?.status),
      networkDevice: host?.hostNicVos?.[0]?.name,
      speed: host?.hostNicVos?.[0]?.speed,
      rx: host?.hostNicVos?.[0]?.rxSpeed ? Math.round(convertBytesToMB(host.hostNicVos[0].rxSpeed)) : "",
      tx: host?.hostNicVos?.[0]?.txSpeed ? Math.round(convertBytesToMB(host.hostNicVos[0].txSpeed)) : "",
      totalRx: host?.hostNicVos?.[0]?.rxTotalSpeed ? host.hostNicVos[0].rxTotalSpeed.toLocaleString() : "",
      totalTx: host?.hostNicVos?.[0]?.txTotalSpeed ? host.hostNicVos[0].txTotalSpeed.toLocaleString() : "",
    }));
  };

  const {
    data: nics = [],
    isLoading: isNicsLoading,
    isError: isNicsError,
    isSuccess: isNicsSuccess,
  } = useNetworkInterfaceFromHost(selectedHostId, (e) => ({
    ...e,
  }));

  useEffect(() => {
    if (!isModalOpen) return;
    console.log((nics.length == 0) ? "NIC 데이터가 없습니다." : `NIC 데이터: ${nics}`);
  }, [nics, isModalOpen]);

  const renderModals = () => {
    if (!isModalOpen) {
      // 모달이 없음
      return null;
    }
    return (
      <Suspense fallback={<Loading />}>
        <NetworkHostModal
          nicData={nics}
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          hostId={selectedHostId}
        />
      </Suspense>
    );
  };

  console.log("...")
  return (
    <>
      <div className="header-right-btns">
        <button
          disabled={!selectedHostId} // selectedHost가 없으면 버튼 비활성화
          onClick={() => setIsModalOpen(true)}
        >
          호스트 네트워크 설정
        </button>
      </div>

      <div className="host-filter-btns">
        <button className={buttonClass("connected")} onClick={() => setActiveFilter("connected")}>
          연결됨
        </button>
        <button className={buttonClass("disconnected")} onClick={() => setActiveFilter("disconnected")}>
          연결 해제
        </button>
      </div>

      <span>id = {selectedHostId || ''}</span>

      <TablesOuter
        isLoading={activeFilter==="connected" ? isConnectedHostsLoading: isDisconnectedHostsLoading }
        isError={activeFilter==="connected" ? isConnectedHostsError : isDisconnectedHostsError }
        isSuccess={activeFilter==="connected" ? isConnectedHostsSuccess : isDisconnectedHostsSuccess }
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

      {/* 호스트 네트워크 모달창 */}
      {renderModals()}
    </>
  );
};

export default NetworkHosts;