import React from 'react';
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import { useDomainsFromDataCenter } from '../../../api/RQHook';
import DomainDupl from '../../storage/domain/DomainDupl';

const DataCenterDomains = ({ datacenterId }) => {
  const {
    data: storageDomains = [], isLoading: isStorageDomainsLoading
  } = useDomainsFromDataCenter(datacenterId, (e) => ({...e,}));
  
  return (
    <>
      <DomainDupl
        domains={storageDomains}
        columns={TableColumnsInfo.STORAGE_DOMAINS}
        actionType={'dcDomain'}
        datacenterId={datacenterId}
      />
    </>
  );
};

export default DataCenterDomains;