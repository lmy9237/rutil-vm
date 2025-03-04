import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
import Tables from './Tables';
import './Table.css';

/**
 * @name TablesOuter
 * @description 테이블+ 컴포넌트
 * 
 * @prop {string[]} columns
 * @returns {JSX.Element} 테이블+ 컴포넌트
 */
const TablesOuter = ({ 
  isLoading, isError, isSuccess,
  columns = [],
  data = [],
  shouldHighlight1stCol = false,
  onRowClick,
  clickableColumnIndex, 
  onContextMenuItems,
  onClickableColumnClick,
  showSearchBox=false
}) => {
  console.log(`넘어오는 데이터: ${data}`)
  return (
    <>
      <div className="section-table-outer">
        <Tables
          isLoading={isLoading} isError={isError} isSuccess={isSuccess}
          columns={columns}  
          data={data}
          showSearchBox={showSearchBox}
          onRowClick={onRowClick} 
          clickableColumnIndex={clickableColumnIndex} 
          shouldHighlight1stCol={shouldHighlight1stCol} 
          onContextMenuItems={onContextMenuItems}
          onClickableColumnClick={onClickableColumnClick}
        />
      </div>
    </>
  );
}

export default TablesOuter;
