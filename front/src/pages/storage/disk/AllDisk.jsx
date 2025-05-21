import React from "react";
import SectionLayout          from "@/components/SectionLayout";
import HeaderButton           from "@/components/button/HeaderButton";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import { rvi24HardDrive }     from "@/components/icons/RutilVmIcons";
import DiskDupl               from "@/components/dupl/DiskDupl";
import {
  useAllDisks
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";

const AllDisk = () => {
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
    isRefetching: isDisksRefetching,
  } = useAllDisks((e) => ({ ...e }));

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24HardDrive()}
        title={Localization.kr.DISK}
      />
      <div className="section-content v-start gap-8 w-full">
        <DiskDupl columns={TableColumnsInfo.DISKS}
          disks={disks}
          refetch={refetchDisks} isRefetching={isDisksRefetching}
          isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
        />
      </div>
    </SectionLayout>
  );
};

export default AllDisk;
