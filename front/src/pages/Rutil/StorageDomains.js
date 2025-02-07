import React from 'react';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import { useAllStorageDomains } from '../../api/RQHook';
import DomainDupl from '../../pages/storage/domain/DomainDupl';

const StorageDomains = () => {
  const {
    data: storageDomains = []
  } = useAllStorageDomains((e) => ({...e,}));

  return (
    <>    
      <DomainDupl
        columns={TableColumnsInfo.STORAGE_DOMAINS}
        domains={storageDomains}
        type={'rutil'}
      />
    </>
  );
};

export default StorageDomains;
