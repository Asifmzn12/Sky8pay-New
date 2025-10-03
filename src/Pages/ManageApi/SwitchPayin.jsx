import React, { useEffect, useState } from 'react'
import { GetSwitchPayin } from '../../services/ManageAPI';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';

const SwitchPayin = () => {
  const [loadingForm, setloadingForm] = useState(true);
  const [switchPayinList, setswitchPayinList] = useState([]);


  const {
    register,
    handleSubmit
  } = useForm({

  });

  // bind initial data
  useEffect(() => {
    (async () => {
      try {
        SwitchPayinList();
      }
      catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setloadingForm(false);
      }
    })();
  }, []);

  const SwitchPayinList = async () => {
    try {
      const _result = await GetSwitchPayin({});
      setswitchPayinList(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }

  const onChangeIsChecked=(e)=>{
    console.log(e.target.checked);
    const dd=document.querySelector("input[type='checkbox']");
    console.log(dd);
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Switch Payin</h1>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors">
                Credit
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-colors">
                Debit
              </button>
            </div>
            {/* Input Fields */}
            <div>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  {switchPayinList && Array.isArray(switchPayinList.data) && switchPayinList.data.length > 0 ?
                    switchPayinList.data.map((item) => (                      
                        <div>
                          <div>
                            <label> {item.payinName}</label>
                          </div>
                          <label className="inline-flex items-center cursor-pointer">                           
                            {item.lstPayoutApiList?.[0]?.isInstantSettlement ?
                              <input type="checkbox" value={item.lstPayoutApiList?.[0]?.id} checked onChange={onChangeIsChecked} className="sr-only peer" {...register(item.lstPayoutApiList?.[0]?.id)} /> :
                              <input type="checkbox" value={item.lstPayoutApiList?.[0]?.id} onChange={onChangeIsChecked} className="sr-only peer" {...register(item.lstPayoutApiList?.[0]?.id)} />
                            }
                            <div onChange={onChangeIsChecked} className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{item.lstPayoutApiList?.[0]?.payoutName}</span>
                          </label>
                          </div>
                    )) : (
                      <span></span>
                    )}
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>

  )
}

export default SwitchPayin