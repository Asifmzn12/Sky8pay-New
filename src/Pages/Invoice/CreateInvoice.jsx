import React, { useEffect, useState } from 'react'
import { BindUserListByRoleId, BindUserRole, GetServiceList } from '../../services/Commonapi';
import Swal from 'sweetalert2';
import { encryptvalue } from '../../utils/AESEncrypted';
import { useForm } from 'react-hook-form';
import { GetUserActiveServices } from '../../services/ManageCustomer';
import { GetFinancialYear, GetMonthName, SaveInvoice } from '../../services/GenerateInvoice';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const validationError = Yup.object().shape({
  roleId: Yup.number().typeError("Role is required").moreThan(0, "Select valid role").required("Role is required"),
  user: Yup.number().typeError("User is required").moreThan(0, "Select valid user").required("User is required"),
  serviceId: Yup.number().typeError("Service name is required").moreThan(0, "Select valid service name").required("Service name is required"),
  apiId: Yup.number().typeError("API is requird").moreThan(0, "Select valid API").required("API is required"),
  financialYear: Yup.number().typeError("Financial Year is required").moreThan(0, "Select valid Year").required("Financial Year is required"),
  financialMonth: Yup.number().typeError("Financial month is required").moreThan(0, "Select valid month").required("Financial month is required")
});


