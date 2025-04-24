import React, { useEffect } from "react";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import HostDupl from "../../components/dupl/HostDupl";
import { useAllHosts } from "../../api/RQHook";
import useGlobal from "../../hooks/useGlobal";
import Logger from "../../utils/Logger";

/**
 * @name Hosts
 * @description 호스트 목록 페이지
 *
 * @returns {JSX.Element} Disks
 */
const Hosts = () => {
  const { hostsSelected, setHostsSelected } = useGlobal()

  const {
    data: hosts = [],
    isLoading: isHostsLoading,
    isError: isHostsError,
    isSuccess: isHostsSuccess,
    refetch: refetchHosts,
  } = useAllHosts((e) => ({ ...e }));

  useEffect(() => {
    Logger.debug("Hosts > useEffect ...");
    return () => {
      Logger.debug("Hosts > useEffect ... CLEANING UP");
      setHostsSelected([])
    }
  }, []);

  Logger.debug(`Hosts ... `)
  return (
    <>
    <HostDupl columns={TableColumnsInfo.HOSTS}
      hosts={hosts}
      refetch={refetchHosts}
      isLoading={isHostsLoading} isError={isHostsError} isSuccess={isHostsSuccess}
    />
    <span>{hostsSelected[0]?.id}</span>
    </>
  );
};

export default Hosts;
