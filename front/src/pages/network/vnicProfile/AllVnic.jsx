import React from "react";
import { useAllVnicProfiles } from "../../../api/RQHook";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VnicProfileDupl from "../../../components/dupl/VnicProfileDupl";
import Localization from "../../../utils/Localization";
import { rvi24Flag, rvi24Lan } from "../../../components/icons/RutilVmIcons";
import HeaderButton from "../../../components/button/HeaderButton";
import SectionLayout from "../../../components/SectionLayout";

/**
 * @name AllVnic
 * @description vNic 전체
 *
 * @returns {JSX.Element} AllVnic
 */
const AllVnic = () => {
  const {
    data: vnicProfiles = [],
    isLoading: isVnicProfilesLoading,
    isError: isVnicProfilesError,
    isSuccess: isVnicProfilesSuccess,
    refetch: refetchVnicProfiles,
    isRefetching: isVnicProfilesRefetching,
  } = useAllVnicProfiles((e) => ({ ...e }));

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24Lan()}
        title={Localization.kr.VNIC_PROFILE}
      />
      <div className="section-content v-start gap-8 w-full">
        <VnicProfileDupl columns={TableColumnsInfo.VNIC_PROFILES}
          vnicProfiles={vnicProfiles || []}
          refetch={refetchVnicProfiles} isRefetching={isVnicProfilesRefetching}
          isLoading={isVnicProfilesLoading} isError={isVnicProfilesError} isSuccess={isVnicProfilesSuccess}
        />
      </div>
    </SectionLayout>
  );
};

export default AllVnic;
