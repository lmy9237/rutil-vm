import { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";

const SemiCircleChart = ({ names, percentage }) => {
  const chartOptions = {
    chart: {
      type: "radialBar",
      offsetY: -20,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: "97%",
          margin: 5,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: "#444",
            opacity: 1,
            blur: 2,
          },
        },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: -2,
            fontSize: "12px",
            formatter: function (val) {
              return `${val}%`;
            },
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91],
      },
    },
    labels: ["사용량"],
  };

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "auto" }}>
      <ReactApexChart options={chartOptions} series={[percentage]} type="radialBar" height={200} />
    </div>
  );
};

export default SemiCircleChart;
