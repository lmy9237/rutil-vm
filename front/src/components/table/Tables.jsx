import React, { useState, useRef, useEffect } from "react";
import TableRowLoading from "./TableRowLoading";
import TableRowNoData from "./TableRowNoData";
import { Tooltip } from "react-tooltip";
import PagingButton from "./PagingButton";
import Logger from "../../utils/Logger";
import "./Table.css";
import CONSTANT from "../../Constants";
import 'tippy.js/dist/tippy.css';           
import 'tippy.js/animations/shift-away.css';
import Tippy from "@tippyjs/react";

/**
 * @name Tables
 * @description 테이블 컴포넌트
 *
 * @prop {string[]} columns
 * @returns {JSX.Element} 테이블 컴포넌트
 * 
 */
const Tables = ({
  columns = [], data = [],
  onRowClick = () => {},
  clickableColumnIndex = [],
  onContextMenuItems = false,
  onClickableColumnClick = () => {},
  showSearchBox = true,
  refetch,
  isLoading = null, isError = false, isSuccess,
  searchQuery = "",  // ✅ 기본값 추가
  setSearchQuery = () => {}, // ✅ 기본값 추가
}) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // 선택된 행의 인덱스를 관리
  const [tooltips, setTooltips] = useState({}); // 툴팁 상태 관리
  const [contextRowIndex, setContextRowIndex] = useState(null); // 우클릭한 행의 인덱스 관리
  const [selectedRows, setSelectedRows] = useState([]); // ctrl다중선택택

  // 검색박스

  // 우클릭 메뉴 위치 관리
  const [contextMenu, setContextMenu] = useState(null);
  const handleContextMenu = (e, rowIndex) => {
    e.preventDefault();
    const rowData = sortedData[rowIndex];
  
    setSelectedRows([rowIndex]);
    setSelectedRowIndex(rowIndex);
    if (typeof onRowClick === "function") {
      onRowClick([rowData]);
    }
  
    if (onContextMenuItems) {
      const menuItems = onContextMenuItems(rowData);
  
      // 📌 테이블의 위치 계산
      const tableRect = tableRef.current?.getBoundingClientRect();
      const menuWidth = 150; // 예상 메뉴 너비
      const menuHeight = 120; // 예상 메뉴 높이
      const padding = 10; // 여백을 위한 패딩
  
      // 📌 마우스 클릭 위치 (테이블 기준 상대 좌표)
      let mouseX = e.clientX - (tableRect?.left ?? 0);
      let mouseY = e.clientY - (tableRect?.top ?? 0);
  
      // 📌 화면 바깥으로 나가는 경우 위치 조정
      if (mouseX + menuWidth > window.innerWidth) {
        mouseX -= menuWidth + padding;
      }
      if (mouseY + menuHeight > window.innerHeight) {
        mouseY -= menuHeight + padding;
      }
  
      setContextMenu({
        mouseX,
        mouseY,
        menuItems,
      });
    } else {
      Logger.warn("메뉴 항목이 비어 있습니다.");
    }
    setContextRowIndex(rowIndex);
  };
  
  

  const tableRef = useRef(null);
  // 테이블 외부 클릭 시 선택된 행 초기화, 단 메뉴 박스,모달,headerbutton 제외
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target) &&
        (!menuRef.current || !menuRef.current.contains(event.target)) &&
        !event.target.closest(".header-right-btns button") &&
        !event.target.closest(".Overlay")
      ) {
        setSelectedRowIndex(null);
        setSelectedRows([]);
        if (typeof onRowClick === "function") onRowClick([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onRowClick]);

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
    Logger.debug(`Tables > handleMouseEnter ... rowIndex: ${rowIndex}, colIndex: ${colIndex}`);
    const element = e.target;
    if (element.scrollWidth > element.clientWidth) {
      setTooltips((prevTooltips) => ({
        ...prevTooltips,
        [`${rowIndex}-${colIndex}`]: content,
      }));
    } else {
      setTooltips((prevTooltips) => ({
        ...prevTooltips,
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
    Logger.debug(`PagingTable > handleRowClick ... rowIndex: ${rowIndex}, e: ${e}`);
    const clickedRow = sortedData[rowIndex];
    if (!clickedRow) return;

    if (e.ctrlKey) {
      setSelectedRows((prev) => {
        const updated = prev.includes(rowIndex)
          ? prev.filter((index) => index !== rowIndex)
          : [...prev, rowIndex];
        const selectedData = updated.map((index) => sortedData[index]);
        onRowClick(selectedData); // 선택된 데이터 배열 전달
        return updated;
      });
    } else {
      const selectedData = [clickedRow];
      setSelectedRows([rowIndex]);
      onRowClick(selectedData); // 단일 선택된 데이터 전달
    }
  };

  useEffect(() => {
    if (sortConfig.key) {
      sortData(sortConfig.key, sortConfig.direction);
    } else {
      setSortedData(data);
    }
  }, [data, sortConfig]);

  // 우클릭 메뉴 외부 클릭 시 메뉴 닫기 + 배경색 초기화
  const menuRef = useRef(null);

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

  const renderTableBody = () => {
    if (isLoading) {
      // 로딩중일 때
      return <TableRowLoading colLen={columns.length} />;
    } else if (!isLoading && isSuccess) {
      // 데이터 가져오기 성공 후
      return sortedData.length === 0 ? ( // 데이터 0건일 때
        <TableRowNoData colLen={columns.length} />
      ) : (
        // 데이터 있을 경우
        paginatedData.map((row, rowIndex) => {
          const globalIndex = indexOfFirstItem + rowIndex; 
        
          return (
            // <tr
            //   key={globalIndex}
            //   onClick={(e) => {
            //     setSelectedRowIndex(globalIndex);
            //     setContextRowIndex(null);
            //     onRowClick([row]); // ✅ 배열로 전달
            //     handleRowClick(globalIndex, e);
            //   }}
            //   onContextMenu={(e) => handleContextMenu(e, globalIndex)}
            //   className={
            //     selectedRows.includes(globalIndex) || contextRowIndex === globalIndex
            //       ? "selected-row"
            //       : ""
            //   }
            // >
            //   {columns.map((column, colIndex) => (
            //     <td
            //       key={colIndex}
            //       data-tooltip-id={`tooltip-${globalIndex}-${colIndex}`}
            //       data-tooltip-content={getCellTooltipContent(row[column.accessor])}
            //       onMouseEnter={(e) =>
            //         handleMouseEnter(e, globalIndex, colIndex, row[column.accessor])
            //       }
            //       style={{
            //         whiteSpace: "nowrap",
            //         overflow: "hidden",
            //         textOverflow: "ellipsis",
            //         textAlign: React.isValidElement(row[column.accessor]) ? "center" : "left",
            //         verticalAlign: "middle",
            //         cursor:
            //           row[column.accessor] &&
            //           clickableColumnIndex.includes(colIndex)
            //             ? "pointer"
            //             : "default",
            //         color:
            //           row[column.accessor] &&
            //           clickableColumnIndex.includes(colIndex)
            //             ? "blue"
            //             : "inherit",
            //         fontWeight:
            //           row[column.accessor] &&
            //           clickableColumnIndex.includes(colIndex)
            //             ? "500"
            //             : "normal",
            //         width: column?.width ?? "",
            //       }}
            //       onClick={(e) => {
            //         if (
            //           row[column.accessor] &&
            //           clickableColumnIndex.includes(colIndex)
            //         ) {
            //           e.stopPropagation();
            //           if (onClickableColumnClick) {
            //             onClickableColumnClick(row);
            //           }
            //         }
            //       }}
            //       onMouseOver={(e) => {
            //         if (
            //           row[column.accessor] &&
            //           clickableColumnIndex.includes(colIndex)
            //         ) {
            //           e.target.style.textDecoration = "underline";
            //         }
            //       }}
            //       onMouseOut={(e) => {
            //         if (
            //           row[column.accessor] &&
            //           clickableColumnIndex.includes(colIndex)
            //         ) {
            //           e.target.style.textDecoration = "none";
            //         }
            //       }}
            //     >
            //           <Tippy
            //             content={getCellTooltipContent(row[column.accessor])}
            //             delay={[200, 0]}
            //             placement="top"
            //             animation="shift-away"
            //             theme="dark-tooltip" 
            //             arrow={true}        
            //             disabled={!tooltips[`${globalIndex}-${colIndex}`]}
            //           >
            //             <div style={{ display: "flex", alignItems: "center"}}>
            //               {typeof row[column.accessor] !== "string" &&
            //               typeof row[column.accessor] !== "number" &&
            //               row[column.accessor]?.type?.name !== "TableRowClick" ? (
            //                 row[column.accessor]
            //               ) : (
            //                 row[column.accessor]
            //               )}
            //             </div>
            //           </Tippy>
            //     </td>
            //   ))}
            // </tr>
            <tr
              key={globalIndex}
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
                const isBoolean = typeof cellValue === "boolean";

                // 아이콘, 체크박스 등은 가운데, TableRowClick은 왼쪽
                const shouldCenter = (isJSX && !isTableRowClick) || isBoolean;

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
                      textAlign: shouldCenter ? "center" : "left",
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
                      content={getCellTooltipContent(cellValue)}
                      delay={[200, 0]}
                      placement="top"
                      animation="shift-away"
                      theme="dark-tooltip"
                      arrow={true}
                      disabled={!tooltips[`${globalIndex}-${colIndex}`]}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: shouldCenter ? "center" : "flex-start",
                          alignItems: "center",
                        }}
                      >
                        {isJSX ? cellValue : String(cellValue ?? "")}
                      </div>
                    </Tippy>
                  </td>
                );
              })}
            </tr>


          );
        })
        
      );
    }
  };

  return (
    <>
      <div className="w-full overflow-y-hidden ">
        <table className="custom-table" ref={tableRef}>
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
          <tbody>{renderTableBody()}</tbody>
        </table>

        {/*페이지버튼 */}
        {sortedData.length > itemsPerPage && (
          <div className="paging-arrows my-2">
            <PagingButton
              type="prev"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            <span className="px-1.5">{`${startNumber} - ${endNumber}`}</span>
            <PagingButton
              type="next"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(sortedData.length / itemsPerPage)}
            />
          </div>
      )}

      </div>
      {/* 우클릭 메뉴 박스 */}
      {contextMenu && (
        <div ref={menuRef}
          className="my-context-menu"
          style={{
            top: `${contextMenu.mouseY}px`,
            left: `${contextMenu.mouseX}px`,
          }}
        >
          {contextMenu.menuItems.map((item, index) => (
            <div className="context-menu-item" key={index}>{item}</div>
          ))}
        </div>
      )}

      {/* Tooltip */}
      {/* {data &&
        data.map((row, rowIndex) =>
          columns.map(
            (column, colIndex) =>
              tooltips[`${rowIndex}-${colIndex}`] && (
                <Tooltip
                  key={`tooltip-${rowIndex}-${colIndex}`}
                  id={`tooltip-${rowIndex}-${colIndex}`}
                  place="right"
                  effect="solid"
                  className="my-tooltip"
                  delayShow={200} // 1초 지연 후 표시
                  content={tooltips[`${rowIndex}-${colIndex}`]} // 툴팁에 표시할 내용
                  componentsProps={{
                    color:"white",
                  }}
                />
              )
          )
        )} */}
    </>
  );
};

export default Tables;
