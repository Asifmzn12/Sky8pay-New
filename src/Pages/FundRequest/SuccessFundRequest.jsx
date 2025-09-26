import React, { useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form';
import { DatePicker } from "antd";
import "antd/dist/reset.css"; // Ant Design styles
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { BindUserListByRoleId } from '../../services/Commonapi';
import { StatusEnum } from '../../utils/StatusEnum';
const { RangePicker } = DatePicker;
import { BindFundRequest } from "../../services/FundRequest";


const SuccessFundRequest = () => {
  const [dateRange, setDateRange] = useState([]);
  const [userList, setUserListValue] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fundrequest, setFundrequest] = useState([]);
  const [selectedUser, setSelectedUser] = useState(0);

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
  // bind success fund
  useEffect(() => {
    (async () => {
      try {
        BindSuccessFundRequest({
          userId: 0, roleId: 0, startDate: null,
          endDate: null, pageNo: 0, pageSize: 100, status: StatusEnum.Success
        });
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
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setLoading(false);
    }
  }
  const BindSuccessFundRequest = async (daterange, selecteduser) => {
    try {
      const _result = await BindFundRequest({ userId: selecteduser, roleId: 0, startDate: daterange?.[0]?.format("YYYY-MM-DD"), endDate: daterange?.[1]?.format("YYYY-MM-DD"), pageNo: 0, pageSize: 100, status: StatusEnum.Success });
      setFundrequest(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoading(false);
      setLoadingTable(false);
    }
  }

  const BindDataUserChange = (e) => {
    const userId = parseInt(e.target.value);
    setSelectedUser(userId);
    BindSuccessFundRequest(dateRange, userId);
  }


  // if (loading) return <p>Loading..........</p>

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Success Fund Request</h1>

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
            <input type="text" placeholder='Search' className="block w-full sm:w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white" />
            <button
              className="py-2 px-4 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => BindSuccessFundRequest(dateRange, selectedUser)}
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
                    {['#', 'User Name', 'Company', 'UPI', 'AC/No', 'IFSC', 'Paymode', 'Utr no', 'Amount', 'Req Date', 'Comment', 'Upline Comment', 'Date & Time', 'Update Date & Time', 'Receipt'].map(header => (
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
                  ) : fundrequest && Array.isArray(fundrequest.data) && fundrequest.data.length > 0 ? (
                    fundrequest.data.map((row, index) => (
                      <tr key={row.Id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CompanyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Upi}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.AccountNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.IfscCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.PaymentMode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.PaymentRequestUTR}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.PaymentDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Customercomment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.UplineComment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CreatedDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ModifiedDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {/* <button onClick={() => handleEdit(row)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 transition-colors mr-4">Edit</button> */}
                          {/* <button onClick={() => handleDelete(row.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 transition-colors">Delete</button> */}
                          {row.PaymentRecipiet ? <a href={row.PaymentRecipiet} target="_blank" className="text-blue-500 hover:text-blue-700 mx-2">View</a> : 'No Receipt'}
                        </td>
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

export default SuccessFundRequest