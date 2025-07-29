import React, { useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const HostGeneralChart = ({ per }) => {
  const [series, setSeries] = useState([
    { name: "CPU", data: [] },
    { name: "메모리", data: [] },
    { name: "네트워크", data: [] },
  ]);
  const [datetimes, setDatetimes] = useState([]);
  
  // 날짜 변환 함수 (HH:mm 형식)
  const formatDate = useCallback((isoDate) => {
    const date = new Date(isoDate);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (Array.isArray(per) && per.length > 0) {
      const sortedData = [...per].sort(
        (a, b) => new Date(b.time) - new Date(a.time) // 최신순 정렬
      ).reverse(); // 차트에선 오래된 → 최신 순서로

      setSeries([
        {
          name: "CPU",
          data: sortedData.map((item) => ({
            x: formatDate(item.time),
            y: Math.floor(item.cpuPercent),
          })),
        },
        {
          name: "메모리",
          data: sortedData.map((item) => ({
            x: formatDate(item.time),
            y: Math.floor(item.memoryPercent),
          })),
        },
        {
          name: "네트워크",
          data: sortedData.map((item) => ({
            x: formatDate(item.time),
            y: item.networkPercent != null ? Math.floor(item.networkPercent) : 0,
          })),
        },
      ]);

      const uniqueTimes = [...new Set(sortedData.map((item) => formatDate(item.time)))];
      setDatetimes(uniqueTimes);
    } else {
      setSeries([]);
      setDatetimes([]);
    }
  }, [per]);

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "straight",
      width: 2, 
    },

    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: datetimes,
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (val) => `${val}%`,
      },
    },
    tooltip: {
      enabled: true,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    colors: ["#F0643B", "#30A9DE", "#9BC53D"],
  };

  return (
    <div className="vm-box-default show-yaxis" style={{ minWidth: "100%", padding: "16px" }}>
      <h3 className="box-title ">실시간 사용량</h3>
      <hr className="w-full" />
      <div className="box-content" style={{ padding: "12px 0" }}>
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="line"
          height={240}
        />
      </div>
    </div>
  );
};

export default HostGeneralChart;
