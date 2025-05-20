import React from "react";
import useGlobal from "../../../hooks/useGlobal";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import NetworkDupl from "../../../components/dupl/NetworkDupl";
import { useNetworksFromDataCenter } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import Logger from "../../../utils/Logger";

/**
 * @name DataCenterNetworks
 * @description 데이터센터에 종속 된 논리 네트워크 목록
 * (/computing/datacenters/<datacenterId>/networks)
 *
 * @param {string} datacenterId 데이터센터 ID
 * @returns
 */
const DataCenterNetworks = ({
  datacenterId
}) => {
  const { datacentersSelected } = useGlobal()
  const {
    data: networks = [],
    isLoading: isNetworksLoading,
    isError: isNetworksError,
    isSuccess: isNetworksSuccess,
    refetch: refetchNetworks,
    isRefetching: isNetworksRefetching,
  } = useNetworksFromDataCenter(datacenterId, (e) => ({ ...e }));

  return (
    <>
      <NetworkDupl columns={TableColumnsInfo.NETWORK_FROM_DATACENTER}
        networks={networks}
        refetch={refetchNetworks} isRefetching={isNetworksRefetching}
        isLoading={isNetworksLoading} isError={isNetworksError} isSuccess={isNetworksSuccess}
      />
      <OVirtWebAdminHyperlink 
        name={`${Localization.kr.COMPUTING}>${Localization.kr.DATA_CENTER}>${datacentersSelected[0]?.name}`} 
        path={`dataCenters-logical_networks;name=${datacentersSelected[0]?.name}`} 
      />
    </>
  );
};

export default DataCenterNetworks;