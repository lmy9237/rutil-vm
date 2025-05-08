import React, { useMemo } from "react";
import useAsideState from "../../hooks/useAsideState";
import BarChart from "../../components/Chart/BarChart";
import {
  rvi24Cluster,
  rvi24Datacenter,
  rvi24Host,
  rvi24Storage,
  rvi24Desktop,
  rvi24Event,
  rvi24DeveloperBoard,
  rvi24Memory,
} from "../../components/icons/RutilVmIcons";
import {
  useDashboard,
  useDashboardCpuMemory,
  useDashboardStorage,
  useDashboardStorageMemory,
  useDashboardVmCpu,
  useDashboardVmMemory,
  useDashboardMetricStorage,
  useDashboardDomain,
  useDashboardHosts,
  useDashboardMetricVmCpu,
  useDashboardMetricVmMemory,
} from "../../api/RQHook";
import Localization from "../../utils/Localization";
import SectionLayout from "../../components/SectionLayout";
import {
  BoxesLayout,
  BoxLayout,
  BoxChartSummary,
  BoxChartAllGraphs,
} from "../../components/BoxesLayout";
import "./Dashboard.css";

/*
const BarChartWrapper = ({ data, keyName, keyPercent }) => {
  const names = useMemo(() => 
    data?.map((e) => e[keyName]) ?? []
  , [data, keyName]);

  const percentages = useMemo(() => 
    data?.map((e) => e[keyPercent]) ?? []
  , [data, keyPercent]);

  return <BarChart names={names} percentages={percentages} />;
};

const CpuBarChart = ({ vmCpu }) => (
  <BarChartWrapper data={vmCpu} keyName="name" keyPercent="cpuPercent" />
);
const MemoryBarChart = ({ vmMemory }) => (
  <BarChartWrapper data={vmMemory} keyName="name" keyPercent="memoryPercent" />
);
const StorageMemoryBarChart = ({ storageMemory }) => (
  <BarChartWrapper data={storageMemory} keyName="name" keyPercent="memoryPercent" />
);
*/

