import React from 'react'; 
import { useAllDiskFromDomain} from "../../../api/RQHook";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DiskDupl from '../disk/DiskDupl';

const DomainDisks = ({ domainId }) => {
  const { 
    data: disks = [], isLoading: isDisksLoading, 
  } = useAllDiskFromDomain(domainId, (e) => ({ ...e }));

  return (
    <>
      <DiskDupl
        columns={TableColumnsInfo.DISKS_FROM_STORAGE_DOMAIN}
        disks={disks}
      />
    </>
  );
};

export default DomainDisks;