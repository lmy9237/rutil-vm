// import React, { Suspense } from 'react';

// const ClusterModals = ({ 
//   isModalOpen, 
//   action, 
//   onRequestClose, 
//   selectedClusters,
//   datacenterId
// }) => {
//   const ClusterModal = React.lazy(() => import('../modal/ClusterModal'));
//   const DeleteModal = React.lazy(() => import('../../../../components/DeleteModal'));

//   if (!isModalOpen || !action) return null;

//   return (
//     <Suspense>
//       {(action === 'create' || action === 'edit') && (
//         <ClusterModal
//           isOpen={isModalOpen}
//           onRequestClose={onRequestClose}
//           editMode={action === 'edit'}
//           cId={selectedClusters.length === 1 ? selectedClusters[0].id : null}
//           datacenterId={datacenterId}
//         />
//       )}
//       {action === 'delete' && (
//         <DeleteModal
//           isOpen={isModalOpen}
//           type="Cluster"
//           onRequestClose={onRequestClose}
//           contentLabel="클러스터"
//           data={selectedClusters}
//         />
//       )}
//     </Suspense>
//   );
// };


// export default ClusterModals;
