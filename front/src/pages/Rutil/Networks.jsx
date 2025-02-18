import React from "react";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import { useAllNetworks } from "../../api/RQHook";
import NetworkDupl from "../../components/dupl/NetworkDupl";

/**
 * @name Networks
 * @description 네트워크 전체
 *
 * @returns
 */
const Networks = () => {
  const {
    data: networks = [],
    isLoading: isNetworksLoading,
    isError: isNetworksError,
    isSuccess: isNetworksSuccess,
  } = useAllNetworks((e) => ({ ...e }));

  return (
    <>
      <NetworkDupl
        networks={networks}
        columns={TableColumnsInfo.NETWORKS}
        isLoading={isNetworksLoading}
        isError={isNetworksError}
        isSuccess={isNetworksSuccess}
      />
    </>
  );
};

export default Networks;
