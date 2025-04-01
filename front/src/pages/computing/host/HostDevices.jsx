import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import { useHostDevicesFromHost } from "../../../api/RQHook";
import Tables from "../../../components/table/Tables";
import Logger from "../../../utils/Logger";

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
  } = useHostDevicesFromHost(hostId, (e) => ({ ...e }));

  Logger.debug("...")
  return (
    <div className="section-table-outer">
      <Tables columns={TableColumnsInfo.DEVICE_FROM_HOST}
        data={hostDevices}
        isLoading={isHostDevicesLoading} isError={isHostDevicesError} isSuccess={isHostDevicesSuccess}
      />
    </div>
  );
};

export default HostDevices;
