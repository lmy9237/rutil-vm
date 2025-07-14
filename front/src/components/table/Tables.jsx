import React, { useState, useRef, useEffect, useCallback } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import useContextMenu from "../../hooks/useContextMenu";
import TableRowLoading from "./TableRowLoading";
import TableRowNoData from "./TableRowNoData";
import PagingButton from "./PagingButton";
import Logger from "../../utils/Logger";
import CONSTANT from "../../Constants";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
import "./Table.css";

/**
 * @name Tables
 * @description 테이블 컴포넌트
 *
 * @prop {string[]} columns
 * @returns {JSX.Element} 테이블 컴포넌트
 * 
 */
const Tables = ({
  target = "datacenter", columns = [], data = [],
  onRowClick = () => {},
  clickableColumnIndex = [],
  onClickableColumnClick = () => {},
  isRefetching=null,
  isLoading=null, isError=false, isSuccess,
  searchQuery="", setSearchQuery=()=>{},
}) => {
  const {
    contextMenu, setContextMenu
  } = useContextMenu()

  // 재접할 때 처음접속할 때
  const useFirstLoading = (isLoading) => {
    const isFirst = useRef(true);

    if (!isLoading) {
      isFirst.current = false;
    }

    return isLoading && isFirst.current;
  };
  const isFirstLoading = useFirstLoading(isLoading); 
  
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // 선택된 행의 인덱스를 관리
  const [tooltips, setTooltips] = useState({}); // 툴팁 상태 관리
  const [contextRowIndex, setContextRowIndex] = useState(null); // 우클릭한 행의 인덱스 관리
  const [selectedRows, setSelectedRows] = useState([]); // ctrl다중선택

  // shift다중선택
  const [lastClickedRowIndex, setLastClickedRowIndex] = useState(null);


  // 검색박스
  // 우클릭 메뉴 위치 관리
  const handleContextMenu = (e, rowIndex) => {
    Logger.debug(`Tables > handleContextMenu ... rowIndex: ${rowIndex}, e: `, e)
    e.preventDefault();
    
    const rowData = sortedData[rowIndex];
    setSelectedRows([rowIndex]);
    setSelectedRowIndex(rowIndex);
    if (typeof onRowClick === "function")
      onRowClick([rowData]);
  
      setContextMenu({
        mouseX: e.clientX,
        mouseY: e.clientY,
        item: {
          id: rowData?.id,
          name: rowData?.name,
        },
      }, target);
    };
  
  const tableRef = useRef(null);
  // 테이블 외부 클릭 시 선택된 행 초기화, 단 메뉴 박스,모달,headerbutton 제외
  useClickOutside(tableRef, (e) => {
    setSelectedRowIndex(null);
    setSelectedRows([]);
    if (typeof onRowClick === "function") onRowClick([]);
  }, [
    ".header-right-btns button", ".Overlay", "#right-click-menu-box"
    , "#modal-vm-migration"
  ]);

  // 테이블 정렬기능
  const [sortedData, setSortedData] = useState(data);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const sortData = (key, direction) => {
    const sorted = [...data].sort((a, b) => {
      const getValue = (row) => {
        if (key === "icon") {
          return row.iconSortKey ?? 99;
        }
        
        // 단위별 정렬
        const val = row[key];
        if (typeof val === "string" && val.match(/^\d+(\.\d+)?\s?GiB$/i)) {
          return parseFloat(val); // "200 GiB" → 200
        }
        if (typeof val === "string") {
          if (val.includes("일")) {
            const days = parseInt(val.replace("일", "").trim());
            return days * 24 * 60; // 분 단위
          }
          if (val.includes("시간")) {
            const hours = parseInt(val.replace("시간", "").trim());
            return hours * 60; // 분 단위
          }
        }
        if (React.isValidElement(val)) {
          const child = val.props?.children;
          if (Array.isArray(child)) return child.join("");
          return child ?? "";
        }
        return val ?? "";
      };
  
      const aValue = getValue(a);
      const bValue = getValue(b);
  
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
  
      return direction === "asc"
        ? String(aValue).localeCompare(String(bValue), "ko", { sensitivity: "base" })
        : String(bValue).localeCompare(String(aValue), "ko", { sensitivity: "base" });
    });
  
    setSortedData(sorted);
  };
  
  useEffect(() => {
    let filteredData = data;
  
    // 🔍 검색 필터 적용
    if (searchQuery?.trim() !== "") {
      filteredData = data.filter((row) =>
        columns.some((column) =>
          String(row[column.accessor] ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }
  
    // 🔁 정렬 적용 (icon 포함)
    if (sortConfig.key) {
      const getValue = (row) => {
        if (sortConfig.key === "icon") {
          return row.iconSortKey ?? 99;
        }
  
        const val = row[sortConfig.key];
        if (React.isValidElement(val)) {
          const child = val.props?.children;
          return Array.isArray(child) ? child.join("") : child ?? "";
        }
        return val ?? "";
      };
  
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = getValue(a);
        const bValue = getValue(b);
  
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        }
  
        return sortConfig.direction === "asc"
          ? String(aValue).localeCompare(String(bValue), "ko", { sensitivity: "base" })
          : String(bValue).localeCompare(String(aValue), "ko", { sensitivity: "base" });
      });
    }
  
    setSortedData(filteredData);
  }, [data, searchQuery, sortConfig]);
  

  const handleSort = (column) => {
    // 내림, 오름차순
    Logger.debug(`PagingTable > handleSort ... column: ${column}`);
    if (column.isIcon) return;
    const { accessor } = column;
    const direction =
      sortConfig.key === accessor && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: accessor, direction });
    sortData(accessor, direction);
  };

  // 툴팁 설정
  const handleMouseEnter = (e, rowIndex, colIndex, content) => {
    const target = e.currentTarget.querySelector('.cell-ellipsis');
    if (target && target.scrollWidth > target.clientWidth) {
      setTooltips((prev) => ({
        ...prev,
        [`${rowIndex}-${colIndex}`]: content,
      }));
    } else {
      setTooltips((prev) => ({
        ...prev,
        [`${rowIndex}-${colIndex}`]: null,
      }));
    }
  };

  const getCellTooltipContent = (value) => {
    if (React.isValidElement(value)) {
      // JSX 요소의 텍스트 추출
      const child = value.props?.children;
      return Array.isArray(child) ? child.join("") : String(child ?? "");
    } else if (typeof value === "object" && value !== null) {
      // 일반 객체인 경우 JSON으로 안전하게 변환
      return JSON.stringify(value);
    }
    return String(value ?? ""); // 기본값: 문자열로 변환
  };
  
  // 페이징처리
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = CONSTANT.itemsPerPage;
  // 시작/끝 인덱스 계산
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, sortedData.length);
  // 현재 페이지에 표시할 데이터 슬라이스
  const paginatedData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  // 시작번호 & 끝번호 (1부터 시작하도록 설정)
  const startNumber = indexOfFirstItem + 1;
  const endNumber = indexOfLastItem;

  // 페이지 변경 핸들러 수정
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(sortedData.length / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };
  
  const handleRowClick = (rowIndex, e) => {
    Logger.debug(`PagingTable > handleRowClick ... rowIndex: ${rowIndex}, e: `, e);
    const clickedRow = sortedData[rowIndex];
    if (!clickedRow) return;

    if (e.shiftKey && lastClickedRowIndex !== null) {
      const start = Math.min(lastClickedRowIndex, rowIndex);
      const end = Math.max(lastClickedRowIndex, rowIndex);
      const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      setSelectedRows(range);
      onRowClick(range.map(index => sortedData[index]));
    } else if (e.ctrlKey || e.metaKey) {
      setSelectedRows((prev) => {
        const updated = prev.includes(rowIndex)
          ? prev.filter((i) => i !== rowIndex)
          : [...prev, rowIndex];
        onRowClick(updated.map(i => sortedData[i]));
        return updated;
      });
      setLastClickedRowIndex(rowIndex);
    } else {
      setSelectedRows([rowIndex]);
      onRowClick([clickedRow]);
      setLastClickedRowIndex(rowIndex);
    }
  };

  useEffect(() => {
    if (sortConfig.key) {
      sortData(sortConfig.key, sortConfig.direction);
    } else {
      setSortedData(data);
    }
  }, [data, sortConfig]);

  // th드레그
  const [columnWidths, setColumnWidths] = useState({});
  const handleMouseDown = (e, accessor) => {
    const startX = e.clientX;
    const startWidth = columnWidths[accessor] || 150;
    let animationFrameId = null;

    const onMouseMove = (moveEvent) => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        const newWidth = Math.max(startWidth + moveEvent.clientX - startX, 30);
        setColumnWidths(prev => ({ ...prev, [accessor]: newWidth }));
      });
    };

    const onMouseUp = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // ✔ 복원
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    // ✔ 드래그 중 텍스트 선택 방지 및 커서 설정
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const renderTableBody = useCallback(() => {
    if (isFirstLoading) { // 재접속 or 첫로딩딩
      return <TableRowLoading colLen={columns.length} />;
    } else if (isRefetching || isLoading) {
      // 최초가 아닌 refetch 상황이면 로딩 띄우지 않음(이상함 수정필요)
      return <TableRowLoading colLen={columns.length} />;
    }else if (!isLoading && isSuccess) {
      // 데이터 가져오기 성공 후
      // Logger.debug(`Tables > renderTableBody ... isLoading: ${isLoading}, isSuccess: ${isSuccess}`)
      return sortedData.length === 0 ? (
        // 데이터 0건일 때
        <TableRowNoData colLen={columns.length} />
      ) : (
        // 데이터 있을 경우
        paginatedData.map((row, rowIndex) => {
          const globalIndex = indexOfFirstItem + rowIndex; 
        
          return (
            <tr key={globalIndex}
              onClick={(e) => {
                setSelectedRowIndex(globalIndex);
                setContextRowIndex(null);
                onRowClick([row]);
                handleRowClick(globalIndex, e);
              }}
              onContextMenu={(e) => handleContextMenu(e, globalIndex)}
              className={
                selectedRows.includes(globalIndex) || contextRowIndex === globalIndex
                  ? "selected-row"
                  : ""
              }
            >
              {columns.map((column, colIndex) => {
                const cellValue = row[column.accessor];
                const isJSX = React.isValidElement(cellValue);
                const isTableRowClick = isJSX && cellValue?.type?.name === "TableRowClick";
                // const isBoolean = typeof cellValue === "boolean";

                // 아이콘, 체크박스,상태,유형 등은 가운데, TableRowClick은 왼쪽
                const isForceCenter = ["status", "storageType","snapshotExist"].includes(column.accessor);
                
                typeof cellValue === "string" &&
                (cellValue.trim().toLowerCase().endsWith("gib") || cellValue.trim().endsWith("%"));

                const shouldCenter = 
                (isJSX && !isTableRowClick) || // 아이콘 같은 JSX
                (typeof cellValue === "string" && (cellValue.trim().toLowerCase().endsWith("gib") || cellValue.trim().endsWith("%"))) || // GiB나 % 끝나는 문자열
                isForceCenter;

                let determinedAlign = column?.align ?? (shouldCenter ? "center" : "left");
                if (isTableRowClick) {
                  determinedAlign = "left";
                }
            
                return (
                  <td
                    key={colIndex}
                    
                    data-tooltip-id={`tooltip-${globalIndex}-${colIndex}`}
                    data-tooltip-content={getCellTooltipContent(cellValue)}
                    onMouseEnter={(e) =>
                      handleMouseEnter(e, globalIndex, colIndex, cellValue)
                    }
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: determinedAlign, 
                      verticalAlign: "middle",
                      cursor:
                        cellValue && clickableColumnIndex.includes(colIndex)
                          ? "pointer"
                          : "default",
                      color:
                        cellValue && clickableColumnIndex.includes(colIndex)
                          ? "blue"
                          : "inherit",
                      fontWeight:
                        cellValue && clickableColumnIndex.includes(colIndex)
                          ? "500"
                          : "normal",
                      width: column?.width ?? "",
                      ...(column?.style ?? {}), 
                    }}
                    onClick={(e) => {
                      if (
                        cellValue &&
                        clickableColumnIndex.includes(colIndex) &&
                        onClickableColumnClick
                      ) {
                        e.stopPropagation();
                        onClickableColumnClick(row);
                      }
                    }}
                    onMouseOver={(e) => {
                      if (cellValue && clickableColumnIndex.includes(colIndex)) {
                        e.target.style.textDecoration = "underline";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (cellValue && clickableColumnIndex.includes(colIndex)) {
                        e.target.style.textDecoration = "none";
                      }
                    }}
                  >
                  <Tippy
                    appendTo={() => document.body}
                    content={<div className="v-start w-full tooltip-content">{getCellTooltipContent(cellValue)}</div>}
                    delay={[200, 0]}
                    placement="top"
                    animation="shift-away"
                    theme="dark-tooltip"
                    className="tippy-box"
                    arrow={true}
                    zIndex={9999} 
                    disabled={!tooltips[`${globalIndex}-${colIndex}`]}
                  >
                      {isJSX ? (
                          isTableRowClick ? (
                            cellValue
                          ) : (
                            <div className="cell-ellipsis f-center">{cellValue}</div>
                          )
                        ) : (
                          <div className="cell-ellipsis" style={{ textAlign: determinedAlign }}>
                            {String(cellValue ?? "")}
                          </div>
                      )}
                  </Tippy>
                  </td>
                );
              })}
            </tr>
          );
        })
      );
    }
  }, [sortedData, paginatedData]);

  return (
    <>
      <div className="w-full overflow-y-hidden">
        <table className="custom-table w-full" 
          ref={tableRef}
        >
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="fw-700" 
                onClick={() => !column.isIcon && handleSort(column)}
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
                {/* 헤더명 + 정렬 아이콘 */}
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
                  onMouseDown={(e) => handleMouseDown(e, column.accessor)}
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

          <tbody>{renderTableBody()}</tbody>
        </table>

        
      </div>
      {/*페이지버튼 */}
      {sortedData.length > itemsPerPage && (   
        <div className="paging-arrows f-end my-2">
          <PagingButton type="prev"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          <span className="px-1.5">{`${startNumber} - ${endNumber}`}</span>
          <PagingButton type="next"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= Math.ceil(sortedData.length / itemsPerPage)}
          />
        </div>
      )}
    </>
  );
};

export default Tables;