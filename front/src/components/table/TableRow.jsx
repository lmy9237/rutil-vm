import { Loading }                          from "@/components/common/Loading";
import Localization                     from "@/utils/Localization";
import Logger                           from "@/utils/Logger";

/**
 * @name TableRowLoading
 * @description (로딩 때) 테이블 Row
 *
 * @param {number} colLen (점유할) col 숫자
 * @returns
 */
export const TableRowLoading = ({ 
  colLen=1
}) => {
  return (
    <tr className="h-[10vh]">
      <td colSpan={colLen} className="table-loading-outer"> 
        <Loading />
      </td>
    </tr>
  );
};

/**
 * @name TableRowNoData
 * @description (데이터 없을 때) 테이블 Row
 * 
 * @param {number} colLen (점유할) col 숫자
 * @returns 
 */
export const TableRowNoData = ({colLen = 1}) => {
  return (
    <tr className="text-center h-[10vh]">
      <td className="text-center" colSpan={colLen}>{Localization.kr.NO_INFO}</td>
    </tr>
  );
}


/**
 * @name TableRowError
 * @description (데이터 조회 실패 했을 떄) 테이블 Row
 * 
 * @param {number} colLen (점유할) col 숫자
 * @returns 
 */
export const TableRowError = ({
  colLen = 1,
  code=400,
  message="",
}) => {
  return (
    <tr className="text-center h-[10vh]">
      <td className="text-center" colSpan={colLen}>{Localization.kr.NO_INFO}</td>
      {/* <td className="text-center" colSpan={colLen}>{Localization.kr.UNABLE_TO_FETCH}</td> */}
    </tr>
  );
}
