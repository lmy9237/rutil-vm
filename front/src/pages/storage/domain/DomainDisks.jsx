import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DiskDupl from "../../../components/dupl/DiskDupl";
import { useAllDiskFromDomain } from "../../../api/RQHook";

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
  } = useAllDiskFromDomain(domainId, (e) => ({ ...e }));

  return (
    <>
      <DiskDupl
        disks={disks}
        columns={TableColumnsInfo.DISKS_FROM_STORAGE_DOMAIN}
        isLoading={isDisksLoading}
        isError={isDisksError}
        isSuccess={isDisksSuccess}
      />
    </>
  );
};

export default DomainDisks;
