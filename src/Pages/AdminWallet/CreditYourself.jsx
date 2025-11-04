import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { DoCreditYourSelf } from '../../services/AdminWallet';
import Swal from 'sweetalert2';
import { decryptValue, encryptvalue } from '../../utils/AESEncrypted';

const validationError = Yup.object().shape({
  amount: Yup.number().typeError("Amount is required").moreThan(0, "Enter amount is greater than 0").required("Amount is required"),
  comment: Yup.string().required("Comment is required")
});


const CreditYourself = () => {
  const [loadingForm, setLoadingForm] = useState(true);


  useEffect(() => {
    try {

    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingForm(false);
    }
  }, [])

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
      var usrId = decryptValue(localStorage.getItem("serial"));
      var requestdata = encryptvalue(JSON.stringify({
        userId: usrId,
        domainName: window.location.hostname,
        amount: data.amount,
        userComment: data.comment,
        adminComment: "",
        status: 0
      }));
      const _result = await DoCreditYourSelf({
        data: requestdata
      });
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
      amount: "",
      comment: ""
    })
  }


  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Credit Your self</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  )
}

export default CreditYourself