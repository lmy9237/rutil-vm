
import React, { useState, useRef, useEffect } from "react";
import TableRowLoading from "./TableRowLoading";
import TableRowNoData from "./TableRowNoData";
import "./Table.css";
import { Tooltip } from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

/**
 * @name Tables
 * @description 테이블 컴포넌트
 *
 * @prop {string[]} columns
 * @returns {JSX.Element} 테이블 컴포넌트
 * 
 */
const Tables = ({
  isLoading = null,
  isError = false,
  isSuccess,
  columns = [],
  data = [],
  onRowClick = () => {},
  clickableColumnIndex = [],
  onContextMenuItems = false,
  onClickableColumnClick = () => {},
  showSearchBox = true,
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
      console.warn("메뉴 항목이 비어 있습니다.");
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
  console.log(`PagingTable > sortData ... key: ${key}, direction: ${direction}`);

  const sorted = [...data].sort((a, b) => {
    const aValue = a[key] ?? "";
    const bValue = b[key] ?? "";

    // 문자열 비교: 대소문자 무시 및 로케일별 정렬 (A-Z, ㄱ-ㅎ)
    const result = String(aValue).localeCompare(String(bValue), "ko", {
      sensitivity: "base",
    });

    return direction === "asc" ? result : -result;
  });

  setSortedData(sorted);
};

  useEffect(() => {
    let filteredData = data;
  
    // 검색 기능 추가
    if (searchQuery?.trim() !== "") { 
      filteredData = data.filter((row) =>
        columns.some((column) =>
          String(row[column.accessor] ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }
  
    // 정렬 기능 유지
    if (sortConfig.key) {
      filteredData = [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key] ?? "";
        const bValue = b[sortConfig.key] ?? "";
  
        const result = String(aValue).localeCompare(String(bValue), "ko", {
          sensitivity: "base",
        });
  
        return sortConfig.direction === "asc" ? result : -result;
      });
    }
  
    setSortedData(filteredData);
  }, [data, searchQuery, sortConfig]);
  

  const handleSort = (column) => {
    // 내림, 오름차순
    console.log(`PagingTable > handleSort ... column: ${column}`);
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
    console.log(
      `Tables > handleMouseEnter ... rowIndex: ${rowIndex}, colIndex: ${colIndex}`
    );
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
  // 페이징처리
  // ✅ 현재 페이지 상태 및 페이지당 항목 개수 추가
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
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
    console.log(
      `PagingTable > handleRowClick ... rowIndex: ${rowIndex}, e: ${e}`
    );
    const clickedRow = sortedData[rowIndex];
    if (!clickedRow) {
      return;
    }

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
      // console.log("Tables > renderTableBody ... ");
      // 로딩중일 때
      return <TableRowLoading colLen={columns.length} />;
    } else if (!isLoading && isSuccess) {
      // 데이터 가져오기 성공 후
      // console.log("Tables > data fetched successfully ... ");
      return sortedData.length === 0 ? ( // 데이터 0건일 때
        <TableRowNoData colLen={columns.length} />
      ) : (
        // 데이터 있을 경우
        paginatedData.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            onClick={(e) => {
              setSelectedRowIndex(rowIndex);
              setContextRowIndex(null); // 다른 우클릭된 행을 초기화
              onRowClick(row); // 클릭한 행의 전체 데이터를 onRowClick에 전달
              handleRowClick(rowIndex, e); // 다중 선택 핸들러
            }}
            onContextMenu={(e) => handleContextMenu(e, rowIndex)} // 우클릭 시 메뉴 표시
            className={`${
              selectedRows.includes(rowIndex) || contextRowIndex === rowIndex
                ? "selected-row" // ✅ 추가된 클래스
                : ""
            }`}
            
          >
            
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                data-tooltip-id={`tooltip-${rowIndex}-${colIndex}`}
                data-tooltip-content={row[column.accessor]}
                onMouseEnter={(e) => handleMouseEnter(e, rowIndex, colIndex, row[column.accessor])}
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
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {row[column.accessor]}
                  </div>
                ) : (
                  row[column.accessor]
                )}
              </td>
            ))}
          </tr>
        ))
      );
    }
  };

  // console.log("...");
  return (
    <>
        {showSearchBox && (
          <div className="nomal-search-box">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => setSearchQuery("")}>
              <FontAwesomeIcon icon={faRefresh} fixedWidth />
            </button>
          </div>
        )}
        
      <div className="w-full  overflow-y-hidden ">
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
          <div className="paging-arrows flex"style={{ paddingTop: "18px", paddingBottom: "10px" }}>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} >
              {"<"}
            </button>
            <span className="px-1.5">{`${startNumber} - ${endNumber}`}</span> {/* ✅ 범위 표시 */}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= Math.ceil(sortedData.length / itemsPerPage)}>
              {">"}
            </button>
          </div>
        )} 

      </div>
      {/* 우클릭 메뉴 박스 */}
      {contextMenu && (
      <div
        ref={menuRef}
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
      {data &&
        data.map((row, rowIndex) =>
          columns.map(
            (column, colIndex) =>
              tooltips[`${rowIndex}-${colIndex}`] && (
                <Tooltip
                  key={`tooltip-${rowIndex}-${colIndex}`}
                  id={`tooltip-${rowIndex}-${colIndex}`}
                  place="right"
                  effect="solid"
                  delayShow={400} // 1초 지연 후 표시
                  content={tooltips[`${rowIndex}-${colIndex}`]} // 툴팁에 표시할 내용
                />
              )
          )
        )}
    </>
  );
};

export default Tables;
