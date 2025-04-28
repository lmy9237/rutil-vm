import React, { useEffect } from "react";
import useGlobal from "../../hooks/useGlobal";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import DiskDupl from "../../components/dupl/DiskDupl";
import { useAllDisks } from "../../api/RQHook";
import Logger from "../../utils/Logger";

/**
 * @name Disks
 * @description 디스크 목록 페이지
 *
 * @returns {JSX.Element} Disks
 */
const Disks = () => {
  const { setDisksSelected } = useGlobal()

  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
  } = useAllDisks((e) => ({ ...e }));
  
  useEffect(() => {
    return () => {
      Logger.debug("Disks > useEffect ... CLEANING UP");
      setDisksSelected([])
    }
  }, []);

  return (
    <DiskDupl columns={TableColumnsInfo.DISKS}
      disks={disks}
      refetch={refetchDisks}
      isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
    />
  );
};

export default Disks;
