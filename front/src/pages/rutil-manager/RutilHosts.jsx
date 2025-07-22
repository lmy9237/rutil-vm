import React, { useEffect } from "react";
import useGlobal              from "@/hooks/useGlobal";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import HostDupl               from "@/components/dupl/HostDupl";
import {
  useAllHosts,
  useDashboardHostList,
} from "@/api/RQHook";
import Logger                 from "@/utils/Logger";
import HostChart from "../computing/host/HostChart";

/**
 * @name RutilHosts
 * @description 호스트 목록 페이지
 * 경로: <메뉴>/rutil-manager/hosts
 *
 * @returns {JSX.Element} RutilHosts
 */
const RutilHosts = () => {
  const { setHostsSelected } = useGlobal()

  const { 
    data: hostList
  } = useDashboardHostList();

  const {
    data: hosts = [],
    isLoading: isHostsLoading,
    isError: isHostsError,
    isSuccess: isHostsSuccess,
    refetch: refetchHosts,
    isRefetching: isHostsRefetching,
  } = useAllHosts((e) => ({ ...e }));

  useEffect(() => {
    return () => {
      Logger.debug("RutilHosts > useEffect ... CLEANING UP");
      setHostsSelected([])
    }
  }, []);

  return (
    <>
    <HostDupl columns={TableColumnsInfo.HOSTS}
      hosts={hosts}
      refetch={refetchHosts} isRefetching={isHostsRefetching}
      isLoading={isHostsLoading} isError={isHostsError} isSuccess={isHostsSuccess}
    />
    <div style={{width:"1200px"}}>
      <HostChart per={hostList} cpu={true}/>
      <HostChart per={hostList} cpu={false}/>
    </div>
    </>

  );
};

export default RutilHosts;
