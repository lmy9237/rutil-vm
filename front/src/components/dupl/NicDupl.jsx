/*
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import TablesOuter from "../table/TablesOuter";
import TableRowClick from "../table/TableRowClick";
import { renderTFStatusIcon } from "../Icon";
import { useVm } from "../../api/RQHook";
import NicModals from "../modal/nic/NicModals";
import NicActionButtons from "./NicActionButtons";
*/

// /**
//  * @name NicDupl
//  * @description ...
//  *
//  * @param {Array} vmNics
//  * @returns
//  */
// const NicDupl = ({ 
//   isLoading, isError, isSuccess,
//   vmNics = [], columns = [], vmId,  showSearchBox =true
// }) => {
//   const { data: vm }  = useVm(vmId);
  
//   const navigate = useNavigate();
//   const [activeModal, setActiveModal] = useState(null);
//   const [selectedNics, setSelectedNics] = useState([]); // 다중 선택된 nic
//   const selectedIds = (Array.isArray(selectedNics) ? selectedNics : []).map((nic) => nic.id).join(", ");

//   const openModal = (action) => setActiveModal(action);
//   const closeModal = () => setActiveModal(null);

//   // const transformedData = vmNics.map((nic) => {
//   //   const NicDupl = nic?.nicImageVo;
//   //   return {
//   //     ...nic,
//   //     icon: renderTFStatusIcon(nic?.active),
//   //     name: nic?.name,
//   //     network: nic?.networkVo?.name,
//   //     ipv6: nic?.ipv6,
//   //     ipv4: nic?.ipv4,
//   //     macAddress: nic?.macAddress,
//   //     vnicProfile: nic?.vnicProfileVo?.name,
//   //     status: nic?.status,
//   //     interfaceType: nic?.interface_,
//   //     speed: nic?.speed,
//   //     portMirroring: nic?.portMirroring,
//   //     guestInterfaceName: nic?.guestInterfaceName,
//   //     rxSpeed: nic?.rxSpeed,
//   //     txSpeed: nic?.txSpeed,
//   //     rxTotalSpeed: nic?.rxTotalSpeed,
//   //     txTotalSpeed: nic?.txTotalSpeed,
//   //     rxTotalError: nic?.rxTotalError,
//   //   };
//   // });

//   return (
//     <div onClick={(e) => e.stopPropagation()}>
//       <div className="dupl-header-group">
//         <NicActionButtons
//           openModal={openModal}
//           isEditDisabled={selectedNics.length !== 1}
//           isDeleteDisabled={selectedNics.length === 0}
//         />
//       </div>
//      
//       <TablesOuter
//         isLoading={isLoading} isError={isError} isSuccess={isSuccess}
//         columns={columns}
//         data={filteredData}
//         shouldHighlight1stCol={true}
//         onRowClick={(selectedRows) => setSelectedNics(selectedRows)}
//         multiSelect={true}
//         // onContextMenuItems={(row) => [ // 마우스 버튼
//         //   <VmDiskActionButtons
//         //     openModal={openModal}
//         //     isEditDisabled={!row}
//         //     type='context'
//         //   />
//         // ]}
//       />
//       {/* 디스크 모달창 */}
//       <Suspense>
//         <NicModals
//           activeModal={activeModal}
//           nic={selectedNics[0]}
//           selectedNics={selectedNics}
//           vmId={vmId}
//           onClose={closeModal}
//         />
//       </Suspense>
//     </div>
//   );
// };

// export default NicDupl;
