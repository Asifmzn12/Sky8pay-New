import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import { BindAPIListByServiceName } from '../../services/Commonapi';
import { SaveApiFund } from '../../services/ManageAPI';

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
  apiId: Yup.number().typeError("API is required").moreThan(0, "Please select API").required("API is required"),
  amount: Yup.number().typeError("Amount is required").moreThan(0, "Enter a valid amount").required("Amount is required"),
  comment: Yup.string().required("Comment is required")
});

const APIFund = () => {
  const [ApiMasterByServiceName, setApiMasterByServiceName] = useState([]);
  const [loadingForm, setloadingForm] = useState(true);
  const [ActionType, setActionType] = useState(0);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [ApiName, setApiName] = useState("");
  const [formData, setformData] = useState([]);
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
        setloadingForm(false);
      }
    })();
  }, []);


  const fetchInitialData = async () => {
    setloadingForm(true);
    try {
      const _apiresult = await BindAPIListByServiceName({ serviceName: "" });
      setApiMasterByServiceName(_apiresult);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setloadingForm(false);
    }
  }

  const onSubmit = async (data) => {
    if (data) {
      setformData(data);
      setIsReceiptModalOpen(true);
    } else {
      setformData([]);
      setIsReceiptModalOpen(false);
      Swal.fire("Error!", "something went wrong", "error");
    }
  }

  const onClose = async () => {
    setIsReceiptModalOpen(false);
  }

  const resetFormAndState = () => {
    reset({
      userId: 0,
      amount: "",
      comment: "",
      ActionType: 0
    });
    setformData([]);
  }

  const onSubmitYes = async () => {
    setloadingForm(true);
    setIsReceiptModalOpen(false);    
    try {
      const _result = await SaveApiFund({
        apiId: formData.apiId, amount: formData.amount,
        remarks: formData.comment, type: ActionType, userId: 101
      });
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
        resetFormAndState();
      } else {
        Swal.fire("Error!", _result.message, "error");
      }
    } catch (err) {

    } finally {
      setloadingForm(false);
    }
  }



  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Manage API Fund</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Role Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select API</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <select
                    {...register("apiId")}
                    onChange={(e) => {
                      setApiName(e.target.options[e.target.selectedIndex].text);
                    }}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.apiId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option key={0} value={0}>Select API</option>
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
              {/* <button
                type="button"
                onClick={handleClear}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Clear
              </button> */}
              <button
                type="submit" onClick={() => { setActionType(1); }}
                className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors">
                Credit
              </button>
              <button
                type="submit" onClick={() => { setActionType(2); }}
                className="px-6 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-colors">
                Debit
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation start */}
      <Modal isOpen={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)}>
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
          <span className="text-gray-600 font-medium">Transaction Amount</span>
          <span className="text-gray-800">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(formData.amount)}</span>
        </div>
        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
            onClick={() => onSubmitYes()} >
            Yes
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
            onClick={onClose} >
            No
          </button>
        </div>
      </Modal>
      {/* Confirmation end */}
    </div>

  )
}

export default APIFund