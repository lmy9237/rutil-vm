import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { useHostdeviceFromHost } from "../../../api/RQHook";
import Tables from "../../../components/table/Tables";

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
  } = useHostdeviceFromHost(hostId, (e) => ({ ...e }));

  console.log("...");
  return (
    <>
      <div className="section-table-outer">
        <Tables
          isLoading={isHostDevicesLoading} isError={isHostDevicesError} isSuccess={isHostDevicesSuccess}
          columns={TableColumnsInfo.DEVICE_FROM_HOST}
          data={hostDevices}
        />
      </div>
    </>
  );
};

export default HostDevices;
