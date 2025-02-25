import React from "react";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../../components/footer/Footer";
import HeaderButton from "../../../components/button/HeaderButton";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DiskDupl from "../../../components/dupl/DiskDupl";
import { useAllDisks } from "../../../api/RQHook";

const AllDisk = () => {
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
  } = useAllDisks((e) => ({
    ...e,
  }));

  console.log("...");
  return (
    <div id="section">
      <div>
        <HeaderButton titleIcon={faDatabase} title="디스크" />
      </div>
      <div className="w-full px-[0.5rem] py-[0.5rem] section-content">
        <DiskDupl
          isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
          disks={disks} columns={TableColumnsInfo.DISKS}
        />
      </div>
      <Footer />
    </div>
  );
};

export default AllDisk;
