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
    refetch: refetchNetworks,
  } = useAllNetworks((e) => ({ ...e }));

  return (
      <NetworkDupl columns={TableColumnsInfo.NETWORKS}
        networks={networks}
        refetch={refetchNetworks}
        isLoading={isNetworksLoading} isError={isNetworksError} isSuccess={isNetworksSuccess}
      />
  );
};

export default Networks;
