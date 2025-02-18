import React from "react";
import Modal from "react-modal";
import { useAllVnicProfiles } from "../../../api/RQHook";
import { faLaptop } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../../components/footer/Footer";
import HeaderButton from "../../../components/button/HeaderButton";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VnicProfileDupl from "../../../components/dupl/VnicProfileDupl";

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
  } = useAllVnicProfiles((e) => ({
    ...e,
  }));

  return (
    <div id="section">
      <div>
        <HeaderButton titleIcon={faLaptop} title="VNIC 프로파일" />
      </div>
      <div className="w-full px-[0.5rem] py-[0.5rem]">
        <VnicProfileDupl
          isLoading={isVnicProfilesLoading}
          isError={isVnicProfilesError}
          isSuccess={isVnicProfilesSuccess}
          columns={TableColumnsInfo.VNIC_PROFILES}
          vnicProfiles={vnicProfiles || []}
        />
      </div>
      <Footer />
    </div>
  );
};

export default AllVnic;
