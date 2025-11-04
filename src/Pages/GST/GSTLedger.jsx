import React, { useEffect, useState } from 'react'
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import dayjs from 'dayjs';
import { encryptvalue } from '../../utils/AESEncrypted';
import { GetGstLedger } from '../../services/GST';
import { BindAPI } from '../../services/Commonapi';
import Swal from 'sweetalert2';

const GSTLedger = () => {
  const [dateRange, setDateRange] = useState([]);
  const [GstLedgerList, setGstLedgerList] = useState();
  const [apiOptions, setApiOptions] = useState();
  const [loadingTable, setLoadingTable] = useState(true);
  const [selectedApi, setSelectedApi] = useState();
  const [loadingForm, setLoadingForm] = useState(true);

  useEffect(() => {
    (async () => {
      BindGstLedger({ dateRange: dateRange, apiId: 0 });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      apiFetchData();
    })();
  }, []);

  const apiFetchData = async () => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        RoleId: 2
      }));
      const data = await BindAPI({ data: requestdata });
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        setApiOptions(data.data);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingForm(false);
    }
  };

  const BindGstLedger = async ({ dateRange, apiId }) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
        apiId: apiId
      }));
      var _result = await GetGstLedger({ data: requestdata });
      setGstLedgerList(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }

  const handleApiChange = async (e) => {
    const apiId = parseInt(e.target.value);
    setSelectedApi(apiId);
    BindGstLedger({ dateRange: dateRange, apiId: apiId });
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">GST Ledger</h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <RangePicker
              format="DD-MM-YYYY"
              onChange={(values) => setDateRange(values)}
              presets={[
                { label: "Today", value: [dayjs(), dayjs()] },
                { label: "Yesterday", value: [dayjs().subtract(1, "day"), dayjs().subtract(1, "day")] },
                { label: "Last 7 days", value: [dayjs().subtract(7, "day"), dayjs()] },
                { label: "Last 30 days", value: [dayjs().subtract(30, "day"), dayjs()] },
                { label: "This month", value: [dayjs().startOf("month"), dayjs().endOf("month")] },
                {
                  label: "Last month", value: [
                    dayjs().subtract(1, "month").startOf("month"),
                    dayjs().subtract(1, "month").endOf("month")
                  ]
                },
              ]}
              //defaultValue={[dayjs(),dayjs()]}
              className="w-[350px] h-[40px] rounded-lg"
            />
            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={handleApiChange}>
              <option value={0}>Select API</option>
              {apiOptions && apiOptions.length > 0 ?
                apiOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )}
            </select>
            <input type="text" placeholder='Search' className="block w-full sm:w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white" />
            <button
              className="py-2 px-4 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => BindGstLedger({ dateRange: dateRange, apiId: selectedApi })}
            >
              Search
            </button>
          </div>
          <hr className="my-10 border-gray-200 dark:border-gray-700" />

          <div>
            {/* <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Bank Account List</h2> */}
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {['#', 'Pay By', 'Company Name', 'Gst No', 'API Name', 'Unique Id', 'Amount', 'Type', 'Comment', 'DateTime'].map(header => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loadingTable ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <tr key={index}>
                        {Array.from({ length: 10 }).map((_, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : GstLedgerList && Array.isArray(GstLedgerList.data) && GstLedgerList.data.length > 0 ? (
                    GstLedgerList.data.map((row, index) => (
                      <tr key={index + 1}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.PaybyUser}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CompanyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.GstNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ApiName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.SystemUniqueId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" style={{ color: row.CrDrType.toLowerCase() === "paid" ? "green" : "red" }}>{row.CrDrType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Comment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CreatedDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr key={0}>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No data found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default GSTLedger