import React, { useEffect } from "react";
import useGlobal from "../../hooks/useGlobal";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import VnicProfileDupl from "../../components/dupl/VnicProfileDupl";
import { useAllVnicProfiles } from "../../api/RQHook";
import Logger from "../../utils/Logger";

/**
 * @name RutilVnicProfiles
 * @description VnicProfiles
 * 경로: <메뉴>/rutil-manager/vnicProfiles
 * 
 * @returns {JSX.Element} VnicProfiles
 */
const RutilVnicProfiles = () => {
  const { setVnicProfilesSelected } = useGlobal()

  const {
    data: vnicProfiles = [],
    isLoading: isVnicProfilesLoading,
    isError: isVnicProfilesError,
    isSuccess: isVnicProfilesSuccess,
    refetch: refetchVnicProfiles,
  } = useAllVnicProfiles((e) => ({ ...e }));
  
  useEffect(() => {
    return () => {
      Logger.debug("RutilVnicProfiles > useEffect ... CLEANING UP");
      setVnicProfilesSelected([])
    }
  }, []);

  return (
    <VnicProfileDupl columns={TableColumnsInfo.VNIC_PROFILES}
      vnicProfiles={vnicProfiles}
      refetch={refetchVnicProfiles}
      isLoading={isVnicProfilesLoading} isError={isVnicProfilesError} isSuccess={isVnicProfilesSuccess}
    />
  );
};

export default RutilVnicProfiles;
