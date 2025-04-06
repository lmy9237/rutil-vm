import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from '../../../components/table/TablesOuter';
import TableRowClick from '../../../components/table/TableRowClick';
import { convertBytesToGB } from '../../../util';
import { useAllStorageDomainsFromDisk } from "../../../api/RQHook";
import { status2Icon } from "../../../components/icons/RutilVmIcons";
import Logger from "../../../utils/Logger";

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
  } = useAllStorageDomainsFromDisk(diskId, (e) => ({
    ...e,
    status: e.status === 'ACTIVE' ? '활성화' : '비활성화',
  }));

  const sizeCheck = (size) => {
    Logger.debug(`DiskDomains > sizeCheck ... size: ${size}`)
    return (size === 0) 
      ? 'N/A' 
      : `${convertBytesToGB(size)} GB`;
  };

  Logger.debug("DiskDomains ...")
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <TablesOuter
        isLoading={isDomainsLoading} isError={isDomainsError} isSuccess={isDomainsSuccess}
        columns={TableColumnsInfo.STORAGE_DOMAINS_FROM_DISK}
        data={(domains).map((domain) => ({
          ...domain,
          icon: status2Icon(domain.status),
          storageDomain: (<TableRowClick type="domain" id={domain?.id}>{domain?.name}</TableRowClick>),
          domainType: domain?.domainType === 'data' 
              ? '데이터'
              : domain?.domainType === 'iso' 
                ? 'ISO'
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
