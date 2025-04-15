import { useState, useMemo } from "react";

/**
 * @name useSearch
 * @description 모든 데이터에서 검색 가능 (한글 포함, 공백 포함 검색 가능)
 *
 * @param {Array} data - 검색할 데이터 배열
 * @returns {Object} { searchQuery, setSearchQuery, filteredData }
 */
const useSearch = (
  data = []
) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const normalizedSearchQuery = searchQuery.toLowerCase();

    return data.filter((row) => {
      return Object.values(row).some((value) => {
        if (value === null || value === undefined) return false;

        // ✅ JSX 요소에서 텍스트 추출
        if (typeof value === "object" && value?.props?.children) {
          let childrenText = value.props.children;

          // `children`이 배열이면 문자열로 합침
          if (Array.isArray(childrenText)) {
            childrenText = childrenText.join(" ");
          }

          value = String(childrenText);
        }

        // ✅ 모든 필드를 소문자로 변환 후 검색
        const stringValue = String(value).toLowerCase();

        return stringValue.includes(normalizedSearchQuery);
      });
    });
  }, [data, searchQuery]);

  return { searchQuery, setSearchQuery, filteredData };
};

export default useSearch;
