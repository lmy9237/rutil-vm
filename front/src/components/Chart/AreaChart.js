import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import './AreaChart.css'

const AreaChart = ({ series, datetimes }) => {
  const [options, setOptions] = useState({
    chart: {
      type: 'area',

      
      offsetX: 15,
    },
    colors: ['#1597E5', '#69DADB', 'rgb(231, 190, 231)'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      type: 'String',
      categories: datetimes
    },
    yaxis: {
      min: 0,      // 최소값 고정
      max: 100,    // 최대값 고정
    },
    tooltip: {
      x: {
        format: 'yy/MM/dd HH:mm'
      },
    },
  });

  //반응형
  const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.24);  // 초기 너비를 화면의 70%로 설정
  const [chartHeight, setChartHeight] = useState(window.innerHeight * 0.18); // 초기 높이를 화면의 30%로 설정

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth * 0.26);  // 화면 너비의 70%로 설정
      setChartHeight(window.innerHeight * 0.18); // 화면 높이의 30%로 설정
    };

    window.addEventListener('resize', handleResize); // 창 크기 변경 시 이벤트 감지

    return () => {
      window.removeEventListener('resize', handleResize); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, []);
  return (
    <div>
      <div id="chart">
        <ReactApexChart 
          options={options}
          series={series}
          type="area"
          width={chartWidth}
          height={chartHeight}
           />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default AreaChart