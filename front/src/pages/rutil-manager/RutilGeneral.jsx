import { useMemo } from "react";
import RutilVmLogo                from "@/components/common/RutilVmLogo";
import { InfoTable }              from "@/components/table/InfoTable";
import {
  useDashboard,
  useDashboardCpuMemory,
  useDashboardStorage
} from "@/api/RQHook";
import Localization               from "@/utils/Localization";
import VmGeneralBarChart from "../../components/Chart/GeneralBarChart";
import RutilGeneralBoxProps from "./RutilGeneralBoxProps";
import {
  RVI16, 
  rvi16Cluster, 
  rvi16DataCenter, 
  rvi16Desktop, 
  rvi16Host, 
  rvi16Network, 
  rvi16Storage
} from "@/components/icons/RutilVmIcons";
import GeneralLayout from "@/components/GeneralLayout";

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
  
  const { data: cpuMemory } = useDashboardCpuMemory();
  const { data: storage } = useDashboardStorage();
  
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

  function getPercent(total, used) {
    if (total === 0) return 0;
    return Math.floor((used / total) * 100);
  }

  // 그래프값
  const usageItems = useMemo(() => {
    const cpuUsed = getPercent(cpuMemory?.totalCpuCore, cpuMemory?.usedCpuCore);
    const memoryUsed = getPercent(cpuMemory?.totalMemoryGB, cpuMemory?.usedMemoryGB);
    
    return [
      {
        label: "CPU",
        value: cpuUsed,
        description: `${cpuUsed}% 사용됨 | ${100 - cpuUsed}% 사용 가능`,
      },
      {
        label: "메모리",
        value: memoryUsed,
        description: `${memoryUsed}% 사용됨 | ${100 - memoryUsed}% 사용 가능`,
      },
      {
        label: "스토리지",
        value: (storage?.usedPercent ?? 0).toFixed(0),
        description: `${(storage?.usedPercent ?? 0).toFixed(0)}% 사용됨 | ${(100 - storage?.usedPercent ?? 0).toFixed(0)}% 사용 가능`,
      },
    ];
  }, [cpuMemory?.totalCpuCore, cpuMemory?.usedCpuCore, cpuMemory?.totalMemoryGB, cpuMemory?.usedMemoryGB]);

  return (
    <>
    <GeneralLayout
      top={
      <>
        <div className="grid-col-span-2 vm-box-default">
          <div className="vm-info-vnc-group flex h-full">
            <div className="half-box mr-[40px]">
              <RutilVmLogo className="big"
                details={`v${dashboard?.version}-${dashboard?.buildNo || 0} (${dashboard?.releaseDate})`}
              />
            </div>
           <InfoTable tableRows={tableRows} /> 
          </div>
        </div>
        <div className="vm-box-default">
          <h3 className="box-title">{Localization.kr.USAGE}</h3>
          <hr className="w-full" />
          <div className="box-content">
           <VmGeneralBarChart type="rutil" items={usageItems}/>
          </div>
        </div>
      </>
    }
    bottom={
      <>
        <RutilGeneralBoxProps
          title="Data Center"
          icon={<RVI16 iconDef={rvi16DataCenter()} />}
          badge={dashboard?.datacenters ?? 0}
        >
          {/* <div>Default :</div> */}
          <div>{`${dashboard?.clusters ?? 0} 클러스터`}</div>
          <div>{`${dashboard?.hosts ?? 0} 호스트`}</div>
        </RutilGeneralBoxProps>

        <RutilGeneralBoxProps
          title="Cluster"
          icon={<RVI16 iconDef={rvi16Cluster()} />}
          badge={dashboard?.clusters ?? 0}
        >
          {/* <div>Default :</div> */}
          <div>{`${dashboard?.hosts ?? 0} 호스트`}</div>
          <div>{`${dashboard?.vms ?? 0} 가상머신`}</div>
        </RutilGeneralBoxProps>

        <RutilGeneralBoxProps
          title="호스트"
          icon={<RVI16 iconDef={rvi16Host()} />}
          badge={dashboard?.hosts ?? 0}
        >
          <div>{`${dashboard?.hostsUp ?? 0} 연결됨`}</div>
          <div>{`${dashboard?.hostsDown ?? 0} 연결 끊김`}</div>
          {/* <div>-</div> */}
        </RutilGeneralBoxProps>

        <RutilGeneralBoxProps
          title="가상머신"
          icon={<RVI16 iconDef={rvi16Desktop()} />}
          badge={dashboard?.vms ?? 0}
        >
          {/* <div>{`${dashboard?.vms ?? 0} 전체`}</div> */}
          <div>{`${dashboard?.vmsUp ?? 0} 전원 켜짐`}</div>
          <div>{`${dashboard?.vmsDown ?? 0} 종료됨`}</div>
        </RutilGeneralBoxProps>

        <RutilGeneralBoxProps
          title="스토리지 도메인"
          icon={<RVI16 iconDef={rvi16Storage()} />}
          badge={dashboard?.storageDomains ?? 0}
        >
          <div>{`${dashboard?.storageDomainsUp ?? 0} 활성화`}</div>
          <div>{`${dashboard?.storageDomainsDown ?? 0} 비활성화`}</div>
        </RutilGeneralBoxProps>

        <RutilGeneralBoxProps
          title="네트워크"
          icon={<RVI16 iconDef={rvi16Network()} />}
          badge={dashboard?.networks ?? 0}
        >
          {/* <div>ovirtmgmt</div> */}
          <div>{`${dashboard?.hosts ?? 0} 호스트`}</div>
          <div>{`${dashboard?.vms ?? 0} 가상머신`}</div>
        </RutilGeneralBoxProps>
      </>
    }

    // bottom={
    //   <>
    //     <RutilGeneralBoxProps title="Data Center" icon={<RVI16 iconDef={rvi16DataCenter()} />} badge={1}>
    //       <div>Default :</div>
    //       <div>1 클러스터</div>
    //       <div>2 호스트</div>
    //     </RutilGeneralBoxProps>

    //     <RutilGeneralBoxProps title="Cluster" icon={<RVI16 iconDef={rvi16Cluster()} />} badge={2}>
    //       <div>Default :</div>
    //       <div>{`${dashboard?.hosts ?? 0} 호스트`}</div>
    //       <div>{`${dashboard?.vms ?? 0} 가상머신`}</div>
    //     </RutilGeneralBoxProps>

    //     <RutilGeneralBoxProps title="호스트" icon={<RVI16 iconDef={rvi16Host()}/>} badge={2}>
    //       <div>2 연결됨</div>
    //       <div>0 연결 끊김</div>
    //       <div>0 유지보수</div>
    //     </RutilGeneralBoxProps>

    //     <RutilGeneralBoxProps title="가상머신" icon={<RVI16 iconDef={rvi16Desktop()}/>} badge={13}>
    //       <div>6 전체</div>
    //       <div>5 전원 켜짐</div>
    //       <div>2 일시 중단됨</div>
    //     </RutilGeneralBoxProps>

    //     <RutilGeneralBoxProps title="스토리지 도메인" icon={<RVI16 iconDef={rvi16Storage()}/>} badge={4}>
    //       <div>2 활성</div>
    //       <div>1 연결 끊김</div>
    //       <div>1 유지보수</div>
    //     </RutilGeneralBoxProps>

    //     <RutilGeneralBoxProps title="네트워크" icon={<RVI16 iconDef={rvi16Network()}/>} badge={1}>
    //       <div>ovirtmgmt</div>
    //       <div>2 호스트</div>
    //       <div>13 가상머신</div>
    //     </RutilGeneralBoxProps>
   
    //   </>
    //   }
    />
</>
  );
};

export default RutilGeneral;
