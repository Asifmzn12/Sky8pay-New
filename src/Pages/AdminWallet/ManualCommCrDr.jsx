import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { BindAPI, BindUserListByRoleId, BindUserRole } from '../../services/Commonapi';
import { encryptvalue } from '../../utils/AESEncrypted';
import Swal from 'sweetalert2';
import { SaveManualCommission } from '../../services/AdminWallet';


var ValidationError = Yup.object().shape({
  roleId: Yup.number().typeError("Role is required").moreThan(0, "Please select Role").required("Role is required"),
  userId: Yup.number().typeError("User is required").moreThan(0, "Please select User").required("User is required"),
  apiId: Yup.number().typeError("API is required").moreThan(0, "Please select API").required("API is required"),
  amount: Yup.number().typeError("Amount is required").moreThan(0, "Enter a valid amount").required("Amount is required"),
  comment: Yup.string().required("Comment is required")
});

const ManualCommCrDr = () => {
  const [userRoleList, setUserRoleList] = useState(0);
  const [userList, setUserList] = useState([]);
  const [apiList, setApiList] = useState([]);
  const [loadingForm, setLoadingForm] = useState(true);

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

      var requestdata = encryptvalue(JSON.stringify({
        RoleId: 2
      }));
      const _result = await BindAPI({ data: requestdata });
      setApiList(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingForm(false);
    }
  };

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
      const btn = e.nativeEvent.submitter;
      const btnval = btn.value;
      var requestdata = encryptvalue(JSON.stringify({
        userId: data.userId,
        apiId: data.apiId,
        transactionTypeId: btnval,
        amount: data.amount,
        remarks: data.comment
      }));
      var _result = await SaveManualCommission({ data: requestdata });
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
        resetFormAndState();
      } else {
        Swal.fire("Error!", _result.message, "error");
      }
    }
    catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }

  const handleClear = async () => {
    resetFormAndState();
  }

  const resetFormAndState = () => {
    reset({
      roleId: 0,
      userId: 0,
      apiId: 0,
      amount: "",
      comment: ""
    });
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Manual Commission Credit Debit</h1>
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

            {/* api select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select API</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <select
                    {...register("apiId")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value={0}>Select API</option>
                    {apiList && Array.isArray(apiList.data) && apiList.data.length > 0 ?
                      apiList.data.filter(x => x.id !== 1 && x.id !== 2 && x.id !== 7).map((item) => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      )) : (
                        <option disabled>No Data Found</option>
                      )
                    }
                  </select>
                  {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId.message}</p>}
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
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors"
                value={1}
              >
                Credit
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-colors"
                value={2}
              >
                Debit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ManualCommCrDr