import React, { useEffect, useState } from 'react'
import { DatePicker } from "antd";
import "antd/dist/reset.css"; // Ant Design styles
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
const { RangePicker } = DatePicker;
import { BindAPIListByServiceName, BindUserListByRoleId } from '../../services/Commonapi';
import pending from '../../assests/StatusSvgIcon/Rtpending.svg';
import complaintRaise from '../../assests/icon/Rtraise.svg';
import complaintTicket from '../../assests/icon/Rtticket.svg';
import { BsDownload, BsEye, BsReceipt } from 'react-icons/bs';
import Pagination from '../../utils/Pagination';
import { StatusEnum } from '../../utils/StatusEnum';
import { GetUnsettledPayinReport, PayinCheckStatusTransaction } from "../../services/PayinReport";

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

const UnSettledPendingPayinReport = () => {

  const rowsPerPage = 50;
  const [dateRange, setDateRange] = useState([]);
  const [searchValue, setsearchValue] = useState("");
  const [userList, setUserListValue] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [PayinReportList, setPayinReportList] = useState([]);
  const [ApiMasterByServiceName, setApiMasterByServiceName] = useState([]);
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedApi, setSelectedApi] = useState(0);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isCallBackModalOpen, setIsCallBackModalOpen] = useState(false);
  const [isCheckStatusModalOpen, setIsCheckStatusModalOpen] = useState(false);
  const [rowPayoutData, setRowPayoutData] = useState(null);
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
        BindPayinReport({ dateRange: dateRange, selectedUser: selectedUser, selectedApi: selectedApi, searchValue: "", currentPage: currentPage });
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

      const _apiresult = await BindAPIListByServiceName({ serviceName: "Payin" });
      setApiMasterByServiceName(_apiresult);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const BindPayinReport = async ({ dateRange: dateRange, selectedUser: selectedUser, selectedApi: selectedApi, searchValue: searchValue, currentPage: currentPage }) => {
    try {
      const _result = await GetUnsettledPayinReport({
        userId: selectedUser, startDate: dateRange?.[0]?.format("YYYY-MM-DD"), endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
        apiId: selectedApi, status: StatusEnum.Pending, search: searchValue, transactionTypeId: 0, pageNo: currentPage, pageSize: rowsPerPage
      });
      if (_result && Array.isArray(_result.data) && _result.data.length > 0) {
        setPayinReportList(_result);
        setTotalCount(_result.data[0].TotalRecord);
      }
      else {
        setPayinReportList([]);
        setTotalCount(0);
      }
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
    BindPayinReport({ dateRange: dateRange, selectedUser: userId, selectedApi: selectedApi, searchValue: "", currentPage: currentPage });
  }


  const BindDataApiChange = (e) => {
    const apiId = parseInt(e.target.value);
    setSelectedApi(apiId);
    BindPayinReport({ dateRange: dateRange, selectedUser: selectedUser, selectedApi: apiId, searchValue: "", currentPage: currentPage });
  }

  const UpdateCheckStatus = async (Id) => {
    try {
      const _result = await PayinCheckStatusTransaction({ payinId: Id });
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
      } else {
        Swal.fire("Error!", _result.message, "error");
      }
    } catch (err) {
      Swal.fire("Warning!", err.message, "warning");
    } finally {

    }
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Unsettled Pending Payin Report</h1>

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
            <input type="text" onChange={(e) => setsearchValue(e.target.value)} value={searchValue} placeholder='Search' className="block w-full sm:w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white" />
            <button
              onClick={() => BindPayinReport({  dateRange,  selectedUser, selectedApi, searchValue, currentPage })}
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
                    {['#', 'User Name', 'Company Name', 'Mobile No', 'Service Name', 'Date & Time', 'Status', 'Amount', 'RRN', 'Name', 'Email Id', 'Payer Mobile No', 'UPI', 'Open', 'Surcharge', 'GST', 'Payable', 'Closed', 'Ref Id', 'Unique Id', 'API Ref Id', 'Receipt', 'Complaint', 'Fraud', 'Txn From', 'IP Address', 'Check Status', 'IP State', 'IP City'].map(header => (
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
                  ) : PayinReportList && Array.isArray(PayinReportList.data) && PayinReportList.data.length > 0 ? (
                    PayinReportList.data.map((row, index) => (
                      <tr key={row.Id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.UserName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.CompanyName}>{row.CompanyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.MobileNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ApiName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CreatedDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {{
                            pending: <img src={pending} />
                          }[row.STATUS?.toLowerCase()] || (
                              <img src={pending} />
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.TransactionAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.BankPayoutId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.AccountHolderName}>{row.AccountHolderName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.AccountNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.PayinMobileNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.UpiId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.OpenBalance)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Surcharge)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Gst)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.PayableAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.ClosedBalance)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ReferenceId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.SystemUniqueId}</td>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.IsFraud}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.TransactionFrom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.IpAddress}>{row.IpAddress}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><BsEye size={20} color='black' onClick={() => UpdateCheckStatus(row.Id)} /> </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.IPCity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.IPState}</td>

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
          { label: "Status", value: rowPayoutData?.STATUS },
          { label: "Payment Date", value: rowPayoutData?.CreatedDate },
          { label: "Amount", value: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(rowPayoutData?.TransactionAmount) },
          { label: "UTR", value: rowPayoutData?.BankPayoutId },
          { label: "Name", value: rowPayoutData?.AccountHolderName },
          { label: "Email id", value: rowPayoutData?.AccountNo },
          { label: "Mobile No", value: rowPayoutData?.PayinMobileNo },
          { label: "Payment Invoice no", value: rowPayoutData?.SystemUniqueId },
          { label: "Reference Id", value: rowPayoutData?.ReferenceId },
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

export default UnSettledPendingPayinReport