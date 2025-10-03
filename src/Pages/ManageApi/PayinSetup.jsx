import React, { useEffect, useState } from 'react'
import { GetInstantPayinSetup } from '../../services/ManageAPI';
import Pagination from '../../utils/Pagination';
import { BindAPIListByServiceName } from '../../services/Commonapi';

const PayinSetup = () => {
  const rowsPerPage = 50;
  const [ApiMasterByServiceName, setApiMasterByServiceName] = useState([]);
  const [loadingForm, setloadingForm] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [payinSetup, setPayinSetup] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

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
          const _apiresult = await BindAPIListByServiceName({ serviceName: "Payin" });
          setApiMasterByServiceName(_apiresult);
        } catch (err) {
          Swal.fire("warning!", err.message, "warning");
        }
        finally {
          setloadingForm(false);
        }
      }
    

  // bind data
  useEffect(() => {
    (async () => {
      try {
        BindGetPayinsetup({ apiId: 0, PageNo: currentPage });
      }
      catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setLoadingTable(false);
      }
    })();
  }, []);


  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const BindGetPayinsetup = async ({ apiId: apiId, PageNo: PageNo }) => {
    setLoadingTable(true);
    try {
      const _result = await GetInstantPayinSetup({
        id: apiId, pageNo: PageNo, pageSize: rowsPerPage
      });
      if (_result && Array.isArray(_result.data) && _result.data.length > 0) {
        setPayinSetup(_result);
        setTotalCount(_result.data[0].TotalRecord);
      } else {
        setPayinSetup([]);
        setTotalCount(0);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }

  const onChangeApi = (e) => {
    const apiId = parseInt(e.target.value);
    BindGetPayinsetup({ apiId: apiId, PageNo: currentPage });
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
              <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Payin Setup</h1>
              <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <select
                  className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  onChange={onChangeApi}
                >
                  <option value={0}>Select API</option>
                  {ApiMasterByServiceName && Array.isArray(ApiMasterByServiceName.data) && ApiMasterByServiceName.data.length > 0 ?
                    ApiMasterByServiceName.data.map((item) => (
                      <option key={item.ApiId} value={item.ApiId}>{item.ApiName}</option>
                    )) : (
                      <option disabled>No Data Found</option>
                    )}
                </select>
              </div>
              <hr className="my-10 border-gray-200 dark:border-gray-700" />

              {/* Table Section */}
              <div>
                {totalPages ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : ""}
                <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {['#', 'API Name', 'Payout Name', 'Status', 'Instant-Settlement', 'Is Intent Enabled', 'Is  QR Enabled'].map(header => (
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
                            {Array.from({ length: 7 }).map((_, colIndex) => (
                              <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : payinSetup && Array.isArray(payinSetup.data) && payinSetup.data.length > 0 ? (
                        payinSetup.data.map((row, index) => (
                          <tr key={index+1}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.PayinApiName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.PayoutName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Status}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.IsInstantSettlement ? "True" : "False"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.IsIntentEnabled ? "True" : "False"}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.IsQrEnabled ? "True" : "False"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr key={0}>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No bank details found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {totalPages ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayinSetup