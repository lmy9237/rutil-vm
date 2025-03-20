import React from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import NetworkDupl from "../../../components/dupl/NetworkDupl";
import { useNetworksFromDataCenter } from "../../../api/RQHook";

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
  } = useNetworksFromDataCenter(datacenterId, (e) => ({ ...e }));

  console.log("...");
  return (
    <>
      <NetworkDupl
        isLoading={isNetworksLoading} isError={isNetworksError} isSuccess={isNetworksSuccess}
        columns={TableColumnsInfo.NETWORK_FROM_DATACENTER}
        networks={networks}
      />
    </>
  );
};

export default DataCenterNetworks;
