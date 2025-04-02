import React from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import NetworkDupl from "../../../components/dupl/NetworkDupl";
import { useNetworksFromDataCenter } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";

/**
 * @name DataCenterNetworks
 * @description 데이터센터에 종속 된 논리 네트워크 목록
 * (/computing/datacenters/<datacenterId>/networks)
 *
 * @param {string} datacenterId 데이터센터 ID
 * @returns
 */
const DataCenterNetworks = ({ datacenterId }) => {
  const {
    data: networks = [],
    isLoading: isNetworksLoading,
    isError: isNetworksError,
    isSuccess: isNetworksSuccess,
    refetch: refetchNetworks,
  } = useNetworksFromDataCenter(datacenterId, (e) => ({ ...e }));

  Logger.debug("DataCenterNetworks ...");
  return (
    <NetworkDupl columns={TableColumnsInfo.NETWORK_FROM_DATACENTER}
      networks={networks}
      refetch={refetchNetworks}
      isLoading={isNetworksLoading} isError={isNetworksError} isSuccess={isNetworksSuccess}
    />
  );
};

export default DataCenterNetworks;