import React from 'react';
import ReactApexChart from 'react-apexcharts';

/**
 * @name VmGeneralChart
 * @description 가상머신 일반정보 차트
 * (/computing/vms/<vmId>)
 * 
 * @prop {string} vmId 가상머신 ID
 * @returns {JSX.Element} VmGeneralChart
 * 
 * @todo 값 부여
 */
const VmGeneralChart = ({diskData}) => {
  const categories = diskData.map((disk) => disk.alias);
  const seriesData = diskData.map((disk) => disk.virtualSize / (1024 ** 3)); // GB 단위 변환

  const [state, setState] = React.useState({
    series: [
      { data: seriesData, },
      // { data: [540, 580, 690, 1100, 1200, 1380], },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 300,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: true,
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: categories,
        // categories: ['ex1', 'ex1', 'ex1', 'ex1', 'ex1', 'ex1',],
      },
    },
  });

  return (
    <div id="chart">
      <ReactApexChart type="bar"
        options={state.options}
        series={state.series}
        height={215}
      />
    </div>
  );
};

export default VmGeneralChart;
