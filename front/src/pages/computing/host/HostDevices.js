import React from 'react';
import {useHostdeviceFromHost} from "../../../api/RQHook";
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import PagingTable from '../../../components/table/PagingTable';

const HostDevices = ({ hostId }) => {
  const { 
    data: hostDevices = [], isLoading: isHostDevicesLoading
  } = useHostdeviceFromHost(hostId, (e) => ({ ...e }));

  return (
    <>
      <div className="section-table-outer">
        <PagingTable
          columns={TableColumnsInfo.DEVICE_FROM_HOST} 
          data={hostDevices}
        />
      </div>
    </>
  );
};
  
export default HostDevices;