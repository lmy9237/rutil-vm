// import React, { useState, useRef, useEffect } from 'react';
// import { Tooltip } from 'react-tooltip';
// import './Table.css';

// const Table = ({ 
//   columns = [], 
//   data = [], 
//   onRowClick = () => {}, 
//   clickableColumnIndex = [], 
//   onContextMenuItems = false 
// }) => {
//   const [selectedRowIndex, setSelectedRowIndex] = useState(null);
//   const [tooltips, setTooltips] = useState({});
//   const [sortedData, setSortedData] = useState(data);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const tableRef = useRef(null);
//   const [contextRowIndex, setContextRowIndex] = useState(null);
//   const [contextMenu, setContextMenu] = useState(null);

//   const sortData = (data, key, direction) => {
//     const sorted = [...data].sort((a, b) => {
//       const aValue = a[key];
//       const bValue = b[key];
  
//       if (aValue === null || aValue === undefined || aValue === '') return 1;
//       if (bValue === null || bValue === undefined || bValue === '') return -1;
  
//       // 문자열 비교 시 대소문자 무시
//       const aLower = typeof aValue === 'string' ? aValue.toLowerCase() : aValue;
//       const bLower = typeof bValue === 'string' ? bValue.toLowerCase() : bValue;
  
//       if (aLower < bLower) return direction === 'asc' ? -1 : 1;
//       if (aLower > bLower) return direction === 'asc' ? 1 : -1;
//       return 0;
//     });
//     setSortedData(sorted);
//   };

//   const handleSort = (column) => {
//     if (column.isIcon) return;

//     const { accessor } = column;
//     const direction = sortConfig.key === accessor && sortConfig.direction === 'asc' ? 'desc' : 'asc';
//     setSortConfig({ key: accessor, direction });
//     sortData(sortedData, accessor, direction);
//   };

//   useEffect(() => {
//     if (sortConfig.key) {
//       sortData(data, sortConfig.key, sortConfig.direction);
//     } else {
//       setSortedData(data);
//     }
//   }, [data]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         tableRef.current &&
//         !tableRef.current.contains(event.target) &&
//         (!menuRef.current || !menuRef.current.contains(event.target)) &&
//         !event.target.closest('.header_right_btns button') &&
//         !event.target.closest('.Overlay')
//       ) {
//         setSelectedRowIndex(null);
//         setContextRowIndex(null);
//         if (typeof onRowClick === 'function') onRowClick(null);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [onRowClick]);

//   const handleMouseEnter = (e, rowIndex, colIndex, content) => {
//     const element = e.target;
//     if (element.scrollWidth > element.clientWidth) {
//       setTooltips((prevTooltips) => ({
//         ...prevTooltips,
//         [`${rowIndex}-${colIndex}`]: content,
//       }));
//     } else {
//       setTooltips((prevTooltips) => ({
//         ...prevTooltips,
//         [`${rowIndex}-${colIndex}`]: null,
//       }));
//     }
//   };

//   const menuRef = useRef(null);
//   useEffect(() => {
//     const handleClickOutsideMenu = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setContextMenu(null);
//         setContextRowIndex(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutsideMenu);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutsideMenu);
//     };
//   }, []);

//   const handleContextMenu = (e, rowIndex) => {
//     e.preventDefault();
//     const rowData = data[rowIndex];
//     if (onContextMenuItems) {
//       const menuItems = onContextMenuItems(rowData);
//       setContextMenu({
//         mouseX: e.clientX - 320,
//         mouseY: e.clientY - 47,
//         menuItems,
//       });
//     }
//     setContextRowIndex(rowIndex);
//     setSelectedRowIndex(null);
//   };

