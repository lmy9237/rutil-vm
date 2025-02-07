import React from 'react';
import TablesOuter from '../../../components/table/TablesOuter';
import TableRowClick from '../../../components/table/TableRowClick';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

const sizeToGB = (data) => (data / Math.pow(1024, 3));

const formatSize = (size) =>
  sizeToGB(size) < 1 ? '< 1 GB' : `${sizeToGB(size).toFixed(1)} GB`;

const renderStatusIcon = (status) => {
  const styles = {
    ACTIVE: { color: 'lime', transform: 'rotate(270deg)' },
    DOWN: { color: 'red', transform: 'rotate(90deg)' },
  };

  return styles[status] ? (
    <FontAwesomeIcon
      icon={faPlay}
      fixedWidth
      style={{ ...styles[status], fontSize: '0.3rem' }}
    />
  ) : (
    status
  );
};

const mapDiskToRow = (disk) => {
  const connectVmOrTemplate = disk?.connectVm?.name || disk?.connectTemplate?.name;

  return {
    ...disk,
    icon: renderStatusIcon(disk.status),
    storageDomain: (
      <TableRowClick type="domains" id={disk?.storageDomainVo.id}>
        {disk?.storageDomainVo.name}
      </TableRowClick>
    ),
    sharable: disk?.sharable ? 'O' : '',
    sparse: disk?.sparse ? '씬 프로비저닝' : '사전 할당',
    connectVm: (
      <TableRowClick
        type={disk?.connectVm?.id ? "vms" : "templates"}
        id={disk?.connectVm?.id || disk?.connectTemplate?.id}
      >
        {disk?.connectVm?.name || disk?.connectTemplate?.name}
      </TableRowClick>
    ),
    virtualSize: formatSize(disk?.virtualSize),
    actualSize: formatSize(disk?.actualSize),
  };
};

const DiskTable = ({
  columns,
  disks,
  setSelectedDisks, // 다중 선택된 디스크를 관리하기 위한 함수
}) => {
  const navigate = useNavigate();

  const handleRowSelection = (selectedRows) => {
    setSelectedDisks(selectedRows); // 선택된 데이터 전달
  };

  const handleColumnClick = (row) => {
    navigate(`/storages/disks/${row.id}`);
  };

  return (
    <TablesOuter
      columns={columns}
      data={disks.map(mapDiskToRow)}
      shouldHighlight1stCol
      onRowClick={handleRowSelection} // 다중 선택된 행 데이터를 업데이트
      clickableColumnIndex={[0]}
      onClickableColumnClick={handleColumnClick}
    />
  );
};

export default DiskTable;

// import React from 'react';
// import TablesOuter from './TablesOuter';
// import TableRowClick from './TableRowClick';
// import { useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlay } from '@fortawesome/free-solid-svg-icons';

// const sizeToGB = (data) => (data / Math.pow(1024, 3));

// const formatSize = (size) =>
//   sizeToGB(size) < 1 ? '< 1 GB' : `${sizeToGB(size).toFixed(1)} GB`;

// const renderStatusIcon = (status) => {
//   const styles = {
//     ACTIVE: { color: 'lime', transform: 'rotate(270deg)' },
//     DOWN: { color: 'red', transform: 'rotate(90deg)' },
//   };

//   return styles[status] ? (
//     <FontAwesomeIcon
//       icon={faPlay}
//       fixedWidth
//       style={{ ...styles[status], fontSize: '0.3rem' }}
//     />
//   ) : (
//     status
//   );
// };


// const mapDiskToRow = (disk) => {
//   const connectVmOrTemplate = disk?.connectVm?.name || disk?.connectTemplate?.name ;

//   return {
//     ...disk,
//     icon: renderStatusIcon(disk.status),
//     storageDomain: (
//       <TableRowClick type="domains" id={disk?.storageDomainVo.id}>
//         {disk?.storageDomainVo.name}
//       </TableRowClick>
//     ),
//     sharable: disk?.sharable ? 'O' : '',
//     sparse: disk?.sparse ? '씬 프로비저닝' : '사전 할당',
//     connectVm: (
//       <TableRowClick
//         type={disk?.connectVm?.id ? "vms" : "templates"}
//         id={disk?.connectVm?.id || disk?.connectTemplate?.id}
//       >
//         {connectVmOrTemplate}
//       </TableRowClick>
//     ),
//     virtualSize: formatSize(disk?.virtualSize),
//     actualSize: formatSize(disk?.actualSize),
//   };
// };

// const DiskTable = ({
//   columns,
//   disks,
//   setSelectedDisk,
// }) => {
//   const navigate = useNavigate();
//   const handleRowClick = (row) => setSelectedDisk(row);
//   const handleColumnClick = (row) => navigate(`/storages/disks/${row.id}`);

//   return (
//     <>
//       <TablesOuter
//         columns={columns}
//         data={disks.map(mapDiskToRow)}
//         shouldHighlight1stCol
//         onRowClick={handleRowClick}
//         clickableColumnIndex={[0]}
//         onClickableColumnClick={handleColumnClick}
//       />
//     </>
//   );
// };

// export default DiskTable;
