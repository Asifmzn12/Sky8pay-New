import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 150 },
  { name: 'Feb', value: 250 },
  { name: 'March', value: 220 },
  { name: 'April', value: 450 },
  { name: 'May', value: 280 },
  { name: 'jane', value: 550 },
  { name: 'Jul', value: 600 },
  { name: 'Aug', value: 250 },
  { name: 'Sep', value: 220 },
  { name: 'Oct', value: 450 },
  { name: 'Nov', value: 280 },
  { name: 'Dec', value: 550 },
  { name: 'Jan', value: 600 },
];

const BalanceHistoryChart = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Balance History</h2>
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default BalanceHistoryChart;