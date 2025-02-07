import Tables from './Tables';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Table.css';

const TablesOuter = ({ 
  columns = [], 
  data = [], 
  shouldHighlight1stCol = false,
  onRowClick,
  clickableColumnIndex, 
  showSearchBox = false, 
  onContextMenuItems,
  onClickableColumnClick
}) => {
  return (
    <div className="section-table-outer">
      {showSearchBox && ( 
        <div className="search-box">
          <input type="text" />
          <button><FontAwesomeIcon icon={faSearch} fixedWidth /></button>
          <button><FontAwesomeIcon icon={faRefresh} fixedWidth /></button>
        </div>
      )}
      
      <Tables
        columns={columns}  
        data={data}
        onRowClick={onRowClick} 
        clickableColumnIndex={clickableColumnIndex} 
        shouldHighlight1stCol={shouldHighlight1stCol} 
        onContextMenuItems={onContextMenuItems}
        onClickableColumnClick={onClickableColumnClick}
      />
    </div>
  );
}

export default TablesOuter;
