import { useCallback, } from "react";
// import toast from "react-hot-toast";
import { useToast }           from "@/hooks/use-toast";
import {
  RVI16,
  rvi16Close,
  rvi16Refresh
} from "@/components/icons/RutilVmIcons";
import IconButton             from "@/components/Input/IconButton";
import Localization           from "@/utils/Localization";
import Logger                 from "@/utils/Logger";
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
  onRefresh=()=>{},
  refetch=()=>{},
 }) => {
  const { toast } = useToast();

  const handleRefresh = useCallback((e) =>  {
    Logger.debug(`SearchBox > handleRefresh ... `)
    if (!refetch) return;
    refetch()
    import.meta.env.DEV && toast({ 
      title: "API 조회",
      description: "다시 조회 중 ..." 
    })
  }, [])
  
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
        {(
          <IconButton iconDef={rvi16Refresh("#717171")} 
            className="btn-refresh f-center"
            onClick={handleRefresh}
            // onClick={() =>  window.location.reload()}
          />
        )}
        {/* END: 다시 로딩 */}
       </div>
    </>
  );
};

export default SearchBox;
