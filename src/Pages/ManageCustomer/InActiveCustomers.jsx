import React, { useEffect, useState } from 'react'
import { encryptvalue } from '../../utils/AESEncrypted';
import { GetInActiveUserList, GetPackageId, GetUserServiceStatus, UpdateUserStatus } from '../../services/ManageCustomer';
import Swal from 'sweetalert2';
import { BindInActiveUserListByRoleId, BindUserListByRoleId, BindUserRole } from '../../services/Commonapi';
import Pagination from '../../utils/Pagination';
import { BsEye } from 'react-icons/bs';


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

function InActiveCustomers() {
  const rowsPerPage = 50;
  const [InActiveUserList, setInActiveUserList] = useState();
  const [loadingTable, setLoadingTable] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [userRoleList, setUserRoleList] = useState(0);
  const [SelectedUserId, setSelectedUserId] = useState(0);
  const [userList, setUserListValue] = useState([]);
  const [PackageList, setPackageList] = useState();
  const [IsBalanceModal, setIsBalanceModal] = useState(false);
  const [rowPayoutData, setRowPayoutData] = useState(null);
  const [UserServiceStatus, setUserServiceStatus] = useState();
  const [loadingForm, setLoadingForm] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [SelectedRoleOptions, setSelectedRoleOptions] = useState(0);
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

  useEffect(() => {
    (async () => {
      BindInActiveUserList({ selectedUser: 0, selectedRole: 0, selectedPackage: 0, currentPage: currentPage });
    })();
  }, [currentPage]);


  const fetchInitialData = async () => {
    try {
      const data = await BindUserRole();
      setUserRoleList(data);

      var _result = await GetUserServiceStatus({});
      setUserServiceStatus(_result);

    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setLoadingForm(false);
    }
  }

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const BindInActiveUserList = async ({ selectedUser, selectedRole, selectedPackage, currentPage }) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        userId: selectedUser,
        uplineId: 0,
        roleId: selectedRole,
        packageId: selectedPackage,
        pageNo: currentPage,
        pageSize: rowsPerPage
      }));
      const _result = await GetInActiveUserList({ data: requestdata });
      if (_result && Array.isArray(_result.data) && _result.data.length > 0) {
        setInActiveUserList(_result);
        setTotalCount(_result.data[0].TotalRecord);
      }
      else {
        setInActiveUserList([]);
        setTotalCount(0);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
      setLoadingForm(false);
    }
  }

  const UserChangeFilter = async (e) => {
    const userId = parseInt(e.target.value);
    setSelectedUserId(userId);
    BindInActiveUserList({ selectedUser: userId, selectedRole: SelectedRoleOptions, selectedPackage: 0, currentPage: currentPage });
  }

  const PackageChangeFilter = async (e) => {
    const packageId = parseInt(e.target.value);
    BindInActiveUserList({ selectedUser: SelectedUserId, selectedRole: SelectedRoleOptions, selectedPackage: packageId, currentPage: currentPage });
  }

  const BindUserListByRole = async (roleId) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        roleId: roleId
      }));
      const _result = await BindInActiveUserListByRoleId({ data: requestdata });
      setUserListValue(_result);
      BindPackageList(roleId);
      setSelectedRoleOptions(roleId);
      BindInActiveUserList({ selectedUser: 0, selectedRole: roleId, selectedPackage: 0, currentPage: currentPage });

    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }

  const BindPackageList = async (roleId) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        roleId: roleId
      }));
      var _result = await GetPackageId({ data: requestdata });
      setPackageList(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }

  const ChangeUserStatus = async (id) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        id: id
      }));
      var _result = await UpdateUserStatus({ data: requestdata });
      if (_result.statuscode === 200) {
        Swal.fire("success!", _result.message, "success");
        BindInActiveUserList({ selectedUser: 0, selectedRole: 0, selectedPackage: 0, currentPage: currentPage });
      } else {
        Swal.fire("Error!", _result.message, "error");
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
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">InActive User List</h1>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={(e) => BindUserListByRole(parseInt(e.target.value))}
            >
              <option value={0}>Select Role</option>
              {userRoleList && Array.isArray(userRoleList.data) && userRoleList.data.length > 0 ?
                userRoleList.data.filter(x => x.id !== 1 && x.id !== 2 && x.id !== 7).map((item) => (
                  <option key={item.id} value={item.id}>{item.roleName}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )
              }
            </select>
            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={UserChangeFilter}
            >
              <option value={0}>Select User</option>
              {userList && Array.isArray(userList.data) && userList.data.length > 0 ?
                userList.data.filter(x => x.UserId !== 100 && x.UserId !== 101).map((item) => (
                  <option key={item.UserId} value={item.UserId}>{item.NameWithCompanyName}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )}
            </select>

            {/* Package select */}
            <select
              className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onChange={PackageChangeFilter}
            >
              <option value={0}>Select Package</option>
              {PackageList && Array.isArray(PackageList.data) && PackageList.data.length > 0 ?
                PackageList.data.map((item) => (
                  <option key={item.Id} value={item.Id}>{item.Name}</option>
                )) : (
                  <option disabled>No Data Found</option>
                )}
            </select>
            {/* <input type="text" placeholder='Search' className="block w-full sm:w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white" />
            <button              
              className="py-2 px-4 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
              Search
            </button> */}
          </div>
          <hr className="my-10 border-gray-200 dark:border-gray-700" />

          <div>
            {/* <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Bank Account List</h2> */}
            {totalPages ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : ""}
            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {['#', 'Name', 'Company Name', 'Role', 'Parent Name', 'Package', 'Mobile No', 'Email', 'Email OTP', 'SMS OTP', 'Status', 'Wallet'].map(header => (
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
                        {Array.from({ length: 12 }).map((_, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : InActiveUserList && Array.isArray(InActiveUserList.data) && InActiveUserList.data.length > 0 ? (
                    InActiveUserList.data.map((row, index) => (
                      <tr key={row.Id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.CompanyName}>{row.CompanyName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.RoleName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ParentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.PackageName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.MobileNo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.Email}>{row.Email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" style={{ color: row.IsEmailOtpEnabled ? "green" : "red" }}>{row.IsEmailOtpEnabled ? "Enable" : "Disable"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" style={{ color: row.IsSmsOtpEnabled ? "green" : "red" }}>{row.IsSmsOtpEnabled ? "Enable" : "Disable"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <a href='#' onClick={() => ChangeUserStatus(row.Id)}>
                            {row.Status}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <a href='#' onClick={() => { setRowPayoutData(row); setIsBalanceModal(true) }} ><BsEye size={20} color='black' /></a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={0}>
                      <td colSpan="15" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No data found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalPages ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : ""}
          </div>
        </div>
      </div>
      {/* Balance start */}
      <Modal isOpen={IsBalanceModal} onClose={() => setIsBalanceModal(false)}>
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Wallet Details</h2>
        <div key={1}>
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Settled Balance
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(rowPayoutData?.SettledWalletBalance)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Unsettled Balance
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(rowPayoutData?.UnSettledWalletBalance)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Lien Balance
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(rowPayoutData?.LienBalance)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  Loan Balance
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(rowPayoutData?.LoanAmount)}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </Modal>
      {/* Balance end */}
    </div >
  )
}

export default InActiveCustomers