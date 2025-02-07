
// import { useAllStorageDomainFromDisk, useAllVmsFromDisk, useAllVnicProfilesFromNetwork } from "../../../api/RQHook";
// import TableColumnsInfo from "../../table/TableColumnsInfo";
// import PagingTableOuter from "../../table/PagingTableOuter";

// const DiskStorage = ({disk}) => {

//     const { 
//         data: storageDomains, 
//         status: storageDomainsStatus, 
//         isLoading: isStorageDomainsLoading, 
//         isError: isStorageDomainsError,
//       } = useAllStorageDomainFromDisk(disk?.id, toTableItemPredicateStorage);
//       function toTableItemPredicateStorage(storageDomain) { 
//         return {
//           icon1: '',
//           icon2: '',
//           name: storageDomain?.name ?? '없음',
//           domainType: storageDomain?.domainType ?? '없음',
//           status: storageDomain?.status ?? '알 수 없음',
//           freeSpace: storageDomain?.freeSpace ? `${(storageDomain.freeSpace / 1024).toFixed(2)} GiB` : '알 수 없음',
//           usedSpace: storageDomain?.usedSpace ? `${(storageDomain.usedSpace / 1024).toFixed(2)} GiB` : '알 수 없음',
//           totalSpace: storageDomain?.totalSpace ? `${(storageDomain.totalSpace / 1024).toFixed(2)} GiB` : '알 수 없음',
//           description: storageDomain?.description ?? '없음',
//         };
//       }
    
//     return (
//         <PagingTableOuter 
//             columns={TableColumnsInfo.STORAGES_FROM_DISK} 
//             data={storageDomains}
//             onRowClick={() => console.log('Row clicked')} 
//             showSearchBox={false}
//         />
//     );
//   };
  
//   export default DiskStorage;