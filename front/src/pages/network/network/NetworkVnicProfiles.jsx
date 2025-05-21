import React from "react";
import useGlobal              from "@/hooks/useGlobal";
import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import VnicProfileDupl        from "@/components/dupl/VnicProfileDupl";
import {
  useAllVnicProfilesFromNetwork
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";

/**
 * @name NetworkVnicProfiles
 * @description 네트워크에 종속 된 vNic프로필 목록
 *
 * @prop {string} networkId 네트워크 ID
 * @returns {JSX.Element} NetworkVnicProfiles
 */
const NetworkVnicProfiles = ({ 
  networkId
}) => {
  const { 
    datacentersSelected,
    networksSelected
  } = useGlobal();
  
  const {
    data: vnicProfiles = [],
    isLoading: isVnicProfilesLoading,
    isError: isVnicProfilesError,
    isSuccess: isVnicProfilesSuccess,
    refetch: refetchVnicProfiles,
    isRefetching: isVnicProfilesRefetching,
  } = useAllVnicProfilesFromNetwork(networkId, (e) => ({ ...e }));

  return (
    <>
      <VnicProfileDupl columns={TableColumnsInfo.VNIC_PROFILES_FROM_NETWORK}
        vnicProfiles={vnicProfiles || []}
        refetch={refetchVnicProfiles} isRefetching={isVnicProfilesRefetching}
        isLoading={isVnicProfilesLoading} isError={isVnicProfilesError} isSuccess={isVnicProfilesSuccess}
      />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.NETWORK}>${Localization.kr.NETWORK}>${networksSelected[0]?.name}`}
        path={`networks-profiles;name=${networksSelected[0]?.name};dataCenter=${datacentersSelected[0]?.name}`}
      />
    </>
  );
};

export default NetworkVnicProfiles;
