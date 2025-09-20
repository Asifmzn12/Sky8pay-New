import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Sat', deposit: 250, withdraw: 210 },
  { name: 'Sun', deposit: 320, withdraw: 250 },
  { name: 'Mon', deposit: 280, withdraw: 230 },
  { name: 'Tue', deposit: 390, withdraw: 290 },
  { name: 'Wed', deposit: 180, withdraw: 140 },
  { name: 'Thu', deposit: 380, withdraw: 220 },
  { name: 'Fri', deposit: 350, withdraw: 310 },
];

const WeeklyActivityChart = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Weekly Activity</h2>
    <div className="flex space-x-4 text-sm font-medium">
      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>Diposit</span>
      <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-pink-500 mr-2"></span>Withdraw</span>
    </div>
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Bar dataKey="deposit" fill="#3B82F6" barSize={20} radius={[10, 10, 0, 0]} />
          <Bar dataKey="withdraw" fill="#EC4899" barSize={20} radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default WeeklyActivityChart;