//   return (
//     <>
//       <div className='custom_outer'>
//         <table className="custom-table" ref={tableRef} style={{ tableLayout: 'fixed', width: '100%' }}>
//           <thead>
//             <tr>
//               {columns.map((column, index) => (
//                 <th
//                   key={index}
//                   onClick={() => handleSort(column)}
//                   style={{
//                     cursor: column.isIcon ? 'default' : 'pointer',
//                     width: column.width ,
//                   }}
//                 >
//                   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                     {column.header}
//                     {!column.isIcon && sortConfig.key === column.accessor && (
//                       <span>{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
//                     )}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {sortedData.length === 0 ? (
//               <tr>
//                 <td colSpan={columns.length} style={{ textAlign: 'center' }}>내용이 없습니다</td>
//               </tr>
//             ) : (
//               sortedData.map((row, rowIndex) => (
//                 <tr
//                   key={rowIndex}
//                   onClick={() => {
//                     setSelectedRowIndex(rowIndex);
//                     setContextRowIndex(null);
//                     onRowClick(row);
//                   }}
//                   onContextMenu={(e) => handleContextMenu(e, rowIndex)}
//                   style={{
//                     backgroundColor: selectedRowIndex === rowIndex || contextRowIndex === rowIndex ? 'rgb(218, 236, 245)' : 'transparent',
//                   }}
//                 >
//                   {columns.map((column, colIndex) => (
//                     <td
//                       key={colIndex}
//                       data-tooltip-id={`tooltip-${rowIndex}-${colIndex}`}
//                       data-tooltip-content={row[column.accessor]}
//                       style={{
//                         whiteSpace: 'nowrap',
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                         textAlign: column.isIcon ? 'center' : 'left',
//                         verticalAlign: 'middle',
//                         width: column.width || 'auto',
//                         cursor: row[column.accessor] && clickableColumnIndex.includes(colIndex) ? 'pointer' : 'default',
//                         color: row[column.accessor] && clickableColumnIndex.includes(colIndex) ? 'blue' : 'inherit',
//                         fontWeight: row[column.accessor] && clickableColumnIndex.includes(colIndex) ? '800' : 'normal',
//                       }}
//                       onMouseEnter={(e) => handleMouseEnter(e, rowIndex, colIndex, row[column.accessor])}
//                       onClick={(e) => {
//                         if (row[column.accessor] && clickableColumnIndex.includes(colIndex)) {
//                           e.stopPropagation();
//                           onRowClick(row, column, colIndex);
//                         }
//                       }}
//                       onMouseOver={(e) => {
//                         if (row[column.accessor] && clickableColumnIndex.includes(colIndex)) {
//                           e.target.style.textDecoration = 'underline';
//                         }
//                       }}
//                       onMouseOut={(e) => {
//                         if (row[column.accessor] && clickableColumnIndex.includes(colIndex)) {
//                           e.target.style.textDecoration = 'none';
//                         }
//                       }}
//                     >
//                       {typeof row[column.accessor] === 'object' ? (
//                         <div style={{ display: 'flex' }}>
//                           {row[column.accessor]}
//                         </div>
//                       ) : (
//                         row[column.accessor]
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//       {contextMenu && (
//         <div ref={menuRef}
//           className='my_context_menu'
//           style={{
//             position: 'absolute',
//             top: `${contextMenu.mouseY}px`,
//             left: `${contextMenu.mouseX}px`,
//             boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.16)',
//             fontSize: '0.3rem',
//             backgroundColor: 'white',
//             border: '1px solid #eaeaea',
//             zIndex: '3',
//             borderRadius: '1px',
//           }}
//         >
//           {contextMenu.menuItems.map((item, index) => (
//             <div key={index}>{item}</div>
//           ))}
//         </div>
//       )}
//       {data && data.map((row, rowIndex) =>
//         columns.map((column, colIndex) => (
//           tooltips[`${rowIndex}-${colIndex}`] && (
//             <Tooltip
//               key={`tooltip-${rowIndex}-${colIndex}`}
//               id={`tooltip-${rowIndex}-${colIndex}`}
//               place="right"
//               effect="solid"
//               delayShow={400}
//               content={tooltips[`${rowIndex}-${colIndex}`]}
//             />
//           )
//         ))
//       )}
//     </>
//   );
// };

// export default Table;
