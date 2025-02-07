import Table from './Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Table.css';

const TableOuter = ({ 
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
      
      <Table
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

export default TableOuter;
