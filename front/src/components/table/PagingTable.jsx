import React, { useState, useRef, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import "./Table.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faSearch } from "@fortawesome/free-solid-svg-icons";
import TableRowLoading from "./TableRowLoading"
import TableRowNoData from "./TableRowNoData";
import Localization from "../../utils/Localization";

const PagingTable = ({
  isLoading = null, isError = false, isSuccess,
  columns = [], data = [],
  onRowClick = () => {},
  clickableColumnIndex = [],
  itemsPerPage = 20,
  showSearchBox = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tooltips, setTooltips] = useState({});
  const tableRef = useRef(null);

  // 검색기능 데이터 필터링 로직, 검색 쿼리를 기준으로 데이터 필터링
  const filteredData = data.filter((item) => {
    console.log("PagingTable > filteredData ... ");
    return columns.some((column) => {
      const value = item[column.accessor];
      // 문자열을 소문자로 변환하고, includes로 검색어가 포함되어 있는지 확인
      return (
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
  });

  // 현재 페이지의 데이터를 계산
  const validData = filteredData;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = validData.slice(indexOfFirstItem, indexOfLastItem);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(validData.length / itemsPerPage);

  const handlePageChange = (direction) => {
    // 페이지 변경 처리 함수
    console.log(`PagingTable > handlePageChange ... direction: ${direction}`);
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 툴팁 관리 함수
  const handleMouseEnter = (e, rowIndex, colIndex, content) => {
    console.log(`PagingTable > handleMouseEnter ... rowIndex: ${rowIndex}, colIndex: ${colIndex}`);
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
  const renderTableBody = () => {
    console.log("Tables > renderTableBody ... ")
    if (isLoading) {
      // 로딩중일 때
      return (
        <TableRowLoading colLen={columns.length} />
      )
    } else if (!isLoading && isSuccess) {
      // 데이터 가져오기 성공 후
      console.log("Tables > data fetched successfully ... ")
      return (currentItems.length === 0) ? (
        <TableRowNoData colLen={columns.length} />
      ) : ( // 데이터 있을 경우
        currentItems.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            onClick={() => setSelectedRowIndex(rowIndex)}
            style={{
              backgroundColor:
                selectedRowIndex === rowIndex
                  ? "rgb(218, 236, 245)"
                  : "transparent",
            }}
          >
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                data-tooltip-id={`tooltip-${rowIndex}-${colIndex}`}
                data-tooltip-content={row[column.accessor]}
                onMouseEnter={(e) => handleMouseEnter(e, rowIndex, colIndex, row[column.accessor])}
                style={{
                  maxWidth: "200px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign:
                    typeof row[column.accessor] === "string" || typeof row[column.accessor] === "number"
                      ? "left"
                      : "center",
                  cursor: clickableColumnIndex.includes(colIndex)
                    ? "pointer"
                    : "default",
                }}
              >
                {typeof row[column.accessor] === "object" ? (
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
      )
    }
  }

  console.log("...");
  return (
    <>
    

      <div className="pagination">
      
        <div className="paging-btns center mb-1">
          {showSearchBox && (
            <div className="search-box">
              <input type="text"
                placeholder={Localization.kr.PLACEHOLDER_SEARCH}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => setSearchQuery("")}>
                <FontAwesomeIcon icon={faRefresh} fixedWidth />
              </button>
            </div>
          )}
          <div className="paging-arrows">
            <div className="flex">
              <button
                className="paging-arrow"
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
              >
                {"<"}
              </button>
              <span>{`${indexOfFirstItem + 1} - ${Math.min(indexOfLastItem, validData.length)}`}</span>
              <button
                className="paging-arrow"
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>

        <table className="custom-table"
          ref={tableRef}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  style={{
                    cursor: column.isIcon ? "default" : "pointer",
                    width: column.width,
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderTableBody()}
          </tbody>
        </table>
      </div>
      
      {/* Tooltip */}
      {data && data.map((row, rowIndex) =>
        columns.map((column, colIndex) => (
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
        ))
      )}
    </>
  );
};

export default PagingTable;
