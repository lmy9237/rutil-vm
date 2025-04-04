import { RVI16, rvi16Close, rvi16Refresh } from "../icons/RutilVmIcons";
import Localization from "../../utils/Localization";
import IconButton from "../Input/IconButton";
import "./SearchBox.css";

/**
 * @name SearchBox
 * @description 테이블 검색 기능을 위한 입력창 컴포넌트
 *
 * @prop {string} searchQuery - 현재 검색어
 * @prop {function} setSearchQuery - 검색어를 업데이트하는 함수
 * @prop {function} onRefresh - 목록을 다시 재갱신하는 이벤트
 */
const SearchBox = ({ 
  searchQuery,
  setSearchQuery,
  onRefresh=null,
 }) => {
  return (
    <>
      {/* START: 검색박스 */}
      <div className="normal-search-box f-start">
        <input type="text"
          placeholder={Localization.kr.PLACEHOLDER_SEARCH}
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <RVI16 iconDef={rvi16Close}
          className="btn-search-box f-center" onClick={() => setSearchQuery("")}
        />
        {/* END: 검색박스 */}
        {/* START: 다시 로딩 */}
        {onRefresh && (
          <IconButton iconDef={rvi16Refresh("#717171")} 
            className="btn-refresh f-center"
            onClick={() => onRefresh()}
          />
        )}
        {/* END: 다시 로딩 */}
       </div>
    </>
  );
};

export default SearchBox;
