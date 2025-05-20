import { useMemo } from "react";
import RutilVmLogo from "../../components/common/RutilVmLogo";
import InfoTable from "../../components/table/InfoTable";
import Localization from "../../utils/Localization";
import { useDashboard } from "../../api/RQHook";


/**
 * @name RutilGeneral
 * @description RutilManager > 일반
 * 경로: <메뉴>/rutil-manager
 * 
 * @returns {JSX.Element} RutilGeneral
 */
const RutilGeneral = () => {
  const {
    data: dashboard
  } = useDashboard();  
  
  const tableRows = useMemo(() => [
    { label: Localization.kr.DATA_CENTER, value: dashboard?.datacenters ?? 0 },
    { label: Localization.kr.CLUSTER, value: dashboard?.clusters ?? 0 },
    { label: Localization.kr.HOST, value: dashboard?.hosts ?? 0 },
    { label: Localization.kr.VM, value: `${dashboard?.vmsUp ?? 0} / ${dashboard?.vms ?? 0}` },
    { label: Localization.kr.DOMAIN, value: dashboard?.storageDomains ?? 0 },
    { label: Localization.kr.DATE_CREATED, value: dashboard?.dateCreated ?? Localization.kr.NOT_ASSOCIATED },
    {
      label: `부팅${Localization.kr.TIME} (${Localization.kr.UP_TIME})`,
      // value: dashboard?.dateBooted ?? Localization.kr.NOT_ASSOCIATED
      value: Localization.kr.renderTime(dashboard?.timeElapsedInMilli) ?? Localization.kr.NOT_ASSOCIATED
    },
  ], [dashboard]);

  return (
    <div className="rutil-general-contents f-start w-full">
      <RutilVmLogo className="big"
        details={`v${dashboard?.version} (${dashboard?.releaseDate})`}
      />
      <InfoTable tableRows={tableRows} />          
    </div>
  );
};

export default RutilGeneral;
