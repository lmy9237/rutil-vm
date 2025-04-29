import Localization from "../../utils/Localization";

/**
 * @name TableRowNoData
 * @description (데이터 없을 때) 테이블 Row
 * 
 * @param {number} colLen (점유할) col 숫자
 * @returns 
 */
const TableRowNoData = ({colLen = 1}) => {
  return (
    <tr className="text-center h-[10vh]">
      <td className="text-center" colSpan={colLen}>{Localization.kr.NO_INFO}</td>
    </tr>
  );
}

export default TableRowNoData