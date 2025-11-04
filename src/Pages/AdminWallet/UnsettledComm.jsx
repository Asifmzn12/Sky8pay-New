import React, { useEffect, useState } from 'react'
import { GetApiWiseCommisson } from '../../services/AdminWallet';

const UnsettledComm = () => {
  const [loadingTable, setLoadingTable] = useState(true);
  const [ApiwiseComm, setApiwiseComm] = useState();
  const [TotalEarning, setTotalEarning] = useState(0);
  const [TotalWithDrawan, setTotalWithDrawan] = useState(0);
  const [TotalRemaing, setTotalRemaing] = useState(0);

  useEffect(() => {
    (async () => {
      BindApiWisecomm();
    })();
  }, [])

  const BindApiWisecomm = async () => {
    try {
      var _result = await GetApiWiseCommisson({});
      setApiwiseComm(_result);
      const totalEarncom = _result.data.reduce((x, item) => x + item.CreditedAmount, 0);
      setTotalEarning(totalEarncom);
      const withdrawnEarncom = _result.data.reduce((x, item) => x + item.DebitedAmount, 0);
      setTotalWithDrawan(withdrawnEarncom);
      const totalremaincom = _result.data.reduce((x, item) => x + item.TotalPendingAmount, 0);
      setTotalRemaing(totalremaincom);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">API Wise Commission</h1>
          <hr className="my-10 border-gray-200 dark:border-gray-700" />
          <div>
            {/* <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Bank Account List</h2> */}
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {['#', 'Service Name', 'Earnings', 'Withdrawn', 'Available Amount', 'Updated Date&Time'].map(header => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loadingTable ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <tr key={index}>
                        {Array.from({ length: 6 }).map((_, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : ApiwiseComm && Array.isArray(ApiwiseComm.data) && ApiwiseComm.data.length > 0 ? (
                    ApiwiseComm.data.map((row, index) => (
                      <tr key={index + 1}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ApiName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.CreditedAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.DebitedAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.TotalPendingAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CreatedDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr key={0}>
                      <td colSpan="17" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No data found.</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" colSpan={1}></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Total Amount</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(TotalEarning)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(TotalWithDrawan)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(TotalRemaing)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default UnsettledComm