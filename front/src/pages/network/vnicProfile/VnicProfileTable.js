import React from 'react';
import { useNavigate } from 'react-router-dom';
import TablesOuter from '../../../components/table/TablesOuter';
import TableRowClick from '../../../components/table/TableRowClick';

const VnicProfileTable = ({
  columns,
  vnicProfiles,
  setSelectedVnicProfiles, // 다중 선택된 vNic 프로파일을 관리하기 위한 함수
}) => {

  const navigate = useNavigate();
  
  const handleNameClick = (id) => {
    navigate(`/vnicProfiles/${id}/vms`);
  };
  const handleRowSelection = (selectedRows) => {
    setSelectedVnicProfiles(selectedRows); // 선택된 데이터 전달
  };

  return (
    <TablesOuter
      columns={columns}
      data={vnicProfiles.map((vnic) => ({
        ...vnic,
        network: (
          <TableRowClick type="network" id={vnic?.networkVo?.id}>
            {vnic?.networkVo?.name}
          </TableRowClick>
        ),
        dataCenter: (
          <TableRowClick type="datacenter" id={vnic?.dataCenterVo?.id}>
            {vnic?.dataCenterVo?.name}
          </TableRowClick>
        ),
        passThrough: vnic?.passThrough === 'DISABLED' ? '아니요' : '예',
        networkFilter: vnic?.networkFilterVo?.name || '-',
      }))}
      shouldHighlight1stCol={true}
      onRowClick={handleRowSelection} // 다중 선택된 행 데이터를 업데이트
      clickableColumnIndex={[0]}
      onClickableColumnClick={(row) => handleNameClick(row.id)}
    />
  );
};

export default VnicProfileTable;

// import React from 'react';
// import TablesOuter from './TablesOuter';
// import TableRowClick from './TableRowClick';

// const VnicProfileTable = ({
//   columns,
//   vnicProfiles,
//   setSelectedVnicProfile,
// }) => {

//   return (
//     <>
//       <TablesOuter
//         columns={columns}
//         data={vnicProfiles.map((vnic) => {
//           return {
//             ...vnic,
//             network: (
//               <TableRowClick type="network" id={vnic?.networkVo.id}>
//                 {vnic?.networkVo.name}
//               </TableRowClick>
//             ),
//             dataCenter: (
//               <TableRowClick type="datacenter" id={vnic?.dataCenterVo.id}>
//                 {vnic?.dataCenterVo.name}
//               </TableRowClick>
//             ),
//             // portMirroring: vnic?.portMirroring === true ? '예': '아니요',
//             passThrough: vnic?.passThrough === 'DISABLED' ? '아니요' : '예',
//             // version: vnic?.compatVersion,
//             networkFilter: vnic?.networkFilterVo.name
//           };
//         })}
//         shouldHighlight1stCol={true}
//         onRowClick={(row) => setSelectedVnicProfile(row)}
//       />
//     </>
//   );
// };

// export default VnicProfileTable;
