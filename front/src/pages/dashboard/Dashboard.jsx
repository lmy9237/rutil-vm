import React, { useEffect, memo } from "react";
import { adjustFontSize } from "../../UIEvent";
import { debounce } from "lodash"; // 리스너의 호출 빈도를 줄이기 위해 디바운싱을 사용
import {
  faCloud,
  faEarthAmericas,
  faLayerGroup,
  faListUl,
  faMicrochip,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
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
import DashboardBoxGroup from "./DashboardBoxGroup";
import RadialBarChart from "../../components/Chart/RadialBarChart";
import BarChart from "../../components/Chart/BarChart";
import SuperAreaChart from "../../components/Chart/SuperAreaChart";
import Grid from "../../components/Chart/Grid";
import "./Dashboard.css";
import { ClusterIcon, DataCenterIcon, EventIcon, HostIcon, StorageDomainIcon, VmIcon } from "../../components/icons/RutilVmIcons";

//#region: RadialBarChart
const CpuApexChart = memo(({ cpu }) => { return <RadialBarChart percentage={cpu || 0} />; });
const MemoryApexChart = memo(({ memory }) => { return <RadialBarChart percentage={memory || 0} />; });
const StorageApexChart = memo(({ storage }) => { return <RadialBarChart percentage={storage || 0} />; });
//#endregion: RadialBarChart

//#region: BarChart
const BarChartWrapper = ({ data, keyName, keyPercent }) => {
  const names = React.useMemo(
    () => data?.map((e) => e[keyName]) ?? [],
    [data, keyName]
  );
  const percentages = React.useMemo(
    () => data?.map((e) => e[keyPercent]) ?? [],
    [data, keyPercent]
  );

  return <BarChart names={names} percentages={percentages} />;
};

const CpuBarChart = ({ vmCpu }) => (<BarChartWrapper data={vmCpu} keyName="name" keyPercent="cpuPercent" />);
const MemoryBarChart = ({ vmMemory }) => (
  <BarChartWrapper data={vmMemory} keyName="name" keyPercent="memoryPercent" />
);
const StorageMemoryBarChart = ({ storageMemory }) => (
  <BarChartWrapper
    data={storageMemory}
    keyName="name"
    keyPercent="memoryPercent"
  />
);
//#endregion: BarChart

//#region: Dashboard
const Dashboard = () => {
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

  useEffect(() => {
    const handleResize = debounce(adjustFontSize, 300);
    window.addEventListener("resize", handleResize);
    adjustFontSize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* 대시보드 section */}
      <div id="section">
        <DashboardBoxGroup
          boxItems={[
            {
              icon: <DataCenterIcon className="box-icon"/>,
              title: "데이터센터",
              cntTotal: dashboard?.datacenters ?? 0,
              cntUp:
                dashboard?.datacentersUp === 0 ? "" : dashboard?.datacentersUp,
              cntDown:
                dashboard?.datacentersDown === 0
                  ? ""
                  : dashboard?.datacentersDown,
              navigatePath: "/computing/rutil-manager/datacenters",
            },
            {
              icon: <ClusterIcon className="box-icon" />,
              title: "클러스터",
              cntTotal: dashboard?.clusters ?? 0,
              navigatePath: "/computing/rutil-manager/clusters",
            },
            {
              icon: <HostIcon className="box-icon" />,
              title: "호스트",
              cntTotal: dashboard?.hosts ?? 0,
              cntUp: dashboard?.hostsUp === 0 ? "" : dashboard?.hostsUp,
              cntDown: dashboard?.hostsDown === 0 ? "" : dashboard?.hostsDown,
              navigatePath: "/computing/rutil-manager/hosts",
            },
            {
              icon: <StorageDomainIcon className="box-icon" />,
              title: "스토리지 도메인",
              cntTotal: dashboard?.storageDomains ?? 0,
              navigatePath: "/computing/rutil-manager/storageDomains",
            },
            {
              icon:  <VmIcon className="box-icon" />,
              title: "가상머신",
              cntTotal: dashboard?.vms ?? 0,
              cntUp: dashboard?.vmsUp === 0 ? "" : dashboard?.vmsUp,
              cntDown: dashboard?.vmsDown === 0 ? "" : dashboard?.vmsDown,
              navigatePath: "/computing/rutil-manager/vms",
            },
            {
              icon: <EventIcon className="box-icon" />,
              title: "이벤트",
              cntTotal: dashboard?.events ?? 0,
              alert: dashboard?.eventsAlert === 0 ? "" : dashboard?.eventsAlert,
              error: dashboard?.eventsError === 0 ? "" : dashboard?.eventsError,
              warning:
                dashboard?.eventsWarning === 0 ? "" : dashboard?.eventsWarning,
              navigatePath: "/events",
            },
          ]}
        />

        <div className="dash-section center">
          <div className="dash-section-contents">
            <h1>CPU</h1>
            <div className="status-value flex">
              <h1>{100 - Math.floor((cpuMemory?.usedCpuCore / cpuMemory?.totalCpuCore) * 100)}{"% "} </h1>
              <div>사용가능 (총 {cpuMemory?.totalCpuCore} Core)</div>
            </div>
            <span>
              USED{" "}
              {Math.floor((cpuMemory?.usedCpuCore / cpuMemory?.totalCpuCore) * 100)}{"% "} / Total {cpuMemory?.totalCpuCore} Core
            </span>

            <div className="graphs flex">
              <div
                className="graph-wrap active-on-visible"
                data-active-on-visible-callback-func-name="CircleRun"
              >
                {
                  cpuMemory && (
                    <CpuApexChart cpu={cpuMemory?.totalCpuUsagePercent ?? 0} />
                  ) /* ApexChart 컴포넌트를 여기에 삽입 */
                }
              </div>
              <div>{vmCpu && <CpuBarChart vmCpu={vmCpu} />}</div>
            </div>

         
            {/*COMMIT { Math.floor((cpuMemory?.commitCpuCore)/(cpuMemory?.totalCpuCore)*100 )} % <br/> */}
            <div className="wave-graph">
              {/* <h2>Per CPU</h2> */}
              <div>
                <SuperAreaChart per={host} type="cpu"/>
              </div>
            </div>
          </div>

          <div className="dash-section-contents">
            <h1>MEMORY</h1>
            <div className="status-value flex">
              <h1>{cpuMemory?.freeMemoryGB?.toFixed(0)} GB</h1>
              <div>사용가능(총 {cpuMemory?.totalMemoryGB?.toFixed(0)} GB)</div>
            </div>
            <span>
              USED {cpuMemory?.usedMemoryGB?.toFixed(1)} GB / Total{" "}
              {cpuMemory?.totalMemoryGB?.toFixed(1)} GB
            </span>
            <div className="graphs flex">
              <div
                className="graph-wrap active-on-visible"
                data-active-on-visible-callback-func-name="CircleRun"
              >
                {
                  cpuMemory && (
                    <MemoryApexChart
                      memory={cpuMemory?.totalMemoryUsagePercent}
                    />
                  ) /* ApexChart 컴포넌트를 여기에 삽입 */
                }
              </div>
              <div>{vmMemory && <MemoryBarChart vmMemory={vmMemory} />}</div>
            </div>
            
            <div className="wave-graph">
              {/* <h2>Per MEMORY</h2> */}
              <div>
                <SuperAreaChart per={host} type="memory"/>
              </div>
            </div>
          </div>

          <div
            className="dash-section-contents"
            style={{ borderRight: "none" }}
          >
            <h1>STORAGE</h1>
            <div className="status-value flex">
              <h1>{storage?.freeGB} GB</h1>
              <div>사용가능(총 {storage?.totalGB} GB)</div>
            </div>
            <span>
              USED {storage?.usedGB} GB / Total {storage?.freeGB} GB
            </span>
            <div className="graphs flex">
              <div
                className="graph-wrap active-on-visible" 
                data-active-on-visible-callback-func-name="CircleRun"
              >
                {
                  storage && (
                    <StorageApexChart storage={storage?.usedPercent} />
                  ) /* ApexChart 컴포넌트를 여기에 삽입 */
                }
              </div>
              <div>
                {storageMemory && (
                  <StorageMemoryBarChart storageMemory={storageMemory} />
                )}
              </div>
            </div>
         
            <div className="wave-graph">
              {/* <h2>Per Network</h2> */}
              <div>
                {/* <SuperAreaChart per={host} /> */}
                <SuperAreaChart per={domain} type="domain"/>
              </div>
            </div>
          </div>
        </div>

        <div className="bar">
          <div>
            <span>CPU</span>
            <div className="grid-outer">
              <Grid type={"cpu"} data={vmMetricCpu} />
            </div>
          </div>
          <div>
            <span>MEMORY</span>
            <div className="grid-outer">
              <Grid type={"memory"} data={vmMetricMemory} />
            </div>
          </div>
          <div>
            <span>StorageDomain</span>
            <div className="grid-outer">
              <Grid type={"domain"} data={storageMetric} />
            </div>
          </div>
        </div>
      </div>{" "}
      {/* 대시보드 section끝 */}
    </>
  );
};
//#endregion: Dashboard

export default Dashboard;
