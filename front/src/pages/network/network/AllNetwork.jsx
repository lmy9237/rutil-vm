import React from "react";
import HeaderButton from "../../../components/button/HeaderButton";
import NetworkDupl from "../../../components/dupl/NetworkDupl";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { rvi24Network } from "../../../components/icons/RutilVmIcons";
import Localization from "../../../utils/Localization";
import { useAllNetworks } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";
import "./Network.css";

/**
 * @name AllNetwork
 * @description 네트워크
 *
 * @returns {JSX.Element} AllNetwork
 */
const AllNetwork = () => {
  const {
    data: networks = [],
    isLoading: isNetworksLoading,
    isError: isNetworksError,
    isSuccess: isNetworksSuccess,
    refetch: neworksRefetch,
  } = useAllNetworks((e) => ({ ...e }));

  Logger.debug("...");
  return (
    <div id="section">
      <div>
        <HeaderButton titleIcon={rvi24Network()} 
          title={Localization.kr.NETWORK}
        />
      </div>
      <div className="w-full section-content">
        <NetworkDupl
          isLoading={isNetworksLoading} isError={isNetworksError} isSuccess={isNetworksSuccess}
          columns={TableColumnsInfo.NETWORKS}
          networks={networks}
          showSearchBox={true}
        />
      </div>
    </div>
  );
};

export default AllNetwork;
