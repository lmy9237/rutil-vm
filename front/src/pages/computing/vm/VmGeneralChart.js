import React from 'react';
import ReactApexChart from 'react-apexcharts';


/**
 * @name VmGeneralChart
 * @description 가상머신 일반정보 차트
 * (/computing/vms/<vmId>)
 * 
 * @param {string} vmId 가상머신 ID
 * @returns 
 * 
 * @todo 값 부여
 */
const VmGeneralChart = () => {
  const [state, setState] = React.useState({
    series: [
      { data: [540, 580, 690, 1100, 1200, 1380], },
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
        categories: ['ex1', 'ex1', 'ex1', 'ex1', 'ex1', 'ex1',],
      },
    },
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={215}
      />
    </div>
  );
};

export default VmGeneralChart;
