import React from 'react';
import PagingTable from './PagingTable';
import './Table.css';

const PagingTableOuter = ({ 
  columns, 
  data, 
  onRowClick, 
  shouldHighlight1stCol = false, 
  clickableColumnIndex, 
  itemsPerPage = 15, 
  showSearchBox = true 
}) => {
  return (
    <div className="section-table-outer">
      <PagingTable 
        columns={columns} 
        data={data}
        onRowClick={onRowClick} 
        clickableColumnIndex={clickableColumnIndex} // 클릭 가능 컬럼 전달
        itemsPerPage={itemsPerPage} // 페이지당 표시할 항목 수
        showSearchBox={showSearchBox} // 검색 박스 표시 여부 제어
      />
    </div>
  );
};

export default PagingTableOuter;

