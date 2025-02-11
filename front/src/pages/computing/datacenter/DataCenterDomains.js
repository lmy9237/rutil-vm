import React from 'react';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import DomainDupl from '../../../components/dupl/DomainDupl';
import { useDomainsFromDataCenter } from '../../../api/RQHook';

const DataCenterDomains = ({ datacenterId }) => {
  const {
    data: storageDomains = [],
    isLoading: isStorageDomainsLoading,
    isError: isStorageDomainsError,
    isSuccess: isStorageDomainsSuccess,
  } = useDomainsFromDataCenter(datacenterId, (e) => ({...e,}));
  
  return (
    <>
      <DomainDupl domains={storageDomains} columns={TableColumnsInfo.STORAGE_DOMAINS}
        actionType={'dcDomain'}
        datacenterId={datacenterId}
        isLoading={isStorageDomainsLoading}
        isError={isStorageDomainsError}
        isSuccess={isStorageDomainsSuccess}
      />
    </>
  );
};

export default DataCenterDomains;