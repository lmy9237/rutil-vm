import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import "./RadialBarChart.css";

const RadialBarChart = ({ 
  percentage=0
}) => {
  const chartContainerRef = useRef(null);

  const [chartSize, setChartSize] = useState({
    width: "100%",
  });

  const updateChartSize = () => {
    if (chartContainerRef.current) {
      const containerWidth = chartContainerRef.current.clientWidth;

      let width = Math.max(containerWidth * 0.8, 200); // 기본 너비
      let height = Math.max(window.innerHeight * 0.2, 200); // 기본 높이

      if (window.innerWidth >= 2000) {
        width = Math.max(containerWidth * 1, 280); 
        height = Math.max(window.innerHeight * 0.3, 300);
      }

      setChartSize({ width: `${width}px`, height: `${height}px` });
    }
  };

  useEffect(() => {
    updateChartSize();
    window.addEventListener("resize", updateChartSize);

    return () => {
      window.removeEventListener("resize", updateChartSize);
    };
  }, []);

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
          margin: 0,
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
            offsetY: 10,
            formatter: (val) => {
              return parseInt(val) + "%";
            },
          },
        },
        track: {
          background: "#e7e7e7",
          strokeWidth: "100%",
          margin: -3,
        },
        stroke: {
          lineCap: "round",
        },
      },
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      theme: "light", // 'dark' 로 변경가능
      y: {
        formatter: (val) => `${val}%`,
        title: {
          // formatter: () => "제목",
        },
      },
    },
    labels: [],
    colors: ["#FF4560"],
  });

  useEffect(() => {
    setSeries([percentage]);

    let color = "#E71825";
    if (percentage < 50) {
      color = "#8FC855";
    } else if (percentage < 80) {
      color = "#F49153";
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
                return parseInt(val) + "%";
              },
            },
          },
        },
      },
    }));
  }, [percentage]);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", maxWidth: "600px", minWidth: "150px" }}>
      <div id="donut_chart">
        <ReactApexChart
          options={chartOptions}
          series={series}
          width={chartSize.width}
          height={chartSize.height || "250px"}
          type="radialBar"
        />
      </div>
    </div>
  );
};

export default React.memo(RadialBarChart);
