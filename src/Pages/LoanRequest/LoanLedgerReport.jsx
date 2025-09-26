import React, { useEffect, useState } from 'react'
import { BindMasterData, BindUserListByRoleId } from '../../services/Commonapi';
import Swal from 'sweetalert2';
const { RangePicker } = DatePicker;
import dayjs from 'dayjs';
import { DatePicker } from "antd";
import "antd/dist/reset.css"; // Ant Design styles
import { GetLoanLedger } from '../../services/LoanLedger';
import failed from '../../assests/StatusSvgIcon/Rtfailed.svg'
import success from '../../assests/StatusSvgIcon/Rtsuccess.svg'
import pending from '../../assests/StatusSvgIcon/Rtpending.svg'

const LoanLedgerReport = () => {
  const [userList, setUserListValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([]);
  const [statusMasterdropdown, setStatusMasterDrowdown] = useState(0);
  const [LoanLedgerList, setLoanLedgerList] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(0);

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

  // bind initial data
  useEffect(() => {
    (async () => {
      try {
        BindLoanLedgerList({ dateRange: null, userId: 0, statusId: 0 });
      }
      catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setLoading(false);
      }
    })();
  }, []);



  const fetchInitialData = async () => {
    try {
      const _result = await BindUserListByRoleId({ roleId: 0 });
      setUserListValue(_result);

      const _statusresult = await BindMasterData({ type: "status" });
      setStatusMasterDrowdown(_statusresult);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setLoading(false);
    }
  }

  const BindDataUserChange = (e) => {
    const userId = parseInt(e.target.value);
    setSelectedUser(userId);
    BindLoanLedgerList(null, userId, 0);
  }

  const BindDataStatusChange = (e) => {
    const statusId = parseInt(e.target.value);
    setSelectedStatus(statusId);
    BindLoanLedgerList(null, 0, statusId);
  }

  // const GetLoanSummary = async (dateRange, selectedUser, selectedStatus) => {
  //   try {
  //     const _result = await BindLoanRequest({
  //       userId: selectedUser, roleId: 0, parentUserId: 101,
  //       startDate: dateRange?.[0]?.format("YYYY-MM-DD"), endDate: dateRange?.[1]?.format("YYYY-MM-DD"), pageNo: 0, pageSize: 100,
  //       status: selectedStatus, search: ""
  //     });      
  //     setLoanSummaryList(_result);

  //   } catch (err) {
  //     Swal.fire("Error!", err.message, "error");
  //   } finally {
  //     setLoadingTable(false);
  //   }
  // }

  const BindLoanLedgerList = async (dateRange, selectedUser, selectedStatus) => {
    try {
      const _result = await GetLoanLedger({
        userId: selectedUser, startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"), status: selectedStatus, pageNo: 0, pageSize: 100
      });
      console.log(_result);
      setLoanLedgerList(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }


  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Loan Ledger</h1>

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
              //defaultValue={[dayjs(), dayjs()]}
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
              onChange={BindDataStatusChange}
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
              <option value={0}>Select Status</option>
              {statusMasterdropdown && Array.isArray(statusMasterdropdown.data) && statusMasterdropdown.data.length > 0 ?
                statusMasterdropdown.data.map((item) => (
                  <option key={item.Id} value={item.Id}>{item.Name}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )
              }
            </select>
            <input type="text" placeholder='Search' className="block w-full sm:w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white" />
            {/* <button
                  type="button"
                  // onClick={handleClear}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Clear
                </button> */}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors" onClick={() => BindLoanLedgerList(dateRange, selectedUser, selectedStatus)} >
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
                    {['#', 'User Name', 'Mobile No', 'Company name', 'Open', 'Amount', 'Closed', 'Type', 'System Txn Id', 'Status', 'Request Date & Time', 'Comments'].map(header => (
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
                        {Array.from({ length: 8 }).map((_, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : LoanLedgerList && Array.isArray(LoanLedgerList.data) && LoanLedgerList.data.length > 0 ? (
                    LoanLedgerList.data.map((row, index) => (
                      <tr key={index + 1}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.UserName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.MobileNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CompanyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.OpenBalance)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.ClosedBal)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.TransactionType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.SystemUniqueId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{
                          pending: <img src={pending} />,
                          failed: <img src={failed} />,
                          success: <img src={success} />
                        }[row.Status?.toString().toLowerCase()] || (
                            <img src={success} />
                          )}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CreatedDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Comment}</td>
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

export default LoanLedgerReport