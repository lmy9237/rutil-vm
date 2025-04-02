import React from "react";
import HeaderButton from "../../../components/button/HeaderButton";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DiskDupl from "../../../components/dupl/DiskDupl";
import { useAllDisks } from "../../../api/RQHook";
import { rvi24HardDrive } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";

const AllDisk = () => {
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
  } = useAllDisks((e) => ({ ...e }));

  Logger.debug("AllDisk ...");
  return (
    <div id="section">
      <HeaderButton titleIcon={rvi24HardDrive()}
        title="디스크"
      />
      <div className="w-full section-content">
        <DiskDupl columns={TableColumnsInfo.DISKS}
          disks={disks} 
          showSearchBox={true}
          refetch={refetchDisks}
          isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
        />
      </div>
    </div>
  );
};

export default AllDisk;
