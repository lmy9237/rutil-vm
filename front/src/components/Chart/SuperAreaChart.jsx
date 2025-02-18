import React, { useEffect, useState } from "react";
import AreaChart from "./AreaChart";

const SuperAreaChart = ({ vmPer }) => {
  const [series, setSeries] = useState([]);
  const [datetimes, setDatetimes] = useState([]);

  // 날짜 변환 함수
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (Array.isArray(vmPer) && vmPer.length > 0) {
      const defaultItem = { name: "Unknown", time: [], dataList: [] };

      // 각 항목의 dataList 합계를 기준으로 정렬하여 상위 3개 선택
      const topThree = vmPer
        .map((item) => ({ ...defaultItem, ...item }))
        .sort((a, b) => {
          const sumA = a.dataList.reduce((sum, value) => sum + value, 0);
          const sumB = b.dataList.reduce((sum, value) => sum + value, 0);
          return sumB - sumA;
        })
        .slice(0, 3);

      const sortedData = topThree.map((item) => {
        const combined = item.time
          .map((time, index) => ({
            time,
            value: item.dataList[index] || 0,
          }))
          .sort((a, b) => new Date(a.time) - new Date(b.time));

        return {
          name: item.name,
          data: combined.map(({ time, value }) => ({
            x: formatDate(time),
            y: value,
          })),
        };
      });

      // Remove duplicate times
      const uniqueTimes = [...new Set(vmPer[0]?.time.map(formatDate))];

      setSeries(sortedData);
      setDatetimes(uniqueTimes);
    } else {
      setSeries([]);
      setDatetimes([]);
    }
  }, [vmPer]);

  return <AreaChart series={series} datetimes={datetimes} />;
};

export default SuperAreaChart;
