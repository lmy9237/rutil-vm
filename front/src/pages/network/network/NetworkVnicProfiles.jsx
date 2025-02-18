import React from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VnicProfileDupl from "../../../components/dupl/VnicProfileDupl";
import { useAllVnicProfilesFromNetwork } from "../../../api/RQHook";

/**
 * @name NetworkVnicProfiles
 * @description 네트워크에 종속 된 vNic프로필 목록
 *
 * @prop {string} networkId 네트워크 ID
 * @returns {JSX.Element} NetworkVnicProfiles
 */
const NetworkVnicProfiles = ({ networkId }) => {
  const {
    data: vnicProfiles = [],
    isLoading: isVnicProfilesLoading,
    isError: isVnicProfilesError,
    isSuccess: isVnicProfilesSuccess,
  } = useAllVnicProfilesFromNetwork(networkId, (e) => ({
    ...e,
  }));

  return (
    <>
      <VnicProfileDupl
        isLoading={isVnicProfilesLoading}
        isError={isVnicProfilesError}
        isSuccess={isVnicProfilesSuccess}
        vnicProfiles={vnicProfiles}
        columns={TableColumnsInfo.VNIC_PROFILES_FROM_NETWORK}
        networkId={networkId}
      />
    </>
  );
};

export default NetworkVnicProfiles;
