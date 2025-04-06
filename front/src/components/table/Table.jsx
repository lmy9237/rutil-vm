// 안씀 tables에서 씀

import React, { useState, useRef, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import "./Table.css";
import Logger from "../../utils/Logger";

/**
 * @name Table
 * @description 테이블 컴포넌트
 *
 * @param {string} columns 컬럼목록
 * @returns
 * 
 * @deprecated 사용안함? (이민영 확인필요)
 */
const Table = ({
  isLoading, isError, isSuccess,
  columns = [], data = [],
  onRowClick = () => {},
  clickableColumnIndex = [],
  onContextMenuItems = false,
  onClickableColumnClick = () => {},
}) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [tooltips, setTooltips] = useState({});
  const [contextRowIndex, setContextRowIndex] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [sortedData, setSortedData] = useState(data);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const tableRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target) &&
        (!menuRef.current || !menuRef.current.contains(event.target)) &&
        !event.target.closest(".header-right-btns button") &&
        !event.target.closest(".Overlay")
      ) {
        resetSelection();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setContextMenu(null);
        setContextRowIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);

  useEffect(() => {
    if (sortConfig.key) {
      sortData(sortConfig.key, sortConfig.direction);
    } else {
      setSortedData(data);
    }
  }, [data, sortConfig]);

  const resetSelection = () => {
    setSelectedRowIndex(null);
    setSelectedRows([]);
    setContextMenu(null);
    if (typeof onRowClick === "function") onRowClick([]);
  };

  const sortData = (key, direction) => {
    const sorted = [...data].sort((a, b) => {
      const aValue = a[key] ?? "";
      const bValue = b[key] ?? "";
      const result = String(aValue).localeCompare(String(bValue), "ko", {
        sensitivity: "base",
      });
      return direction === "asc" ? result : -result;
    });
    setSortedData(sorted);
  };

  const handleSort = (column) => {
    Logger.debug(`Table > handleSort ... column: ${JSON.stringify(column, null, 2)}`);
    if (column.isIcon) return;
    const { accessor } = column;
    const direction =
      sortConfig.key === accessor && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: accessor, direction });
  };

  const handleMouseEnter = (e, rowIndex, colIndex, content) => {
    Logger.debug(`Table > handleMouseEnter ... rowIndex: ${rowIndex}, colIndex: ${colIndex}`);
    const element = e.target;
    const hasOverflow = element.scrollWidth > element.clientWidth;
    setTooltips((prevTooltips) => ({
      ...prevTooltips,
      [`${rowIndex}-${colIndex}`]: hasOverflow ? content : null,
    }));
  };

  const handleRowClick = (rowIndex, e) => {
    Logger.debug(`Table > handleRowClick ... rowIndex: ${rowIndex}`);
    const clickedRow = sortedData[rowIndex];
    if (e.ctrlKey) {
      setSelectedRows((prev) => {
        const updated = prev.includes(rowIndex)
          ? prev.filter((index) => index !== rowIndex)
          : [...prev, rowIndex];
        const selectedData = updated.map((index) => sortedData[index]);
        onRowClick(selectedData);
        return updated;
      });
    } else {
      setSelectedRows([rowIndex]);
      onRowClick([clickedRow]);
    }
  };

  const handleContextMenu = (e, rowIndex) => {
    Logger.debug("Table > handleContextMenu ... ");
    e.preventDefault();
    const rowData = sortedData[rowIndex];
    setSelectedRows([rowIndex]);
    setSelectedRowIndex(rowIndex);

    if (typeof onRowClick === "function") {
      onRowClick([rowData]);
    }

    if (onContextMenuItems) {
      const menuItems = onContextMenuItems(rowData);
      setContextMenu({
        mouseX: e.clientX - 260,
        mouseY: e.clientY - 50,
        menuItems,
      });
    } else {
      Logger.warn("No context menu items provided.");
    }

    setContextRowIndex(rowIndex);
  };

  Logger.debug("Table ...");
  return (
    <div className="w-full overflow-y-auto overflow-x-hidden">
      <table
        className="custom-table"
        ref={tableRef}
        style={{ tableLayout: "fixed", width: "100%" }}
      >
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                onClick={() => handleSort(column)}
                style={{
                  cursor: column.isIcon ? "default" : "pointer",
                  width: column.width,
                }}
              >
                <div className="flex justify-center items-center">
                  {column.header}
                  {!column.isIcon && sortConfig.key === column.accessor && (
                    <span>{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ textAlign: "center", height: "10vh" }}
              >
                No data available
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={(e) => {
                  setSelectedRowIndex(rowIndex);
                  setContextRowIndex(null);
                  onRowClick(row);
                  handleRowClick(rowIndex, e);
                }}
                onContextMenu={(e) => handleContextMenu(e, rowIndex)}
                style={{
                  backgroundColor:
                    selectedRows.includes(rowIndex) ||
                    contextRowIndex === rowIndex
                      ? "rgb(218, 236, 245)"
                      : "transparent",
                }}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    data-tooltip-id={`tooltip-${rowIndex}-${colIndex}`}
                    data-tooltip-content={row[column.accessor]}
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign:
                        typeof row[column.accessor] === "string" ||
                        typeof row[column.accessor] === "number"
                          ? "left"
                          : "center",
                      verticalAlign: "middle",
                      cursor:
                        row[column.accessor] &&
                        clickableColumnIndex.includes(colIndex)
                          ? "pointer"
                          : "default",
                      color:
                        row[column.accessor] &&
                        clickableColumnIndex.includes(colIndex)
                          ? "blue"
                          : "inherit",
                      fontWeight:
                        row[column.accessor] &&
                        clickableColumnIndex.includes(colIndex)
                          ? "800"
                          : "normal",
                    }}
                    onClick={(e) => {
                      if (
                        row[column.accessor] &&
                        clickableColumnIndex.includes(colIndex)
                      ) {
                        e.stopPropagation();
                        if (onClickableColumnClick) {
                          onClickableColumnClick(row);
                        }
                      }
                    }}
                    onMouseOver={(e) => {
                      if (
                        row[column.accessor] &&
                        clickableColumnIndex.includes(colIndex)
                      ) {
                        e.target.style.textDecoration = "underline";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (
                        row[column.accessor] &&
                        clickableColumnIndex.includes(colIndex)
                      ) {
                        e.target.style.textDecoration = "none";
                      }
                    }}
                  >
                    {typeof row[column.accessor] === "object" &&
                    column.header === "icon" ? (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {row[column.accessor]}
                      </div>
                    ) : (
                      row[column.accessor]
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {contextMenu && (
        <div
          ref={menuRef}
          className="my-context-menu"
          style={{
            position: "absolute",
            top: `${contextMenu.mouseY}px`,
            left: `${contextMenu.mouseX}px`,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.16)",
            backgroundColor: "white",
            zIndex: "3",
            borderRadius: "1px",
          }}
        >
          {contextMenu.menuItems.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      )}

      {data.map((row, rowIndex) =>
        columns.map(
          (column, colIndex) =>
            tooltips[`${rowIndex}-${colIndex}`] && (
              <Tooltip
                key={`tooltip-${rowIndex}-${colIndex}`}
                id={`tooltip-${rowIndex}-${colIndex}`}
                place="right"
                effect="solid"
                delayShow={400}
                content={tooltips[`${rowIndex}-${colIndex}`]}
              />
            )
        )
      )}
    </div>
  );
};

export default Table;
