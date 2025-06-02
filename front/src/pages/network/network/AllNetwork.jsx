import React from "react";
import SectionLayout          from "@/components/SectionLayout";
import HeaderButton           from "@/components/button/HeaderButton";
import NetworkDupl            from "@/components/dupl/NetworkDupl";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import { rvi24Network }       from "@/components/icons/RutilVmIcons";
import {
  useAllNetworks
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";

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
    isRefetching: isNetworksRefetching,
  } = useAllNetworks((e) => ({ ...e }));

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24Network()} 
        title={Localization.kr.NETWORK}
      />
      <div className="section-content v-start gap-8 w-full">
        <NetworkDupl columns={TableColumnsInfo.NETWORKS}
          networks={networks}
          refetch={refetchNetworks} isRefetching={isNetworksRefetching}
          isLoading={isNetworksLoading} isError={isNetworksError} isSuccess={isNetworksSuccess}
        />
      </div>
    </SectionLayout>
  );
};

export default AllNetwork;
