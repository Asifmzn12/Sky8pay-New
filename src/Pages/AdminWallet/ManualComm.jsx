import React, { useEffect, useState } from 'react'
import { GetManualCommission } from '../../services/AdminWallet';

const ManualComm = () => {

  const [loadingTable, setLoadingTable] = useState(true);
  const [ManualCommission, setManualCommission] = useState();
  const [TotalSurcharge, setTotalSurcharge] = useState(0);
  const [TotalGst, setTotalTotalGst] = useState(0);
  const [TotalCharge, setTotalCharge] = useState(0);
  const [ReceivedAmt, setReceivedAmt] = useState(0);
  const [RemainBalance, setRemainBalance] = useState(0);

  useEffect(() => {
    (async () => {
      BindManualCommission();
    })();
  }, []);

  const BindManualCommission = async () => {
    try {
      const _result = await GetManualCommission({});
      setManualCommission(_result);
      var totalsur = _result.data.reduce((x, item) => x + item.TotalSurcharge, 0);
      setTotalSurcharge(totalsur);
      var totalgst = _result.data.reduce((x, item) => x + item.TotalGst, 0);
      setTotalTotalGst(totalgst);
      var totalcharge = _result.data.reduce((x, item) => x + item.TotalCharges, 0);
      setTotalCharge(totalcharge);
      var receivedamt = _result.data.reduce((x, item) => x + item.TotalDeduct, 0);
      setReceivedAmt(receivedamt);
      var remainbal = _result.data.reduce((x, item) => x + item.RemainingBalance, 0);
      setRemainBalance(remainbal);
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
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Manual Commission</h1>
          <hr className="my-10 border-gray-200 dark:border-gray-700" />
          <div>
            {/* <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Bank Account List</h2> */}
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {['#', 'User Name', 'Company Name', 'Mobile No', 'API Name', 'Total Surcharge', 'Total GST', 'Total Charge', 'Received Amt', 'Remain Balance'].map(header => (
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
                        {Array.from({ length: 10 }).map((_, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : ManualCommission && Array.isArray(ManualCommission.data) && ManualCommission.data.length > 0 ? (
                    ManualCommission.data.map((row, index) => (
                      <tr key={index + 1}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CompanyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.MobileNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ApiName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.TotalSurcharge)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.TotalGst)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.TotalCharges)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.TotalDeduct)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.RemainingBalance)}</td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" colSpan={4}></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Total Amount</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(TotalSurcharge)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(TotalGst)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(TotalCharge)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(ReceivedAmt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(RemainBalance)}</td>
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

export default ManualComm