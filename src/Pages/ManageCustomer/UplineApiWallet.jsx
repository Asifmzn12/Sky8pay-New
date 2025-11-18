import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { encryptvalue } from '../../utils/AESEncrypted';
import { BindAPIListByServiceName, BindUserListByRoleId } from '../../services/Commonapi';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SaveUplineApiWallet } from '../../services/ManageCustomer';


var ValidationError = Yup.object().shape({
  typeId: Yup.number().typeError("Type is required").moreThan(0, "Select valid Type").required("Type is required"),
  user: Yup.number().typeError("User is required").moreThan(0, "Select valid User").required("User is required"),
  apiId: Yup.number().typeError("API is required").moreThan(0, "Select valid API").required("API is required"),
  Amount: Yup.number().typeError("Amount is required").moreThan(0, "Enter valid amount").required("Amount is required")
});


function UplineApiWallet() {
  const [ApiMasterByServiceName, setApiMasterByServiceName] = useState([]);
  const [userList, setUserListValue] = useState([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const [loading, setLoading] = useState(true);

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

  const fetchInitialData = async () => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        roleId: 0
      }));
      const _result = await BindUserListByRoleId({ data: requestdata });
      console.log(_result)
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
        apiId: data.apiId,
        amount: data.Amount,
        type: data.typeId
      }));
      const _result = await SaveUplineApiWallet({ data: requestdata });
      if (_result.statuscode === 200) {
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
  const handleClear = () => {
    resetFormAndState();
  }

  const resetFormAndState = () => {
    reset({
      typeId: 0,
      user: 0,
      apiId: 0,
      Amount: ""
    });
  };

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Upline API Wallet</h1>
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
                      userList.data.filter(x => x.RoleId === 3 || x.RoleId === 6).map((item) => (
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
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.user ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                  {errors.apiId && <p className="text-red-500 text-sm mt-1">{errors.apiId.message}</p>}
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter Amount</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <input
                    type="text"
                    {...register("Amount")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.Amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.Amount && <p className="text-red-500 text-sm mt-1">{errors.Amount.message}</p>}
                </>
              )}
            </div>

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
        </div>
      </div>


    </div>
  )
}

export default UplineApiWallet