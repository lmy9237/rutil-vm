import React from "react";
import { useAllVnicProfilesFromNetwork } from "../../../api/RQHook";
import VnicProfileDupl from "../../network/vnicProfile/VnicProfileDupl";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";

const NetworkVnicProfiles = ({ networkId }) => {
  const { 
    data: vnicProfiles = [], 
  } = useAllVnicProfilesFromNetwork(networkId, (e) => ({ ...e }));
  
  return (
    <>
     <VnicProfileDupl
        vnicProfiles={vnicProfiles}
        columns={TableColumnsInfo.VNIC_PROFILES_FROM_NETWORK}
        networkId={networkId}
      />
    </>
  );
};
  
export default NetworkVnicProfiles;