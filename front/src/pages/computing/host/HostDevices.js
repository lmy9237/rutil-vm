import { useHostdeviceFromHost } from "../../../api/RQHook";
import TableColumnsInfo from '../../../components/table/TableColumnsInfo';
import PagingTable from '../../../components/table/PagingTable';

/**
 * @name HostDevices
 * @description 호스트에 종속 된 장치 목록
 * (/computing/hosts/<hostId>/devices)
 * 
 * @param {string} hostId 호스트 ID
 * @returns
 */
const HostDevices = ({ hostId }) => {
  const {
    data: hostDevices = [],
    isLoading: isHostDevicesLoading,
    isError: isHostDevicesError,
    isSuccess: isHostDevicesSuccess,
  } = useHostdeviceFromHost(hostId, (e) => ({ 
    ...e
  }));

  console.log("...");
  return (
    <>
      <div className="section-table-outer">
        <PagingTable data={hostDevices} columns={TableColumnsInfo.DEVICE_FROM_HOST}
          isLoading={isHostDevicesLoading}
          isError={isHostDevicesError}
          isSuccess={isHostDevicesSuccess}
        />
      </div>
    </>
  );
};

export default HostDevices;