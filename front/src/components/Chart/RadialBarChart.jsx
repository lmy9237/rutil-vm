import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import "./RadialBarChart.css";
import CONSTANT from "../../Constants";

const RadialBarChart = ({ 
  percentage=0,
  ...props
}) => {
  /*
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
  */

  const [series, setSeries] = useState([0]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "radialBar",
      // redrawOnParentResize: true,
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "85%",
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            color: "#111",
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
        formatter: (val) => `${parseInt(val)}%`,
        title: {
          formatter: () => "", 
        },
      },
    },
    labels: [],
    colors: ["#FF4560"],
  });

  useEffect(() => {
    setSeries([percentage]);

    let color = CONSTANT.color.alert;
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
    /* css로 빼기 */
    // <div className="f-center w-full">
      <div 
        className="f-center w-full h-full"
      >
        <ReactApexChart id="chart-radial"
          type="radialBar"
          options={chartOptions}
          series={series}
          height="100%"
          width="100%"
          {...props}
        />
      </div>
    // </div>

    //     <ReactApexChart type="radialBar" 
    //       id="chart-radial" /* css id,class 둘다 먹힘 */          
    //       options={chartOptions}
    //       series={series}
    //       height="100%" // 부모 기준
    //       {...props}
    //   />
    
  );
};

export default React.memo(RadialBarChart);
