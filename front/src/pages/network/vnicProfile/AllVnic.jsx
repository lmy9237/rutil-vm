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
  } = useAllVnicProfiles((e) => ({ ...e }));

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24Lan()}
        title={Localization.kr.VNIC_PROFILE}
      />
      <div className="w-full section-content">
        <VnicProfileDupl
          isLoading={isVnicProfilesLoading} isError={isVnicProfilesError} isSuccess={isVnicProfilesSuccess}
          columns={TableColumnsInfo.VNIC_PROFILES}
          vnicProfiles={vnicProfiles || []}
          showSearchBox={true}
        />
      </div>
    </SectionLayout>
  );
};

export default AllVnic;
