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
  "가상 디스크": <RVI24 iconDef={rvi24Storage()} />,
};

/**
 * @name VmGeneralBarChart
 * @description label 기반 icon 자동 지정 바 차트
 *
 * @prop {Array} items - { label, value, color, description } 형태의 객체 배열
 */
const VmGeneralBarChart = ({ items = [] }) => {
  const containerClass = `vm-bar-chart-container${
    items.length === 3 ? " space-between-3" : ""
  }`;

  return (
    <div className={containerClass}>
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
