import { useState, useEffect, useMemo } from "react";
import Logger                 from "@/utils/Logger";

/**
 * @name useSearch
 * @description 모든 데이터에서 검색 가능 (한글 포함, 공백 포함 검색 가능)
 *
 * @param {Array} data - 검색할 데이터 배열
 * @param {string} filterAccessor (탭이 존재했을 때) 데이터에서 확인 할 key값
 * @returns {Object} { searchQuery, setSearchQuery, filteredData }
 */
const useSearch = (
  data = [],
  filterAccessor="",
  filterTypeInit="all",
) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState(filterTypeInit)
  const [shouldRefreshPage, setShouldRefreshPage] = useState(false);

  useEffect(() => {
    Logger.debug(`useSearch > useEffect ...`)
    // 탭 변경 될 떄 마다 페이지 1로 전환하도록
    setShouldRefreshPage(true)
  }, [filterType, setFilterType])

  const filteredData = useMemo(() => {
    // if (!searchQuery.trim()) return data;
    const _accessors = !filterAccessor.trim() 
      ? []
      : filterAccessor.split(".")

    const filteredDataByTab = _accessors.length === 0
      ? [...data]
      : [...data].filter((e) => {
        let filterValueFound = e[_accessors[0]]
        switch (_accessors.length) {
        case 2: filterValueFound = e[_accessors[0]][_accessors[1]];break;
        case 3: filterValueFound = e[_accessors[0]][_accessors[1]][_accessors[2]];break;
        default: break;
        }
        return (filterType === "all")
          ? true
          : filterValueFound.toLowerCase() === filterType.toLowerCase()
      })

    if (!searchQuery.trim()) return filteredDataByTab;
    const normalizedSearchQuery = searchQuery.toLowerCase();

    return [...filteredDataByTab].filter((row) => {
      return Object.values(row).some((value) => {
        if (value === null || value === undefined) return false;

        // JSX 요소에서 텍스트 추출
        if (typeof value === "object" && value?.props?.children) {
          let childrenText = value.props.children;

          // `children`이 배열이면 문자열로 합침
          if (Array.isArray(childrenText)) {
            childrenText = childrenText.join(" ");
          }

          value = String(childrenText);
        }

        // 모든 필드를 소문자로 변환 후 검색
        const stringValue = String(value).toLowerCase();

        return stringValue.includes(normalizedSearchQuery);
      });
    });
  }, [data, searchQuery, setSearchQuery, filterType, setFilterType]);

  return {
    searchQuery, setSearchQuery, 
    filterType, setFilterType,
    shouldRefreshPage, setShouldRefreshPage,
    filteredData
  };
};

export default useSearch;
