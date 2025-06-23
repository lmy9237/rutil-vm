// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   Tooltip,
// } from "recharts";
// import {
//   RVI24,
//   rvi24DeveloperBoard,
//   rvi24Memory,
//   rvi24Network,
//   rvi24Storage,

// } from "@/components/icons/RutilVmIcons";
// import "./VmGeneralBarChart.css";

// const getUsageData = (type = "vm", usageDto = {}) => {

//   /*가상머신 그래프 */
//   const cpu = usageDto.cpuPercent ?? 0;
//   const memory = usageDto.memoryPercent ?? 0;
//   const networkOrStorage = usageDto.networkPercent ?? 0;
//   const cpuDesc = `${cpu}% 사용됨 | ${100 - cpu}% 사용 가능`;
//   const memoryDesc = `${memory}% 사용됨 | ${100 - memory}% 사용 가능`;
//   const networkDesc = `${networkOrStorage}% 사용됨 | ${100 - networkOrStorage}% 사용 가능`;

//   /*호스트 그래프 */


//   if (type === "domain") {
//     return [
//       {
//         label: "스토리지",
//         value: 89, // 예시 값
//         color: "#6396d8",
//         icon: <RVI24 iconDef={rvi24Storage()} />,
//         description: "4.56 TB 사용됨 | 총 5.11 TB",
//       }
//     ];
//   }
//   return [
//     {
//       label: "CPU",
//       value: cpu,
//       color: "#6396d8",
//       icon: <RVI24 iconDef={rvi24DeveloperBoard()} />,
//       description: cpuDesc,
//     },
//     {
//       label: "메모리",
//       value: memory,
//       color: "#6396d8",
//       icon: <RVI24 iconDef={rvi24Memory()} />,
//       description: memoryDesc
//     },
//     type === "rutil"
//       ? {
//           label: "스토리지",
//           value: 10,
//           color: "#6396d8",
//           icon: <RVI24 iconDef={rvi24Storage()} />,
//           description: "90% 사용 가능",
//         }
//       : {
//           label: "네트워크",
//           value: networkOrStorage,
//           color: "#6396d8",
//           icon: <RVI24 iconDef={rvi24Network()} />,
//           description: networkDesc
//         },
//   ];
// };

// const VmGeneralBarChart = ({ 
//   type="vm",
//   usageDto={},
// }) => {
//   const usageData = getUsageData(type, usageDto);

//   return (
//     <div className="vm-bar-chart-container">
//       {usageData.map((item, idx) => (
//         <div className="vm-bar-row" key={idx}>
//           <div className="vm-bar-label">
//             {item.icon}
//             <span className="label-text">{item.label}</span>
//           </div>
//           <div className="vm-bar-chart-wrapper">
//             <ResponsiveContainer width="100%" height={34}>
//               <BarChart layout="vertical" data={[item]}>
//                 <XAxis type="number" domain={[0, 100]} hide />
//                 <YAxis type="category" dataKey="label" hide />
//                 <Tooltip
//                   content={({ active, payload }) => {
//                     if (active && payload && payload.length > 0) {
//                       const { value } = payload[0];
//                       return (
//                         <div
//                           style={{
//                             padding: "6px 10px",
//                             backgroundColor: "#fff",
//                             border: "1px solid #ccc",
//                             borderRadius: "4px",
//                             boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
//                             fontSize: "12px",
//                           }}
//                         >
//                           {`${value}% 사용`}
//                         </div>
//                       );
//                     }
//                     return null;
//                   }}
//                 />
//                 <Bar
//                   dataKey="value"
//                   fill={item.color}
//                   background={{ fill: "#D9D9D9" }}
//                   radius={0}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//             <div className="vm-bar-desc">{item.description}</div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default VmGeneralBarChart;

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  RVI24,
  rvi24DeveloperBoard,
  rvi24Memory,
  rvi24Network,
  rvi24Storage,
} from "@/components/icons/RutilVmIcons";
import "./VmGeneralBarChart.css";

// label 기준 icon 매핑
const labelIconMap = {
  "CPU": <RVI24 iconDef={rvi24DeveloperBoard()} />,
  "메모리": <RVI24 iconDef={rvi24Memory()} />,
  "네트워크": <RVI24 iconDef={rvi24Network()} />,
  "스토리지": <RVI24 iconDef={rvi24Storage()} />,
};

/**
 * @name VmGeneralBarChart
 * @description label 기반 icon 자동 지정 바 차트
 *
 * @prop {Array} items - { label, value, color, description } 형태의 객체 배열
 */
const VmGeneralBarChart = ({ items = [] }) => {
  return (
    <div className="vm-bar-chart-container">
      {items.map((item, idx) => {
        const icon = labelIconMap[item.label] || null;
        return (
          <div className="vm-bar-row" key={idx}>
            <div className="vm-bar-label">
              {icon}
              <span className="label-text">{item.label}</span>
            </div>
            <div className="vm-bar-chart-wrapper">
              <ResponsiveContainer width="100%" height={34}>
                <BarChart layout="vertical" data={[item]}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="label" hide />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0) {
                        const { value } = payload[0];
                        return (
                          <div
                            style={{
                              padding: "6px 10px",
                              backgroundColor: "#fff",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                              fontSize: "12px",
                            }}
                          >
                            {`${value}% 사용`}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill={"#6396d8"}
                    background={{ fill: "#D9D9D9" }}
                    radius={0}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="vm-bar-desc">{item.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VmGeneralBarChart;
