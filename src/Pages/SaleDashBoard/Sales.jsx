import React, { useEffect, useState } from 'react';
import { BindAPI } from '../../services/Commonapi';
import { GetSaleDashBoard } from '../../services/SaleDashBoard';


// const Card = ({ title, value }) => (
//   <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
//     <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h3>
//     <p className="text-2xl font-bold text-gray-900 dark:text-white">
//       {typeof value === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value) : value}
//     </p>
//   </div>
// );


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
    (async () => {
      try {
        apiFetchData();
      } catch (err) {

      } finally {
        setLoading(false);
      }
    })();

  }, []);

  useEffect(() => {
    handleDateChange("today");
  }, []);

  const handleApiChange = (e) => {
    const apiId = parseInt(e.target.value);
    setSelectedValue(apiId);
    fetchData(dateRange, apiId);

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
                  className={`py-2 px-4 rounded-full text-sm font-medium transition-colors duration-200 ${filterType === type
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
              // <Card
              //   key={index}
              //   title={item.metric}
              //   value={item.value}
              // />
              <>
                {/* <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{item.metric}</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.value === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.value) : item.value}
                  </p>
                </div> */}

                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payin Surcharge Collected</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.payinSurchargeCollected === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.payinSurchargeCollected) : item.payinSurchargeCollected}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payout Surcharge Collected</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.payoutSurchargeCollected === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.payoutSurchargeCollected) : item.payoutSurchargeCollected}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Surcharge Collected</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.totalSurchargeCollected === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.totalSurchargeCollected) : item.totalSurchargeCollected}
                  </p>
                </div>

                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Surcharge Paid</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.surchargePaid === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.surchargePaid) : item.surchargePaid}
                  </p>
                </div>

                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Surcharge Profit</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.surchargeProfit === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.surchargeProfit) : item.surchargeProfit}
                  </p>
                </div>

                {/* <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Md Comm</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.totalMdCommission === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.totalMdCommission) : item.totalMdCommission}
                  </p>
                </div> */}
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Ad Comm</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.totalAdCommission === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.totalAdCommission) : item.totalAdCommission}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Admin Comm</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.totalAdminCommission === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.totalAdminCommission) : item.totalAdminCommission}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">GST Collected</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.gstCollected === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.gstCollected) : item.gstCollected}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">GST Paid By me</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.paidByMe === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.paidByMe) : item.paidByMe}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">GST Payable By me</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.payableByMe === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.payableByMe) : item.payableByMe}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">GST Deduct By API</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.gstDeduct === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.gstDeduct) : item.gstDeduct}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">GST Paid By API</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.paidByAPI === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.paidByAPI) : item.paidByAPI}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">GST Payable By API</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.payableByApi === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.payableByApi) : item.payableByApi}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payin Success</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.payinSuccess === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.payinSuccess) : item.payinSuccess}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payin Pending</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.payinPending === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.payinPending) : item.payinPending}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payin Failed</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.payinFailed === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.payinFailed) : item.payinFailed}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Unsettled Payin Success</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.unSettledPayinSuccess === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.unSettledPayinSuccess) : item.unSettledPayinSuccess}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Unsettled Payin Pending</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.unSettledPayinPending === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.unSettledPayinPending) : item.unSettledPayinPending}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Unsettled Payin Failed</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.unSettledPayinFailed === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.unSettledPayinFailed) : item.unSettledPayinFailed}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payout Success</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.payoutSuccess === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.payoutSuccess) : item.payoutSuccess}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payout Pending</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.payoutPending === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.payoutPending) : item.payoutPending}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payout Failed</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.payoutFailed === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.payoutFailed) : item.payoutFailed}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">GST Paid Total</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.paidGst === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.paidGst) : item.paidGst}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payin API Balance</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.payinApiBalance === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.payinApiBalance) : item.payinApiBalance}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payout API Balance</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.payoutApiBalance === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.payoutApiBalance) : item.payoutApiBalance}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Payin Hit</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.payinHit}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Payout Hit</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.payoutHit}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Pending Ticket</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.pendingTicket}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Close Ticket</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.closedTicket}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">TDS Collected</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.tdsCollected === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.tdsCollected) : item.tdsCollected}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">TDS Paid</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.tdsPaid === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.tdsPaid) : item.tdsPaid}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payable TDS</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.payableTds === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.payableTds) : item.payableTds}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Chargeback Recieved</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.chargeBackReceived === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.chargeBackReceived) : item.chargeBackReceived}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Chargeback Pending</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.pendingChargeBack}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Chargeback Approved</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.approvedChargeBack}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Chargeback Rejected</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.rejectChargeBack}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Loan Recovered</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.loanRecoveredBalance === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.loanRecoveredBalance) : item.loanRecoveredBalance}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Loan Given</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof item.givenLoan === 'number' ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.givenLoan) : item.givenLoan}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payout Success Hit</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.noOfPayoutSuccess}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payout Pending Hit</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.noOfPayoutPending}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payout Failed Hit</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.noOfPayoutFailed}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payin Success Hit</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.noOfPayinSuccess}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payin Pending Hit</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.noOfPayinPending}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payin Failed Hit</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.noOfPayinFailed}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Unsettled Payin Success Hit</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.noOfUnSettledPayinSuccess}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Unsettled Payin Pending Hit</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.noOfUnSettledPayinPending}
                  </p>
                </div>
                <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-transform transform hover:scale-105">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Unsettled Payin Failed Hit</h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {item.noOfUnSettledPayinFailed}
                  </p>
                </div>
              </>
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