//#region: Dashboard
const Dashboard = () => {
  const { 
    asideVisible, setAsideWidthInPx
  } = useAsideState()
  const {
    data: dashboard,
    status: dashboardStatus,
    isRefetching: isDashboardRefetching,
    refetch: dashboardRefetch,
    isError: isDashboardError,
    error: dashboardError,
    isLoading: isDashboardLoading,
  } = useDashboard();

  const {
    data: cpuMemory,
    status: cpuMemoryStatus,
    isRefetching: isCpuMemoryRefetching,
    refetch: cpuMemoryRefetch,
    isError: isCpuMemoryError,
    error: cpuMemoryError,
    isLoading: isCpuMemoryLoading,
  } = useDashboardCpuMemory();

  const {
    data: storage,
    status: storageStatus,
    isRefetching: isStorageRefetching,
    refetch: storageRefetch,
    isError: isStorageError,
    error: storageError,
    isLoading: isStorageLoading,
  } = useDashboardStorage();

  const {
    data: host,
    status: hostStatus,
    isRefetching: isHostRefetching,
    refetch: hossRefetch,
    isError: isHostError,
    error: hostError,
    isLoading: isHostLoading,
  } = useDashboardHosts();

  const {
    data: domain,
    status: domainStatus,
    isRefetching: isDomainRefetching,
    refetch: domainRefetch,
    isError: isDomainError,
    error: domainError,
    isLoading: isDomainLoading,
  } = useDashboardDomain();

  const {
    data: vmCpu,
    status: vmCpuStatus,
    isRefetching: isVmCpuRefetching,
    refetch: vmCpuRefetch,
    isError: isVmCpuError,
    error: vmCpuError,
    isLoading: isVmCpuLoading,
  } = useDashboardVmCpu();

  const {
    data: vmMemory,
    status: vmMemoryStatus,
    isRefetching: isVmMemoryRefetching,
    refetch: vmMemoryRefetch,
    isError: isVmMemoryError,
    error: vmMemoryError,
    isLoading: isVmMemoryLoading,
  } = useDashboardVmMemory();

  const {
    data: storageMemory,
    status: storageMemoryStatus,
    isRefetching: isStorageMemoryRefetching,
    refetch: storageMemoryRefetch,
    isError: isStorageMemoryError,
    error: storageMemoryError,
    isLoading: isStorageMemoryeLoading,
  } = useDashboardStorageMemory();

  // const {
  //   data: vmCpuPer,
  //   status: vmCpuPerStatus,
  //   isRefetching: isVmCpuPerRefetching,
  //   refetch: vmCpuPerRefetch,
  //   isError: isVmCpuPerError,
  //   error: vmCpuPerError,
  //   isLoading: isVmCpuPeroading,
  // } = useDashboardPerVmCpu();

  // const {
  //   data: vmMemoryPer,
  //   status: vmMemoryPerStatus,
  //   isRefetching: isVmMemoryPerRefetching,
  //   refetch: vmMemoryPerRefetch,
  //   isError: isVmMemoryPerError,
  //   error: vmMemoryPerError,
  //   isLoading: isVmMemoryPeroading,
  // } = useDashboardPerVmMemory();

  const {
    data: vmMetricCpu,
    status: vmMetricCpuStatus,
    isRefetching: isvmMetricCpuRefetching,
    refetch: vmMetricCpuRefetch,
    isError: isvmMetricCpuError,
    error: vmMetricCpuError,
    isLoading: isvmMetricCpuoading,
  } = useDashboardMetricVmCpu();

  const {
    data: vmMetricMemory,
    status: vmMetricMemoryStatus,
    isRefetching: isVmMetricMemoryRefetching,
    refetch: vmMetricMemoryRefetch,
    isError: isVmMetricMemoryError,
    error: vmMetricMemoryError,
    isLoading: isVmMetricMemoryoading,
  } = useDashboardMetricVmMemory();

  const {
    data: storageMetric,
    status: storageMetricStatus,
    isRefetching: isstorageMetricRefetching,
    refetch: storageMetricRefetch,
    isError: isstorageMetricError,
    error: storageMetricError,
    isLoading: isstoragemMetricoading,
  } = useDashboardMetricStorage();
  
  const cpuCoreTotal = useMemo(() => (
    cpuMemory?.totalCpuCore
  ), [cpuMemory])
  const cpuCoreUsed = useMemo(() => (
    cpuMemory?.usedCpuCore
  ), [cpuMemory])
  const cpuUsedPercentageComputed = useMemo(() => (
    Math.floor((cpuMemory?.usedCpuCore / cpuMemory?.totalCpuCore) * 100)
  ), [cpuMemory])
  const cpuAvailablePercentageComputed = useMemo(() => (
    100 - cpuUsedPercentageComputed
  ), [cpuUsedPercentageComputed])
  const memAvailablePercentageComputed = useMemo(() => (
    cpuMemory?.freeMemoryGB?.toFixed(0)
  ), [cpuMemory])

  const boxItems = useMemo(() => [
    {
      iconDef: rvi24Datacenter(),
      title: Localization.kr.DATA_CENTER,
      cntTotal: dashboard?.datacenters ?? 0,
      cntUp: dashboard?.datacentersUp === 0 ? "" : dashboard?.datacentersUp,
      cntDown: dashboard?.datacentersDown === 0 ? "" : dashboard?.datacentersDown,
      navigatePath: "/computing/rutil-manager/datacenters",
    }, {
      iconDef: rvi24Cluster(),
      title: Localization.kr.CLUSTER,
      cntTotal: dashboard?.clusters ?? 0,
      navigatePath: "/computing/rutil-manager/clusters",
    }, {
      iconDef: rvi24Host(),
      title: Localization.kr.HOST,
      cntTotal: dashboard?.hosts ?? 0,
      cntUp: dashboard?.hostsUp === 0 ? "" : dashboard?.hostsUp,
      cntDown: dashboard?.hostsDown === 0 ? "" : dashboard?.hostsDown,
      navigatePath: "/computing/rutil-manager/hosts",
    }, {
      iconDef: rvi24Storage(),
      title: Localization.kr.DOMAIN,
      cntTotal: dashboard?.storageDomains ?? 0,
      navigatePath: "/computing/rutil-manager/storageDomains",
    }, {
      iconDef: rvi24Desktop(),
      title: Localization.kr.VM,
      cntTotal: dashboard?.vms ?? 0,
      cntUp: dashboard?.vmsUp === 0 ? "" : dashboard?.vmsUp,
      cntDown: dashboard?.vmsDown === 0 ? "" : dashboard?.vmsDown,
      navigatePath: "/computing/rutil-manager/vms",
    }, {
      iconDef: rvi24Event(),
      title: Localization.kr.EVENT,
      cntTotal: dashboard?.events ?? 0,
      alert: dashboard?.eventsAlert === 0 ? "" : dashboard?.eventsAlert,
      error: dashboard?.eventsError === 0 ? "" : dashboard?.eventsError,
      warning: dashboard?.eventsWarning === 0 ? "" : dashboard?.eventsWarning,
      navigatePath: "/events",
    },
  ], [dashboard]);

  return (
    <>
      {/* 대시보드 section */}
      <SectionLayout 
        className="section-dashboard v-start gap-4 h-full"
      >
        {/* <DashboardBoxGroup boxItems={boxItems} /> */}
        <BoxesLayout>{/* 항목 별 상태 박스 */}
          {[...boxItems].map(({
            navigatePath, title, iconDef,
            cntTotal, cntDown, cntUp,
            alert, error, warning
          }) => (
            <BoxLayout 
              navigatePath={navigatePath} title={title} iconDef={iconDef}
              cntTotal={cntTotal} cntUp={cntUp} cntDown={cntDown}
              alert={alert} error={error} warning={warning}
            />
          ))}
        </BoxesLayout>
        <BoxesLayout>{/* 그래프 박스 */}
          <BoxLayout 
            title={Localization.kr.CPU}
            iconDef={rvi24DeveloperBoard()}
          >
            <BoxChartSummary
              unit="Core"
              total={cpuCoreTotal}
              used={cpuCoreUsed}
            >
              <BoxChartAllGraphs type="cpu"/>
            </BoxChartSummary>
          </BoxLayout>
          <BoxLayout
            title={Localization.kr.MEMORY}
            iconDef={rvi24Memory()}
          >
            <BoxChartSummary
              unit="GiB"
              total={cpuMemory?.totalMemoryGB?.toFixed(1)}
              used={cpuMemory?.usedMemoryGB?.toFixed(1)}
            >
              <BoxChartAllGraphs type="memory"/>
            </BoxChartSummary>
          </BoxLayout>
          <BoxLayout
            title={Localization.kr.STORAGE}
            iconDef={rvi24Storage()}
          >
            <BoxChartSummary
              unit="GiB"
              total={storage?.totalGB?.toFixed(1)}
              used={storage?.usedGB?.toFixed(1)}
            >
              <BoxChartAllGraphs type="domain"/>
            </BoxChartSummary>
          </BoxLayout>
        </BoxesLayout>

        {/* <div className="dash-section f-btw">
          <div className="dash-section-contents">
            <h1 className="dash-con-title fs-16">CPU</h1>
            <div className="dash-status f-start">
              <h1 className="fs-24">{cpuAvailablePercentageComputed}</h1>
              <span className="unit fs-18">%</span>
              <div>{Localization.kr.AVAILABLE} (총 {cpuCoreTotal} Core)</div>
            </div>
            <span>
              {`${cpuCoreUsed}`} / {cpuCoreTotal} Core
            </span>
            <div className="graphs flex">
              <div
                className="graph-wrap"
              >
                {cpuMemory && (<RadialBarChart percentage={cpuMemory?.totalCpuUsagePercent ?? 0} />)}
              </div>
              {vmCpu && <CpuBarChart vmCpu={vmCpu} />}
            </div>
            <div className="graph-wave fs-14">
              <SuperAreaChart per={host} type="cpu" />
            </div>
          </div>

          <div className="dash-section-contents">
            <h1 className="dash-con-title fs-16">MEMORY</h1>
            <div className="dash-status f-start">
              <h1 className="fs-24">{memAvailablePercentageComputed}</h1>
              <span className="unit fs-18">GiB</span>
              <div>{Localization.kr.AVAILABLE}</div>
            </div>
            <span>
              사용중 {cpuMemory?.usedMemoryGB?.toFixed(1)} GiB / 총 {cpuMemory?.totalMemoryGB?.toFixed(1)} GiB
            </span>
            <div className="graphs f-start">
              <div
                className="graph-wrap"
              >
                {cpuMemory && (<RadialBarChart percentage={cpuMemory?.totalMemoryUsagePercent} />)}
              </div>
              {vmMemory && <MemoryBarChart vmMemory={vmMemory} />}
            </div>

            <div className="graph-wave fs-14">
              <SuperAreaChart per={host} type="memory" />
            </div>
          </div>

          <div className="dash-section-contents">
            <h1 className="dash-con-title fs-16">STORAGE</h1>
            <div className="dash-status f-start">
              <h1 className="fs-24">{storage?.freeGB}</h1>
              <span className="unit fs-18">GiB</span>
              <div>{Localization.kr.AVAILABLE} (총 {storage?.totalGB} GiB)</div>
            </div>
            <span>
              USED {storage?.usedGB} GiB / Total {storage?.freeGB} GiB
            </span>
            <div className="graphs f-start">
              <div className="graph-wrap"
              >
                {storage && (<RadialBarChart percentage={storage?.usedPercent || 0} />)}
              </div>
              {storageMemory && (<StorageMemoryBarChart storageMemory={storageMemory} />)}
            </div>
            <div className="graph-wave fs-14">
              <SuperAreaChart per={domain} type="domain" />
            </div>
          </div>
        </div> 
        
        <div className="bar-outer v-btw">
          <div className="bar f-btw fs-14">
            <div>
              <span className="fs-18">CPU</span>
              <Grid className="grid-outer" type={"cpu"} data={vmMetricCpu} />
            </div>
            <div>
              <span className="fs-18">MEMORY</span>
              <Grid className="grid-outer" type={"memory"} data={vmMetricMemory} />
            </div>
            <div>
              <span className="fs-18">StorageDomain</span>
              <Grid className="grid-outer" type={"domain"} data={storageMetric} />
            </div>
          </div>
          <GridLegends />
        </div>
        */}
      </SectionLayout>
      {/* 대시보드 section끝 */}
    </>
  );
};

export default Dashboard;
