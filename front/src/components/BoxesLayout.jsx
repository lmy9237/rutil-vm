import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RadialBarChart from "./Chart/RadialBarChart";
import BarChart from "./Chart/BarChart";
import SuperAreaChart from "./Chart/SuperAreaChart";
import Grid from "./Chart/Grid";
import GridLegends from "./Chart/GridLegends";
import {
  RVI16,
  rvi16DiagonalUp, 
  rvi16DiagonalDown, 
  RVI24,
  severity2Icon,
} from "./icons/RutilVmIcons";
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
} from "../api/RQHook";
import Localization from "../utils/Localization";
import "./BoxesLayout.css"

/**
 * @name BoxesLayout
 * @description 박스 레이아웃
 *
 * @returns {JSX.Element} BoxesLayout
 */
export const BoxesLayout = ({
  // items=[],
  ...props
}) => {
  return (
    <div className="dash-boxes w-full f-btw gap-4"
      {...props}
    >
      {props.children}
    </div>
  );
}

export const BoxLayout = ({
  navigatePath=null, title, iconDef,
  cntTotal=null, cntUp=null, cntDown=null, alert=null, error=null, warning=null,
  ...props
}) => {
  const navigate = useNavigate();
  
  return (
    <div className={`box${!cntTotal ? " box-graph" : ""} v-start ${!cntTotal ? "gap-2" : "gap-8"}`}
      onClick={() => navigatePath && navigate(navigatePath)}
      {...props}
    >
      {title && 
        <BoxTitle title={title} iconDef={iconDef}/>
      }
      {cntTotal && 
        <BoxDetail 
          cntTotal={cntTotal} cntUp={cntUp} cntDown={cntDown} 
          alert={alert} error={error} warning={warning} 
        />}
      {props.children}
    </div>
  )
}

export const BoxTitle = ({
  title,
  iconDef,
  ...props
}) => (
  <span
    className="box-icon-title f-start gap-2"
    {...props}
  >
    {iconDef && <RVI24 className="box-icon" iconDef={iconDef} />}
    {title && <p className="box-icon-name fs-14">{title}</p>}
  </span>
)

/**
 * @name BoxDetail
 * @description 기본 박스안 내용
 * 
 * @prop {number?} cntToal 
 * @prop {number?} cntUp 
 * @prop {number?} cntDown
 * @prop {number?} alert
 * @prop {number?} error
 * @prop {number?} warning
 * @returns 
 */
export const BoxDetail = ({
  cntTotal, cntUp, cntDown, alert, error, warning,
  ...props
}) => {
  return (
    <div className={`box-detail f-end gap-8 w-full`}
      {...props}
    >
      {cntTotal && (<>
        <div className="box-detail-icons f-end fw-500 gap-2">
          {cntUp && (<div className="box-detail-icon f-end">
            <RVI16 className="box-icon sml" iconDef={rvi16DiagonalUp()} />
            <span className="up v-end">{cntUp}</span>
          </div>)}
          {cntDown && (<div className="box-detail-icon f-end fw-500">
            <RVI16 className="box-icon sml" iconDef={rvi16DiagonalDown()} />
            <span className="down v-end">{cntDown}</span>
          </div>)}
          {alert && (<div className="box-detail-icon f-end fw-500">
            {severity2Icon("ALERT", true)}
            <span className="alert v-end">{alert}</span>
          </div>)}
          {error && (<div className="box-detail-icon f-end fw-500 ">
            {severity2Icon("ERROR", true)}
            <span className="error v-end">{error}</span>
          </div>)}
          {warning && (<div className="box-detail-icon f-end fw-500 ">
            {severity2Icon("WARNING", true)}
            <span className="warning v-end">{warning}</span>
          </div>)}
        </div>
        <h1 className="f-end fs-24 fw-700">{cntTotal}</h1>
      </>)}
    </div>
  )
}

export const BoxChartSummary = ({
  unit, total, used, 
  ...props
}) => {
  const usedPercentageComputed = useMemo(() => (
    Math.floor((used / total) * 100)
  ), [total, used])

  const availablePercentageComputed = useMemo(() => (
    100 - usedPercentageComputed
  ), [usedPercentageComputed])

  return (
    <>
      <div className="box-detail f-start gap-8 w-full"
        {...props}
      >
        <div className="box-status v-start">
          <h1 className="fs-24">{availablePercentageComputed}%</h1>
          <span className="fs-8">{Localization.kr.AVAILABLE}</span>
          {/* (총 {total} {unit}) */}
        </div>
        <div className="box-status v-start">
          <div className="box-status-metric f-start gap-2">
            <span className="fs-14">{used}</span>
            <span className="fs-8">(사용 중 {unit})</span>
          </div>
          {/* (총 {total} {unit}) */}
          <hr className="w-full"/>
          <div className="box-status-metric f-start">
            <span className="fs-14">{total}</span>
            <span className="fs-8">(총 {unit})</span>
          </div>
        </div>
        
      </div>
      {props.children}
    </>
  )
}

