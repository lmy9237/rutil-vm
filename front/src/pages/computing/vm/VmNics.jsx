// 삭제예정

// import React, { useState, Suspense, useRef } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowCircleDown, faArrowCircleUp, faPlug, faPlugCircleXmark} from "@fortawesome/free-solid-svg-icons";
// import useUIState             from "@/hooks/useUIState";
// import useGlobal              from "@/hooks/useGlobal";
// import useContextMenu         from "@/hooks/useContextMenu";
// import useClickOutside        from "@/hooks/useClickOutside";
// import SelectedIdView         from "@/components/common/SelectedIdView";
// import OVirtWebAdminHyperlink from "@/components/common/OVirtWebAdminHyperlink";
// import TablesRow              from "@/components/table/TablesRow";
// import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
// import NicActionButtons       from "@/components/dupl/VmNicActionButtons";
// import {
//   useNetworkInterfacesFromVM
// } from "@/api/RQHook";
// import {
//   RVI24,
//   rvi24ChevronDown,
//   rvi24ChevronRight,
// } from "@/components/icons/RutilVmIcons";
// import { checkZeroSizeToMbps } from "@/util";
// import Localization           from "@/utils/Localization";
// import Logger                 from "@/utils/Logger";
// import "./Vm.css"
// import VmNicModals from "@/components/modal/vm/VmNicModals";
// /**
//  * @name VmNics
//  * @description 가상에 종속 된 네트워크 인터페이스 목록
//  * (/computing/vms/<VM_ID>/nics)
//  * 
//  * @param {string} vmId 가상머신 ID
//  * @returns
//  */
// const VmNics = ({ 
//   vmId
// }) => {
//   const { activeModal, closeModal, } = useUIState()
//   const {
//     contextMenu, setContextMenu
//   } = useContextMenu()
//   const {
//     vmsSelected,
//     nicsSelected, setNicsSelected
//   } = useGlobal()

//   const {
//     data: nics = [],
//     isLoading: isNicsLoading,
//     isError: isNicsError,
//     Success: isNicsSuccess,
//   } = useNetworkInterfacesFromVM(vmId, (e) => ({ ...e }));

//   const transformedData = [...nics].sort((a, b) => a.name.localeCompare(b.name)).map((nic) => ({
//     ...nic,
//     id: nic?.id,
//     name: nic?.name,
//     status: nic?.status,
//     linked: nic?.linked === true ? "연결됨": "연결해제됨",
//     plugged: nic?.plugged,
//     ipv4: nic?.ipv4 || "해당 없음",
//     ipv6: nic?.ipv6 || "해당 없음",
//     macAddress : nic?.macAddress,
//     networkName : nic?.networkVo?.name,
//     vnicProfileName : nic?.vnicProfileVo?.name,
//     interface_: nic?.interface_,
//     portMirroring: nic?.portMirroring || "비활성화됨",
//     guestInterfaceName: nic?.guestInterfaceName,
//     speed: "10000",
//     rxSpeed: checkZeroSizeToMbps(nic?.rxSpeed),
//     txSpeed: checkZeroSizeToMbps(nic?.txSpeed),
//     rxTotalSpeed: nic?.rxTotalSpeed?.toLocaleString() || "0",
//     txTotalSpeed: nic?.txTotalSpeed?.toLocaleString() || "0",
//     pkts: `${nic?.rxTotalError}` || "1",    
//   }));

//   const [visibleDetailId, setVisibleDetailId] = useState(null);
//   const toggleDetails = (id) => { setVisibleDetailId((prev) => (prev === id ? null : id))};
  
//   const handleContextMenu = (e, rowIndex) => {
//     Logger.debug(`VmNic > handleContextMenu ... rowIndex: ${rowIndex}, e: `, e)
//     e.preventDefault();
  
//     setContextMenu({
//       mouseX: e.clientX,
//       mouseY: e.clientY,
//       item: {
//         ...nicsSelected,
//       },
//     }, "nic");
//   };

//   const nicRef = useRef()

// useClickOutside(nicRef, (e) => {
//   const isInsideModal = e.target.closest(".modal"); // BaseModal 안이면 무시
//   if (!isInsideModal) {
//     setNicsSelected([]);
//   }
// });
//   return (
//     <>{/* v-start w-full으로 묶어짐*/}
//       <div className="network-interface-group w-full"
//         ref={nicRef} 
//       > 
//         <div className="dupl-header-group f-start align-start gap-4 w-full mb-2">
//           <NicActionButtons />
//         </div>

