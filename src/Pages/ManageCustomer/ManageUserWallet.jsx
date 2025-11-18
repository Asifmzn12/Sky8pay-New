import React, { useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form';
import { decryptValue, encryptvalue } from '../../utils/AESEncrypted';
import { BindAPIListByServiceName, BindUserListByRoleId, BindUserRole } from '../../services/Commonapi';
import Swal from 'sweetalert2';
import { GetCurrentUserWalletBalance, GetWalletType, SaveSettledWalletCreditDebit, SaveUnSettledWalletCreditDebit } from '../../services/ManageCustomer';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

var ValidationError = Yup.object().shape({
  wallettypeId: Yup.number().typeError("Wallet is required").moreThan(0, "Select valid wallet").required("Wallet is required"),
  roleId: Yup.number().typeError("Role is required").moreThan(0, "Select valid role").required("Role is required"),
  user: Yup.number().typeError("User is required").moreThan(0, "Select valid User").required("User is required"),
  apiId: Yup.number().typeError("API is required").moreThan(0, "Select valid API").required("API is required"),
  Amount: Yup.number().typeError("Amount is required").moreThan(0, "Enter valid amount").required("Amount is required"),
  Comment: Yup.string().required("Comment is required")
});


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


function ManageUserWallet() {
  const [WalletType, setWalletType] = useState();
  const [userList, setUserListValue] = useState([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const [loading, setLoading] = useState(true);
  const [ApiMasterByServiceName, setApiMasterByServiceName] = useState([]);
  const [userRoleList, setUserRoleList] = useState(0);
  const [IsCheckedApiBalance, setIsCheckedApiBalance] = useState(false);
  const [IsCheckedRecon, setIsCheckedRecon] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [ActionType, setActionType] = useState(0);
  const [ApiName, setApiName] = useState("");
  const [formData, setformData] = useState([]);
  const [UserCurrentBal, setUserCurrentBal] = useState(0);
  const [SelectedWalletTypeId, setSelectedWalletTypeId] = useState(0);
  // bind initial data
  useEffect(() => {
    (async () => {
      try {
        if (!IsCheckedApiBalance) {
          setValue("ApiAmount", 0);
        }
        fetchInitialData();
      }
      catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setLoading(false);
      }
    })();
  }, [IsCheckedApiBalance]);

  const fetchInitialData = async () => {
    try {
      const walletdata = await GetWalletType({ data: {} });
      setWalletType(walletdata);

      const data = await BindUserRole({ data: {} });
      setUserRoleList(data);

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
        setUserCurrentBal(0);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(ValidationError)
  });

  const onSubmit = async (data) => {
    try {
      setformData(data);
      setIsConfirmationModalOpen(true);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }

  const onSubmitYes = async () => {
    setLoading(true);
    try {
      const AdminId = localStorage.getItem("serial");
      const AdminRoleId = localStorage.getItem("serialtype");
      var requestdata = encryptvalue(JSON.stringify({
        userId: formData.user, amount: formData.Amount, apiId: formData.apiId, userTransactionTypeId: ActionType,
        roleId: formData.roleId, comment: formData.Comment, fromUserId: decryptValue(AdminId), fromRoleId: decryptValue(AdminRoleId),
        isRecon: formData.IsRecon, isApiWallet: formData.IsapiBalance, apiBalance: formData.ApiAmount
      }));
      if (formData.wallettypeId === 1) {
        SettledWalletCrDr(requestdata);
      } else {
        UnSettledWalletCrDr(requestdata);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoading(false);
    }
  }


  const UnSettledWalletCrDr = async (settledRequest) => {
    setIsConfirmationModalOpen(false);
    try {
      var _result = await SaveUnSettledWalletCreditDebit({ data: settledRequest });
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
        resetFormAndState();
      } else {
        Swal.fire("Error!", _result.message, "error");
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoading(false);
    }
  }

  const SettledWalletCrDr = async (settledRequest) => {
    setIsConfirmationModalOpen(false);
    try {
      var _result = await SaveSettledWalletCreditDebit({ data: settledRequest });
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
        resetFormAndState();
      } else {
        Swal.fire("Error!", _result.message, "error");
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoading(false);
    }
  }

  const handleClear = async () => {
    setIsCheckedApiBalance(false);
    setIsCheckedRecon(false);
    setActionType(0);
    setUserCurrentBal("");
    reset({
      wallettypeId: 0,
      user: 0,
      roleId: 0,
      apiId: 0,
      Amount: "",
      ApiAmount: 0,
      Comment: ""
    });
    setformData([]);
  }

  const resetFormAndState = () => {
    setIsCheckedApiBalance(false);
    setIsCheckedRecon(false);
    setActionType(0);
    reset({
      Amount: "",
      ApiAmount: 0,
      Comment: ""
    });
    setformData([]);
  }

  const onClose = () => {
    setIsConfirmationModalOpen(false);
  }

  const BindUserCurrentWallet = async (e) => {
    try {
      const userId = parseInt(e.target.value);
      var requestdata = encryptvalue(JSON.stringify({
        userId: userId,
        apiId: 0,
        walletTypeId: SelectedWalletTypeId
      }));
      var _result = await GetCurrentUserWalletBalance({ data: requestdata });
      if (_result.statuscode === 200) {
        setUserCurrentBal(_result.data);
      } else {
        setUserCurrentBal(0);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }


  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Manage User Wallet</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Type</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <select
                    {...register("wallettypeId")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.wallettypeId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    onClick={(e) => { setSelectedWalletTypeId(parseInt(e.target.value)); setUserCurrentBal(0) }}
                  >
                    <option value={0}>Select Wallet</option>
                    {WalletType && Array.isArray(WalletType.data) && WalletType.data.length > 0 ?
                      WalletType.data.map((item) => (
                        <option key={item.Id} value={item.Id}>{item.Name}</option>
                      )) : (
                        <option disabled>No Data Found</option>
                      )
                    }
                  </select>
                  {errors.wallettypeId && <p className="text-red-500 text-sm mt-1">{errors.wallettypeId.message}</p>}
                </>
              )}
            </div>

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
              <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(UserCurrentBal)}</label>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select User</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <select
                    {...register("user")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.user ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    onChange={BindUserCurrentWallet}
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
                    onChange={(e) => setApiName(e.target.options[e.target.selectedIndex].text)}
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
            {/* Amount input */}
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
            {/* Comment input */}
            <div>
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
            </div>

            {/* Check for API Balance */}
            <div>
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
            </div>

            {/* Check for API Balance */}
            <div>
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


            {/* api balance */}
            <div style={{ display: IsCheckedApiBalance ? "block" : "none" }}>
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
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors"
                onClick={() => setActionType(1)}
              >
                Credit
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-colors"
                onClick={() => setActionType(2)}
              >
                Debit
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation start */}
      <Modal isOpen={isConfirmationModalOpen} onClose={() => setIsConfirmationModalOpen(false)}>
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Fund Confirmation</h2>
        <div className="flex justify-between p-4">
          <span className="text-gray-600 font-medium">Transaction Type</span>
          <span className="text-gray-800">{ActionType === 1 ? "Credit" : "Debit"}</span>
        </div>
        <div className="flex justify-between p-4">
          <span className="text-gray-600 font-medium">Name</span>
          <span className="text-gray-800">{ApiName}</span>
        </div>
        <div className="flex justify-between p-4">
          <span className="text-gray-600 font-medium">Opening Amount</span>
          <span className="text-gray-800">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(UserCurrentBal)}</span>
        </div>
        <div className="flex justify-between p-4">
          <span className="text-gray-600 font-medium">Transaction Amount</span>
          <span className="text-gray-800">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(formData.Amount)}</span>
        </div>
        <div className="flex justify-between p-4">
          <span className="text-gray-600 font-medium">Closing Amount</span>
          <span className="text-gray-800">
            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(ActionType == 1 ? UserCurrentBal + formData.Amount : UserCurrentBal - formData.Amount)}</span>
        </div>
        {IsCheckedApiBalance
          ? <div className="flex justify-between p-4">
            <span className="text-gray-600 font-medium">API Amount</span>
            <span className="text-gray-800">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(formData.ApiAmount)}</span>
          </div> : ""
        }
        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors"
            onClick={() => onSubmitYes()} >
            Yes
          </button>
          <button type="submit" className="px-6 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-colors"
            onClick={onClose} >
            No
          </button>
        </div>
      </Modal>
      {/* Confirmation end */}
    </div>
  )
}

export default ManageUserWallet