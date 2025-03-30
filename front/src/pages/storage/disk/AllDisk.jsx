import React from "react";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import HeaderButton from "../../../components/button/HeaderButton";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DiskDupl from "../../../components/dupl/DiskDupl";
import { useAllDisks } from "../../../api/RQHook";
import { rvi24Desktop, rvi24HardDrive } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";

const AllDisk = () => {
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
  } = useAllDisks((e) => ({ ...e }));

  Logger.debug("...");
  return (
    <div id="section">
        {/* <HeaderButton titleIcon={faDatabase} title="디스크" /> */}
        <HeaderButton titleIcon={rvi24HardDrive()}
          title="디스크"
        />
      <div className="w-full section-content">
        <DiskDupl
          isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
          columns={TableColumnsInfo.DISKS}
          disks={disks} 
          showSearchBox={true}
        />
      </div>
    </div>
  );
};

export default AllDisk;
