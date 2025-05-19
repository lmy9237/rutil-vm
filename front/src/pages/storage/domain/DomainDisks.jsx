import useGlobal from "../../../hooks/useGlobal";
import OVirtWebAdminHyperlink from "../../../components/common/OVirtWebAdminHyperlink";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DiskDupl from "../../../components/dupl/DiskDupl";
import { useAllDisksFromDomain } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";

/**
 * @name DomainDisks
 * @description 도메인에 종속 된 디스크 목록
 *
 * @prop {string} domainId 도메인ID
 * @returns {JSX.Element} DomainDisks
 */
const DomainDisks = ({
  domainId
}) => {
  const {
    domainsSelected,
  } = useGlobal();

  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
    refetch: refetchDisks,
  } = useAllDisksFromDomain(domainId, (e) => ({ ...e }));

  return (
    <>
      <DiskDupl columns={TableColumnsInfo.DISKS_FROM_STORAGE_DOMAIN}
        disks={disks}
        refetch={refetchDisks}
        isLoading={isDisksLoading} isError={isDisksError} isSuccess={isDisksSuccess}
      />
      <OVirtWebAdminHyperlink
        name={`${Localization.kr.DOMAIN}>${Localization.kr.DOMAIN}>${domainsSelected[0]?.name}`}
        path={`storage-disks;name=${domainsSelected[0]?.name}`}
      />
    </>
  );
};

export default DomainDisks;
