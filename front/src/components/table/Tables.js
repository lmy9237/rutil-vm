import React, { useState, useRef, useEffect } from 'react';
import { Tooltip } from 'react-tooltip'; // react-tooltip의 Tooltip 컴포넌트 사용
import TableRowLoading from './TableRowLoading';
import TableRowNoData from './TableRowNoData';
import './Table.css';

/**
 * @name Tables
 * @description 테이블 컴포넌트
 * 
 * @param {string[]}
 * @returns 
 */
const Tables = ({
  isLoading = null, isError = false, isSuccess,
  columns = [], data = [],
  onRowClick = () => {},
  clickableColumnIndex = [],
  onContextMenuItems = false,
  onClickableColumnClick = () => { }
}) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // 선택된 행의 인덱스를 관리
  const [tooltips, setTooltips] = useState({}); // 툴팁 상태 관리
  const [contextRowIndex, setContextRowIndex] = useState(null); // 우클릭한 행의 인덱스 관리
  const [selectedRows, setSelectedRows] = useState([]); // ctrl다중선택택

  // 우클릭 메뉴 위치 관리
  const [contextMenu, setContextMenu] = useState(null);
  const handleContextMenu = (e, rowIndex) => {
    console.log("Tables > handleContextMenu...")
    e.preventDefault();
    const rowData = sortedData[rowIndex];

    // 우클릭 시 해당 행을 선택된 행으로 설정
    setSelectedRows([rowIndex]);
    setSelectedRowIndex(rowIndex);
    if (typeof onRowClick === 'function') {
      onRowClick([rowData]); // 선택된 행 데이터를 전달
    }

    if (onContextMenuItems) {
      const menuItems = onContextMenuItems(rowData);
      setContextMenu({
        mouseX: e.clientX - 260,
        mouseY: e.clientY - 50,
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
        !event.target.closest('.header-right-btns button') &&
        !event.target.closest('.Overlay')
      ) {
        setSelectedRowIndex(null);
        setSelectedRows([]);
        if (typeof onRowClick === 'function') onRowClick([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onRowClick]);

  // 테이블 정렬기능
  const [sortedData, setSortedData] = useState(data);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  useEffect(() => {
    if (sortConfig.key) {
      sortData(data, sortConfig.key, sortConfig.direction);
    } else {
      setSortedData(data);
    }
  }, [data]);

  const sortData = (key, direction) => {
    console.log(`PagingTable > sortData ... key: ${key}, direction: ${direction}`);
    const sorted = [...data].sort((a, b) => {
      const aValue = a[key] ?? '';
      const bValue = b[key] ?? '';

      // 문자열 비교: 대소문자 무시 및 로케일별 정렬 (A-Z, ㄱ-ㅎ)
      const result = String(aValue).localeCompare(String(bValue), 'ko', { sensitivity: 'base' });

      return direction === 'asc' ? result : -result;
    });
    setSortedData(sorted);
  };

  const handleSort = (column) => {
    // 내림, 오름차순
    console.log(`PagingTable > handleSort ... column: ${column}`);
    if (column.isIcon) return;
    const { accessor } = column;
    const direction = sortConfig.key === accessor && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: accessor, direction });
    sortData(accessor, direction);
  };

  // 툴팁 설정
  const handleMouseEnter = (e, rowIndex, colIndex, content) => {
    console.log(`Tables > handleMouseEnter ... rowIndex: ${rowIndex}, colIndex: ${colIndex}`);
    const element = e.target;
    if (element.scrollWidth > element.clientWidth) {
      setTooltips((prevTooltips) => ({
        ...prevTooltips,
        [`${rowIndex}-${colIndex}`]: content
      }));
    } else {
      setTooltips((prevTooltips) => ({
        ...prevTooltips,
        [`${rowIndex}-${colIndex}`]: null
      }));
    }
  };

  const handleRowClick = (rowIndex, e) => {
    console.log(`PagingTable > handleRowClick ... rowIndex: ${rowIndex}, e: ${e}`);
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
    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu);
    };
  }, []);

  const renderTableBody = () => {
    if (isLoading) {
      console.log("Tables > renderTableBody ... ")
      // 로딩중일 때
      return (
        <TableRowLoading colLen={columns.length} />
      )
    } else if (!isLoading && isSuccess) {
      // 데이터 가져오기 성공 후
      console.log("Tables > data fetched successfully ... ")
      return (sortedData.length === 0) ? ( // 데이터 0건일 때
        <TableRowNoData colLen={columns.length} />
      ) : ( // 데이터 있을 경우
        sortedData.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            onClick={(e) => {
              setSelectedRowIndex(rowIndex);
              setContextRowIndex(null); // 다른 우클릭된 행을 초기화
              onRowClick(row); // 클릭한 행의 전체 데이터를 onRowClick에 전달
              handleRowClick(rowIndex, e); // 다중 선택 핸들러
            }}
            onContextMenu={(e) => handleContextMenu(e, rowIndex)} // 우클릭 시 메뉴 표시
            style={{
              backgroundColor: selectedRows.includes(rowIndex) || contextRowIndex === rowIndex
                ? 'rgb(218, 236, 245)' // 선택된 행 및 우클릭된 행 색상
                : 'transparent', // 초기화 색상
            }}
          >
            {columns.map((column, colIndex) => (
              <td
                key={colIndex}
                data-tooltip-id={`tooltip-${rowIndex}-${colIndex}`}
                data-tooltip-content={row[column.accessor]}
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign:
                    typeof row[column.accessor] === 'string' || typeof row[column.accessor] === 'number'
                      ? 'left'
                      : 'center',
                  verticalAlign: 'middle',
                  cursor: row[column.accessor] && clickableColumnIndex.includes(colIndex) ? 'pointer' : 'default',
                  color: row[column.accessor] && clickableColumnIndex.includes(colIndex) ? 'blue' : 'inherit',
                  fontWeight: row[column.accessor] && clickableColumnIndex.includes(colIndex) ? '800' : 'normal',
                }}
                onClick={(e) => {
                  if (row[column.accessor] && clickableColumnIndex.includes(colIndex)) {
                    e.stopPropagation();
                    if (onClickableColumnClick) {
                      onClickableColumnClick(row);
                    }
                  }
                }}
                onMouseOver={(e) => {
                  if (row[column.accessor] && clickableColumnIndex.includes(colIndex)) {
                    e.target.style.textDecoration = 'underline';
                  }
                }}
                onMouseOut={(e) => {
                  if (row[column.accessor] && clickableColumnIndex.includes(colIndex)) {
                    e.target.style.textDecoration = 'none';
                  }
                }}
              >
                {typeof row[column.accessor] === 'object' && column.header === 'icon' ? (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
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

  console.log("...")
  return (
    <>
      <div className="w-full max-h-[62.4vh] overflow-y-auto ">
        <table 
          className="custom-table" 
          ref={tableRef} 
       >
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(column)}
                  style={{
                    cursor: column.isIcon ? 'default' : 'pointer',
                    width: column.width,
                  }}
                >
                  <div className="flex justify-center items-center">
                    {column.header}
                    {!column.isIcon && sortConfig.key === column.accessor && (
                      <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderTableBody()}
          </tbody>
        </table>
      </div>
      {/* 우클릭 메뉴 박스 */}
      {contextMenu && (
        <div ref={menuRef}
          className='my-context-menu'
          style={{
            position: 'absolute',
            top: `${contextMenu.mouseY}px`,
            left: `${contextMenu.mouseX}px`,
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.16)',
            fontSize: '0.3rem',
            backgroundColor: 'white',
            zIndex: '3',
            borderRadius: '1px'
          }}
        >
          {contextMenu.menuItems.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      )}
      {/* Tooltip */}
      {data && data.map((row, rowIndex) =>
        columns.map((column, colIndex) => (
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
        ))
      )}
    </>
  );
};

export default Tables;