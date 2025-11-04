import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { BindUserListByRoleId, BindUserRole } from '../../services/Commonapi';
import { encryptvalue } from '../../utils/AESEncrypted';
import Swal from 'sweetalert2';
import { GetUserWiseGst, SaveUserWiseGst } from '../../services/GST';

const ValidationError = Yup.object().shape({
  roleId: Yup.number().typeError("Role is required").moreThan(0, "Please select Role").required("Role is required"),
  userId: Yup.number().typeError("User is required").moreThan(0, "Please select User").required("User is required"),
  GSTNo: Yup.string().required("GST is required"),
  CompanyName: Yup.string().required("Company Name is required"),
  Amount: Yup.number().typeError("Amount is required").moreThan(0, "Enter valid amount").required("Amount is required"),
  Comment: Yup.string().required("Comment is required")
});

const UserWiseGST = () => {
  const [userRoleList, setUserRoleList] = useState(0);
  const [userList, setUserList] = useState([]);
  const [AlluserList, setAlluserList] = useState([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [UserGstList, setUserGstList] = useState();
  const [CollectedGst, setCollectedGst] = useState(0);
  const [PaidGst, setPaidGst] = useState(0);
  const [RefundGst, setRefundGst] = useState(0);
  const [PayableGst, setPayableGst] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(ValidationError)
  });
  useEffect(() => {
    (async () => {
      fetchInitialData();
    })();
  }, []);

  const fetchInitialData = async () => {
    setLoadingForm(true);
    try {
      const data = await BindUserRole();
      setUserRoleList(data);

      var requestData = encryptvalue(JSON.stringify({
        roleId: 0
      }));
      const _result = await BindUserListByRoleId({ data: requestData });
      setAlluserList(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingForm(false);
    }
  };

  useEffect(() => {
    (async () => {
      BindUserWiseGst();
    })();
  }, []);

  const BindDrowndownUserList = async (roleId) => {
    try {
      if (roleId === 0) {
        setUserList([]);
        return;
      }
      var requestdata = encryptvalue(JSON.stringify({
        roleId: roleId
      }));
      const userdataList = await BindUserListByRoleId({ data: requestdata });
      setUserList(userdataList);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  };

  const onSubmit = async (data, e) => {
    try {
      var btn = e.nativeEvent.submitter;
      const btnval = btn.value;
      var requestdata = encryptvalue(JSON.stringify({
        amount: data.Amount,
        gstNo: data.GSTNo,
        companyName: data.CompanyName,
        apiId: 0,
        isCredit: Boolean(Number(btnval)),
        comment: data.Comment,
        userId: data.userId
      }));
      const _result = await SaveUserWiseGst({ data: requestdata });
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
        resetFormAndState();
        BindUserWiseGst();
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
      Amount: "",
      CompanyName: "",
      GSTNo: "",
      Comment: ""
    })
  }


  const BindUserWiseGst = async (userId) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        userId: userId
      }));
      var _result = await GetUserWiseGst({ data: requestdata });
      setUserGstList(_result);
      if (_result.statuscode === 200) {
        var _colledtedGst = _result.data.reduce((x, item) => x + item.CollectedGst, 0);
        setCollectedGst(_colledtedGst);
        var _paidGst = _result.data.reduce((x, item) => x + item.PaidUserGst, 0);
        setPaidGst(_paidGst);
        var _refundGst = _result.data.reduce((x, item) => x + item.RefundUserGst, 0);
        setRefundGst(_refundGst);
        var _payableGst = _result.data.reduce((x, item) => x + item.PayableByUser, 0);
        setPayableGst(_payableGst);
      }else{
        setCollectedGst(0);
        setPaidGst(0);
        setRefundGst(0);
        setPayableGst(0);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }

  const BindDataUserChange = (e) => {
    const userId = parseInt(e.target.value);
    BindUserWiseGst(userId);
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Use Wise GST</h1>
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
            {['GST No', 'Company Name', 'Amount', 'Comment'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                {loadingForm ? (
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                ) : (
                  <>
                    <input
                      type="text"
                      {...register(field.replace(/\s+/g, ""))}
                      className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors[field.replace(/\s+/g, "")] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors[field.replace(/\s+/g, "")] && <p className="text-red-500 text-sm mt-1">{errors[field.replace(/\s+/g, "")].message}</p>}
                  </>
                )}
              </div>
            ))}

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                value={1}
              >
                Pay
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-colors"
                value={0}
              >
                Refund
              </button>
            </div>
          </form>
        </div>

        <hr className="my-10 border-gray-200 dark:border-gray-700" />

        {/* Table Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">User Wise GST</h2>
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={BindDataUserChange}
            >
              <option value={0}>Select User</option>
              {AlluserList && Array.isArray(AlluserList.data) && AlluserList.data.length > 0 ?
                AlluserList.data.filter(x => x.UserId !== 100 && x.UserId !== 101).map((item) => (
                  <option key={item.UserId} value={item.UserId}>{item.NameWithCompanyName}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )}
            </select>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['#', 'User Name', 'Collected GST', 'Paid GST', 'Refund GST', 'Payable GST'].map(header => (
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
                ) : UserGstList && Array.isArray(UserGstList.data) && UserGstList.data.length > 0 ? (
                  UserGstList.data.map((row, index) => (
                    <tr key={index + 1}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.CollectedGst)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.PaidUserGst)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.RefundUserGst)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.PayableByUser)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No data found.</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" colSpan={1}></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(CollectedGst)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(PaidGst)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(RefundGst)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(PayableGst)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserWiseGST