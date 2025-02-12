import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import TablesOuter from '../../../components/table/TablesOuter';
import TableRowClick from '../../../components/table/TableRowClick';
import { renderDomainStatusIcon } from '../../../components/Icon';
import { convertBytesToGB } from '../../../util';
import { useAllStorageDomainFromDisk } from "../../../api/RQHook";

const DiskDomains = ({ diskId }) => {
  const {
    data: domains = [],
  } = useAllStorageDomainFromDisk(diskId, (e) => ({
    ...e,
    status: e.status === 'ACTIVE' ? '활성화' : '비활성화',
  }));

  const sizeCheck = (size) => {
    if (size === 0) {
      return 'N/A';
    } else {
      return convertBytesToGB(size) + ' GB';
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <TablesOuter
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
