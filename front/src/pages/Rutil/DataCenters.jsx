import React from "react";
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
  } = useAllDataCenters((e) => ({ ...e }));

  Logger.debug("...");
  return (
    <>
      <DataCenterDupl
        isLoading={isDataCentersLoading} isError={isDataCentersError} isSuccess={isDataCentersSuccess}
        columns={TableColumnsInfo.DATACENTERS}
        datacenters={datacenters}
      />
    </>
  );
};

export default DataCenters;
