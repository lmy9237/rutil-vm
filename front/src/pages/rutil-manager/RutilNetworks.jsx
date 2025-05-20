import React, { useEffect } from "react";
import useGlobal from "../../hooks/useGlobal";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import { useAllNetworks } from "../../api/RQHook";
import NetworkDupl from "../../components/dupl/NetworkDupl";
import Logger from "../../utils/Logger";

/**
 * @name RutilNetworks
 * @description 네트워크 전체
 * 경로: <메뉴>/rutil-manager/networks
 *
 * @returns {JSX.Element} RutilNetworks
 */
const RutilNetworks = () => {
  const { setNetworksSelected } = useGlobal()

  const {
    data: networks = [],
    isLoading: isNetworksLoading,
    isError: isNetworksError,
    isSuccess: isNetworksSuccess,
    refetch: refetchNetworks,
    isRefetching: isNetworksRefetching,
  } = useAllNetworks((e) => ({ ...e }));
  
  useEffect(() => {
    return () => {
      Logger.debug("RutilNetworks > useEffect ... CLEANING UP");
      setNetworksSelected([])
    }
  }, []);

  return (
    <NetworkDupl columns={TableColumnsInfo.NETWORKS}
      networks={networks}
      refetch={refetchNetworks} isRefetching={isNetworksRefetching}
      isLoading={isNetworksLoading} isError={isNetworksError} isSuccess={isNetworksSuccess}
    />
  );
};

export default RutilNetworks;
