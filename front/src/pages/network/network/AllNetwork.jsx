import React, { useEffect } from "react";
import { faServer } from "@fortawesome/free-solid-svg-icons";
import HeaderButton from "../../../components/button/HeaderButton";
import NetworkDupl from "../../../components/dupl/NetworkDupl";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { useAllNetworks } from "../../../api/RQHook";
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
  } = useAllNetworks((e) => ({ ...e }));

  console.log("...");
  return (
    <div id="section">
      <div>
        <HeaderButton titleIcon={faServer} title="네트워크" />
      </div>
      <div className="w-full section-content">
        <NetworkDupl
          networks={networks}
          columns={TableColumnsInfo.NETWORKS}
          isLoading={isNetworksLoading}
          isError={isNetworksError}
          isSuccess={isNetworksSuccess}
          showSearchBox={true}
        />
      </div>
    </div>
  );
};

export default AllNetwork;
