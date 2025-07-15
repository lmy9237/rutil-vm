import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import CONSTANT from "@/Constants";
import "./RadialBarChart.css";

const RadialBarChart = ({
  label="라벨위치",
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

  const [series, setSeries] = useState([percentage]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "radialBar",
      // redrawOnParentResize: true,
    },
    labels: [label],
    colors: ["#FF4560"],
    plotOptions: {
      radialBar: {
        hollow: {
          size: "100",
        },
        dataLabels: {
          show: true,
          textAnchor: "start",
          distributed: false,
          name: {
            offsetY: 23, 
            color: CONSTANT.color.black,
          },
          value: {
            offsetY: -10, 
            color: CONSTANT.color.black,
            fontSize: '24px',
            formatter: (val) => `${parseInt(val)}%`,
          },
        },
        track: {
          strokeWidth: "100%",
          /*background: "#e7e7e7",*/
          margin: -10,
        },
        stroke: {
          lineCap: "round",
        },
      },
    },
     tooltip: {
      enabled: true,
      fillSeriesColor: false,
      theme: "light",
      custom: function({ series, seriesIndex }) {
        const used = parseInt(series[seriesIndex]);
        const remaining = 100 - used;
        return `
          <div style="
            text-align: center;
            font-size: 13px;
            padding: 8px;
            line-height: 1.4;
          ">
            <div><strong>사용률:</strong> ${used}%</div>
            <div><strong>남은 사용량:</strong> ${remaining}%</div>
          </div>
        `;
      }
  }
  });

  useEffect(() => {
    setSeries([percentage]);
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      colors: [CONSTANT.color.byPercentage(percentage)],
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
    <>
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
      </>
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
