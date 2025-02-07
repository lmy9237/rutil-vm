import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const generateData = (count, yrange) => {
  const series = [];
  for (let i = 0; i < count; i++) {
    const x = (i + 1).toString();
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    series.push({ x, y });
  }
  return series;
};

const HeatMapChart = () => {
  const [chartSize, setChartSize] = useState({
    width: window.innerWidth * 0.3,
    height: window.innerHeight * 0.17,
  });

  const [series, setSeries] = useState([
    {
      name: 'Metric1',
      data: generateData(8, { min: 0, max: 90 }),
    },
    {
      name: 'Metric2',
      data: generateData(8, { min: 0, max: 90 }),
    },
  ]);

  const options = {
    chart: {
      type: 'heatmap',
      offsetX: 20,
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#008FFB'],
  };

  useEffect(() => {
    const updateChartSize = () => {
      setChartSize({
        width: window.innerWidth * 0.3,
        height: window.innerHeight * 0.17,
      });
    };

    window.addEventListener('resize', updateChartSize);
    return () => window.removeEventListener('resize', updateChartSize);
  }, []);

  return (
    <div id="heatmap_chart">
      <ReactApexChart
        options={options}
        series={series}
        type="heatmap"
        width={chartSize.width}
        height={chartSize.height}
      />
    </div>
  );
};

export default HeatMapChart;


// import React, { useEffect, useState } from 'react';
// import ReactApexChart from 'react-apexcharts';

// const generateData = (count, yrange) => {
//   const series = [];
//   for (let i = 0; i < count; i++) {
//     const x = (i + 1).toString();
//     const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
//     series.push({ x, y });
//   }
//   return series;
// };

// const HeatMapChart = () => {
//   const [chartSize, setChartSize] = useState({
//     width: window.innerWidth * 0.3,
//     height: window.innerHeight * 0.17,
//   });

//   const [series, setSeries] = useState([
//     {
//       name: 'Metric1',
//       data: generateData(8, { min: 0, max: 90 }),
//     },
//     {
//       name: 'Metric2',
//       data: generateData(8, { min: 0, max: 90 }),
//     },
//   ]);

//   const options = {
//     chart: {
//       type: 'heatmap',
//       offsetX: 20,
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     colors: ['#008FFB'],
//   };

//   useEffect(() => {
//     const updateChartSize = () => {
//       setChartSize({
//         width: window.innerWidth * 0.3,
//         height: window.innerHeight * 0.17,
//       });
//     };

//     window.addEventListener('resize', updateChartSize);
//     return () => window.removeEventListener('resize', updateChartSize);
//   }, []);

//   return (
//     <div id="heatmap_chart">
//       <ReactApexChart
//         options={options}
//         series={series}
//         type="heatmap"
//         width={chartSize.width}
//         height={chartSize.height}
//       />
//     </div>
//   );
// };