export const BoxChartAllGraphs = ({
  type,
}) => {
  /*
  const chartContainerRef = useRef()
  const [chartSize, setChartSize] = useState({
    width: "50%",
  });

  const updateChartSize = () => {
    if (chartContainerRef.current) {
      const containerWidth = chartContainerRef.current.clientWidth;

      // let width = Math.max(containerWidth * 0.8, 200); // 기본 너비
      let height = Math.max(window.innerHeight * 0.2, 200); // 기본 높이

      if (window.innerWidth >= 2000) {
        // width = Math.max(containerWidth * 1, 280); 
        height = Math.max(window.innerHeight * 0.3, 300);
      }

      setChartSize({ height: `${height}px` });
    }
  };

  useEffect(() => {
    updateChartSize();
    window.addEventListener("resize", updateChartSize);

    return () => {
      window.removeEventListener("resize", updateChartSize);
    };
  }, []);
  */

  return (<>
    <div id={`graphs-${type}`}
      className="graphs v-center w-full"
    >
      <div 
        className="graphs-horizontal f-start w-full"
      >
        <RadialChartAll type={type}/>
        <BarChartAll className="ml-auto" type={type}/>
      </div>
      <WaveChartCpu type={type}/>
      <BoxGrids type={type} />
    </div>
  </>)
}

const RadialChartAll = ({
  type
}) => {
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

  const _percentage = useMemo(() => (
    type === "cpu"
      ? cpuMemory?.totalCpuUsagePercent
      : type === "memory" 
        ? cpuMemory?.totalMemoryUsagePercent 
        : type === "domain"
          ? storage?.usedPercent
          : 0
  ), [type, cpuMemory, storage])

  return (
    <RadialBarChart percentage={_percentage} />
  )
}

const BarChartAll = ({
  type,
  ...props
}) => {
  const {
    data: vmCpu = [],
    status: vmCpuStatus,
    isRefetching: isVmCpuRefetching,
    refetch: vmCpuRefetch,
    isError: isVmCpuError,
    error: vmCpuError,
    isLoading: isVmCpuLoading,
  } = useDashboardVmCpu();

  const {
    data: vmMemory = [],
    status: vmMemoryStatus,
    isRefetching: isVmMemoryRefetching,
    refetch: vmMemoryRefetch,
    isError: isVmMemoryError,
    error: vmMemoryError,
    isLoading: isVmMemoryLoading,
  } = useDashboardVmMemory();
  
  const {
    data: storageMemory = [],
    status: storageMemoryStatus,
    isRefetching: isStorageMemoryRefetching,
    refetch: storageMemoryRefetch,
    isError: isStorageMemoryError,
    error: storageMemoryError,
    isLoading: isStorageMemoryeLoading,
  } = useDashboardStorageMemory();

  const _data = useMemo(() => {
    return type === "cpu" 
      ? [...vmCpu] 
      : type === "memory" 
        ? [...vmMemory]
        : type === "domain"
          ? [...storageMemory]
          : []
  }, [type, vmCpu, vmMemory, storageMemory])

  const _keyPercent = useMemo(() => {
    return type === "cpu" 
    ? "cpuPercent"
    : type === "memory"  || type === "domain"
      ? "memoryPercent"
      : ""
  }, [type])

  return (
    <BarChartWrapper 
      data={_data}
      keyName="name"
      keyPercent={_keyPercent}
      {...props}
    />
  )
};

const WaveChartCpu = ({
  type
}) => {
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

  const _per = useMemo(() => {
    return type === "cpu" || type === "memory"
      ? host 
      : type === "domain"
        ? domain
        : []
  }, [type, host, domain])

  return (
    <div className="graph-wave fs-14 w-full">
      {/* <h2>Per CPU</h2> */}
      <SuperAreaChart type={type} per={_per} />
    </div>
  )
}

const BarChartWrapper = ({ 
  data, 
  keyName, 
  keyPercent,
  ...props
}) => {
  const names = useMemo(() => 
    [...data]?.map((e) => e[keyName]) ?? []
  , [data, keyName]);

  const percentages = useMemo(() => 
    [...data]?.map((e) => e[keyPercent]) ?? []
  , [data, keyPercent]);

  return <BarChart names={names} percentages={percentages} {...props} />;
};

const BoxGrids = ({
  type,
  ...props
}) => {
  return (
    <div className="boxes-grid w-full"
      {...props}
    >
      {type ? <BoxGrid type={type} />
        : ["cpu", "memory", "domain"].map((e) => (
          <BoxGrid type={e} />
        ))
      }
      <GridLegends />
    </div>
  )
}

const BoxGrid = ({
  type,
  ...props
}) => {

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
 
  const _data = useMemo(() => {
    return type === "cpu"
      ? vmMetricCpu
      : type === "memory"
        ? vmMetricMemory
        : type === "domain"
          ? storageMetric
          : []
  }, [type, vmMetricCpu, vmMetricMemory, storageMetric])

  return (
    <div className="box-grid w-full"
      {...props}
    >
      {/* <span className="fs-18">StorageDomain</span> */}
      <Grid className="grid-outer" type={type} data={_data} />
    </div>
    
  )
}

export default React.memo(BoxesLayout);
