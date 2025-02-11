import React from 'react';
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import DiskDupl from '../../../components/dupl/DiskDupl';
import { useAllDiskFromDomain } from "../../../api/RQHook";

const DomainDisks = ({ domainId }) => {
  const {
    data: disks = [],
    isLoading: isDisksLoading,
    isError: isDisksError,
    isSuccess: isDisksSuccess,
  } = useAllDiskFromDomain(domainId, (e) => ({ ...e }));

  return (
    <>
      <DiskDupl disks={disks} columns={TableColumnsInfo.DISKS_FROM_STORAGE_DOMAIN}
        isLoading={isDisksLoading}
        isError={isDisksError}
        isSuccess={isDisksSuccess}
      />
    </>
  );
};

export default DomainDisks;