function CreateInvoice() {
  const [userRoleList, setUserRoleList] = useState(0);
  const [loadingForm, setLoadingForm] = useState(true);
  const [userList, setUserListValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [UserActiveService, setUserActiveService] = useState();
  const [SelectedServiceName, setSelectedServiceName] = useState("");
  const [SelectedUserId, setSelectedUserId] = useState(0);
  const [FinancialList, setFinancialList] = useState();
  const [MonthName, setMonthName] = useState();
  const [SelectedMonthName, setSelectedMonthName] = useState();
  const [SelectedFinancialYear, setSelectedFinancialYear] = useState();


  useEffect(() => {
    (async () => {
      fetchInitialData();
    })();
  }, [])


  const fetchInitialData = async () => {
    try {
      const _roleresult = await BindUserRole({ data: {} });
      setUserRoleList(_roleresult);

      const _result = await GetFinancialYear({ data: {} });
      setFinancialList(_result);


      const _resultMothName = await GetMonthName({ data: {} });
      setMonthName(_resultMothName);

    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setLoading(false);
      setLoadingForm(false);
    }
  }


  const BindUserByRole = async (e) => {
    try {
      const roleId = parseInt(e.target.value);
      if (roleId === 0) {
        setUserListValue([]);
      } else {
        var requestdata = encryptvalue(JSON.stringify({
          roleId: parseInt(e.target.value)
        }));
        const _result = await BindUserListByRoleId({ data: requestdata });
        setUserListValue(_result);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
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
    resolver: yupResolver(validationError)
  });

  const onSubmit = async (data) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        userId: data.user,
        apiId: data.apiId,
        serviceName: SelectedServiceName,
        invoiceOfMonth: SelectedMonthName,
        monthNo: data.financialMonth,
        financialYear: SelectedFinancialYear
      }));
      var _result = await SaveInvoice({ data: requestdata });
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

  const resetFormAndState = () => {
    reset({
      roleId: 0,
      user: 0,
      serviceId: 0,
      apiId: 0,
      financialYear: 0,
      financialMonth: 0
    })
  }

  const handleClear = () => {
    resetFormAndState();
  }

  const BindUserServiceByUserId = async (e) => {
    const userId = parseInt(e.target.value);
    setSelectedUserId(userId);
    BindUserActiveService(userId, SelectedServiceName);
  }

  const BindUserServiceByService = async (e) => {
    const serviceName = e.target.options[e.target.selectedIndex].text;
    setSelectedServiceName(serviceName);
    BindUserActiveService(SelectedUserId, serviceName);
  }

  const BindUserActiveService = async (SelectedUserId, SelectedServiceName) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        userId: SelectedUserId,
        serviceName: SelectedServiceName
      }));
      var _result = await GetUserActiveServices({ data: requestdata });
      setUserActiveService(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }




  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Generate Invoice</h1>
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
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.roleId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    onChange={BindUserByRole}
                  >
                    <option value={0}>Select Role</option>
                    {userRoleList && Array.isArray(userRoleList.data) && userRoleList.data.length > 0 ?
                      userRoleList.data.filter(x => x.id === 3 || x.id === 4 || x.id === 6).map((item) => (
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
                    {...register("user")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.user ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    onChange={BindUserServiceByUserId}
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
                  {errors.user && <p className="text-red-500 text-sm mt-1">{errors.user.message}</p>}
                </>
              )}
            </div>

            {/* Service Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Service</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <select
                    {...register("serviceId")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.serviceId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    onChange={BindUserServiceByService}
                  >
                    <option value={0}>Select Service</option>
                    <option value={101}>Payin</option>
                    <option value={102}>Payout</option>
                  </select>
                  {errors.serviceId && <p className="text-red-500 text-sm mt-1">{errors.serviceId.message}</p>}
                </>
              )}
            </div>

            {/* Active serive Select */}
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
                    {UserActiveService && Array.isArray(UserActiveService.data) && UserActiveService.data.length > 0 ?
                      UserActiveService.data.map((item) => (
                        <option key={item.ApiId} value={item.ApiId}>{item.ApiName}</option>
                      )) : (
                        <option disabled>No Data Found</option>
                      )}
                  </select>
                  {errors.apiId && <p className="text-red-500 text-sm mt-1">{errors.apiId.message}</p>}
                </>
              )}
            </div>

            {/* Financial Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Financial</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <select
                    {...register("financialYear")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.financialYear ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    onChange={(e) => setSelectedFinancialYear(e.target.options[e.target.selectedIndex].text)}
                  >
                    <option value={0}>Select Financial Year</option>
                    {FinancialList && Array.isArray(FinancialList.data) && FinancialList.data.length > 0 ?
                      FinancialList.data.map((item, index) => (
                        <option key={item.FinancialYear} value={index + 1}>{item.FinancialYear}</option>
                      )) : (
                        <option disabled>No Data Found</option>
                      )}
                  </select>
                  {errors.financialYear && <p className="text-red-500 text-sm mt-1">{errors.financialYear.message}</p>}
                </>
              )}
            </div>
            {/* Month Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Month</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <select
                    {...register("financialMonth")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.financialMonth ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    onChange={(e) => setSelectedMonthName(e.target.options[e.target.selectedIndex].text)}
                  >
                    <option value={0}>Select Month</option>
                    {MonthName && Array.isArray(MonthName.data) && MonthName.data.length > 0 ?
                      MonthName.data.map((item) => (
                        <option key={item.MonthNumber} value={item.MonthNumber}>{item.Name}</option>
                      )) : (
                        <option disabled>No Data Found</option>
                      )}
                  </select>
                  {errors.financialMonth && <p className="text-red-500 text-sm mt-1">{errors.financialMonth.message}</p>}
                </>
              )}
            </div>
            {/* Amount input */}
            {/* <div>
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
            </div> */}
            {/* Comment input */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter Comment</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <input
                    type="text"
                    {...register("Comment")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.Comment ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.Comment && <p className="text-red-500 text-sm mt-1">{errors.Comment.message}</p>}
                </>
              )}
            </div> */}

            {/* Check for API Balance */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Are you Add Recon History</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    {...register("IsRecon")}
                    checked={IsCheckedRecon}
                    onChange={(e) => setIsCheckedRecon(e.target.checked)}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </>
              )}
            </div> */}

            {/* Check for API Balance */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Are you Add Api Balance</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    {...register("IsapiBalance")}
                    checked={IsCheckedApiBalance}
                    onChange={(e) => setIsCheckedApiBalance(e.target.checked)}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </>
              )}
            </div>
 */}

            {/* api balance */}
            {/* <div style={{ display: IsCheckedApiBalance ? "block" : "none" }}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter API Amount</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <input
                    type="text"
                    {...register("ApiAmount")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </>
              )}
            </div> */}

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

export default CreateInvoice