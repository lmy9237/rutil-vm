import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import './BarChart.css'

const BarChart = ({ names, percentages }) => {
  const [series, setSeries] = useState([{ data: [] /* 막대 값 */ }]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      offsetY: -15,
      offsetX: -55,
      type: 'bar',

    },
    grid: {
      show: false, // Hide grid lines
    },
    plotOptions: {
      bar: {
        barHeight: '100%',
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: 'bottom'
        },
      }
    },
    colors: ['#1597E5', '#69DADB', '#7C7DEA'],
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff'],
        fontSize: '0.25rem', // 텍스트 크기를 rem 단위로 설정합니다.
        fontWeight: '400'
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
      },
      offsetX: 0,
      dropShadow: {
        enabled: true
      }
    },
    stroke: {
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      categories: [],
      min: 0,
      max: 100,
      lineWidth: 0,
      labels: {
        show: false // Hide x-axis labels
      },
      gridLineWidth: 0, // Remove x-axis grid lines
      tickWidth: 0, // Remove x-axis tick marks 
      axisBorder: {
        show: false // Hide x-axis line
      },
      axisTicks: {
        show: false // Hide x-axis ticks
      }
    },
    yaxis: {
      labels: {
        show: false // y축 레이블을 제거합니다.
      },
      gridLineWidth: 0, // Remove y-axis grid lines
    },
    title: {
      text: '', // 제목을 제거합니다.
      align: 'center',
      floating: true
    },
    subtitle: {
      text: '', // 부제목을 제거합니다.
      align: 'center',
    },
    tooltip: {
      theme: 'dark',
      x: {
        show: false // x축 제목을 제거합니다.
      },
      y: {
        title: {
          formatter: function () {
            return '';
          }
        }
      }
    }
  });

  // 반응형
  const [chartWidth, setChartWidth] = useState(window.innerWidth * 0.15); 
  const [chartHeight, setChartHeight] = useState(window.innerHeight * 0.2); 
  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth * 0.15); // 창 너비의 50%
      setChartHeight(window.innerHeight * 0.2); // 창 높이의 30%
    };

    window.addEventListener('resize', handleResize); // 창 크기 변경 감지

    return () => {
      window.removeEventListener('resize', handleResize); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, []);
  useEffect(() => {
    setSeries([{ data: percentages }]);
    setChartOptions(prevOptions => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: names,
      }
    }))
  }, [names, percentages])

  return (
    <div>
      <div id="bar_chart">
        <ReactApexChart 
          options={chartOptions} 
          series={series}
          type="bar"
          width={chartWidth}
          height={chartHeight}
          />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default BarChart