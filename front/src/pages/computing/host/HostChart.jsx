import React, { useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const HostChart = ({ per, cpu=true }) => {
  const [series, setSeries] = useState([]);

  const formatDateKey = useCallback((isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString(); // ISO 전체로 하면 정확하게 정렬 가능
  }, []);

  const formatTimeLabel = useCallback((isoDate) => {
    const date = new Date(isoDate);
    return (
      date.getHours().toString().padStart(2, "0") + ":" +
      date.getMinutes().toString().padStart(2, "0")
    );
  }, []);

  useEffect(() => {
    if (!Array.isArray(per) || per.length === 0) {
      setSeries([]);
      return;
    }

    const sorted = [...per].sort((a, b) => new Date(a.time) - new Date(b.time));

    const timeKeySet = new Set(sorted.map((item) => formatDateKey(item.time)));
    const timeKeys = Array.from(timeKeySet).sort();

    const timeLabelMap = {};
    timeKeys.forEach((key) => {
      timeLabelMap[key] = formatTimeLabel(key);
    });

    const hostMap = {};
    sorted.forEach((item) => {
      if (!hostMap[item.name]) {
        hostMap[item.name] = {};
      }
      const key = formatDateKey(item.time);
      const value = cpu ? item.cpuPercent : item.memoryPercent;
      hostMap[item.name][key] = typeof value === "number" ? Math.floor(value) : null;
    });

    const newSeries = Object.entries(hostMap)
      .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
      .map(([name, valueMap]) => {
        const data = timeKeys.map((key) => ({
          x: timeLabelMap[key],
          y: valueMap[key] ?? null,
        }));
        return { name, data };
      });

    setSeries(newSeries);
  }, [per, formatDateKey, formatTimeLabel, cpu]);

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
      type: "category",
      labels: {
        formatter: (val) => val,
      },
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
    colors: ["#30A9DE", "#F0643B", "#7AC74F", "#FFA41B", "#9D4EDD", "#8B5CF6"],
  };

  return (
    <div className="vm-box-default show-yaxis" style={{ minWidth: "100%", padding: "16px" }}>
      <h3 className="box-title">호스트 {cpu ? "CPU" : "메모리"} 사용률</h3>
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

export default HostChart;
