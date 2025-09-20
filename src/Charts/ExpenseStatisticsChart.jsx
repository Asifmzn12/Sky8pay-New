import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Entertainment", value: 30, color: "#302C69" },   // dark indigo
  { name: "Bill Expense", value: 25, color: "#FF8F00" },    // orange
  { name: "Investment", value: 25, color: "#FF00A3" },      // magenta
  { name: "Others", value: 20, color: "#0047FF" },          // blue
];

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload }) => {
  // Position label inside slice slightly closer to center
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <text
        x={x}
        y={y - 7}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontWeight: 700, fontSize: 16, fill: "#fff" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text
        x={x}
        y={y + 10}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontWeight: 600, fontSize: 13, fill: "#fff" }}
      >
        {payload.name}
      </text>
    </g>
  );
};

const ExpenseStatisticsChart = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg h-full">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
      Expense Statistics
    </h2>
    <div className="flex items-center justify-center h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={110}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            label={renderLabel}
            labelLine={false}
            stroke="#fff"
            strokeWidth={10}
            blendStroke
            isAnimationActive={false}
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ExpenseStatisticsChart;
