// import "./TableRow.css";

/**
 * @name TableRowLoading
 * @description (로딩 때) 테이블 Row
 * 
 * @param {number} colLen (점유할) col 숫자
 * @returns 
 */
const TableRowLoading = ({colLen}) => {
  return (
    <tr className="text-center h-[10vh]">
      <td colSpan={colLen}>🌀 로딩중 ...</td>
    </tr>
  );
};

export default TableRowLoading;
