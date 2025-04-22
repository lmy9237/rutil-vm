import React from "react";
import "./Table.css";

/**
 * @name TablesRow
 * @description 테이블 컴포넌트 (행)
 *
 * @prop {string[]} columns
 * @returns {JSX.Element} 테이블 컴포넌트
 * 
 */
const TablesRow = ({
  columns = [],
  data = [],
  isLoading, isError, isSuccess,
}) => (
  <div className="w-full overflow-y-hidden ">
    <table className="snap-table w-full">
      <tbody>
        {columns.map((column, index) => (
          <tr className="f-center" key={index}>
            <th>{column.header}</th>
            <td>{data[column.accessor] ?? ""}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TablesRow;
