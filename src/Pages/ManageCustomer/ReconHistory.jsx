import React, { useEffect, useState } from 'react';
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import Pagination from '../../utils/Pagination';
import { BindAPIListByServiceName, BindUserListByRoleId } from '../../services/Commonapi';
import { encryptvalue } from '../../utils/AESEncrypted';
const { RangePicker } = DatePicker;
import { GetReconHistory, SaveReconHistory } from '../../services/ManageCustomer'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

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

var ValidationError = Yup.object().shape({
  typeId: Yup.number().typeError("Type is required").moreThan(0, "Please select Type").required("Type is required"),
  user: Yup.number().typeError("User is required").moreThan(0, "Please select User").required("User is required"),
  Amount: Yup.number().typeError("Amount is required").moreThan(0, "Enter valid amount").required("Amount is required"),
  Comment: Yup.string().required("Comment is required"),
});

function ReconHistory() {
  const rowsPerPage = 50;
  const [dateRange, setDateRange] = useState([]);
  const [userList, setUserListValue] = useState([]);
  const [searchValue, setsearchValue] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTable, setLoadingTable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [ReconHistory, setReconHistory] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [selectTxnType, setselectTxnType] = useState();
  const [IsReconModel, setIsReconModel] = useState(false);
  const [loadingForm, setLoadingForm] = useState(true);
  const [ApiMasterByServiceName, setApiMasterByServiceName] = useState([]);

  const totalPages = Math.ceil(totalCount / rowsPerPage);

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
      BindUserReconHistory({ dateRange: dateRange, selectedUser: 0, transactionTypeId: 0, searchValue: "", currentPage });
    })();
  }, [currentPage])

  const fetchInitialData = async () => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        roleId: 0
      }));
      const _result = await BindUserListByRoleId({ data: requestdata });
      setUserListValue(_result);

      var _requestdata = encryptvalue(JSON.stringify({
        serviceName: ""
      }));
      const _apiresult = await BindAPIListByServiceName({ data: _requestdata });
      setApiMasterByServiceName(_apiresult);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setLoading(false);
      setLoadingForm(false);
    }
  }

  const BindDataUserChange = (e) => {
    const userId = parseInt(e.target.value);
    setSelectedUser(userId);
    BindUserReconHistory({ dateRange: dateRange, selectedUser: userId, transactionTypeId: txnTypeId, searchValue: searchValue, currentPage: currentPage });
  }

  const BindDataTransactionTypeChange = (e) => {
    const txnTypeId = parseInt(e.target.value);
    setselectTxnType(txnTypeId);
    BindUserReconHistory({ dateRange: dateRange, selectedUser: selectedUser, transactionTypeId: txnTypeId, searchValue: searchValue, currentPage: currentPage });
  }

  const BindUserReconHistory = async ({ dateRange, selectedUser, transactionTypeId, searchValue, currentPage }) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        userId: selectedUser,
        transactionTypeId: transactionTypeId,
        startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
        endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
        search: searchValue,
        pageNo: currentPage,
        pageSize: rowsPerPage
      }));
      var _result = await GetReconHistory({ data: requestdata });
      if (_result.statuscode === 200 && Array.isArray(_result.data) && _result.data.length > 0) {
        setReconHistory(_result);
        setTotalCount(_result.data[0].TotalRecord);
      } else {
        setReconHistory([]);
        setTotalCount(0);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(ValidationError)
  });

  const onSubmit = async (data) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        userId: data.user,
        amount: data.Amount,
        type: data.typeId,
        remarks: data.Comment,
        apiId: data.apiId
      }));
      var _result = await SaveReconHistory({ data: requestdata });
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
        setIsReconModel(false);
        resetFormAndState();
        BindUserReconHistory({ dateRange: dateRange, selectedUser: 0, transactionTypeId: 0, searchValue: "", currentPage });
      } else {
        Swal.fire("Error!", _result.message, "error");
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }

  const handleClear = () => {
    resetFormAndState();
  }
  const resetFormAndState = () => {
    reset({
      typeId: 0,
      user: 0,
      apiId: 0,
      Amount: "",
      Comment: ""
    });
  };

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Recon History</h1>
          <a href='#' onClick={() => setIsReconModel(true)} className="py-2 px-4 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">Add Recon</a>
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
              onChange={BindDataTransactionTypeChange}
            >
              <option value={0}>Select Type</option>
              <option value={1}>Credit</option>
              <option value={2}>Debit</option>
            </select>
            <input type="text" onChange={(e) => setsearchValue(e.target.value)} value={searchValue} placeholder='Search' className="block w-full sm:w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white" />
            <button
              onClick={() => BindUserReconHistory({ dateRange: dateRange, selectedUser: selectedUser, transactionTypeId: selectTxnType, searchValue: searchValue, currentPage })}
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
                    {['#', 'User Name', 'Company Name', 'Mobile No', 'Role Name', 'Transaction Type', 'Recon Amount', 'Comment', 'Date & Time'].map(header => (
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
                        {Array.from({ length: 9 }).map((_, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : ReconHistory && Array.isArray(ReconHistory.data) && ReconHistory.data.length > 0 ? (
                    ReconHistory.data.map((row, index) => (
                      <tr key={row.Id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.CompanyName}>{row.CompanyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.MobileNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.RoleName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" style={{ color: row.TransactionType.toLowerCase() === "credit" ? "green" : "red" }}>{row.TransactionType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.Comment}>{row.Comment}</td>
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
            {totalPages ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : ""}
          </div>
        </div>
      </div>

      {/* Add Recon start */}
      <Modal isOpen={IsReconModel} onClose={() => setIsReconModel(false)}>
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Recon</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Type</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <select
                  {...register("typeId")}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.typeId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value={0}>Select Type</option>
                  <option value={1}>Credit</option>
                  <option value={2}>Debit</option>
                </select>
                {errors.typeId && <p className="text-red-500 text-sm mt-1">{errors.typeId.message}</p>}
              </>
            )}
          </div>

          {/* User Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select User</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <select
                  {...register("user")}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.user ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value={0}>Select User</option>
                  {userList && Array.isArray(userList.data) && userList.data.length > 0 ?
                    userList.data.filter(x => x.UserId !== 100 && x.UserId !== 101).map((item) => (
                      <option key={item.UserId} value={item.UserId}>{item.NameWithCompanyName}</option>
                    )) : (
                      <option disabled>No Data Found</option>
                    )
                  }
                </select>
                {errors.user && <p className="text-red-500 text-sm mt-1">{errors.user.message}</p>}
              </>
            )}
          </div>

          {/* API Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select API</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <select
                  {...register("apiId")}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value={0}>Select API</option>
                  {ApiMasterByServiceName && Array.isArray(ApiMasterByServiceName.data) && ApiMasterByServiceName.data.length > 0 ?
                    ApiMasterByServiceName.data.map((item) => (
                      <option key={item.ApiId} value={item.ApiId}>{item.ApiName}</option>
                    )) : (
                      <option disabled>No Data Found</option>
                    )
                  }
                </select>
              </>
            )}
          </div>

          {/* Input Fields */}
          {['Amount', 'Comment'].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <input
                    type="text"
                    {...register(field)}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors[field] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field].message}</p>}
                </>
              )}
            </div>
          ))}

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
      {/* Add Recon end */}

    </div>
  )
}

export default ReconHistory