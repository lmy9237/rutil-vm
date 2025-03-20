import React from "react";
import Modal from "react-modal";
import { useAllVnicProfiles } from "../../../api/RQHook";
import { faLaptop } from "@fortawesome/free-solid-svg-icons";
import HeaderButton from "../../../components/button/HeaderButton";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VnicProfileDupl from "../../../components/dupl/VnicProfileDupl";
import Localization from "../../../utils/Localization";

// React Modal 설정
Modal.setAppElement("#root");

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
    <div id="section">
      <div>
        <HeaderButton titleIcon={faLaptop} title={Localization.kr.VNIC_PROFILE} />
      </div>
      <div className="w-full section-content">
        <VnicProfileDupl
          isLoading={isVnicProfilesLoading} isError={isVnicProfilesError} isSuccess={isVnicProfilesSuccess}
          columns={TableColumnsInfo.VNIC_PROFILES}
          vnicProfiles={vnicProfiles || []}
          showSearchBox={true}
        />
      </div>
    </div>
  );
};

export default AllVnic;
