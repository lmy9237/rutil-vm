import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const HostGeneralChart = () => {
  const [series, setSeries] = useState([
    { name: "CPU", data: [] },
    { name: "메모리", data: [] },
    { name: "네트워크", data: [] },
  ]);

  useEffect(() => {
    const cpu = [];
    const mem = [];
    const net = [];

    for (let i = 0; i < 10; i++) {
      cpu.push(Math.floor(Math.random() * 40 + 50));   // 50~90%
      mem.push(Math.floor(Math.random() * 40 + 30));   // 30~70%
      net.push(Math.floor(Math.random() * 30 + 10));   // 10~40%
    }

    setSeries([
      { name: "CPU", data: cpu },
      { name: "메모리", data: mem },
      { name: "네트워크", data: net },
    ]);
  }, []);

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "straight" },

    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [
        "10:40", "10:45", "10:50", "10:55", "11:00",
        "11:05", "11:10", "11:15", "11:20", "11:25",
      ],
    },
    yaxis: {
      min: 0,
      max: 120,
      tickAmount: 6,
      labels: {
        formatter: (val) => `${val}%`,
      },
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    colors: ["#F0643B", "#30A9DE", "#9BC53D"],
  };

  return (
    <div className="vm-box-default " style={{ minWidth: "100%", padding: "16px" }}>
      <h3 className="box-title">실시간 사용량</h3>
      <hr className="w-full" />
      <div className="box-content" style={{ padding: "12px 0" }}>
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="line"
          height={230}
        />
      </div>
    </div>
  );
};

export default HostGeneralChart;
