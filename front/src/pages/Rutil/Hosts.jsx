import React from "react";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import HostDupl from "../../components/dupl/HostDupl";
import { useAllHosts } from "../../api/RQHook";

/**
 * @name Hosts
 * @description 호스트 목록 페이지
 *
 * @returns {JSX.Element} Disks
 */
const Hosts = () => {
  const {
    data: hosts = [],
    isLoading: isHostsLoading,
    isError: isHostsError,
    isSuccess: isHostsSuccess,
    refetch: refetchHosts,
  } = useAllHosts((e) => ({ ...e }));

  return (
    <>
      <HostDupl columns={TableColumnsInfo.HOSTS}
        hosts={hosts}
        refetch={refetchHosts}
        isLoading={isHostsLoading} isError={isHostsError} isSuccess={isHostsSuccess}
      />
    </>
  );
};

export default Hosts;
