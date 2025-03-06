import { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import "./AreaChart.css";

const AreaChart = ({ series, datetimes }) => {
  const chartContainerRef = useRef(null);

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

  // 반응형 차트 크기 조정
  const [chartSize, setChartSize] = useState({
    width: "100%", // 부모 div의 100% 사용
    height: "30vh", // 뷰포트 높이의 30% 사용
  });

  // 부모 div 크기에 맞춰 차트 크기 조정
  const updateChartSize = () => {
    if (chartContainerRef.current) {
      const containerWidth = chartContainerRef.current.clientWidth;

      let width = Math.max(containerWidth * 0.8, 300); // 기본 너비
      let height = Math.max(window.innerHeight * 0.25, 200); // 기본 높이

      if (window.innerWidth >= 2000) {
        width = Math.max(containerWidth * 1, 600); // 🔥 2000px 이상일 때 더 크게
        height = Math.max(window.innerHeight * 0.25, 330);
      }

      setChartSize({ width: `${width}px`, height: `${height}px` });
    }
  };


  // 창 크기 변경 시 차트 크기 업데이트
  useEffect(() => {
    updateChartSize();
    window.addEventListener("resize", updateChartSize);

    return () => {
      window.removeEventListener("resize", updateChartSize);
    };
  }, []);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", maxWidth: "900px", minWidth: "300px" }}>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          width={chartSize.width}
          height={chartSize.height}
        />
      </div>
    </div>
  );
};

export default AreaChart;
