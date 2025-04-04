import Loading from "../common/Loading";

/**
 * @name TableRowLoading
 * @description (로딩 때) 테이블 Row
 * 
 * @param {number} colLen (점유할) col 숫자
 * @returns 
 */
const TableRowLoading = ({colLen}) => {
  return (
    <tr className="h-[10vh]">
      <td colSpan={colLen} className="table-loading-outer"> 
        <Loading />
      </td>
    </tr>
  );
};

export default TableRowLoading;
