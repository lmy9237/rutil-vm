import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import TablesOuter from '../../../components/table/TablesOuter';
import { formatBytesToGBToFixedZero, renderDomainStatusIcon } from '../../../util';

const DomainTable = ({
  columns,
  domains,
  setSelectedDomains, // 다중 선택된 도메인을 관리하기 위한 함수
}) => {
  const navigate = useNavigate();

  const handleNameClick = (id) => {
    navigate(`/storages/domains/${id}`);
  };

  const renderStatus = (status) => {
    if (status === 'ACTIVE') {
      return '활성화';
    } else if (status === 'DOWN') {
      return '중지';
    } else if (status === 'INACTIVE') {
      return '비활성화';
    }
    return status;
  };

  const sizeCheck = (size) => {
    if (size === 0) {
      return 'N/A';
    } else {
      return formatBytesToGBToFixedZero(size) + ' GB';
    }
  };

  const handleRowSelection = (selectedRows) => {
    setSelectedDomains(selectedRows); // 선택된 데이터를 업데이트
  };

  return (
    <TablesOuter
      columns={columns}
      data={domains.map((domain) => ({
        ...domain,
        icon: renderDomainStatusIcon(domain.status),
        status: renderStatus(domain?.status),
        hostedEngine: domain?.hostedEngine === true ? (
          <FontAwesomeIcon 
            icon={faPencil} 
            fixedWidth 
            style={{ color: 'gold', fontSize: '0.3rem', transform: 'rotate(90deg)' }} 
          />
        ) : '',
        domainType: 
          domain?.domainType === 'data' ? '데이터' 
          : domain?.domainType === 'iso' ? 'ISO'
          : 'EXPORT',
        storageType: 
          domain?.storageType === 'nfs' ? 'NFS'
          : domain?.storageType === 'iscsi' ? 'iSCSI'
          : 'Fibre Channel',
        diskSize: sizeCheck(domain?.diskSize),
        availableSize: sizeCheck(domain?.availableSize),
        usedSize: sizeCheck(domain?.usedSize),
      }))}
      shouldHighlight1stCol={true}
      onRowClick={handleRowSelection} // 다중 선택된 데이터 업데이트
      clickableColumnIndex={[2]}
      onClickableColumnClick={(row) => handleNameClick(row.id)}
    />
  );
};

export default DomainTable;

// import React from 'react';
// import TablesOuter from './TablesOuter';
// import { useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlay, faPencil, faWrench } from '@fortawesome/free-solid-svg-icons';
// import { formatBytesToGBToFixedZero } from '../util';

// const DomainTable = ({
//   columns,
//   domains,
//   setSelectedDomain,
// }) => {
//   const navigate = useNavigate();
  
//   const handleNameClick = (id) => {
//     navigate(`/storages/domains/${id}`);
//   };

//   const renderStatusIcon = (status) => {
//     if (status === 'ACTIVE') {
//       return <FontAwesomeIcon icon={faPlay} fixedWidth style={{ color: 'lime', fontSize: '0.3rem', transform: 'rotate(270deg)' }} />;
//     } else if (status === 'DOWN' || status === 'INACTIVE') {
//       return <FontAwesomeIcon icon={faPlay} fixedWidth style={{ color: 'red', fontSize: '0.3rem', transform: 'rotate(90deg)' }} />;
//     } else if (status === 'MAINTENANCE') {
//       return <FontAwesomeIcon icon={faWrench} fixedWidth style={{ color: 'black', fontSize: '0.3rem', }} />;
//     }
//     return status;
//   };

//   const renderStatus = (status) => {
//     if (status === 'ACTIVE') {
//       return '활성화';
//     } else if (status === 'DOWN') {
//       return '중지?';
//     } else if (status === 'INACTIVE') {
//       return '비활성화';
//     }
//     return status;
//   };

//   const sizeCheck = (size) => {
//     if(size === 0){
//       return 'N/A';
//     }else{
//       return formatBytesToGBToFixedZero(size) + " GB";
//     }
//   }


//   return (
//     <>
//       <TablesOuter
//         columns={columns}
//         data={domains.map((domain) => ({
//           ...domain,
//           icon: renderStatusIcon(domain.status),
//           status: renderStatus(domain?.status),
//           hostedEngine: domain?.hostedEngine === true ? 
//             <FontAwesomeIcon 
//                 icon={faPencil} 
//                 fixedWidth 
//                 style={{ color: 'gold', fontSize: '0.3rem', transform: 'rotate(90deg)' }} 
//             /> : "" ,
//           domainType: 
//             domain?.domainType === 'data' ? '데이터' 
//             : domain?.domainType === 'iso' ? 'ISO'
//             : 'EXPORT',
//           storageType: 
//             domain?.storageType === 'nfs' ? 'NFS'
//             : domain?.storageType === 'iscsi' ? 'iSCSI'
//             : 'Fibre Channel',
//           // hostedEngine: domain?.hostedEngine ? 'O' : 'X',
//           diskSize: sizeCheck(domain?.diskSize),
//           availableSize: sizeCheck(domain?.availableSize),
//           usedSize: sizeCheck(domain?.usedSize),
//         }))}
//         shouldHighlight1stCol={true}
//         onRowClick={(row) => setSelectedDomain(row)}
//         clickableColumnIndex={[2]}
//         onClickableColumnClick={(row) => handleNameClick(row.id)}
//       />
//     </>
//   );
// };

// export default DomainTable;
