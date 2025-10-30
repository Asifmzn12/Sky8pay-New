import React, { useEffect, useState } from 'react'
import { BindAPIListByServiceName, BindUserListByRoleId } from '../../services/Commonapi';
import { GetTopPayinTxn } from '../../services/Search';
const { RangePicker } = DatePicker;
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import Pagination from '../../utils/Pagination';

const TopPayinTxn = () => {
  const rowsPerPage = 50;
  const [dateRange, setDateRange] = useState([]);
  const [searchValue, setsearchValue] = useState("");
  const [userList, setUserListValue] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [TopPayinList, setTopPayinList] = useState([]);
  const [ApiMasterByServiceName, setApiMasterByServiceName] = useState([]);
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedApi, setSelectedApi] = useState(0);
  const [selectedSortBy, setSelectedSortBy] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);


  // bind initial data
  useEffect(() => {
    (async () => {
      try {
        fetchInitialData();
      }
      catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // bind payout data
  useEffect(() => {
    (async () => {
      try {
        BindTopPayinReport({ dateRange: dateRange, selectedUser: selectedUser, selectedApi: selectedApi, searchValue: "", currentPage: currentPage, sortBy: selectedSortBy });
      }
      catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentPage]);

  const fetchInitialData = async () => {
    try {
      const _result = await BindUserListByRoleId({ roleId: 0 });
      setUserListValue(_result);

      const _apiresult = await BindAPIListByServiceName({ serviceName: "" });
      setApiMasterByServiceName(_apiresult);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const BindTopPayinReport = async ({ dateRange, selectedUser, selectedApi, searchValue, currentPage, sortBy }) => {
    setLoadingTable(true);
    try {
      const _result = await GetTopPayinTxn({
        sortBy: sortBy, userId: selectedUser, apiId: selectedApi,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"), endDate: dateRange?.[0]?.format("YYYY-MM-DD"), pageNo: currentPage,
        pageSize: rowsPerPage, upiId: searchValue
      });
      if (_result && Array.isArray(_result.data) && _result.data.length > 0) {
        setTopPayinList(_result);
        setTotalCount(_result.data[0].TotalRecord);
      }
      else {
        setTopPayinList([]);
        setTotalCount(0);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
      setLoading(false);
    }
  }

  const BindDataUserChange = (e) => {
    const userId = parseInt(e.target.value);
    setSelectedUser(userId);
    BindTopPayinReport({ dateRange: dateRange, selectedUser: userId, selectedApi: selectedApi, searchValue: "", currentPage: currentPage, sortBy: selectedSortBy });
  }


  const BindDataApiChange = (e) => {
    const apiId = parseInt(e.target.value);
    setSelectedApi(apiId);
    BindTopPayinReport({ dateRange: dateRange, selectedUser: selectedUser, selectedApi: apiId, searchValue: "", currentPage: currentPage, sortBy: selectedSortBy });
  }

  const BindDataSortByChange = (e) => {
    const sortBy = e.target.value;    
    setSelectedSortBy(sortBy);
    BindTopPayinReport({ dateRange: dateRange, selectedUser: selectedUser, selectedApi: selectedApi, searchValue: "", currentPage: currentPage, sortBy: sortBy });
  }


  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Success Payout Report</h1>

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
              // defaultValue={[dayjs(),dayjs()]}
              className="w-[350px] h-[40px] rounded-lg"
            />
            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={BindDataUserChange}
            >
              <option value={0}>Select User</option>
              {userList && Array.isArray(userList.data) && userList.data.length > 0 ?
                userList.data.filter(x => x.UserId !== 100 && x.UserId !== 101).map((item) => (
                  <option key={item.UserId} value={item.UserId}>{item.NameWithCompanyName}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )}
            </select>

            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={BindDataApiChange}
            >
              <option value={0}>Select API</option>
              {ApiMasterByServiceName && Array.isArray(ApiMasterByServiceName.data) && ApiMasterByServiceName.data.length > 0 ?
                ApiMasterByServiceName.data.map((item) => (
                  <option key={item.ApiId} value={item.ApiId}>{item.ApiName}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )}
            </select>
            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={BindDataSortByChange}>
              <option value="">Select</option>
              <option value="ASCBYAMT">Min To High AMT</option>
              <option value="DESCBYAMT">High To Min AMT</option>
              <option value="ASCBYNOTXNID">Min To High TXN</option>
              <option value="DESCBYNOTXNID">High To Min TXN</option>
            </select>
            <input type="text" onChange={(e) => setsearchValue(e.target.value)} value={searchValue} placeholder='Search' className="block w-full sm:w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white" />
            <button
              onClick={() => BindTopPayinReport({ dateRange, selectedUser, selectedApi, searchValue, currentPage,selectedSortBy })}
              className="py-2 px-4 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
              Search
            </button>
          </div>
          <hr className="my-10 border-gray-200 dark:border-gray-700" />

          <div>
            {/* <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Bank Account List</h2> */}
            {totalPages ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : ""}
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {['#', 'Company Name', 'API Name', 'Account Holder Name', 'Acc No & UPI Id', 'Total Amount', 'No. Of Txn'].map(header => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loadingTable ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <tr key={index}>
                        {Array.from({ length: 15 }).map((_, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : TopPayinList && Array.isArray(TopPayinList.data) && TopPayinList.data.length > 0 ? (
                    TopPayinList.data.map((row, index) => (
                      <tr key={index + 1}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.CompanyName}>{row.CompanyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.APIName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.AccountHolderName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.AcDetails==="" ? row.UpiId  : "NA"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.NOOFTXN}</td>
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
            {totalPages ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : ""}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopPayinTxn