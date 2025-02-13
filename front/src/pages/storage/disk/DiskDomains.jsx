import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from '../../../components/table/TablesOuter';
import TableRowClick from '../../../components/table/TableRowClick';
import { renderDomainStatusIcon } from '../../../components/Icon';
import { convertBytesToGB } from '../../../util';
import { useAllStorageDomainFromDisk } from "../../../api/RQHook";

/**
 * @name DiskDomains
 * @description 디스크에 종속 된 스토리지도메인 목록
 * (/storages/disks/<diskId>/domains)
 *
 * @param {string} diskId 디스크ID
 * @returns
 */
const DiskDomains = ({ diskId }) => {
  const {
    data: domains = [],
    isLoading: isDomainsLoading,
    isError: isDomainsError,
    isSuccess: isDomainsSuccess,
  } = useAllStorageDomainFromDisk(diskId, (e) => ({
    ...e,
    status: e.status === 'ACTIVE' ? '활성화' : '비활성화',
  }));

  const sizeCheck = (size) => {
    console.log(`DiskDomains > sizeCheck ... size: ${size}`)
    return (size === 0) ? 'N/A' : `${convertBytesToGB(size)} GB`;
  };

  console.log("...")
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <TablesOuter
        isLoading={isDomainsLoading} isError={isDomainsError} isSuccess={isDomainsSuccess}
        columns={TableColumnsInfo.STORAGE_DOMAINS_FROM_DISK}
        data={(domains).map((domain) => ({
          ...domain,
          icon: renderDomainStatusIcon(domain.status),
          storageDomain: <TableRowClick type="domains" id={domain?.id}>{domain?.name}</TableRowClick>,
          domainType:
            domain?.domainType === 'data' ? '데이터'
              : domain?.domainType === 'iso' ? 'ISO'
                : 'EXPORT',
          diskSize: sizeCheck(domain?.diskSize),
          availableSize: sizeCheck(domain?.availableSize),
          usedSize: sizeCheck(domain?.usedSize),
        }))}
        shouldHighlight1stCol={true}
      />
    </div>
  );
};

export default DiskDomains;
