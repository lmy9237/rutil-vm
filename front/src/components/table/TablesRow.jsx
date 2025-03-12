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
  isLoading, isError, isSuccess,
  columns = [],
  data = [],
}) => {

  return (
    <>
      <div className="w-full overflow-y-hidden ">
        <table className="snap-table">
          <tbody>
            {columns.map((column, index) => (
              <tr key={index}>
                <th>{column.header}</th>
                <td>{data[column.accessor] ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TablesRow;
