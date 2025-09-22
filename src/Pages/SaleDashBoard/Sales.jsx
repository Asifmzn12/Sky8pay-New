import React, { useEffect, useState } from 'react';
import { BindAPI } from '../../services/Commonapi';
import { GetSaleDashBoard } from '../../services/SaleDashBoard';


const Card = ({ title, value }) => (
  <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">
      {typeof value === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value) : value}
    </p>
  </div>
);


const SkeletonCard = () => (
  <div className="flex flex-col w-full h-full p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-full w-3/4 mb-4"></div>
    <div className="h-8 bg-gray-400 dark:bg-gray-500 rounded-md w-full"></div>
  </div>
);

const Sales = () => {
  const [saledata, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [filterType, setFilterType] = useState("today");
  const [apiOptions, setApiOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  };

  const apiFetchData = async () => {
    try {
      const data = await BindAPI({ RoleId: 2 });
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        setApiOptions(data.data);
        setSelectedValue(data.data[0].id); 
      }
    } catch (err) {
      setError(err.message || "Something went wrong fetching API options.");
    }
  };

  const fetchData = async (range, apiId) => {
    setLoading(true);
    try {
      const data = await GetSaleDashBoard({
        apiId: apiId,
        startDate: range.startDate,
        endDate: range.endDate
      });
      setSales(data.data || []);
    } catch (err) {
      setError(err.message || "Something went wrong fetching sales data.");
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    apiFetchData();
  }, []);

  useEffect(() => {
    if (selectedValue !== 0) {
      handleDateChange(filterType);
    }
  }, [selectedValue]);

  const handleApiChange = (e) => {
    const apiId = parseInt(e.target.value);
    setSelectedValue(apiId);
    
  };
  
  const handleDateChange = (type) => {
    setFilterType(type);
    const today = new Date();
    let start, end;

    switch (type) {
      case "today":
        start = end = formatDate(today);
        break;
      case "yesterday":
        const yest = new Date(today);
        yest.setDate(today.getDate() - 1);
        start = end = formatDate(yest);
        break;
      case "7days":
        const last7 = new Date(today);
        last7.setDate(today.getDate() - 7);
        start = formatDate(last7);
        end = formatDate(today);
        break;
      case "30days":
        const last30 = new Date(today);
        last30.setDate(today.getDate() - 30);
        start = formatDate(last30);
        end = formatDate(today);
        break;
      case "custom":
        start = dateRange.startDate;
        end = dateRange.endDate;
        break;
      default:
        start = end = formatDate(today);
    }
    const newDateRange = { startDate: start, endDate: end };
    setDateRange(newDateRange);
    fetchData(newDateRange, selectedValue);
  };

  return (
    <div className="py-3 md:py-7 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h2 className="text-3xl font-bold">Sales Dashboard</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* API Select */}
            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={handleApiChange}
              value={selectedValue}
            >
              <option value={0}>Select API</option>
              {apiOptions && apiOptions.length > 0 ?
                apiOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )}
            </select>
            
            {/* Date Filters */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {["today", "yesterday", "7days", "30days", "custom"].map(type => (
                <button
                  key={type}
                  type="button"
                  className={`py-2 px-4 rounded-full text-sm font-medium transition-colors duration-200 ${
                    filterType === type
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleDateChange(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('days', ' Days')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filterType === "custom" && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <input 
              type="date"
              className="py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
            <input
              type="date"
              className="py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
            <button
              className="py-2 px-4 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => fetchData(dateRange, selectedValue)}
            >
              Search
            </button>
          </div>
        )}

        {/* Sales Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (saledata && saledata.length > 0) ? (
            saledata.map((item, index) => (
              <Card
                key={index}
                title={item.metric}
                value={item.value}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
              <p>No data found for the selected criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;