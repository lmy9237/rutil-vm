import React, { useCallback, useEffect, useState } from "react";
import AreaChart from "./AreaChart";
import Localization from "../../utils/Localization";

const SuperAreaChart = ({ 
  per,
  type
}) => {
  const [series, setSeries] = useState([]);
  const [datetimes, setDatetimes] = useState([]);

  // 날짜 변환 함수 (HH:mm 형식)
  const formatDate = useCallback((isoDate) => {
    const date = new Date(isoDate);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (Array.isArray(per) && per.length > 0) {
      // `historyDatetime`을 정확히 Date 객체로 변환하여 **오름차순** 정렬
      const sortedData = [...per].sort(
        (a, b) => new Date(a.historyDatetime).getTime() - new Date(b.historyDatetime).getTime()
      );

      let selectedData = [];

      // type에 따라 CPU 또는 Memory 데이터만 선택
      if (type === "cpu") {
        selectedData = sortedData.map((item) => ({
          x: formatDate(item.historyDatetime),
          y: Math.floor(item.avgCpuUsage), // 소수점 아래 버림
        }));
      } else if (type === "memory") {
        selectedData = sortedData.map((item) => ({
          x: formatDate(item.historyDatetime),
          y: Math.floor(item.avgMemoryUsage), // 소수점 아래 버림
        }));
      } else if (type === "domain") {
        selectedData = sortedData.map((item) => ({
          x: formatDate(item.historyDatetime),
          y: Math.floor(item.avgDomainUsagePercent), // 소수점 아래 버림
        }));
      }

      // 차트 시리즈 업데이트
      setSeries([
        {
          name: type === "cpu" ? "CPU 사용률 (%)" : `${Localization.kr.MEMORY} 사용률 (%)`,
          data: selectedData,
        },
      ]);

      // 중복 없는 시간 리스트 생성 (오름차순 반영)
      const uniqueTimes = [...new Set(sortedData.map((item) => formatDate(item.historyDatetime)))];
      setDatetimes(uniqueTimes);
    } else {
      setSeries([]);
      setDatetimes([]);
    }
  }, [per, type]);

  return <AreaChart series={series} datetimes={datetimes} />;
};

export default React.memo(SuperAreaChart);
