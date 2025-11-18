import React, { Children, useEffect, useState } from 'react'
import { BindUserListByRoleId } from '../../services/Commonapi';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { BindLoanHistory, UserLoanRecovered } from '../../services/LoanRequest';
import { encryptvalue } from '../../utils/AESEncrypted';

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
  userId: Yup.number().typeError("User is required").moreThan(0, "Please select a valid user").required("User is required"),
  amount: Yup.number().typeError("Amount is required").moreThan(0, "Enter valid amount").required("Amount is required"),
  comments: Yup.string().required("Comments is required")
});

const LoanRecovered = () => {
  const [userList, setUserListValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoandetails, setUserLoanDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [laonRecovereddataOnSubmit, setLaonRecovereddataOnSubmit] = useState([]);
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
      setUserListValue(_result);

    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setLoading(false);
    }
  }

  const UserLoanHistory = async (usrId) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        userId: usrId
      }));
      const _result = await BindLoanHistory({ data: requestdata });
      setUserLoanDetails(_result);
      return _result;
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoading(false);
    }
  }


  const UsrLoanConfirmed = async (data) => {
    try {
      const _result = await UserLoanHistory(data.userId);
      if (_result.data.PENDINGLOAN > 0 && _result.data.PENDINGLOAN >= data.amount) {
        setLaonRecovereddataOnSubmit(data);
        setIsModalOpen(true);
      } else {
        Swal.fire("Error!", "The loan amount you entered exceeds the pending loan amount. Please enter a valid amount.", "error");
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        userId: data.userId, comment: data.comments,
        amount: data.amount, systemUniqueId: ""
      }));
      const _result = await UserLoanRecovered({
        data: requestdata
      });
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
        if (isModalOpen) {
          setIsModalOpen(false);
        }
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
  };
  const resetFormAndState = () => {
    reset({
      userId: 0,
      amount: "",
      comments: ""
    });
    setUserLoanDetails([]);
  }

  return (
    // <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
    //   <div className="max-w-7xl mx-auto">
    //     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
    <div className="mb-12">
      <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Loan Recovered</h1>
      <form onSubmit={handleSubmit(UsrLoanConfirmed)} className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          &nbsp;&nbsp;{
            userLoandetails && userLoandetails.data ? (
              <span>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(userLoandetails.data.PENDINGLOAN)}</span>
            ) : (<span></span>)}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select User</label>
            {loading ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <select {...register("userId")}
                  className={`block w-full sm:w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.userId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  onChange={(e) => UserLoanHistory(e.target.value)}
                >
                  <option value={0}>Select User</option>
                  {userList && Array.isArray(userList.data) && userList.data.length > 0 ?
                    userList.data.filter(x => x.UserId !== 100 && x.UserId !== 101).map((item) => (
                      <option key={item.UserId} value={item.UserId}>{item.NameWithCompanyName}</option>
                    )) : (
                      <option disabled>No Data Found</option>
                    )}
                </select>
                {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>}
              </>
            )}
          </div>
          {['amount', 'comments'].map(fields => (
            <div key={fields}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{fields.replace(/([A-Z])/g, '$1').replace(/^./, str => str.toUpperCase())}</label>
              {loading ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <input type='text' {...register(fields)} className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors[fields] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                  {errors[fields] && <p className="text-red-500 text-sm mt-1">{errors[fields].message}</p>}
                </>
              )}
            </div>
          ))}
          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Clear
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors" >
              Submit
            </button>
          </div>
        </div>
      </form>
      {laonRecovereddataOnSubmit && userLoandetails && userLoandetails.data ? (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Loan history</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <label>Total Given Loan</label>
              <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(userLoandetails.data.GIVENLOAN)}</label>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <label>Loan Recovered</label>
              <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(userLoandetails.data.RECOVERLOAN)}</label>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <label>Pending Loan</label>
              <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(userLoandetails.data.PENDINGLOAN)}</label>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <label>Transaction Amount</label>
              <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(laonRecovereddataOnSubmit.amount)}</label>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <label>Total Loan Recovered</label>
              <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(userLoandetails.data.RECOVERLOAN + laonRecovereddataOnSubmit.amount)}</label>
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button"
                // onClick={handleClear}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Clear
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors" >
                Submit
              </button>
            </div>
          </form>
        </Modal>
      ) : ("")}
    </div>
  )
}

export default LoanRecovered