import React, { useEffect, useState } from 'react'
import { encryptvalue } from '../../utils/AESEncrypted';
import { BindUserListByRoleId, BindUserRole } from '../../services/Commonapi';
import { GetUserWalletList } from '../../services/ManageCustomer';
import Swal from 'sweetalert2';
import Pagination from '../../utils/Pagination';

function UserWalletBalance() {
  const rowsPerPage = 50;
  const [userRoleList, setUserRoleList] = useState(0);
  const [userList, setUserListValue] = useState([]);
  const [UserWallet, setUserWallet] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTable, setLoadingTable] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingForm, setLoadingForm] = useState(true);
  const [TotalSettledWallet, setTotalSettledWallet] = useState(0);
  const [TotalUnSettledWallet, setTotalUnSettledWallet] = useState(0);
  const [TotalLienWallet, setTotalLienWallet] = useState(0);
  const [TotalLoanWallet, setTotalLoanWallet] = useState(0);
  const [selectedUser, setSelectedUser] = useState(0);

  const BindUserListByRole = async (roleId) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        roleId: roleId
      }));
      const _result = await BindUserListByRoleId({ data: requestdata });
      setUserListValue(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }

  // bind initial data
  useEffect(() => {
    (async () => {
      try {
        fetchInitialData();
      }
      catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setLoadingForm(false);
      }
    })();
  }, []);


  const fetchInitialData = async () => {
    try {
      const data = await BindUserRole();
      setUserRoleList(data);

    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setLoadingForm(false);
    }
  }


  useEffect(() => {
    (async () => {
      BindUserWalletList({ selectedUser: 0, sortBy: 0 });
    })();
  }, [currentPage]);



  const BindUserWalletList = async ({ selectedUser, sortBy }) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        userId: selectedUser,
        pageNo: currentPage,
        pageSize: rowsPerPage,
        sortBy: sortBy
      }));
      const _result = await GetUserWalletList({ data: requestdata });
      if (_result.statuscode === 200 && Array.isArray(_result.data) && _result.data.length > 0) {
        setUserWallet(_result);
        setTotalCount(_result.data[0].TotalRecord);
        var settledBalance = _result.data.reduce((x, item) => x + item.SettledWalletBalance, 0);
        setTotalSettledWallet(settledBalance);
        var unsettledBalance = _result.data.reduce((x, item) => x + item.UnSettledWalletBalance, 0);
        setTotalUnSettledWallet(unsettledBalance);
        var lienbalance = _result.data.reduce((x, item) => x + item.LienBalance, 0);
        setTotalLienWallet(lienbalance);
        var loanbalance = _result.data.reduce((x, item) => x + item.LoanBalance, 0);
        setTotalLoanWallet(loanbalance);
      } else {
        setUserWallet([]);
        setTotalCount(0);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const BindWalletByUserChange = async (e) => {
    const userId = parseInt(e.target.value);
    setSelectedUser(userId);
    BindUserWalletList({ selectedUser: userId, sortBy: 0 });
  }
  const BindWalletBySortBy = async (e) => {
    const sortBy = parseInt(e.target.value);
    BindUserWalletList({ selectedUser: selectedUser, sortBy: sortBy });
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Login History</h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={(e) => BindUserListByRole(parseInt(e.target.value))}
            >
              <option value={0}>Select Role</option>
              {userRoleList && Array.isArray(userRoleList.data) && userRoleList.data.length > 0 ?
                userRoleList.data.filter(x => x.id !== 5 && x.id !== 1 && x.id !== 2 && x.id !== 7).map((item) => (
                  <option key={item.id} value={item.id}>{item.roleName}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )
              }
            </select>
            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={BindWalletByUserChange}
            >
              <option value={0}>Select User</option>
              {userList && Array.isArray(userList.data) && userList.data.length > 0 ?
                userList.data.map((item) => (
                  <option key={item.UserId} value={item.UserId}>{item.NameWithCompanyName}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )}
            </select>
            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={BindWalletBySortBy}
            >
              <option value={0}>Sort By</option>
              <option value="1">Settled High To Min</option>
              <option value="2">Settled Min To High</option>
              <option value="3">UnSettled High To Min</option>
              <option value="4">UnSettled Min To High</option>
            </select>
          </div>
          <hr className="my-10 border-gray-200 dark:border-gray-700" />

          <div>
            {/* <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Bank Account List</h2> */}
            {totalPages ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : ""}
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {['#', 'User Name', 'Role', 'Company Name', 'Mobile No', 'Status', 'Settled Wallet', 'UnSettled Wallet', 'Lien Amount', 'Loan Amount'].map(header => (
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
                        {Array.from({ length: 9 }).map((_, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : UserWallet && Array.isArray(UserWallet.data) && UserWallet.data.length > 0 ? (
                    UserWallet.data.map((row, index) => (
                      <tr key={row.Id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.UserName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.RoleName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.CompanyName}>{row.CompanyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.MobileNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" style={{ color: row.Status.toLowerCase() === "active" ? "green" : "red" }}>{row.Status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.SettledWalletBalance)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.UnSettledWalletBalance)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.LienBalance)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.LoanBalance)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr key={0}>
                      <td colSpan="10" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No data found.</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" colSpan={5}></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(TotalSettledWallet)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(TotalUnSettledWallet)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(TotalLienWallet)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(TotalLoanWallet)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {totalPages ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : ""}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserWalletBalance