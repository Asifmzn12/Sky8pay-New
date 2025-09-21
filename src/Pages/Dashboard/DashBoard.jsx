import React from 'react';
import { BsThreeDots, BsChevronRight } from 'react-icons/bs';
import { IoIosSend } from "react-icons/io";

// Import the chart components
import WeeklyActivityChart from '../../Charts/WeeklyActivityChart';
import ExpenseStatisticsChart from '../../Charts/ExpenseStatisticsChart';
import BalanceHistoryChart from '../../Charts/BalanceHistoryChart';
import AnalyticsComponent from '../../Charts/AnalyticsComponent';

const Dashboard = () => {
  return (
    <div className="p-lg-8 bg-gray-100 dark:bg-gray-900 min-h-screen overflow-x-hidden">

      {/* First Row: My Cards & Recent Transaction */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr] gap-8 mb-8">
        {/* My Cards */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">My Cards</h2>
            <span className="text-blue-600 font-medium cursor-pointer">See All</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative p-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl shadow-lg text-white w-full">
              {/* Card content */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="block text-sm opacity-80">Balance</span>
                  <h3 className="text-2xl font-bold mt-1">$5,756</h3>
                </div>
                <BsThreeDots className="text-2xl opacity-80" />
              </div>
              <div className="mt-8">
                <span className="block text-sm opacity-80">CARD HOLDER</span>
                <p className="text-lg font-medium mt-1">Eddy Cusuma</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm">3778 **** **** 1234</p>
                <span className="text-xs">VALID THRU 12/22</span>
              </div>
            </div>
            <div className="relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 w-full">
              {/* Card content */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="block text-sm opacity-80 dark:text-gray-400">Balance</span>
                  <h3 className="text-2xl font-bold mt-1">$5,756</h3>
                </div>
                <BsThreeDots className="text-2xl opacity-80" />
              </div>
              <div className="mt-8">
                <span className="block text-sm opacity-80 dark:text-gray-400">CARD HOLDER</span>
                <p className="text-lg font-medium mt-1">Eddy Cusuma</p>
              </div>
              <div className="flex justify-between items-center mt-2 text-gray-600 dark:text-gray-400">
                <p className="text-sm">3778 **** **** 1234</p>
                <span className="text-xs">VALID THRU 12/22</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transaction */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Recent Transaction</h2>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 flex items-center justify-center bg-yellow-100 rounded-full"></div>
                <div>
                  <p className="text-gray-800 dark:text-gray-100 font-medium">Deposit from my</p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">28 January 2021</span>
                </div>
              </div>
              <span className="text-red-500 font-semibold">-$850</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full"></div>
                <div>
                  <p className="text-gray-800 dark:text-gray-100 font-medium">Deposit Paypal</p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">25 January 2021</span>
                </div>
              </div>
              <span className="text-green-500 font-semibold">+$2,500</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full"></div>
                <div>
                  <p className="text-gray-800 dark:text-gray-100 font-medium">Jemi Wilson</p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">21 January 2021</span>
                </div>
              </div>
              <span className="text-green-500 font-semibold">+$5,400</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />
      
      {/* Second Row: Weekly Activity & Expense Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <WeeklyActivityChart />
        <ExpenseStatisticsChart />
      </div>

      <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />

      {/* Third Row: Balance History */}
      <div className="grid grid-cols-1 mb-8">
        <BalanceHistoryChart />
      </div>

      <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />

      {/* Fourth Row: Analytics */}
      <div className="grid grid-cols-1">
        <AnalyticsComponent />
      </div>
    </div>
  );
};

export default Dashboard;