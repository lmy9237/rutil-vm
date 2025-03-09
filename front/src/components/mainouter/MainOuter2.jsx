// 컴포넌트분리 테스트용
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faChevronDown,
//   faChevronRight,
//   faBuilding,
//   faLayerGroup,
//   faEarthAmericas,
//   faMicrochip,
// } from "@fortawesome/free-solid-svg-icons";

// const MainOuter2 = ({ selected }) => {
//   const navigate = useNavigate();
//   const [selectedDiv, setSelectedDiv] = useState(null);

//   const [openDataCenters, setOpenDataCenters] = useState({});
//   const [openClusters, setOpenClusters] = useState({});
//   const [openHosts, setOpenHosts] = useState({});

//   // 네비게이션 데이터 (API 호출 시 주입해야 함)
//   const [navClusters, setNavClusters] = useState([]);

//   // 데이터 로드 (API 연결 필요)
//   useEffect(() => {
//     // 🚀 TODO: API 호출 후 setNavClusters(data) 로 데이터 설정
//     setNavClusters([
//       {
//         id: "dc-1",
//         name: "Data Center 1",
//         clusters: [
//           {
//             id: "cluster-1",
//             name: "Cluster 1",
//             hosts: [{ id: "host-1", name: "Host 1" }],
//           },
//         ],
//       },
//     ]);
//   }, []);

//   // 열림/닫힘 상태 변경
//   const toggleDataCenter = (id) =>
//     setOpenDataCenters((prev) => ({ ...prev, [id]: !prev[id] }));
//   const toggleCluster = (id) =>
//     setOpenClusters((prev) => ({ ...prev, [id]: !prev[id] }));
//   const toggleHost = (id) =>
//     setOpenHosts((prev) => ({ ...prev, [id]: !prev[id] }));

//   const getBackgroundColor = (id) =>
//     selectedDiv === id ? "rgb(218, 236, 245)" : "";

//   return (
//     <div id="virtual_machine_chart">
//       {/* Rutil Manager */}
//       <div
//         className="aside-popup-content"
//         style={{ backgroundColor: getBackgroundColor("rutil-manager") }}
//         onClick={() => {
//           setSelectedDiv("rutil-manager");
//           navigate("/computing/rutil-manager");
//         }}
//       >
//         <FontAwesomeIcon icon={faBuilding} fixedWidth />
//         <span>Rutil Manager</span>
//       </div>

//       {/* 데이터 센터 */}
//       {navClusters.map((dc) => (
//         <div key={dc.id}>
//           <div
//             className="aside-popup-second-content"
//             style={{ backgroundColor: getBackgroundColor(dc.id) }}
//             onClick={() => {
//               setSelectedDiv(dc.id);
//               navigate(`/computing/datacenters/${dc.id}/clusters`);
//             }}
//           >
//             <FontAwesomeIcon
//               icon={openDataCenters[dc.id] ? faChevronDown : faChevronRight}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleDataCenter(dc.id);
//               }}
//               fixedWidth
//             />
//             <FontAwesomeIcon icon={faLayerGroup} fixedWidth />
//             <span>{dc.name}</span>
//           </div>

//           {/* 클러스터 */}
//           {openDataCenters[dc.id] &&
//             dc.clusters.map((cluster) => (
//               <div key={cluster.id}>
//                 <div
//                   className="aside-popup-third-content"
//                   style={{ backgroundColor: getBackgroundColor(cluster.id) }}
//                   onClick={() => {
//                     setSelectedDiv(cluster.id);
//                     navigate(`/computing/clusters/${cluster.id}`);
//                   }}
//                 >
//                   <FontAwesomeIcon
//                     icon={openClusters[cluster.id] ? faChevronDown : faChevronRight}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleCluster(cluster.id);
//                     }}
//                     fixedWidth
//                   />
//                   <FontAwesomeIcon icon={faEarthAmericas} fixedWidth />
//                   <span>{cluster.name}</span>
//                 </div>

//                 {/* 호스트 */}
//                 {openClusters[cluster.id] &&
//                   cluster.hosts.map((host) => (
//                     <div key={host.id}>
//                       <div
//                         className="aside-popup-fourth-content"
//                         style={{ backgroundColor: getBackgroundColor(host.id) }}
//                         onClick={() => {
//                           setSelectedDiv(host.id);
//                           navigate(`/computing/hosts/${host.id}`);
//                         }}
//                       >
//                         <FontAwesomeIcon
//                           icon={openHosts[host.id] ? faChevronDown : faChevronRight}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleHost(host.id);
//                           }}
//                           fixedWidth
//                         />
//                         <FontAwesomeIcon icon={faMicrochip} fixedWidth />
//                         <span>{host.name}</span>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MainOuter2;
