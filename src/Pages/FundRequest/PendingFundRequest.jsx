import React, { Children, useEffect, useState } from 'react'
import { StatusEnum } from '../../utils/StatusEnum';
import Swal from 'sweetalert2';
import { BindFundRequest, UpdatePendingFundRequest } from '../../services/FundRequest';
import { BindMasterData, BindUserListByRoleId } from '../../services/Commonapi';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';


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

const ValidationScheme = Yup.object().shape({
  status: Yup.number().typeError("Status is required").moreThan(0, "Please select a valid status").required("Status is required"),
  uplinecomment: Yup.string().required("Enter remarks")
});

const PendingFundRequest = () => {
  const [userList, setUserListValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fundrequest, setFundrequest] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMasterdropdown, setStatusMasterDrowdown] = useState(0);
  const [selectfundRow, setSelectFundRow] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ValidationScheme),
    defaultValues: {
      status: 0,
      uplinecomment: ""
    }
  });


  // bind initial data
  useEffect(() => {
    (async () => {
      try {
        fetchInitialData();
      }
      catch (err) {
        Swal.fire("Error!", err.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  // bind pending fund
  useEffect(() => {
    (async () => {
      try {
        BindPendingFundRequest({
          userId: 0, roleId: 0, startDate: null, endDate: null, pageNo: 0, pageSize: 100, status: StatusEnum.Pending
        });
      }
      catch (err) {
        Swal.fire("Error!", err.message, "error");
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
      Swal.fire("Error!", err.message, "error");
    }
    finally {
      setLoading(false);
    }
  }


  const BindPendingFundRequest = async (daterange, selecteduser) => {
    try {
      const _result = await BindFundRequest({ userId: selecteduser, roleId: 0, startDate: daterange?.[0]?.format("YYYY-MM-DD"), endDate: daterange?.[1]?.format("YYYY-MM-DD"), pageNo: 0, pageSize: 100, status: StatusEnum.Pending });
      setFundrequest(_result);
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const BindDataUserChange = (e) => {
    const userId = parseInt(e.target.value);
    setSelectedUser(userId);
    BindPendingFundRequest(dateRange, userId);
  }

  const resetFormAndState = () => {
    reset({
      status: 0,
      uplinecomment: ""
    });
  };

  const handleClear = () => {
    resetFormAndState();
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...selectfundRow,
        statusId: data.status,
        UplineComments: data.uplinecomment
      }
      var _result = await UpdatePendingFundRequest({
        status: payload.statusId, amount: payload.Amount, userId: payload.UserId, roleId: payload.RoleId,
        fundId: payload.Id, uplinecomment: payload.UplineComments, systemUniqueId: payload.SystemGeneratedId,
        uplineUserId: 101, uplineRoleId: 2
      });
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
        resetFormAndState();
        BindPendingFundRequest();
        if (isModalOpen) {
          setIsModalOpen(false); // Close modal if it was open
        }
      } else {
        Swal.fire("Error!", _result.message, "error");
      }
    } catch (err) {
      Swal.fire("Error!", err.message, "error");
    }
    finally {

    }
  }



  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Pending Fund Request</h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
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
            <input type="text" placeholder='Search' className="block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white" />
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
                    {['#', 'User Name', 'Company', 'UPI', 'AC/No', 'IFSC', 'Paymode', 'Utr no', 'Amount', 'Req Date', 'Comment', 'Txn Id', 'Date & Time', 'Receipt', 'Action'].map(header => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.SystemGeneratedId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CreatedDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {row.PaymentRecipiet ? <a href={row.PaymentRecipiet} target="_blank" className="text-blue-500 hover:text-blue-700 mx-2">View</a> : 'No Receipt'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button type="button" onClick={() => { setSelectFundRow(row); setIsModalOpen(true) }} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 transition-colors mr-4">Update</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={0}>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No bank details found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Update Status Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Update Pending Fund</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div key={0}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Status</label>
            <select key={2}
              {...register("status")}
              // onChange={(e) => BindDrowndownUserList(parseInt(e.target.value))}
              className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.status ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option value={0}>Select Status</option>
              {statusMasterdropdown && Array.isArray(statusMasterdropdown.data) && statusMasterdropdown.data.length > 0 ?
                statusMasterdropdown.data.filter(x => x.Id !== 2).map((item) => (
                  <option key={item.Id} value={item.Id}>{item.Name}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )
              }
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
          </div>
          <div key={1}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter Remarks</label>
            <input
              type="text"
              placeholder='Enter Remarks'
              {...register("uplinecomment")}
              className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.uplinecomment ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.uplinecomment && <p className="text-red-500 text-sm mt-1">{errors.uplinecomment.message}</p>}
          </div>
          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={handleClear}
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
    </div >
  )
}

export default PendingFundRequest