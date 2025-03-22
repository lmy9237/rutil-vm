import RutilVmLogo from "../../components/common/RutilVmLogo";
import {
  useDashboard,
  useDashboardCpuMemory,
  useDashboardStorage,
} from "../../api/RQHook";
import Localization from "../../utils/Localization";
import InfoTable from "../../components/table/InfoTable";

/**
 * @name Info
 * @description RutilManager > 일반
 *
 * @returns {JSX.Element} Info
 */
const Info = () => {
  const { data: dashboard = [] } = useDashboard();
  const { data: cpuMemory = [] } = useDashboardCpuMemory();
  const { data: storage = [] } = useDashboardStorage();
  
  const tableRows = [
    { label: Localization.kr.DATA_CENTER, value: dashboard?.datacenters ?? 0 },
    { label: Localization.kr.CLUSTER, value: dashboard?.clusters ?? 0 },
    { label: "호스트", value: dashboard?.hosts ?? 0 },
    { label: "가상머신", value: `${dashboard?.vmsUp ?? 0} / ${dashboard?.vms ?? 0}` },
    { label: "스토리지 도메인", value: dashboard?.storageDomains ?? 0 },
    { label: `부팅${Localization.kr.TIME}(업타임)`, value: dashboard?.bootTime ?? "" },
  ];

  console.log("...");
  return (
    <>
      <div className="rutil-general-contents">
        <div>
          <RutilVmLogo
            className="big" 
            details={`v${dashboard?.version} (${dashboard?.releaseDate})`}
          />
        </div>
        <InfoTable tableRows={tableRows} />  
        {/* <div>
          <div>
            <span>{Localization.kr.DATA_CENTER}: {dashboard?.datacenters ?? 0}</span>
            <br />
            <span>{Localization.kr.CLUSTER}: {dashboard?.clusters ?? 0}</span>
            <br />
            <span>호스트: {dashboard?.hosts ?? 0}</span>
            <br />
            <span>가상머신: {dashboard?.vmsUp ?? 0} / {dashboard?.vms}</span>
            <br />
            <span>스토리지 도메인: {dashboard?.storageDomains ?? 0}</span>
            <br />
          </div>
          <br />
          <div>
            부팅{Localization.kr.TIME}(업타임): <strong>{dashboard?.bootTime ?? ""}</strong>
          </div>
        </div> */}
        
      </div>
      {/* <div className="type-info-boxs">
        <div className="type-info-box">
          CPU: {Math.floor(100 - (cpuMemory?.totalCpuUsagePercent ?? 0))}%
          {Localization.kr.AVAILABLE}
        </div>
        <div className="type-info-box">
          메모리: {Math.floor(100 - (cpuMemory?.totalMemoryUsagePercent ?? 0))}%
          {Localization.kr.AVAILABLE}
        </div>
        <div className="type-info-box">
          스토리지: {Math.floor(100 - (storage?.usedPercent ?? 0))}%
          {Localization.kr.AVAILABLE}
        </div>
      </div> */}

    </>
  );
};

export default Info;
