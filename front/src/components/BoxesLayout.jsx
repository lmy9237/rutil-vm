import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  RVI16,
  rvi16DiagonalUp, 
  rvi16DiagonalDown, 
  RVI24,
  severity2Icon,
} from "@/components/icons/RutilVmIcons";
import {
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
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
import "./BoxesLayout.css"
import RadialBarChart         from "./Chart/RadialBarChart";
import BarChart               from "./Chart/BarChart";
import SuperAreaChart         from "./Chart/SuperAreaChart";
import Grid                   from "./Chart/Grid";
import GridLegends            from "./Chart/GridLegends";
import useGlobal from "@/hooks/useGlobal";

/**
 * @name BoxesLayout
 * @description 박스 레이아웃
 *
 * @returns {JSX.Element} BoxesLayout
 */
export const BoxesLayout = ({
  // items=[],
  isLast,
  ...props
}) => {
  const [styleDashBoxes, setStyleDashBoxes] = useState({
    height: '450px',
  });

  const updateHeightDashBoxes = () => {
    Logger.debug(`BoxChartAllGraphs > updateHeightGraphRest ... window.innerHeight: ${window.innerHeight}`)
    // let width = Math.max(containerWidth * 0.8, 200); // 기본 너비
    let heightSubstract = 64+40+110+4
    // let height = Math.max((window.innerHeight - heightSubstract) / 2, 200); // 기본 높이
    let height = window.innerHeight - heightSubstract

    if (window.innerWidth >= 2000) {
      // width = Math.max(containerWidth * 1, 280); 
      height = window.innerHeight - heightSubstract
      // height = Math.max(window.innerHeight * 0.3, 300);
    }

    setStyleDashBoxes({ height: `${height-13}px` });
  }
  
  useEffect(() => {
    Logger.debug(`BoxChartAllGraphs > useEffect ... (initial)`)
    if (!isLast) return;
    updateHeightDashBoxes()
  }, [])

  useEffect(() => {
    Logger.debug(`BoxChartAllGraphs > useEffect ... `)
    if (!isLast) return;
    window.addEventListener("resize", updateHeightDashBoxes);
    return () => window.removeEventListener("resize", updateHeightDashBoxes);;
  }, []);

  return (
    <div 
      className={`dash-boxes f-btw gap-4${isLast ? " dash-boxes-last" : ""}`}
      style={styleDashBoxes}
      {...props}
    >
      {props.children}
    </div>
  );
}

export const BoxLayout = ({
  navigatePath=null, title, iconDef,
  cntTotal=null, cntUp=null, cntDown=null, alert=null, error=null, warning=null,
  isLast=false,
  ...props
}) => {
  const navigate = useNavigate();
  
  return (
    <div className={`box${cntTotal === null || cntTotal === undefined ? " box-graph" : ""} v-start ${cntTotal === null || cntTotal === undefined ? "gap-2" : "gap-8"}`}
      onClick={() => navigatePath && navigate(navigatePath)}
      {...props}
    >
      {title &&
        <BoxTitle title={title} iconDef={iconDef}/>
      }
      {cntTotal !== undefined && cntTotal !== null &&
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
      {cntTotal !== undefined && (<>
        <div className="box-detail-icons f-end fw-500 gap-2">
          {cntUp && (<div className="box-detail-icon f-end gap-2">
            <RVI16 className="box-icon sml" iconDef={rvi16DiagonalUp()} />
            <span className="up v-end">{cntUp}</span>
          </div>)}
          {cntDown && (<div className="box-detail-icon f-end gap-2 fw-500">
            <RVI16 className="box-icon sml" iconDef={rvi16DiagonalDown()} />
            <span className="down v-end">{cntDown}</span>
          </div>)}
          {alert && (<div className="box-detail-icon f-end gap-2 fw-500">
            {severity2Icon("alert", true)}
            <span className="alert v-end">{alert}</span>
          </div>)}
          {error && (<div className="box-detail-icon f-end gap-2 fw-500">
            {severity2Icon("error", true)}
            <span className="error v-end">{error}</span>
          </div>)}
          {warning && (<div className="box-detail-icon f-end gap-2 fw-500 ">
            {severity2Icon("warning", true)}
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
        {/* <div className="box-status v-start ml-1.5">
          <h1 className="fs-24">{availablePercentageComputed}%</h1>
          <span className="fs-12">{Localization.kr.AVAILABLE}</span>
        </div> */}
        <div className="box-status v-start ml-1.5 ">
          <div className="box-status-metric f-start gap-2">
            <span className="fs-14">{used}</span>
            <span className="fs-12">(사용 중 {unit})</span>
          </div>
          {/* (총 {total} {unit}) */}
          <hr className="w-full"/>
          <div className="box-status-metric f-start">
            <span className="fs-14">{total}</span>
            <span className="fs-12">(총 {unit})</span>
          </div>
        </div>
        
      </div>
      {props.children}
    </>
  )
}

// export const BoxChartAllGraphs = ({
//   type,
// }) => {
//   // const chartContainerRef = useRef()
//   const [heightGraphRest, setHeightGraphRest] = useState(150);

//   const updateHeightGraphRest = () => {
//     Logger.debug(`BoxChartAllGraphs > updateHeightGraphRest ... window.innerHeight: ${window.innerHeight}`)
//     // let width = Math.max(containerWidth * 0.8, 200); // 기본 너비
//     let heightSubstract = 64+40+110+4+28+32+20+20+8+8+HEIGHT_GRAPH_HORIZ
//     // let height = Math.max((window.innerHeight - heightSubstract) / 2, 200); // 기본 높이
//     let height = (window.innerHeight - heightSubstract) / 2

//     if (window.innerWidth >= 2000) {
//       // width = Math.max(containerWidth * 1, 280); 
//       height = (window.innerHeight - heightSubstract) / 2
//       // height = Math.max(window.innerHeight * 0.3, 300);
//     }

//     setHeightGraphRest(height);
//   };
//   useEffect(() => {
//     updateHeightGraphRest()
//   }, [])

//   useEffect(() => {
//     Logger.debug(`BoxChartAllGraphs > useEffect ... `)
//     window.addEventListener("resize", updateHeightGraphRest);
//     return () => window.removeEventListener("resize", updateHeightGraphRest);;
//   }, []);

//   return (<>
//     <div id={`graphs-${type}`}
//       className="graphs v-center w-full mt-auto"
//     >
//       <div 
//         className="graphs-horizontal f-start w-full"
//         style={{
//           height: `${HEIGHT_GRAPH_HORIZ}px`,
//         }}
//       >
//         <RadialChartAll type={type}/>
//         <BarChartAll className="ml-auto" type={type}/>
//       </div>
//       <WaveChartCpu type={type} heightInn={heightGraphRest}
//         style={{
//           height: `${heightGraphRest}px`,
//         }}
//       />
//       <BoxGrids type={type}
//         style={{
//           height: `${heightGraphRest}px`,
//         }}
//       />
//     </div>
//   </>)
// }
export const BoxChartAllGraphs = ({ type }) => {
  const [heightGraphHoriz, setHeightGraphHoriz] = useState(250); // 동적 높이
  const [heightGraphRest, setHeightGraphRest] = useState(150);

  const updateHeightGraphRest = () => {
    const isWide = window.innerWidth >= 2300;
    const newHoriz = isWide ? 360 : 225;
    setHeightGraphHoriz(newHoriz);

    const heightSubstract = 64 + 40 + 110 + 4 + 28 + 32 + 20 + 20 + 8 + 8 + newHoriz;
    const height = (window.innerHeight - heightSubstract) / 2;
    setHeightGraphRest(height);
  };

  useEffect(() => {
    updateHeightGraphRest();
    window.addEventListener("resize", updateHeightGraphRest);
    return () => window.removeEventListener("resize", updateHeightGraphRest);
  }, []);

  return (
    <div id={`graphs-${type}`} className="graphs v-center w-full mt-auto">
      <div className="graphs-horizontal f-start w-full" style={{ height: `${heightGraphHoriz}px` }}>
        <RadialChartAll type={type} size={heightGraphHoriz} />
        <BarChartAll type={type} size={heightGraphHoriz} className="ml-auto"  
        /*
          title={
            type === "cpu" ? "CPU Top3 가상머신" // "가상머신 CPU 사용률 Top3"
            : type === "memory" ? " 메모리 Top3 가상머신" //"가상머신 메모리 사용률 Top3"
            : type === "domain" ? " 스토리지 Top3" //"가상머신 스토리지 사용률 Top3"
            : ""
          }
        */
        />
      </div>
      <WaveChartCpu type={type} heightInn={heightGraphRest} style={{ height: `${heightGraphRest}px` }} />
      <BoxGrids type={type} title={
        type === "cpu" ? "가상머신 CPU 사용률" :
        type === "memory" ? "가상머신 메모리 사용률" : 
        type === "domain" ? "스토리지 사용률" : ""
      } style={{ height: `${heightGraphRest}px` }} />
    </div>
    );
  };

const RadialChartAll = ({
  type, size
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

  const _label = useMemo(() => 
    type === "cpu"
      ? "전체 호스트 CPU avg %"
      : type === "memory" 
        ? "전체 호스트 메모리 avg %"
        : type === "domain"
          ? "전체 스토리지 %"
          : ""
  , [type, cpuMemory, storage])

  return (
    <div className="graph-chart-all v-center radial-graph"
      style={{
          width: `${size}px`,
          height: `${size}px`,
        // width: `${HEIGHT_GRAPH_HORIZ}px`,
        // height: `${HEIGHT_GRAPH_HORIZ}px`,
        // background: import.meta.env.DEV ? "olive" : ""
      }}
    >
      <RadialBarChart 
        label={_label}
        percentage={_percentage} 
      />
    </div>
  )
}

const BarChartAll = ({
  type, size, title,
  ...props
}) => {
  const _keyPercent = useMemo(() => {
    return type === "cpu" 
    ? "cpuPercent"
    : type === "memory"  || type === "domain"
      ? "memoryPercent"
      : ""
  }, [type])

  return (
    <div className="graph-chart-all f-center v-start"
      style={{
         height: `${size}px`,
        // height: `${HEIGHT_GRAPH_HORIZ}px`,
      }}
    >
      {title && (
        <div className="bar-chart-title fs-12 fw-500 w-full">
          {title}
        </div>
      )}
      <BarChartWrapper 
        keyName="name"
        keyPercent={_keyPercent}
        type={type}  
        {...props}
      />
    </div>
  )
};

const WaveChartCpu = ({
  type,
  heightInn,
  ...props
}) => {
  const {
    data: host,
  } = useDashboardHosts();
  
  const {
    data: domain,
  } = useDashboardDomain();

  const _per = useMemo(() => {
    return type === "cpu" || type === "memory"
      ? host 
      : type === "domain"
        ? domain
        : []
  }, [type, host, domain])

  return (
    <div className="graph-sub graph-wave w-full mb-4"
      {...props}
    >
      {/* <h2>Per CPU</h2> */}
      <SuperAreaChart type={type} per={_per} heightInn={heightInn} />
    </div>
  )
}

const BarChartWrapper = ({ 
  keyName, 
  keyPercent,
  type,
  ...props
}) => {

  const {
    top3VmsCpuUsed,
    top3VmsMemUsed,
    top3StoragesUsed
  } = useGlobal()
  
  const _data = useMemo(() => {
    return type === "cpu" 
      ? [...top3VmsCpuUsed] 
      : type === "memory" 
        ? [...top3VmsMemUsed]
        : type === "domain"
          ? [...top3StoragesUsed]
          : []
  }, [type, top3VmsCpuUsed, top3VmsMemUsed, top3StoragesUsed])

  const names = useMemo(() => _data.map((e) => e[keyName]), [_data, keyName]);
  const percentages = useMemo(() => _data.map((e) => e[keyPercent]), [_data, keyPercent]);
  const ids = () => {
    const originalIds = _data.map((e) => e.id); 
    const padded = [...originalIds];
    while (padded.length < 3) {
      padded.push(`placeholder-${padded.length}`);
    }
    return padded;
  };

  // ✅ 타이틀 텍스트 조건
  const title = useMemo(() => {
    if (type === "cpu") return "CPU Top3 가상머신";
    if (type === "memory") return "메모리 Top3 가상머신";
    if (type === "domain") return "스토리지 Top3";
    return "";
  }, [type]);


  return (
    <>
      <div style={{ position: "relative" }}>
        <div style={{ top:"2px", left:"15px" }}>{title}</div>
        <BarChart
          names={names}
          percentages={percentages}
          ids={ids}
          type={type}
          {...props}
        />
      </div>
    </>
  );
};


const BoxGrids = ({
  type,
  title,
  heightInn,
  ...props
}) => {
  return (
    <div className="graph-sub boxes-grid v-start w-full"
      {...props}
    >
      {title && (
        <div className="box-grid-title fs-12 fw-500 mb-3 ml-2">
          {title}
        </div>
      )}
      <BoxGrid type={type} />
      <GridLegends />
    </div>
  );
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
    <div className="box-grid gap-4 f-start w-full h-full mb-3"
      {...props}
    >
      {/* <span className="fs-18">StorageDomain</span> */}
      <Grid type={type} data={_data} />
    </div>
    
  )
}

export default React.memo(BoxesLayout);
