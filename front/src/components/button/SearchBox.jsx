import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

/**
 * @name SearchBox
 * @description 테이블 검색 기능을 위한 입력창 컴포넌트
 *
 * @prop {string} searchQuery - 현재 검색어
 * @prop {Function} setSearchQuery - 검색어를 업데이트하는 함수
 */
const SearchBox = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="nomal-search-box">
      <input
        type="text"
        placeholder="Search...dddd"
        value={searchQuery || ""}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={() => setSearchQuery("")}>
        <FontAwesomeIcon icon={faRefresh} fixedWidth />
      </button>
    </div>
  );
};

export default SearchBox;
