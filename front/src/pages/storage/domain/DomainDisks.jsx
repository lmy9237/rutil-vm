import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DiskDupl from "../../../components/dupl/DiskDupl";
import { useAllDisksFromDomain } from "../../../api/RQHook";

/**
 * @name DomainDisks
 * @description 도메인에 종속 된 디스크 목록
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainDisks
 */
const DomainDisks = ({ domainId }) => {
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
  } = useAllDisksFromDomain(domainId, (e) => ({ ...e }));

  return (
    <DiskDupl columns={TableColumnsInfo.DISKS_FROM_STORAGE_DOMAIN}
      disks={disks}
      refetch={refetchDisks}
      isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
    />
  );
};

export default DomainDisks;
