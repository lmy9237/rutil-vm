import React, { useEffect } from "react";
import useGlobal              from "@/hooks/useGlobal";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import DiskDupl               from "@/components/dupl/DiskDupl";
import { useAllDisks }        from "@/api/RQHook";
import Logger                 from "@/utils/Logger";

/**
 * @name RutilDisks
 * @description 디스크 목록 페이지
 * 경로: <메뉴>/rutil-manager/disks
 * 
 * @returns {JSX.Element} RutilDisks
 */
const RutilDisks = () => {
  const { setDisksSelected } = useGlobal()

  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
    isRefetching: isDisksRefetching,
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
      refetch={refetchDisks} isRefetching={isDisksRefetching}
      isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
    />
  );
};

export default RutilDisks;
