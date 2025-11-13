import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BindUserListByRoleId, BindUserRole } from '../../services/Commonapi';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import { DeleteUserLien, GetLienData, SubmitLienData } from '../../services/ManageLien';


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


const validationScheme = Yup.object().shape({
  roleId: Yup.number().typeError("Role is required").moreThan(0, "Please select a valid role").required("Role is required"),
  userId: Yup.number().typeError("User is required").moreThan(0, "Please select a valid user").required("User is required"),
  amount: Yup.number().typeError("Amount is required").moreThan(0, "Please enter a valid amount").required("Amount is requred"),
  comment: Yup.string().required("Comment is required")
});

const LienDeletevalidationScheme = Yup.object().shape({
  uplinecomments: Yup.string().required("Enter comments")
});

const ManageLien = () => {
  const [userRoleList, setUserRoleList] = useState(0);
  const [userList, setUserList] = useState([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [LienDataList, setLienDataList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [LienId, setLienId] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationScheme)
  });

  // delete lien register

  const {
    register: deletelienregister,
    handleSubmit: deletelienhandleSubmit,
    reset: deletelienreset,
    formState: { errors: deletelienerrors }
  } = useForm({
    resolver: yupResolver(LienDeletevalidationScheme)
  });



  useEffect(() => {
    (async () => {
      try {
        fetchInitialData();
      } catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setLoadingForm(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        BindLienData(0);
      } catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setLoadingTable(false);
      }
    })();
  }, [])

  const fetchInitialData = async () => {
    setLoadingForm(true);
    try {
      const data = await BindUserRole();
      setUserRoleList(data);

    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingForm(false);
      setLoadingTable(false);
    }
  };

  const BindDrowndownUserList = async (roleId) => {
    try {
      if (roleId === 0) {
        setUserList([]);
        return;
      }
      const userdataList = await BindUserListByRoleId({ roleId: roleId });
      setUserList(userdataList);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  };

  const onSubmit = async (data) => {
    try {
      const _result = await SubmitLienData({
        userId: data.userId, capAmount: data.amount,
        remarks: data.comment, deleteRemarks: ""
      });
      if (_result.statuscode === 200) {
        BindLienData(0);
        Swal.fire("Success!", _result.message, "success");
        resetFormAndState();
      } else {
        Swal.fire("Error!", _result.message, "error");
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }

  const resetFormAndState = () => {
    reset({
      roleId: 0,
      userId: 0,
      amount: "",
      comment: ""
    });
    setUserList([]);

    deletelienreset({
      uplinecomments: ""
    });
    setLienId(0);
  }

  const handleClear = () => {
    resetFormAndState();
  }


  const BindLienData = async (userId = 0) => {
    try {
      const _result = await GetLienData({
        userId: userId, pageNo: 0, pageSize: 100
      });
      setLienDataList(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }


  const onDeleteLien = async (data) => {
    try {
      const _result = await DeleteUserLien({ lienId: LienId, uplineComment: data.uplinecomments });
      if (isModalOpen) {
        setIsModalOpen(false);
      }
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
        BindLienData(0);
        resetFormAndState();
      } else {
        Swal.fire("Error!", _result.message, "error");
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Manage Lien</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Role Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Role</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <select
                    {...register("roleId")}
                    onChange={(e) => BindDrowndownUserList(parseInt(e.target.value))}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value={0}>Select Role</option>
                    {userRoleList && Array.isArray(userRoleList.data) && userRoleList.data.length > 0 ?
                      userRoleList.data.filter(x => x.id !== 1 && x.id !== 2 && x.id !== 7).map((item) => (
                        <option key={item.id} value={item.id}>{item.roleName}</option>
                      )) : (
                        <option disabled>No Data Found</option>
                      )
                    }
                  </select>
                  {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId.message}</p>}
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
                    {...register("userId")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.user ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value={0}>Select User</option>
                    {userList && Array.isArray(userList.data) && userList.data.length > 0 ?
                      userList.data.map((item) => (
                        <option key={item.UserId} value={item.UserId}>{item.NameWithCompanyName}</option>
                      )) : (
                        <option disabled>No Data Found</option>
                      )
                    }
                  </select>
                  {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>}
                </>
              )}
            </div>

            {/* Input Fields */}
            {['amount', 'comment'].map(field => (
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
        </div>

        <hr className="my-10 border-gray-200 dark:border-gray-700" />

        {/* Table Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Active Lien List</h2>
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['#', 'User Name', 'Company Name', 'Amount', 'Comments', 'Date & Time', 'Actions'].map(header => (
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
                      {Array.from({ length: 6 }).map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : LienDataList && Array.isArray(LienDataList.data) && LienDataList.data.length > 0 ? (
                  LienDataList.data.map((row, index) => (
                    <tr key={index + 1}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CompanyName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Comments}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CreatedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button type="button" onClick={() => { setLienId(row.LienId); setIsModalOpen(true) }} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 transition-colors mr-4">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Delete Lien</h2>
        <div>
          <form onSubmit={deletelienhandleSubmit(onDeleteLien)}>
            <div key={0}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter Comments</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <input
                    type="text"
                    {...deletelienregister("uplinecomments")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${deletelienerrors.uplinecomments ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {deletelienerrors.uplinecomments && <p className="text-red-500 text-sm mt-1">{deletelienerrors.uplinecomments.message}</p>}
                </>
              )}
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
        </div>
      </Modal>
    </div>

  )
}

export default ManageLien