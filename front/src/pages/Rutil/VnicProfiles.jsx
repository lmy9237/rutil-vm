import React from "react";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import VnicProfileDupl from "../../components/dupl/VnicProfileDupl";
import { useAllVnicProfiles } from "../../api/RQHook";

/**
 * @name VnicProfiles
 * @description VnicProfiles
 *
 * @returns {JSX.Element} VnicProfiles
 */
const VnicProfiles = () => {
  const {
    data: vnicProfiles = [],
    isLoading: isVnicProfilesLoading,
    isError: isVnicProfilesError,
    isSuccess: isVnicProfilesSuccess,
  } = useAllVnicProfiles((e) => ({ ...e }));

  return (
    <>
      <VnicProfileDupl
        isLoading={isVnicProfilesLoading} isError={isVnicProfilesError} isSuccess={isVnicProfilesSuccess}
        columns={TableColumnsInfo.VNIC_PROFILES}
        vnicProfiles={vnicProfiles}
      />
    </>
  );
};

export default VnicProfiles;
