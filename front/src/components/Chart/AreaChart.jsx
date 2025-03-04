import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import "./AreaChart.css";

const AreaChart = ({ series, datetimes }) => {
  const [options, setOptions] = useState({
    chart: {
      type: "area",
      offsetX: 15,
    },
    colors: ["#1597E5", "#69DADB", "rgb(177, 143, 216)"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "String",
      categories: datetimes,
    },
    yaxis: {
      min: 0, // 최소값 고정
      max: 100, // 최대값 고정
    },
    tooltip: {
      x: {
        format: "yy/MM/dd HH:mm",
      },
    },
  });

  //반응형
  // const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.24);
  // const [chartHeight, setChartHeight] = useState(window.innerHeight * 0.18); 

  // useEffect(() => {
  //   const handleResize = () => {
  //     setChartWidth(window.innerWidth * 0.26);
  //     setChartHeight(window.innerHeight * 0.18); 
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize); 
  //   };
  // }, []);
  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          width="80%"
          height="180px"
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default AreaChart;
