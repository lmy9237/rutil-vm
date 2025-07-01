import React, { useState, useEffect, useRef } from "react";
import { useNavigate }          from "react-router-dom";
import ReactApexChart           from "react-apexcharts";
import CONSTANT                 from "@/Constants";
import useGlobal                from "@/hooks/useGlobal";
import Logger                   from "@/utils/Logger";
import "./BarChart.css";

const BarChart = ({ 
  names,
  percentages,
  ids,         // ✅ 추가해야 함
  type,   
  ...props
}) => {
  const navigate = useNavigate(); 
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


  // 차트 수치가 0인건 1%로 표시하기
  // useEffect(() => {
  //   const paddedNames = [...names];
  //   const paddedPercentages = [...percentages];
  
  //   // 3개가 안 되면 빈 항목으로 채움
  //   // while (paddedNames.length < 3) {
  //   //   paddedNames.push("");           
  //   //   paddedPercentages.push(0);    
  //   // }
  //   const dynamicColors = paddedPercentages.map((e) => CONSTANT.color.byPercentage(e));
  //   while (paddedNames.length < 3) {
  //     paddedNames.push("");
  //     paddedPercentages.push(0);
  //     dynamicColors.push("transparent"); // 색도 빈 항목용
  //   }

  //   setSeries([{ data: paddedPercentages }]);
  //   setChartOptions((prevOptions) => ({
  //     ...prevOptions,
  //     colors: dynamicColors,
  //     xaxis: {
  //       ...prevOptions.xaxis,
  //       categories: paddedNames,
  //     },
  //   }));
  // }, [names, percentages]);
  useEffect(() => {
    const paddedNames = [...names];
    const paddedPercentages = [...percentages];

    while (paddedNames.length < 3) {
      paddedNames.push("");
      paddedPercentages.push(0);
    }

    const displayed = paddedPercentages.map((p, i) => {
      const isEmptyLabel = paddedNames[i] === "";
      return p === 0 && !isEmptyLabel ? 1 : p;
    });

    const real = [...paddedPercentages];
    const colors = displayed.map((val, i) => {
      const isEmptyLabel = paddedNames[i] === "";
      return isEmptyLabel ? "transparent" : CONSTANT.color.byPercentage(val);
    });

    setSeries([{ data: displayed, realData: real }]);
    setChartOptions((prev) => ({
      ...prev,
      colors,
      xaxis: {
        ...prev.xaxis,
        categories: paddedNames,
      },
    }));
  }, [names, percentages]);

  const { 
    top3VmsCpuUsed, top3VmsMemUsed, top3StoragesUsed
  } = useGlobal()

  const [series, setSeries] = useState([{ data: percentages }]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      redrawOnParentResize: true,
      offsetX: -15,
      events: {
        dataPointSelection: onDataPointSelected,
      },
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
    // grid: {
    //   show: true,
    //   borderColor:"#F7F7F7",
    //   strokeDashArray: 0,
    //   xaxis: {
    //     lines: { show: false }
    //   },
    //   yaxis: {
    //     lines: { show: true }
    //   }
    // },
    // plotOptions: {
    //   bar: {
    //     horizontal: true,
    //     barHeight: "100%",
    //     distributed: true,
    //     borderRadius: 1,
    //     dataLabels: {
    //       position: "bottom",
    //     },
    //   }
    // },
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
        return `${label}: ${val}%`;
      },
    },
    stroke: {
      width: 0.7,
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
      custom: function({ 
        series, 
        seriesIndex, 
        dataPointIndex,
        w
      }) {
        const label = w.globals.labels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        if (!label) return ""; // 빈 항목이면 툴팁 안 뜸
        return `<div class="apex-tooltip">${label}: ${value}</div>`;
      },
    },
  });

  function onDataPointSelected(_, __, opts) {
    Logger.debug(`BarChart > onDataPointSelected ...`)

    const srIndex = opts.seriesIndex;
    const dpIndex = opts.dataPointIndex;
    const d = opts.w.config.series[srIndex].data[dpIndex]
    const id = ids[dpIndex];

    Logger.debug(`BarChart ... id: ${d}, dpIndex: ${dpIndex}`)
    const realIds = type === "cpu"
      ? top3VmsCpuUsed 
      : type === "memory" 
        ? top3VmsMemUsed
        : top3StoragesUsed
    const realId = realIds[dpIndex]?.id;

    if (type === "domain") {
      navigate(`/storages/domains/${realId}`); 
    } else {
      navigate(`/computing/vms/${realId}`);
    }
  }

  return (
    <div className="f-center " style={{ marginTop: "-20px" }}>
      <ReactApexChart type="bar" 
        id="chart-bar" /* css id는 먹히지만 class명은 안먹힘 */
        options={chartOptions}
        series={series}
         height={props.height ?? 210}
        // width={chartSize.width}
        // height={chartSize.height || "250px"}
        {...props}
      />
    </div>
  );
};

export default React.memo(BarChart);
