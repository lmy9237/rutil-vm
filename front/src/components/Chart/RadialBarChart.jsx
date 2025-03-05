import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import "./RadialBarChart.css";

const RadialBarChart = ({ percentage }) => {
    // 차트 크기 상태 (초기값을 뷰포트 크기에 따라 설정)
  const [chartSize, setChartSize] = useState({
    width: Math.max(window.innerWidth * 0.15, 150), // 🔥 최소 크기 보장
    height: Math.max(window.innerHeight * 0.25, 200),
  });

  // 창 크기 변경 시 차트 크기 조정
  useEffect(() => {
    const handleResize = () => {
      setChartSize({
        width: Math.max(window.innerWidth * 0.15, 150), // 🔥 최소 크기 유지
        height: Math.max(window.innerHeight * 0.25, 200),
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // 도넛
  const [series, setSeries] = useState([0]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      offsetY: -5,
      offsetX: -20,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "85%",
        },
        track: {
          margin: 0, // 여백을 없앱니다.
        },
        dataLabels: {
          show: true,
          name: {
            show: false, 
          },
          value: {
            show: true,
            fontSize: "30px",
            fontWeight: "bold",
            color: "#111",
            offsetY: 10, // 텍스트를 아래로 이동
            formatter: (val) => {
              return parseInt(val) + "%"; // 값 포맷
            },
          },
        },
        track: {
          background: "#f0f0f0",
          strokeWidth: "100%", 
          margin: -3,// 선 두께 설정
        },
        stroke: {
          lineCap: "round", // 선의 끝 모양 설정
        },
      },
    },
    labels: [], // 라벨을 제거합니다.
    colors: ["#FF4560"], // 초기 색상 설정
  });

  useEffect(() => {
    setSeries([percentage]);

    let color = "#FF4560"; // 70 이상 빨강
    if (percentage < 30) {
      color = "#00E396"; // 30 미만이면 초록색
    } else if (percentage < 70) {
      color = "#FEB019"; // 30 이상 70 미만이면 노란색
    }

    setChartOptions((prevOptions) => ({
      ...prevOptions,
      colors: [color],
      plotOptions: {
        ...prevOptions.plotOptions,
        radialBar: {
          ...prevOptions.plotOptions.radialBar,
          dataLabels: {
            ...prevOptions.plotOptions.radialBar.dataLabels,
            value: {
              ...prevOptions.plotOptions.radialBar.dataLabels.value,
              formatter: (val) => {
                return parseInt(val) + "%"; // 값 포맷
              },
            },
          },
        },
      },
    }));
  }, [percentage]);

  return (
    <div>
      <div id="donut_chart">
        <ReactApexChart
          options={chartOptions}
          series={series}
          width={`${chartSize.width}px`}
          height={`${chartSize.height}px`}
          type="radialBar"
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default RadialBarChart;
