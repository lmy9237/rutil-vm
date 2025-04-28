import React, { useEffect } from "react";
import useGlobal from "../../hooks/useGlobal";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import { useAllNetworks } from "../../api/RQHook";
import NetworkDupl from "../../components/dupl/NetworkDupl";
import Logger from "../../utils/Logger";

/**
 * @name Networks
 * @description 네트워크 전체
 *
 * @returns
 */
const Networks = () => {
  const { setNetworksSelected } = useGlobal()

  const {
    data: networks = [],
    isLoading: isNetworksLoading,
    isError: isNetworksError,
    isSuccess: isNetworksSuccess,
    refetch: refetchNetworks,
  } = useAllNetworks((e) => ({ ...e }));
  
  useEffect(() => {
    return () => {
      Logger.debug("Networks > useEffect ... CLEANING UP");
      setNetworksSelected([])
    }
  }, []);

  return (
    <NetworkDupl columns={TableColumnsInfo.NETWORKS}
      networks={networks}
      refetch={refetchNetworks}
      isLoading={isNetworksLoading} isError={isNetworksError} isSuccess={isNetworksSuccess}
    />
  );
};

export default Networks;
