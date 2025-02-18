import React from "react";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import DiskDupl from "../../components/dupl/DiskDupl";
import { useAllDisks } from "../../api/RQHook";

/**
 * @name Disks
 * @description 디스크 목록 페이지
 *
 * @returns {JSX.Element} Disks
 */
const Disks = () => {
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
  } = useAllDisks((e) => ({
    ...e,
    connected: e?.connectVm?.name || e?.connectTemplate?.name,
  }));

  return (
    <>
      <DiskDupl
        disks={disks}
        columns={TableColumnsInfo.DISKS}
        isLoading={isDisksLoading}
        isError={isDisksError}
        isSuccess={isDisksSuccess}
      />
    </>
  );
};

export default Disks;
