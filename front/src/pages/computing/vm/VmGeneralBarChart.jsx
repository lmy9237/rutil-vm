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
  RVI16,
  rvi16Host,
  RVI24,
  rvi24DeveloperBoard,
  rvi24Memory,
  rvi24Storage,
} from "@/components/icons/RutilVmIcons";
import "./VmGeneralBarChart.css";

const usageData = [
  {
    label: "CPU",
    value: 53,
    color: "#f57171",
    icon: <RVI24 iconDef={rvi24DeveloperBoard()}/>,
    description: "1 CPU 할당됨 | 47% 사용 가능",
  },
  {
    label: "메모리",
    value: 34,
    color: "#98db6b",
    icon: <RVI24 iconDef={rvi24Memory()}/>,
    description: "4096 MB 할당됨 | 66% 사용 가능",
  },
  {
    label: "네트워크",
    value: 10,
    color: "#98db6b",
    icon: <RVI24 iconDef={rvi24Storage()} />,
    description: "90% 사용 가능",
  },
];

const VmGeneralBarChart = () => {
  return (
    <div className="vm-bar-chart-container">
      {usageData.map((item, idx) => (
        <div className="vm-bar-row" key={idx}>
          <div className="vm-bar-label">
            {item.icon}
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
                        const { name, value } = payload[0];
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
                  fill={item.color}
                  background={{ fill: "#D9D9D9" }}
                  radius={0} // ✅ 둥근 모서리 제거
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="vm-bar-desc">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VmGeneralBarChart;
