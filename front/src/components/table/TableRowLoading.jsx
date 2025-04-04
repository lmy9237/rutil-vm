import Loading from "../common/Loading";
import Logger from "../../utils/Logger";

/**
 * @name TableRowLoading
 * @description (로딩 때) 테이블 Row
 *
 * @param {number} colLen (점유할) col 숫자
 * @returns
 */
const TableRowLoading = ({ colLen }) => {
  Logger.debug("TableRowLoading ...");
  return (
    <tr className="h-[10vh]">
      <td colSpan={colLen} className="table-loading-outer"> 
        <Loading />
      </td>
    </tr>
  );
};

export default TableRowLoading;
