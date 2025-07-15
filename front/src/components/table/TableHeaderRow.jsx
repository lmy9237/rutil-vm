// TableHeaderRow.jsx
import React from "react";

const TableHeaderRow = ({ columns, sortConfig, onSort, columnWidths, onResizeStart }) => {
  return (
    <thead>
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            className="fw-700"
            onClick={() => !column.isIcon && onSort(column)}
            style={{
              textAlign: "center",
              cursor: column.isIcon ? "default" : "pointer",
              width: columnWidths[column.accessor] ?? column.width ?? 120,
              maxWidth: 600,
              position: "relative",
              userSelect: "none",
              ...column.style,
            }}
          >
            <div className="f-center">
              {column.header}
              {!column.isIcon && sortConfig.key === column.accessor && (
                <span className="ml-1">
                  {sortConfig.direction === "asc" ? "▲" : "▼"}
                </span>
              )}
            </div>

            {/* 드래그 핸들 */}
            <div
              className="table-resizer"
              onMouseDown={(e) => onResizeStart(e, column.accessor)}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                height: "100%",
                width: "6px",
                cursor: "col-resize",
                zIndex: 10,
              }}
            />
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeaderRow;
