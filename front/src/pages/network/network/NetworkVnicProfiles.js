import React from "react";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VnicProfileDupl from "../../../components/dupl/VnicProfileDupl";
import { useAllVnicProfilesFromNetwork } from "../../../api/RQHook";

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
        isLoading={isVnicProfilesLoading} isError={isVnicProfilesError} isSuccess={isVnicProfilesSuccess}
        vnicProfiles={vnicProfiles}
        columns={TableColumnsInfo.VNIC_PROFILES_FROM_NETWORK}
        networkId={networkId}
      />
    </>
  );
};
  
export default NetworkVnicProfiles;