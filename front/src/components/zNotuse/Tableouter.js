

// import React, { useState } from 'react';
// import Table from './Table';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
// import './Table.css';

// const TableOuter = ({ 
//   columns = [], 
//   data = [], 
//   shouldHighlight1stCol = false,
//   onRowClick,  
//   clickableColumnIndex, 
//   showSearchBox = false, 
//   onContextMenuItems,
//   onClickableColumnClick
// }) => {
//   const [searchQuery, setSearchQuery] = useState('');

//   // '이름' 컬럼에서만 검색 쿼리를 적용합니다.
//   const filteredData = data.filter((row) => 
//     String(row['name'] || '' || row['alias']).toLowerCase().startsWith(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="section_table_outer">
//       {showSearchBox && (
//         <div className="search_box">
//           <input 
//             type="text" 
//             placeholder="검색어를 입력하세요" 
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)} 
//           />
//           <button><FontAwesomeIcon icon={faSearch} fixedWidth /></button>
//           <button onClick={() => setSearchQuery('')}><FontAwesomeIcon icon={faRefresh} fixedWidth /></button>
//         </div>
//       )}
      
//       <Table 
//         columns={columns}  
//         data={filteredData}  // 필터링된 데이터를 Table에 전달합니다.
//         onRowClick={onRowClick} 
//         clickableColumnIndex={clickableColumnIndex} 
//         shouldHighlight1stCol={shouldHighlight1stCol} 
//         onContextMenuItems={onContextMenuItems}
//         onClickableColumnClick={onClickableColumnClick}
//       />
//     </div>
//   );
// };

// export default TableOuter;