import React from "react";
import "./InfoTable.css";

const InfoTable = ({ 
  tableRows
}) => {
  return (
    <div className="info-table-outer">
      <table className="table">
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index}>
              <th>{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InfoTable;
