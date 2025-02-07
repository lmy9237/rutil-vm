import React from 'react';
import { useAllDataCenters } from '../../api/RQHook';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import DataCenterDupl from '../computing/datacenter/DataCenterDupl';

const DataCenters = () => {
  const { 
    data: datacenters = []
  } = useAllDataCenters((e) => ({ ...e }));
  
  return (
    <>
      <DataCenterDupl
        columns={TableColumnsInfo.DATACENTERS}
        datacenters={datacenters}
      />
    </>
  );
};

export default DataCenters;
