// 삭제예정
// import React from "react";

// import { RVI16, rvi16Storage } from "@/components/icons/RutilVmIcons";

// const DomainStorageUsageBarChart = () => {
//   const used = 4.56; // TB
//   const total = 5.11; // TB
//   const percentage = Math.min(Math.round((used / total) * 100), 100);

//   return (
//     <div className="vm-bar-chart-container">
//       <div className="vm-bar-row">
//         <div className="vm-bar-label">
//           <RVI16 iconDef={rvi16Storage()} />
//           <span className="label-text">스토리지</span>
//         </div>
//         <div className="vm-bar-chart-wrapper">
//           <div
//             className="storage-bar-bg"
//             style={{
//               backgroundColor: "#D9D9D9",
//               height: "20px",
//               borderRadius: "1px",
//               overflow: "hidden",
//             }}
//           >
//             <div
//               className="storage-bar-fill"
//               style={{
//                 width: `${percentage}%`,
//                 height: "100%",
//                 backgroundColor: "#6396d8",
//                 transition: "width 0.4s ease-in-out",
//               }}
//             />
//           </div>
//           <div className="vm-bar-desc">
//             {used.toFixed(2)} TB 사용됨 | 총 {total.toFixed(2)} TB
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DomainStorageUsageBarChart;
