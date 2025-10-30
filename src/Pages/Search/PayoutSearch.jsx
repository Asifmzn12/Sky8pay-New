import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { BindMasterData } from '../../services/Commonapi';
import Swal from 'sweetalert2';
import { SearchPayout, UpdatePendingPayout } from '../../services/Search';
import * as Yup from 'yup';
import success from '../../assests/StatusSvgIcon/Rtsuccess.svg';
import pending from '../../assests/StatusSvgIcon/Rtpending.svg';
import failed from '../../assests/StatusSvgIcon/Rtfailed.svg';
import { BsDownload, BsEye, BsPencil, BsReceipt } from 'react-icons/bs';
import complaintRaise from '../../assests/icon/Rtraise.svg';
import complaintTicket from '../../assests/icon/Rtticket.svg';
import { GetPayoutInvoiceLink } from "../../services/PayoutReport";
import checkStatus from '../../assests/icon/checkstatus-icon.png';

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

const validationSchema = Yup.object().shape({
  statusId: Yup.number().typeError("Status is required").moreThan(0, "Please select a status").required("Status is required"),
  Comment: Yup.string().required("Comment is required"),
  TPin: Yup.number().typeError("TPin is required").moreThan(0, "Enter a valid TPIN").required("TPin is required")
});

const PayoutSearch = () => {

  const [searchValue, setsearchValue] = useState("");
  const [loadingForm, setLoadingForm] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [PayoutReportList, setPayoutReportList] = useState([]);
  const [StatusMaster, setStatusMaster] = useState([]);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isCallBackModalOpen, setIsCallBackModalOpen] = useState(false);
  const [isCheckStatusModalOpen, setIsCheckStatusModalOpen] = useState(false);
  const [IsAPIRequestResponseModalOpen, setIsAPIRequestResponseModalOpen] = useState(false);
  const [IsUpdateStatus, setIsUpdateStatusModalOpen] = useState(false);
  const [rowPayoutData, setRowPayoutData] = useState(null);
  const [PayoutId, setPayoutId] = useState(0);
  const [searchType, setSearchType] = useState("UniqueId");


  const SearchOptions = [
    "UniqueId",
    "ReferenceId",
    "Utr",
    "Account Holder Name",
    "Account No",
    "IFSC",
    "UPIID",
    "API UniquieId"
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  // bind initial data
  useEffect(() => {
    (async () => {
      try {
        fetchInitialData();
      }
      catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setLoadingTable(false);
        setLoadingForm(false);
      }
    })();
  }, []);

  const fetchInitialData = async () => {
    try {
      const _result = await BindMasterData({ type: "status" });
      setStatusMaster(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setLoadingTable(false);
      setLoadingForm(false);
    }
  }



  const GetSearchPayout = async () => {
    setLoadingTable(true);
    try {
      const _result = await SearchPayout({ searchValue: searchValue, type: searchType });
      setPayoutReportList(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }

  const DownloadPayoutInvoice = async (InvoiceId) => {
    try {
      const _result = await GetPayoutInvoiceLink({
        SystemUniqueId: InvoiceId
      });
      if (_result && _result.data) {
        const link = document.createElement("a");
        link.href = _result.data;
        link.target = "_blank";
        link.download = _result.data;
        link.click();
      } else {
        Swal.fire("Error!", "Invoice generation failed", "error");
      }
    } catch (err) {
      Swal.fire("Warning!", err.message, "warning");
    } finally {

    }
  }
  const UpdateCheckStatus = async (Id) => {
    try {
      const _result = await PayoutCheckStatusTransaction({ payoutId: Id });
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

  const onSubmit = async (data) => {
    try {
      const TpinValue = import.meta.env.VITE_TPin;
      if (parseInt(TpinValue) === parseInt(data.TPin)) {
        UpdatePendingPayoutStatus(data);
      } else {
        Swal.fire("Error!", "Invalid TPin", "error");
      }
    } catch (err) {
      Swal.fire("Warning!", err.message, "warning");
    } finally {

    }
  }

  const UpdatePendingPayoutStatus = async (data) => {
    setIsUpdateStatusModalOpen(false);
    try {
      const _result = await UpdatePendingPayout({
        payoutId: PayoutId, status: data.statusId,
        utr: data.UTR, remarks: data.Comment
      });
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
        resetFormAndState();
      } else {
        Swal.fire("Error!", _result.message, "error");
      }
    } catch (err) {

    } finally {

    }
  }

  const handleClear = () => {
    resetFormAndState();
  }

  const resetFormAndState = () => {
    reset({
      statusId: 0,
      Comment: "",
      TPin: "",
      UTR: ""
    });
    setPayoutId(0);
  }


  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Search Payout Report</h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <input type="text" onChange={(e) => setsearchValue(e.target.value)} value={searchValue} placeholder='Search' className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 px-2 py-2 outline-none" />
            <div className="flex items-center border-l border-gray-700 px-2">
              <span className="text-gray-400 text-sm mr-1">in</span>
              <select
                className="bg-transparent text-gray-100 text-sm focus:outline-none cursor-pointer"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                {SearchOptions.map((opt) => (
                  <option
                    key={opt}
                    value={opt}
                    className="bg-gray-800 text-white hover:bg-gray-700"
                  >
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => GetSearchPayout({ searchValue, searchType })}
              className="py-2 px-4 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
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
                    {['#', 'User Name', 'Company Name', 'User Mobile No', 'Service Name', 'Date & Time', 'Mode', 'Status', 'Amount', 'RRN', 'Name', 'Account No', 'IFSC', 'UPI Id', 'Open', 'Surcharge', 'GST', 'Payable', 'Closed', 'Ref Id', 'Unique Id', 'API Ref', 'Receipt', 'Complaint', 'Invoice', 'Check Status', 'Check Status Response', 'API Request Response', 'CallBack Response', 'Push CallBack', 'Update Status', 'IP Address'].map(header => (
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
                        {Array.from({ length: 34 }).map((_, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : PayoutReportList && Array.isArray(PayoutReportList.data) && PayoutReportList.data.length > 0 ? (
                    PayoutReportList.data.map((row, index) => (
                      <tr key={index + 1}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.CompanyName}>{row.CompanyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.MobileNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ApiName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CreatedDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.PaymentMode}</td>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.BankPayoutId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.AccountHolderName}>{row.AccountHolderName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.AccountNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.IfscCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.UpiId ? row.UpiId : "NA"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.OpenBalance)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Surcharge)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Gst)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.PayableAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.ClosedBalance)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ReferenceId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.SystemUniqueId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ApiUniqueId ? row.ApiUniqueId : "Portal"}</td>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a href='#' color='black' onClick={() => DownloadPayoutInvoice(row.SystemUniqueId)}>
                            <BsDownload size={20} />
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {row.IsCheckStatusAPIAvailable ? row.STATUS.toLowerCase() == "Pending" ? <a href='#' onClick={() => UpdateCheckStatus(row.Id)}>
                            <img src={checkStatus} style={{ height: 35 }} /></a> : "Not Pending" : "No CheckStatus API"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {row.CheckStatusResponse === "NA" ? "No Response" : <a href='#' onClick={() => { setRowPayoutData(row); setIsCheckStatusModalOpen(true) }}>
                            <BsEye size={20} color='black' />
                          </a>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a href='#' onClick={() => { setRowPayoutData(row); setIsAPIRequestResponseModalOpen(true) }}>
                            <BsEye size={20} color='black' />
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {row.CallBackResponse === "NA" ? "No Response" : <a href='#' onClick={() => { setRowPayoutData(row); setIsCallBackModalOpen(true) }}>
                            <BsEye size={20} color='black' />
                          </a>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.TransactionFrom.toLowerCase() === "api" ? <img src={checkStatus} /> : "Portal"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{
                          <a href='#' onClick={() => { setPayoutId(row.Id); setIsUpdateStatusModalOpen(true) }}> <BsPencil size={20} />
                          </a>
                        }</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.IpAddress}>{row.IpAddress ? row.IpAddress : "NA"}</td>
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
      {/* Receipt start */}
      <Modal isOpen={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Receipt</h2>
        {[
          { label: "Status", value: rowPayoutData?.STATUS },
          { label: "Payment Date", value: rowPayoutData?.CreatedDate },
          { label: "Amount", value: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(rowPayoutData?.TransactionAmount) },
          { label: "UTR", value: rowPayoutData?.BankPayoutId },
          { label: "Name", value: rowPayoutData?.AccountHolderName },
          { label: "Account No", value: rowPayoutData?.AccountNo },
          { label: "IFSC", value: rowPayoutData?.IfscCode },
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

      {/* CallBack start */}
      <Modal isOpen={isCallBackModalOpen} onClose={() => setIsCallBackModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">CallBack Details</h2>
        <div key={1} className="flex justify-between p-4">
          <span className="text-gray-600 font-medium">Date & Time</span>
          <span className="text-gray-800">{rowPayoutData?.CallBackDateTime}</span>
        </div>
        <div key={2} className="flex justify-between p-4">
          <span className="text-gray-800" style={{ lineBreak: "anywhere" }}>{rowPayoutData?.Response ? rowPayoutData?.Response : "No Response Availabel"}</span>
        </div>
      </Modal>
      {/* CallBack end */}

      {/* CheckStatus start */}
      <Modal isOpen={isCheckStatusModalOpen} onClose={() => setIsCheckStatusModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Check Status Details</h2>
        <div key={1} className="flex justify-between p-4">
          <span className="text-gray-600 font-medium">Date & Time</span>
          <span className="text-gray-800">{rowPayoutData?.CheckStatusDateTime}</span>
        </div>
        <div key={2} className="flex justify-between p-4">
          <span className="text-gray-800" style={{ lineBreak: "anywhere" }}>{rowPayoutData?.CheckStatusResponse ? rowPayoutData?.CheckStatusResponse : "No Response Availabel"}</span>
        </div>
      </Modal>
      {/* CheckStatus end */}

      {/* Request & Response start */}
      <Modal isOpen={IsAPIRequestResponseModalOpen} onClose={() => setIsAPIRequestResponseModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">API Request & Response Details</h2>
        <div key={1} className="flex justify-between p-4">
          <span className="text-gray-600 font-medium">Date & Time</span>
          <span className="text-gray-800">{rowPayoutData?.CreatedDate}</span>
        </div>
        <div key={2} className="flex justify-between p-4">
          <span className="text-gray-800" style={{ lineBreak: "anywhere" }}>{rowPayoutData?.Request ? rowPayoutData?.Request : "No Request Availabel"}</span>
        </div>
        <div key={2} className="flex justify-between p-4">
          <span className="text-gray-800" style={{ lineBreak: "anywhere" }}>{rowPayoutData?.Response ? rowPayoutData?.Response : "No Response Availabel"}</span>
        </div>
      </Modal>
      {/* Request & Response end */}


      {/* Status Update start */}
      <Modal isOpen={IsUpdateStatus} onClose={() => setIsUpdateStatusModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Update Payout Transaction Status</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Status</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <select
                  {...register("statusId")}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.statusId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value={0}>Select Status</option>
                  {StatusMaster && Array.isArray(StatusMaster.data) && StatusMaster.data.length > 0 ?
                    StatusMaster.data.filter(x => x.Id !== 2).map((item) => (
                      <option key={item.Id} value={item.Id}>{item.Name}</option>
                    )) : (
                      <option disabled>No Data Found</option>
                    )
                  }
                  <option value={4}>FAILED TO SUCCESS</option>
                </select>
                {errors.statusId && <p className="text-red-500 text-sm mt-1">{errors.statusId.message}</p>}
              </>
            )}
          </div>
          {['UTR', 'Comment', 'TPin'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
              {
                loadingForm ? (
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                ) : (
                  <>
                    <input type='text' {...register(field)}
                      className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors[field] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field].message}</p>}
                  </>
                )
              }
            </div>
          ))}
          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button" onClick={handleClear}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Clear
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors">
              Submit
            </button>
          </div>
        </form>
      </Modal>
      {/* Status Update end */}
    </div>
  )
}

export default PayoutSearch