//         <div className="network-interface-outer w-full">
//           {transformedData.length === 0 ? ( // NIC가 하나라도 있을 때 실행
//             <p style={{textAlign: "center", color: "gray", padding: "20px", fontSize: "14px" }}>
//               표시할 네트워크 인터페이스가 없습니다.
//             </p>
//           ) : (
//             [...transformedData].map((nic, i) => (
//               <div key={nic?.id}
//                 className={`network_content2 w-full ${nicsSelected[0]?.id === nic.id ? "selected" : ""}`}
//                 onClick={(e) => {
//                   if (e.target.closest(".network-content-detail")) return;
//                   const isSelected = nicsSelected[0]?.id === nic.id;
//                   const isModalOpen = ["nic:create", "nic:update"].includes(activeModal());
//                   if (isSelected && !isModalOpen) {
//                     setNicsSelected([]);
//                   } else {
//                     setNicsSelected(nic);
//                   }
//                   toggleDetails(nic.id);
//                 }}
//                 // onContextMenu={(e) => handleContextMenu(e, i)}
//               >
//                 <div className="network-content f-start f-btw">
//                   <div className="network-status f-start">
//                     <RVI24 iconDef={nicsSelected[0]?.id === nic.id ? rvi24ChevronDown() : rvi24ChevronRight()} />
//                     <FontAwesomeIcon
//                       icon={Boolean(nic?.linked) ? faArrowCircleUp : faArrowCircleDown}
//                       style={{ color: Boolean(nic?.linked) ? "#21c50b" : "#e80c0c", marginLeft: "0.3rem" }}
//                       fixedWidth
//                     />
//                     <FontAwesomeIcon
//                       icon={Boolean(nic?.plugged) ? faPlug : faPlugCircleXmark}
//                       style={{ color: Boolean(nic?.plugged) ? "#21c50b" : "#e80c0c", marginLeft: "0.3rem" }}
//                       fixedWidth
//                     />
//                     <span>{nic?.name}</span>
//                   </div>
//                   <VmNicStatus title={`${Localization.kr.NETWORK} ${Localization.kr.NAME}`} value={nic?.networkVo?.name}/>
//                   <VmNicStatus title={"IPv4"} value={nic?.ipv4}/>
//                   <VmNicStatus title={"IPv6"} value={nic?.ipv6}/>
//                   <VmNicStatus title={"MAC"} value={nic?.macAddress}/>
//                 </div>

//                 <div className="network-content-detail w-full"
//                   style={{ display: (nicsSelected[0]?.id === nic.id) ? "flex" : "none" }}
//                 >
//                   <div className="network-content-detail-box">
//                     <span className="fs-14 fw-700">{Localization.kr.GENERAL}</span>
//                     <TablesRow
//                       columns={TableColumnsInfo.NICS_FROM_VM} 
//                       data={nic} 
//                     />
//                   </div>
//                   <div className="network-content-detail-box">
//                     <span className="fs-14 fw-700">통계</span>
//                     <TablesRow
//                       columns={TableColumnsInfo.NICS_CALC_FROM_VM} 
//                       data={nic} 
//                     />
//                   </div>
//                   <div className="network-content-detail-box">
//                     <span className="fs-14 fw-700">네트워크 필터 매개변수</span>
//                     <table className="snap-table">
//                       <tbody></tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//       <SelectedIdView items={nicsSelected} />
//       <OVirtWebAdminHyperlink
//         name={`${Localization.kr.COMPUTING}>${Localization.kr.VM}>${vmsSelected[0]?.name}`}
//         path={`vms-network_interfaces;name=${vmsSelected[0]?.name}`} 
//       />
//       <VmNicModals type="vm" resourceId={vmId} />
//     </>
    
//   );
// };

// const VmNicStatus = ({
//   title,
//   value,
//   ...props
// }) => {
//   return (
//     <div className="network-status v-start"
//       {...props}
//     >
//       <span className="network-status-name fw-700">{title}</span>
//       <span>{value || Localization.kr.NOT_ASSOCIATED}</span>
//     </div>
//   )
// }

// export default VmNics;
