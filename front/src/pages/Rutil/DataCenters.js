import React from 'react';
import TableColumnsInfo from '../../components/table/TableColumnsInfo';
import DataCenterDupl from '../../components/dupl/DataCenterDupl';
import { useAllDataCenters } from '../../api/RQHook';

/**
 * @name DataCenters
 * @description 데이터센터 전체
 * 
 * @returns 
 */
const DataCenters = () => {
  const {
    data: datacenters = [],
    isLoading: isDataCentersLoading,
    isError: isDataCentersError,
    isSuccess: isDataCentersSuccess,
  } = useAllDataCenters((e) => ({ ...e }));

  console.log("...")
  return (
    <>
      <DataCenterDupl datacenters={datacenters} columns={TableColumnsInfo.DATACENTERS}
        isLoading={isDataCentersLoading}
        isError={isDataCentersError}
        isSuccess={isDataCentersSuccess}
      />
    </>
  );
};

export default DataCenters;
