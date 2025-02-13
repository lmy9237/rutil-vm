import React, { useEffect, memo } from "react";
import RadialBarChart from "../../components/Chart/RadialBarChart";
import BarChartWrapper from "../../components/Chart/BarChartWrapper";
import SuperAreaChart from "../../components/Chart/SuperAreaChart";
import "./DashboardDetailStat.css";

/**
 * @name DashboardDetailStat
 * @description ...
 *
 * @param {string} title 제목
 * @param {number} totalPercentage 총 퍼센티지
 * 
 * @returns
 */
const DashboardDetailStat = ({ title, totalPercentage }) => {
  const CpuApexChart = memo(({ cpu }) => { return <RadialBarChart percentage={cpu || 0} />; });
  const CpuBarChart = ({ vmCpu }) => (<BarChartWrapper data={vmCpu} keyName="name" keyPercent="cpuPercent" />);

  console.log("...")
  return (
    <div className="dash-section-contents">
      <h1>{title}</h1>
      <div className="graphs">
        <div
          className="graph-wrap active-on-visible"
          data-active-on-visible-callback-func-name="CircleRun"
        >
          <CpuApexChart cpu={totalPercentage ?? 0} />{" "}
          {/* ApexChart 컴포넌트를 여기에 삽입 */}
        </div>
        <div>
          <CpuBarChart /> {/* BarChart 컴포넌트를 여기에 삽입 */}
        </div>
      </div>
      <span>USED 64 Core / Total 192 Core</span>
      <div className="wave-graph">
        <h2>Per CPU</h2>
        <div>
          <SuperAreaChart /> {/* AreaChart 컴포넌트를 여기에 삽입 */}
        </div>
      </div>
    </div>
  );
};

export default DashboardDetailStat;
