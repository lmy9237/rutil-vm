import React, { useEffect, useState, useCallback } from "react";
import ReactApexChart from "react-apexcharts";

/**
 * @name VmMonitorChart
 * @description CPU / 메모리 / 네트워크 단일 지표를 표시하는 재사용 가능한 차트 컴포넌트
 * @prop {Array} per - 지표 데이터 배열
 * @prop {string} metricKey - "cpuPercent" | "memoryPercent" | "networkPercent"
 * @prop {string} metricName - 차트 제목
 * @prop {string} color - 차트 색상 (선택)
 */
const VmMonitorChart = ({ per = [],  usageValue = null, metricKey, metricName, color = "#30A9DE" }) => {
  const [series, setSeries] = useState([]);
  const [datetimes, setDatetimes] = useState([]);

  const formatDate = useCallback((isoDate) => {
    const date = new Date(isoDate);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (Array.isArray(per) && per.length > 0) {
      const sortedData = [...per].sort((a, b) => new Date(a.time) - new Date(b.time));

      const dataSeries = sortedData.map((item) => ({
        x: formatDate(item.time),
        y: item[metricKey] != null ? Math.floor(item[metricKey]) : 0,
      }));

      setSeries([{ name: metricName, data: dataSeries }]);
      setDatetimes([...new Set(dataSeries.map((item) => item.x))]);
    } else {
      setSeries([]);
      setDatetimes([]);
    }
  }, [per, metricKey, metricName, formatDate]);

  const chartOptions = {
    chart: {
      type: "line",
      height: 300,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "straight", width: 2 },
    grid: {
      row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 },
    },
    xaxis: { categories: datetimes },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: { formatter: (val) => `${val}%` },
    },
    tooltip: { enabled: true },
    legend: { position: "top", horizontalAlign: "right" },
    colors: [color],
  };

  return (
    <div className="vm-box-default show-yaxis pt-2 mb-5">
      <div className="flex">
        <h3 className="box-title mr-3">{metricName} 사용률 </h3> 
        현재 사용량: <b className="ml-1">{usageValue}%</b>
      </div>
      <hr className="w-full" />
      <div className="box-content" style={{ padding: "12px 0" }}>
        <ReactApexChart options={chartOptions} series={series} type="line" height={200} />
      </div>
    </div>
  );
};

export default VmMonitorChart;
