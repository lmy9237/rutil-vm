import { useMemo } from "react";
import RutilVmLogo                from "@/components/common/RutilVmLogo";
import { InfoTable }              from "@/components/table/InfoTable";
import {
  useDashboard
} from "@/api/RQHook";
import Localization               from "@/utils/Localization";
import "./RutilGeneral.css"
import VmGeneralBarChart from "../computing/vm/VmGeneralBarChart";
import RutilGeneralBoxProps from "./RutilGeneralBoxProps";
import { RVI16, rvi16Cluster, rvi16DataCenter, rvi16Desktop, rvi16Host, rvi16Network, rvi16Storage } from "@/components/icons/RutilVmIcons";
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

  // 그래프값
  const usageItems = useMemo(() => [
    {
      label: "CPU",
      value: 72,
      description: "72% 사용됨 | 28% 사용 가능",
    },
    {
      label: "메모리",
      value: 64,
      description: "64% 사용됨 | 36% 사용 가능",
    },
    {
      label: "네트워크",
      value: 35,
      description: "35% 사용됨 | 65% 사용 가능",
    },
  ], []);
  return (
    // <div className="vm-detail-grid">
    //   <div className="vm-section section-top">
    //     <div className="vm-info-box-outer grid-col-span-2 vm-box-default">
    //       <h3 className="box-title">게스트 운영체제</h3>
    //       <hr className="w-full" />
    //       <div className="flex h-full">
    //         <div className="half-box">
    //           <RutilVmLogo className="big"
    //             details={`v${dashboard?.version} (${dashboard?.releaseDate})`}
    //           />
               
    //         </div>
    //        <InfoTable tableRows={tableRows} /> 
    //       </div>
    //     </div>

    //     <div className="vm-box-default">
    //       <h3 className="box-title">용량 및 사용량</h3>
    //       <hr className="w-full" />
    //       <div className="box-content">
    //        <VmGeneralBarChart/>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="vm-section section-bottom">
    //     <RutilGeneralBoxProps title="Data Center" icon={<RVI16 iconDef={rvi16DataCenter()} />} badge={1}>
    //       <div>Default :</div>
    //       <div>1 클러스터</div>
    //       <div>2 호스트</div>
    //     </RutilGeneralBoxProps>

    //     <RutilGeneralBoxProps title="Cluster" icon={<RVI16 iconDef={rvi16Cluster()} />} badge={2}>
    //       <div>Default :</div>
    //       <div>2 호스트</div>
    //       <div>13 가상머신</div>
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
    //   </div>
    // </div>

    <>
    <GeneralLayout
      top={
      <>
        <div className="vm-info-box-outer grid-col-span-2 vm-box-default">
          <div className="flex h-full">
            <div className="half-box mr-[40px]">
              <RutilVmLogo className="big"
                details={`v${dashboard?.version} (${dashboard?.releaseDate})`}
              />
            </div>
           <InfoTable tableRows={tableRows} /> 
          </div>
        </div>

        <div className="vm-box-default">
          <h3 className="box-title ">용량 및 사용량</h3>
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
          <div>Default :</div>
          <div>{`${dashboard?.clusters ?? 0} 클러스터`}</div>
          <div>{`${dashboard?.hosts ?? 0} 호스트`}</div>
        </RutilGeneralBoxProps>

        <RutilGeneralBoxProps
          title="Cluster"
          icon={<RVI16 iconDef={rvi16Cluster()} />}
          badge={dashboard?.clusters ?? 0}
        >
          <div>Default :</div>
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
          <div>-</div>
        </RutilGeneralBoxProps>

        <RutilGeneralBoxProps
          title="가상머신"
          icon={<RVI16 iconDef={rvi16Desktop()} />}
          badge={dashboard?.vms ?? 0}
        >
          <div>{`${dashboard?.vms ?? 0} 전체`}</div>
          <div>{`${dashboard?.vmsUp ?? 0} 전원 켜짐`}</div>
          <div>{`${dashboard?.vmsDown ?? 0} 종료됨`}</div>
        </RutilGeneralBoxProps>

        <RutilGeneralBoxProps
          title="스토리지 도메인"
          icon={<RVI16 iconDef={rvi16Storage()} />}
          badge={dashboard?.storageDomains ?? 0}
        >
          <div>총 {dashboard?.storageDomains ?? 0} 개</div>
          <div>-</div>
          <div>-</div>
        </RutilGeneralBoxProps>

        <RutilGeneralBoxProps
          title="네트워크"
          icon={<RVI16 iconDef={rvi16Network()} />}
          badge={1}
        >
          <div>ovirtmgmt</div>
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
