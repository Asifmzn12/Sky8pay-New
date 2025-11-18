import React, { useEffect, useState } from 'react'
import Pagination from '../../utils/Pagination';
const { RangePicker } = DatePicker;
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { BindAPIListByServiceName, BindMasterData, BindUserListByRoleId } from '../../services/Commonapi';
import { encryptvalue } from '../../utils/AESEncrypted';
import { GetutilityReport } from '../../services/Utility';
import success from '../../assests/StatusSvgIcon/Rtsuccess.svg';
import failed from '../../assests/StatusSvgIcon/Rtfailed.svg';
import pending from '../../assests/StatusSvgIcon/Rtpending.svg';
import { BsReceipt } from 'react-icons/bs';
import complaintRaise from '../../assests/icon/Rtraise.svg';
import complaintTicket from '../../assests/icon/Rtticket.svg';


const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 max-w-2xl w-full mx-4 transform scale-95 transition-transform duration-300">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};



const UtilityReport = () => {
  const rowsPerPage = 50;
  const [dateRange, setDateRange] = useState([]);
  const [userList, setUserListValue] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [ApiMasterByServiceName, setApiMasterByServiceName] = useState([]);
  const [searchValue, setsearchValue] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [SelectedUserId, setSelectedUserId] = useState();
  const [SelectedApiId, setSelectedApiId] = useState();
  const [SelectedStatus, setSelectedStatus] = useState();
  const [StatusList, setStatusList] = useState();
  const [UtilityList, setUtilityList] = useState([]);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [rowPayoutData, setRowPayoutData] = useState(null);
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

  useEffect(() => {
    (async () => {
      BindUtilityReport({ SelectedUserId: SelectedUserId, dateRange: dateRange, SelectedApiId: SelectedApiId, SelectedStatus: SelectedStatus, searchValue: searchValue, currentPage: currentPage });
    })();
  }, [currentPage]);

  const fetchInitialData = async () => {
    try {
      var requestdata = encryptvalue(JSON.stringify({ roleId: 0 }));
      const _result = await BindUserListByRoleId({ data: requestdata });
      setUserListValue(_result);

      var _requestdata = encryptvalue(JSON.stringify({ serviceName: "Recharge" }));
      const _apiresult = await BindAPIListByServiceName({ data: _requestdata });
      setApiMasterByServiceName(_apiresult);

      var _masterRequest = encryptvalue(JSON.stringify({ type: "status" }));
      const _statusresult = await BindMasterData({ data: _masterRequest });      
      setStatusList(_statusresult);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const BindUtilityReport = async ({ SelectedUserId, dateRange, SelectedApiId, SelectedStatus, searchValue, currentPage }) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        userId: SelectedUserId,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
        apiId: SelectedApiId,
        serviceId: 0,
        status: SelectedStatus,
        search: searchValue,
        pageNo: currentPage,
        pageSize: rowsPerPage
      }));
      var _result = await GetutilityReport({ data: requestdata });
      if (_result.statuscode === 200) {
        setUtilityList(_result);
        setTotalCount(_result.data[0].TotalRecord);
      } else {
        setUtilityList([]);
        setTotalCount(0);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }


  const BindUserWiseUtility = async (e) => {
    const userId = parseInt(e.target.value);
    setSelectedUserId(userId);
    BindUtilityReport({ SelectedUserId: userId, dateRange: dateRange, SelectedApiId: SelectedApiId, SelectedStatus: SelectedStatus, searchValue: searchValue, currentPage: currentPage });
  }

  const BindAPIWiseUtility = async (e) => {
    const apiId = parseInt(e.target.value);
    setSelectedApiId(apiId);
    BindUtilityReport({ SelectedUserId: SelectedUserId, dateRange: dateRange, SelectedApiId: apiId, SelectedStatus: SelectedStatus, searchValue: searchValue, currentPage: currentPage });
  }

  const BindStatusWiseUtility = async (e) => {
    const statusId = parseInt(e.target.value);
    setSelectedStatus(statusId);
    BindUtilityReport({ SelectedUserId: SelectedUserId, dateRange: dateRange, SelectedApiId: SelectedApiId, SelectedStatus: statusId, searchValue: searchValue, currentPage: currentPage });
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Utility Report</h1>

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
              onChange={BindUserWiseUtility}
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
              onChange={BindAPIWiseUtility}
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
              onChange={BindStatusWiseUtility}
            >
              <option value={0}>Select Status</option>
              {StatusList && Array.isArray(StatusList.data) && StatusList.data.length > 0 ?
                StatusList.data.map((item) => (
                  <option key={item.Id} value={item.Id}>{item.Name}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )}
            </select>
            <input type="text" onChange={(e) => setsearchValue(e.target.value)} value={searchValue} placeholder='Search' className="block w-full sm:w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white" />
            <button
              onClick={() => BindUtilityReport({ SelectedUserId, dateRange, SelectedApiId, SelectedStatus, searchValue, currentPage })}
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
                    {['#', 'User Name', 'Company Name', 'Mobile No', 'Date & Time', 'Service Name', 'Operator Name', 'Status', 'Amount', 'Transaction Id', 'Bill Number', 'Customer Name', 'Customer Mobile No', 'Open', 'Commission', 'Tds', 'Payable', 'Closed', 'Unique Id', 'Ref Id', 'API Ref Id', 'Receipt', 'Complaint', 'Txn From', 'IpAddress'].map(header => (
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
                        {Array.from({ length: 25 }).map((_, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : UtilityList && Array.isArray(UtilityList.data) && UtilityList.data.length > 0 ? (
                    UtilityList.data.map((row, index) => (
                      <tr key={row.Id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.UserName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.CompanyName}>{row.CompanyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.MobileNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CreatedDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ServiceName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.SlabName}>{row.SlabName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {{
                            success: <img src={success} />,
                            pending: <img src={pending} />,
                            failed: <img src={failed} />
                          }[row.STATUS?.toLowerCase()] || (
                              <img src={success} />
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.TransactionAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[160px] truncate" title={row.BankPayoutId}>{row.BankPayoutId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.BillNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.BillerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.BillerMobileNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.OpenBalance)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Commission)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Tds)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.PayableAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.ClosedBalance)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.SystemUniqueId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ReferenceId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ApiUniqueId ? row.ApiUniqueId : "Potal"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a href='#' onClick={() => { setRowPayoutData(row); setIsReceiptModalOpen(true) }} ><BsReceipt size={20} color='black' /></a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {{
                            yes: <img src={complaintTicket} />,
                            no: <img src={complaintRaise} />
                          }[row.RasieComplaint?.toLowerCase()] || (
                              <img src={complaintRaise} />
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.TransactionFrom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.IpAddress}</td>
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
      {/* Receipt start */}
      <Modal isOpen={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Receipt</h2>
        {[
          { label: "Amount", value: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(rowPayoutData?.TransactionAmount) },
          { label: "Status", value: rowPayoutData?.STATUS },
          { label: "Payment Invoice no", value: rowPayoutData?.SystemUniqueId },
          { label: "Service Name", value: rowPayoutData?.ServiceName },
          { label: "Bill Number", value: rowPayoutData?.BillNo },
          { label: "Operator", value: rowPayoutData?.SlabName },
          { label: "Reference Id", value: rowPayoutData?.ReferenceId },
          { label: "Transaction Id", value: rowPayoutData?.BankPayoutId },
          { label: "Payment Date", value: rowPayoutData?.CreatedDate },
        ].map((item, index) => (
          <div key={index} className="flex justify-between p-4">
            <span className="text-gray-600 font-medium">{item.label}</span>
            <span className="text-gray-800">{item.value}</span>
          </div>
        ))}
      </Modal>
      {/* Receipt end */}
    </div>
  )
}

export default UtilityReport