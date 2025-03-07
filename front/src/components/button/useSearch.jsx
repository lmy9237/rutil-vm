import { useState, useMemo } from "react";

/**
 * @name useSearch
 * @description 모든 데이터에서 검색 가능 (한 글자 입력 시에도 검색 가능, 한글 포함)
 *
 * @param {Array} data - 검색할 데이터 배열
 * @returns {Object} { searchQuery, setSearchQuery, filteredData }
 */
const useSearch = (data = []) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    return data.filter((row) => {
      const normalizedSearchQuery = searchQuery.replace(/\s+/g, "").toLowerCase();

      // ✅ searchText 필드가 있으면 해당 필드에서 검색
      if (row.searchText) {
        return row.searchText.replace(/\s+/g, "").toLowerCase().includes(normalizedSearchQuery);
      }

      return Object.values(row).some((value) => {
        if (value === null || value === undefined) return false;

        // ✅ JSX 요소에서 텍스트 추출 (한글 포함)
        if (typeof value === "object" && value?.props?.children) {
          let childrenText = value.props.children;

          // `children`이 배열이면 문자열로 합침
          if (Array.isArray(childrenText)) {
            childrenText = childrenText.join(" ");
          }

          value = String(childrenText);
        }

        const stringValue = String(value)
          .replace(/\s+/g, "") // 공백 제거
          .toLowerCase();

        return stringValue.includes(normalizedSearchQuery);
      });
    });
  }, [data, searchQuery]);

  return { searchQuery, setSearchQuery, filteredData };
};

export default useSearch;
