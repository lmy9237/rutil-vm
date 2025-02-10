import React from 'react';
import ReactApexChart from 'react-apexcharts';

const VmGeneralChart = () => {
  const [state, setState] = React.useState({
    series: [
      { data: [540, 580, 690, 1100, 1200, 1380],},
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
        categories: ['ex1','ex1','ex1','ex1','ex1','ex1',],
      },
    },
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={260}
      />
    </div>
  );
};

export default VmGeneralChart;
