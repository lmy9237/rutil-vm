import React, { useEffect } from "react";
import useGlobal from "../../hooks/useGlobal";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import HostDupl from "../../components/dupl/HostDupl";
import { useAllHosts } from "../../api/RQHook";
import Logger from "../../utils/Logger";

/**
 * @name Hosts
 * @description 호스트 목록 페이지
 *
 * @returns {JSX.Element} Disks
 */
const Hosts = () => {
  const { setHostsSelected } = useGlobal()

  const {
    data: hosts = [],
    isLoading: isHostsLoading,
    isError: isHostsError,
    isSuccess: isHostsSuccess,
    refetch: refetchHosts,
  } = useAllHosts((e) => ({ ...e }));

  useEffect(() => {
    return () => {
      Logger.debug("Hosts > useEffect ... CLEANING UP");
      setHostsSelected([])
    }
  }, []);

  return (
    <HostDupl columns={TableColumnsInfo.HOSTS}
      hosts={hosts}
      refetch={refetchHosts}
      isLoading={isHostsLoading} isError={isHostsError} isSuccess={isHostsSuccess}
    />
  );
};

export default Hosts;
