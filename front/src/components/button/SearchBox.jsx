import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { RVI16, rvi16Close } from "../icons/RutilVmIcons";
import "./SearchBox.css";
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
        placeholder="검색어를 입력하세요."
        value={searchQuery || ""}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="search-box-btn" onClick={() => setSearchQuery("")}>
        <RVI16 iconDef={rvi16Close} />
      </div>
    </div>
  );
};

export default SearchBox;
