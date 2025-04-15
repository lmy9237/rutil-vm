import React, { useEffect } from "react";
import useGlobal from "../../hooks/useGlobal";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import DataCenterDupl from "../../components/dupl/DataCenterDupl";
import { useAllDataCenters } from "../../api/RQHook";
import Logger from "../../utils/Logger";

/**
 * @name DataCenters
 * @description 데이터센터 전체
 *
 * @returns {JSX.Element} DataCenters
 */
const DataCenters = () => {
  const {
    data: datacenters = [],
    isLoading: isDataCentersLoading,
    isError: isDataCentersError,
    isSuccess: isDataCentersSuccess,
    refetch: refetchDataCenters,
  } = useAllDataCenters((e) => ({ ...e }));
  
  Logger.debug("DataCenters ...");
  return (
    <>
      <DataCenterDupl columns={TableColumnsInfo.DATACENTERS}
        datacenters={datacenters}
        refetch={refetchDataCenters}
        isLoading={isDataCentersLoading} isError={isDataCentersError} isSuccess={isDataCentersSuccess}
      />
    </>
  );
};

export default DataCenters;
