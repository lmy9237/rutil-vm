import React from "react";
import { RVI16, rvi16Close } from "../icons/RutilVmIcons";
import Localization from "../../utils/Localization";
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
    <div className="normal-search-box f-start">
      <input type="text"
        placeholder={Localization.kr.PLACEHOLDER_SEARCH}
        value={searchQuery || ""}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="search-box-btn f-center" onClick={() => setSearchQuery("")}>
        <RVI16 iconDef={rvi16Close} />
      </div>
    </div>
  );
};

export default SearchBox;
