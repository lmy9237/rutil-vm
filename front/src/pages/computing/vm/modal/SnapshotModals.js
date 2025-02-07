// import React from "react";
// import VnicProfileModal from "./VnicProfileModal.js";
// import VmSnapshotDeleteModal from "./VmSanpshotDeleteModal.js";

// const VnicProfileModals = ({ activeModal, vnicProfile, selectedSnapshots = [], vmId, onClose }) => {
//   const modals = {
//     create: 
//       <VnicProfileModal
//         isOpen={activeModal === 'create'} 
//         vmId={vmId}
//         onClose={onClose} 
//       />,
//     edit: (
//       <VnicProfileModal
//         editMode
//         isOpen={activeModal === 'edit'}
//         vnicProfileId={vnicProfile?.id}
//         onClose={onClose}
//     />
//     ),
//     delete: (
//       <VmSnapshotDeleteModal
//         isOpen={activeModal === 'delete' }
//         data={selectedSnapshots}
//         onClose={onClose}
//       />
//     )
//   };

//   return (
//     <>
//       {Object.keys(modals).map((key) => (
//           <React.Fragment key={key}>{modals[key]}</React.Fragment>
//       ))}
//     </>
//   );
// };

// export default VnicProfileModals;
