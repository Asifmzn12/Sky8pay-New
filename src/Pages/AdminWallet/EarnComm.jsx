import React, { use, useEffect, useState } from 'react'
import { BindUserListByRoleId, BindUserRole } from '../../services/Commonapi';
import { encryptvalue } from '../../utils/AESEncrypted';
import { GetLiveEarnCommission } from '../../services/AdminWallet';
import Swal from 'sweetalert2';

const EarnComm = () => {
  const [loadingTable, setLoadingTable] = useState(false);
  const [userRoleList, setUserRoleList] = useState(0);
  const [userList, setUserList] = useState([]);
  const [earnComList, setEarnCommission] = useState();
  const [NoofTotal, setNoofTotal] = useState(0);
  const [TotalAmount, setTotalAmount] = useState(0);
  const [RtDebitAmount, setRtDebitAmount] = useState(0);
  const [RtGstDebitAmount, setRtGstDebitAmount] = useState(0);
  const [AdCalcCommission, setAdCalcCommission] = useState(0);
  const [AdCalcTds, setAdCalcTds] = useState(0);
  const [ApiCom, setApiCom] = useState(0);
  const [ApiGst, setApiGst] = useState(0);
  const [TotalApiCom, setTotalApiCom] = useState(0);
  const [AdminCom, setAdminCom] = useState(0);
  const [GstCom, setGstCom] = useState(0);
  const [TotalCredit, setTotalCredit] = useState(0);
  const [selectedroleId, setSelectedRoleId] = useState(0);
  const [selecteduserId, setSelecteduserId] = useState(0);

  useEffect(() => {
    (async () => {
      BindDrowndownUserRole();
    })();
  }, []);

  const BindDrowndownUserRole = async () => {
    try {
      const data = await BindUserRole({data:{}});
      setUserRoleList(data);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }
  const BindDrowndownUserList = async (roleId) => {
    try {
      if (roleId === 0) {
        setUserList([]);
        return;
      }
      var requestdata = encryptvalue(JSON.stringify({
        roleId: roleId
      }));
      const userdataList = await BindUserListByRoleId({ data: requestdata });
      setUserList(userdataList);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  };

  const BindLiveEarnCommission = async (roleId, userId) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        userId: userId,
        roleId: roleId
      }));
      const _result = await GetLiveEarnCommission({ data: requestdata });
      setEarnCommission(_result);
      const totalNooftxn = _result.data.reduce((x, item) => x + item.noOfCount, 0);
      setNoofTotal(totalNooftxn);
      const tatalamt = _result.data.reduce((x, item) => x + item.totalAmount, 0);
      setTotalAmount(tatalamt);
      const rtdebitamt = _result.data.reduce((x, item) => x + item.rtDeductAmt, 0);
      setRtDebitAmount(rtdebitamt);
      const rtGstDebit = _result.data.reduce((x, item) => x + item.rtGstDebit, 0);
      setRtGstDebitAmount(rtGstDebit);
      const adCreditAmount = _result.data.reduce((x, item) => x + item.adCreditAmount, 0);
      setAdCalcCommission(adCreditAmount);
      const adTdsDebit = _result.data.reduce((x, item) => x + item.adTdsDebit, 0);
      setAdCalcTds(adTdsDebit);
      const apiDebitAmount = _result.data.reduce((x, item) => x + item.apiDebitAmount, 0);
      setApiCom(apiDebitAmount);
      const apiGstDebit = _result.data.reduce((x, item) => x + item.apiGstDebit, 0);
      setApiGst(apiGstDebit);
      const totalApiCom = _result.data.reduce((x, item) => x + item.apiDebitAmount + item.apiGstDebit, 0);
      setTotalApiCom(totalApiCom);
      const arCreditAmount = _result.data.reduce((x, item) => x + item.arCreditAmount, 0);
      setAdminCom(arCreditAmount);
      const gstCom = _result.data.reduce((x, item) => x + item.rtGstDebit - item.apiGstDebit, 0);
      setGstCom(gstCom);
      const totalCredit = _result.data.reduce((x, item) => x + item.arCreditAmount + (item.rtGstDebit - item.apiGstDebit) + item.adTdsDebit, 0);
      setTotalCredit(totalCredit);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }

  const FilterLiveEarnCommission = async (userId) => {
    setLoadingTable(true);
    BindLiveEarnCommission(selectedroleId, userId);
  }

  const BindUser = async (roleId) => {
    setSelectedRoleId(roleId);
    BindDrowndownUserList(roleId);
  }


  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Admin Profit</h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={(e) => BindUser(parseInt(e.target.value))}
            >
              <option value={0}>Select Role</option>
              {userRoleList && Array.isArray(userRoleList.data) && userRoleList.data.length > 0 ?
                userRoleList.data.filter(x => x.id === 3 || x.id === 2).map((item) => (
                  <option key={item.id} value={item.id}>{item.roleName}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )
              }
            </select>
            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={(e) => FilterLiveEarnCommission(parseInt(e.target.value))}
            >
              <option value={0}>Select User</option>
              {userList && Array.isArray(userList.data) && userList.data.length > 0 ?
                userList.data.map((item) => (
                  <option key={item.UserId} value={item.UserId}>{item.NameWithCompanyName}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )}
            </select>
            {/* <input type="text" placeholder='Search' className="block w-full sm:w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white" />
            <button
              className="py-2 px-4 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => BindAdminProfit({ dateRange, selectedApi })}
            >
              Search
            </button> */}
          </div>
          <hr className="my-10 border-gray-200 dark:border-gray-700" />

          <div>
            {/* <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Bank Account List</h2> */}
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {['#', 'User Name', 'API Name', 'Slab', 'No Of Txn', 'Total Amount', 'RT Sur.', 'RT Type', 'RT GST', 'RT Debit Amt', 'GST Debit Amt', 'AD Sur.', 'AD Type', 'AD GST', 'AD TDS', 'AD Diff', 'AD Comm Cal', 'AD TDS Cal', 'API Charge', 'API Type', 'API GST', 'Admin Diff', 'API Comm', 'API GST Val', 'Total API Com', 'Admin Com', 'GST Com', 'Total Credit'].map(header => (
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
                        {Array.from({ length: 28 }).map((_, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : earnComList && Array.isArray(earnComList.data) && earnComList.data.length > 0 ? (
                    earnComList.data.map((row, index) => (
                      <tr key={index + 1}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.compayName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.apiName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{parseFloat(row.slab)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.noOfCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.totalAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.surchargeValue)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.surchargeValueType ? "Per" : "Rs"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.gst)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.rtDeductAmt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.rtGstDebit)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.adSurchargeValue)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.adSurchargeValueType ? "Per" : "Rs"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.adGST)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.adTDS)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.adDifferenceCom)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.adCreditAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.adTdsDebit)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.arSurchargeValue)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.arSurchargeValueType ? "Per" : "Rs"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.argst)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.arDifferenceCom)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.apiDebitAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.apiGstDebit)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.apiDebitAmount + row.apiGstDebit)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.arCreditAmount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.rtGstDebit - row.apiGstDebit)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.arCreditAmount + (row.rtGstDebit - row.apiGstDebit) + row.adTdsDebit)}</td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" colSpan={3}></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{NoofTotal}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" colSpan={4}>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(TotalAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(RtDebitAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" colSpan={6}>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(RtGstDebitAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(AdCalcCommission)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" colSpan={5}>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(AdCalcTds)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(ApiCom)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(ApiGst)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(TotalApiCom)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(AdminCom)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(GstCom)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(TotalCredit)}</td>
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

export default EarnComm