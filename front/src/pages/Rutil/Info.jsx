import RutilVmLogo from "../../components/common/RutilVmLogo";
import { useDashboard } from "../../api/RQHook";
import Localization from "../../utils/Localization";
import InfoTable from "../../components/table/InfoTable";
import Logger from "../../utils/Logger";

/**
 * @name Info
 * @description RutilManager > 일반
 *
 * @returns {JSX.Element} Info
 */
const Info = () => {
  const { data: dashboard = [] } = useDashboard();  
  const tableRows = [
    { label: Localization.kr.DATA_CENTER, value: dashboard?.datacenters ?? 0 },
    { label: Localization.kr.CLUSTER, value: dashboard?.clusters ?? 0 },
    { label: Localization.kr.HOST, value: dashboard?.hosts ?? 0 },
    { label: Localization.kr.VM, value: `${dashboard?.vmsUp ?? 0} / ${dashboard?.vms ?? 0}` },
    { label: "스토리지 도메인", value: dashboard?.storageDomains ?? 0 },
    { label: `부팅${Localization.kr.TIME}(${Localization.kr.UP_TIME})`, value: dashboard?.bootTime ?? "" },
  ];

  Logger.debug("Info ...");
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
      </div>
    </>
  );
};

export default Info;
