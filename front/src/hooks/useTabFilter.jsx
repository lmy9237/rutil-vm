import { useState, useEffect, useMemo } from "react";
import Logger                 from "@/utils/Logger";

const useTabFilter = (
  data=[],
  accessor="",
  /* filters=[], */
) => {
  const [filterType, setFilterType] = useState("all")
  const [shouldRefreshPage, setShouldRefreshPage] = useState(false);
  /* const _filters = [
    { key: "all",       label: "모두", },
    ...filters
  ]*/

  useEffect(() => {
    Logger.debug(`useTabFilter > useEffect ...`)
    // 탭 변경 될 떄 마다 페이지 1로 전환하도록
    setShouldRefreshPage((prev) => true)
  }, [filterType, setFilterType])

  const filteredDataByTab = useMemo(() => (
    accessor === "" ? [...data] : [...data].filter((e) => (
      (filterType === "all")
        ? true
        : e[accessor].toLowerCase() === filterType.toLowerCase()
    ))
  ), [data, filterType]);

  return {
    filterType, setFilterType,
    shouldRefreshPage, setShouldRefreshPage,
    filteredDataByTab
  }
}

export default useTabFilter;
