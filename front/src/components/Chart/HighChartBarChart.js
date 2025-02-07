
import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const HighChartBarChart = ({ type, data }) => {
  const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.2);
  const [chartHeight, setChartHeight] = useState(window.innerHeight * 0.2);
  
  const formatSeriesData = (data) => {
    return data.map((item) => ({
      name: item.name,
      data: [type === 'cpu' ? item.cpuPercent : item.memoryPercent],
    }));
  };

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar",
      width: chartWidth,
      height: chartHeight,
    },
    title: {
      text: "",
      align: "left",
    },
    xAxis: {
      categories: [""],
      title: {
        text: "",
      },
      lineWidth: 0,
      labels: {
        enabled: false, // Hide x-axis labels
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: "",
        align: "high",
      },
      labels: {
        enabled: false, // Hide y-axis labels
      },
      gridLineWidth: 0,
    },
    tooltip: {
      valueSuffix: "%",
    },
    plotOptions: {
      bar: {
        borderRadius: "70%",
        dataLabels: {
          enabled: true,
        },
      },
    },
    legend: {
      enabled: false, // Hide legend
    },
    credits: {
      enabled: false, // Hide Highcharts credits
    },
    series: formatSeriesData(data),
    // series: [
    //   {
    //     name: "vm1",
    //     data: [80],
    //   },
    //   {
    //     name: "vm2",
    //     data: [75],
    //   },
    //   {
    //     name: "vm3",
    //     data: [10],
    //   },
    // ],
  });

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth * 0.2);
      setChartHeight(window.innerHeight * 0.2);
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        chart: {
          ...prevOptions.chart,
          width: window.innerWidth * 0.2,
          height: window.innerHeight * 0.2,
        },
      }));
    };

    window.addEventListener("resize", handleResize); // Detect window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Remove event listener on component unmount
    };
  }, []);

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default HighChartBarChart;

// const HighChartBarChart = ({ names, percentages }) => {
//   const [series, setSeries] = useState([{ data: [] }]);/* 막대 값 */ 
//   const [chartOptions, setChartOptions] = useState({
//       chart: {
//         type: "bar",
//         width: chartWidth,
//         height: chartHeight,
//       },
//       title: {
//         text: "",
//         align: "left",
//       },
//       xAxis: {
//         categories: [""],
//         title: {
//           text: "",
//         },
//         lineWidth: 0,
//         labels: {
//           enabled: false, // Hide x-axis labels
//         },
//       },
//       yAxis: {
//         min: 0,
//         max: 100,
//         title: {
//           text: "",
//           align: "high",
//         },
//         labels: {
//           enabled: false, // Hide y-axis labels
//         },
//         gridLineWidth: 0,
//       },
//       tooltip: {
//         valueSuffix: "%",
//       },
//       plotOptions: {
//         bar: {
//           borderRadius: "70%",
//           dataLabels: {
//             enabled: true,
//           },
//         },
//       },
//       legend: {
//         enabled: false, // Hide legend
//       },
//       credits: {
//         enabled: false, // Hide Highcharts credits
//       },
//       series: [{
//           name: "vm1",
//           data: [80],
//         },
//         {
//           name: "vm2",
//           data: [75],
//         },
//         {
//           name: "vm3",
//           data: [10],
//         },
//       ],
//     });

    
//   const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.2); 
//   const [chartHeight, setChartHeight] = useState(window.innerHeight * 0.2); 
//   useEffect(() => {
//     const handleResize = () => {
//       setChartWidth(window.innerWidth * 0.2); // 창 너비의 50%
//       setChartHeight(window.innerHeight * 0.2); // 창 높이의 30%
//     };

//     window.addEventListener('resize', handleResize); // 창 크기 변경 감지

//     return () => {
//       window.removeEventListener('resize', handleResize); // 컴포넌트 언마운트 시 이벤트 리스너 제거
//     };
//   }, []);


//   return (
//     <div>
//       <HighchartsReact 
//         highcharts={Highcharts} 
//         options={chartOptions} 
//         width={chartWidth}
//         height={chartHeight}
//       />
//     </div>
//   );
// };

// export default HighChartBarChart;