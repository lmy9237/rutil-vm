import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import "./BarChart.css";

const BarChart = ({ names, percentages }) => {
  const chartContainerRef = useRef(null);

  const [chartSize, setChartSize] = useState({
    width: "100%", // 부모 div의 100% 사용
    height: "230px",
  });

  const updateChartSize = () => {
    if (chartContainerRef.current) {
      const containerWidth = chartContainerRef.current.clientWidth;

      let width = Math.max(containerWidth * 0.5, 230); // 기본 너비
      let height = Math.max(window.innerHeight * 0.2, 100); // 기본 높이

      if (window.innerWidth >= 2800) {
        width = Math.max(containerWidth *  0.9, 650); // 🔥 2000px 이상일 때 더 크게
        height = Math.max(window.innerHeight * 0.2, 230);
      }

      setChartSize({ width: `${width}px`, height: `${height}px` });
    }
  };
  useEffect(() => {
    const paddedNames = [...names];
    const paddedPercentages = [...percentages];
  
    // 3개가 안 되면 빈 항목으로 채움
    while (paddedNames.length < 3) {
      paddedNames.push("");           // 빈 카테고리
      paddedPercentages.push(0);      // 값은 0으로
    }
  
    setSeries([{ data: paddedPercentages }]);
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: paddedNames,
      },
    }));
  }, [names, percentages]);
  useEffect(() => {
    updateChartSize();
    window.addEventListener("resize", updateChartSize);

    return () => {
      window.removeEventListener("resize", updateChartSize);
    };
  }, []);

  const [series, setSeries] = useState([{ data: percentages }]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      offsetY: -15,
      offsetX: -55,
      type: "bar",
  
    },
    grid: {
      show: false,
    },
    plotOptions: {
      bar: {
        barHeight: "100%",
        distributed: true,
        horizontal: true,
        borderRadius: 3,
        dataLabels: {
          position: "bottom",
        },
      },
    },
    colors: ["#BBD8FF", "#FFDE6A", "#FFAABF"],
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      style: {
        colors: ["black"],
        fontSize: "13px",
        fontWeight: "600",
      },
      formatter: function (val, opt) {
        const label = opt.w.globals.labels[opt.dataPointIndex];
        if (val === 0 && !label) return ""; 
        return `${label}: ${val}`;
      },
      offsetX: 0,
 
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: names,
      min: 0,
      max: 100,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return "";
          },
        },
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const label = w.globals.labels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        if (!label) return ""; // 빈 항목이면 툴팁 안 뜸
        return `<div class="apex-tooltip">${label}: ${value}</div>`;
      },
    },
  });



  return (
    <div ref={chartContainerRef} style={{ width: "100%", maxWidth: "900px", minWidth: "100px" }}>
      <div id="bar_chart">
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="bar"
          width={chartSize.width}
          height={chartSize.height}
        />
      </div>
    </div>
  );
};

export default React.memo(BarChart);
