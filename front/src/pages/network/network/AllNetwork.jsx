import React from "react";
import HeaderButton from "../../../components/button/HeaderButton";
import NetworkDupl from "../../../components/dupl/NetworkDupl";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { rvi24Network } from "../../../components/icons/RutilVmIcons";
import Localization from "../../../utils/Localization";
import { useAllNetworks } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";
import "./Network.css";
import SectionLayout from "../../../components/SectionLayout";

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
    refetch: refetchNetworks,
  } = useAllNetworks((e) => ({ ...e }));

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24Network()} 
        title={Localization.kr.NETWORK}
      />
      <div className="section-content w-full">
        <NetworkDupl columns={TableColumnsInfo.NETWORKS}
          networks={networks}
          showSearchBox={true}
          refetch={refetchNetworks}
          isLoading={isNetworksLoading} isError={isNetworksError} isSuccess={isNetworksSuccess}
        />
      </div>
    </SectionLayout>
  );
};

export default AllNetwork;
