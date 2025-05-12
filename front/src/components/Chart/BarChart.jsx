import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import "./BarChart.css";

const BarChart = ({ 
  names,
  percentages,
  ...props
}) => {
  // const chartContainerRef = useRef(null);
  // const [chartSize, setChartSize] = useState(
  //   {
  //     width: "100%", // 부모 div의 100% 사용
  //   }
  // );

  // const updateChartSize = () => {
  //   if (chartContainerRef.current) {
  //     const containerWidth = chartContainerRef.current.clientWidth;
  
  //     let width = Math.max(containerWidth * 0.5, 230); // 기본 width
  //     let height = 184; // ✅ 기본 고정 height (px)
  
  //     if (window.innerWidth >= 2000) {
  //       width = Math.max(containerWidth * 0.9, 650);
  //       height = 260; // ✅ 화면 크면 height도 고정 증가
  //     }
  
  //     setChartSize({ width: `${width}px`, height: `${height}px` });
  //   }
  // };
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
  // useEffect(() => {
  //   updateChartSize();
  //   window.addEventListener("resize", updateChartSize);

  //   return () => {
  //     window.removeEventListener("resize", updateChartSize);
  //   };
  // }, []);

  const [series, setSeries] = useState([{ data: percentages }]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      redrawOnParentResize: true,
      // offsetY: -15,
      // offsetX: -35,
    },
    grid: {
      show: false,
    },
    plotOptions: {
      bar: {
        barHeight: "95%",
        columnWidth: "10px",
        distributed: true,
        horizontal: true,
        borderRadius: 1,
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
        fontWeight: "300",
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
    // <div className="f-center w-full">
      <div className="f-center h-full">
        <ReactApexChart type="bar" 
          id="chart-bar" /* css id는 먹히지만 class명은 안먹힘 */
          options={chartOptions}
          series={series}
          height="100%" // 부모 기준
          // width={chartSize.width}
          // height={chartSize.height || "250px"}
          {...props}
        />
      </div>
    // </div>
  );
};

export default React.memo(BarChart);
