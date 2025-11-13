import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { BindUserListByRoleId, BindUserRole } from '../../services/Commonapi';
import { encryptvalue } from '../../utils/AESEncrypted';
import { GetActiveUserList, GetAddressByPinCode, GetPackageId, GetUserServiceStatus, ProfileUpload, UpdateUser, UpdateUserKyc, UpdateUserStatus } from '../../services/ManageCustomer';
import Pagination from '../../utils/Pagination';
import { BsEye, BsPencil } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

var validationError = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  mobileNo: Yup.string().matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number").required("Mobile No is required"),
  email: Yup.string().required("Email is required"),
  uplineroleId: Yup.number().typeError("Upline Role is required").moreThan(0, "Please select valid Role").required("Upline Role is required"),
  uplineuserId: Yup.number().typeError("Upline User is required").moreThan(0, "Please select valid User").required("Upline User is required"),
  roleId: Yup.number().typeError("Role is required").moreThan(0, "Please select valid Role").required("Role is required"),
  packageId: Yup.number().typeError("Package is required").moreThan(0, "Please select valid package").required("Package is required"),
  serviceStatus: Yup.number().typeError("Service status is required").moreThan(0, "Please select valid service status").required("Service status is required"),
});

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

function ActiveCustomers() {
  const rowsPerPage = 50;
  const [ActiveUserList, setActiveUserList] = useState();
  const [loadingForm, setLoadingForm] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [userList, setUserListValue] = useState([]);
  const [userRoleList, setUserRoleList] = useState(0);
  const [rowPayoutData, setRowPayoutData] = useState(null);
  const [PackageList, setPackageList] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [IsBalanceModal, setIsBalanceModal] = useState(false);
  const [IsUserEditModal, setIsUserEditModal] = useState(false);
  const [IsUserKycModal, setIsUserKycModal] = useState(false);
  const [SelectedRoleOptions, setSelectedRoleOptions] = useState(0);
  const [SelectedUserId, setSelectedUserId] = useState(0);
  const [editingId, seteditingId] = useState(0);
  const [UserServiceStatus, setUserServiceStatus] = useState();
  const [IsCheckedEmailOTP, setIsCheckedEmailOTP] = useState(false);
  const [IsCheckedSMSOTP, setIsCheckedSMSOTP] = useState(false);
  const [EditeduserList, setEditeduserList] = useState(0);
  const [ImageProfile, setImageProfile] = useState('');
  const [ImageError, setImageError] = useState('');
  const {
    register: registerEditUser,
    handleSubmit: handleSubmitEditUser,
    reset: resetEditUser,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationError)
  });


  const {
    register: registerKyc,
    handleSubmit: handleSubmitKyc,
    reset: resetKyc
  } = useForm();


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

  // bind Active user lit
  useEffect(() => {
    (async () => {
      try {
        BindActiveUserList({ selectedUser: 0, selectedRole: 0, selectedPackage: 0, currentPage: currentPage });
      }
      catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setLoadingForm(false);
        setLoadingTable(false);
      }
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

  const BindUserListByRole = async (roleId) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        roleId: roleId
      }));
      const _result = await BindUserListByRoleId({ data: requestdata });
      setUserListValue(_result);
      BindPackageList(roleId);
      setSelectedRoleOptions(roleId);
      BindActiveUserList({ selectedUser: 0, selectedRole: roleId, selectedPackage: 0, currentPage: currentPage });

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


  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const BindActiveUserList = async ({ selectedUser, selectedRole, selectedPackage, currentPage }) => {
    try {
      var requestdata = encryptvalue(JSON.stringify({
        userId: selectedUser,
        uplineId: 0,
        roleId: selectedRole,
        packageId: selectedPackage,
        pageNo: currentPage,
        pageSize: rowsPerPage
      }));
      const _result = await GetActiveUserList({ data: requestdata });
      if (_result && Array.isArray(_result.data) && _result.data.length > 0) {
        setActiveUserList(_result);
        setTotalCount(_result.data[0].TotalRecord);
      }
      else {
        setActiveUserList([]);
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
    BindActiveUserList({ selectedUser: userId, selectedRole: SelectedRoleOptions, selectedPackage: 0, currentPage: currentPage });
  }

  const PackageChangeFilter = async (e) => {
    const packageId = parseInt(e.target.value);
    BindActiveUserList({ selectedUser: SelectedUserId, selectedRole: SelectedRoleOptions, selectedPackage: packageId, currentPage: currentPage });
  }

  //user data
  const BindDrowndownUserList = async (roleId) => {
    try {
      if (roleId === 0) {
        setEditeduserList([]);
        return;
      }
      var requestdata = encryptvalue(JSON.stringify({
        roleId: roleId
      }));
      const userdataList = await BindUserListByRoleId({ data: requestdata });
      setEditeduserList(userdataList);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  };


  const onSubmit = async (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to update user!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#008000",
      confirmButtonText: "Yes Update it"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          var requestdata = encryptvalue(JSON.stringify({
            id: editingId,
            userId: "",
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            mobileNo: data.mobileNo,
            packageId: data.packageId,
            isSmsOtpEnabled: data.smsotp,
            isEmailOtpEnabled: data.emailotp,
            uplineId: data.uplineuserId,
            uplineRoleId: data.uplineroleId,
            roleId: data.roleId,
            userServiceStatus: data.serviceStatus
          }));
          var _result = await UpdateUser({
            data: requestdata
          });
          if (_result.statuscode === 200) {
            Swal.fire("success!", _result.message, "success");
            setIsUserEditModal(false);
            seteditingId(0);
            BindActiveUserList({ selectedUser: 0, selectedRole: 0, selectedPackage: 0, currentPage: currentPage });
          } else {
            Swal.fire("Error!", _result.message, "error");
          }
        } catch (err) {
          Swal.fire("warning!", err.message, "warning");
        } finally {

        }
      }
    });
  }

  const onSubmitKyc = async (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to update kyc!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes Update it"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          var requestdata = encryptvalue(JSON.stringify({
            id: editingId,
            companyName: data.firmname,
            contactPerson: data.contactperson,
            panNumber: data.panno,
            aadharNumber: data.aadharno,
            address: data.address,
            pinCode: data.pincode,
            state: data.state,
            city: data.city,
            district: data.district,
            accountNumber: data.accountno,
            ifscCode: data.ifsc,
            profile: ImageProfile
          }));
          var _result = await UpdateUserKyc({ data: requestdata });
          if (_result.statuscode === 200) {
            Swal.fire("success!", _result.message, "success");
            setIsUserKycModal(false);
            seteditingId(0);
            BindActiveUserList({ selectedUser: 0, selectedRole: 0, selectedPackage: 0, currentPage: currentPage });
          } else {
            Swal.fire("Error!", _result.message, "error");
          }
        } catch (err) {
          Swal.fire("warning!", err.message, "warning");
        } finally {

        }
      }
    });
  }

  const handleEdit = async (row) => {
    seteditingId(row.Id);
    BindDrowndownUserList(row.UplineRoleId);
    BindPackageList(row.RoleId);
    setIsCheckedSMSOTP(row.IsSmsOtpEnabled);
    setIsCheckedEmailOTP(row.IsEmailOtpEnabled);
    setTimeout(() => {
      resetEditUser({
        firstName: row.FirstName,
        lastName: row.LastName,
        mobileNo: row.MobileNo,
        email: row.Email,
        uplineroleId: row.UplineRoleId,
        uplineuserId: row.UplineUserId,
        roleId: row.RoleId,
        serviceStatus: row.UserServiceStatus,
        packageId: row.PackageId,
      });
      setIsUserEditModal(true);
    }, 200);
  }

  const handleKyc = async (row) => {
    seteditingId(row.Id);
    resetKyc({
      roletype: row.RoleName,
      accountstatus: row.UserStatus,
      firmname: row.CompanyName,
      contactperson: row.ContactPersonName,
      panno: row.PanNo,
      aadharno: row.AadharNo,
      mobileno: row.MobileNo,
      emailid: row.Email,
      address: row.Address,
      pincode: row.PinCode,
      state: row.State,
      city: row.City,
      district: row.District,
      accountno: row.AccountNumber,
      ifsc: row.IfscCode
    });
    setIsUserKycModal(true);
  }

  const BindAddressByPincode = async (e) => {
    try {
      const pincode = e.target.value;
      const pinlen = pincode.length;
      if (pinlen === 6) {
        var requestdata = encryptvalue(JSON.stringify({
          pinCode: parseInt(e.target.value)
        }));
        var _result = await GetAddressByPinCode({ data: requestdata });
        if (_result.statuscode === 200) {
          resetKyc({
            state: _result.data.state,
            city: _result.data.city,
            district: _result.data.district
          });
        } else {
          Swal.fire("Error!", _result.message, "error");
        }
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingForm(false);
    }
  }

  const UploadUserProfile = async (e) => {
    setLoadingForm(true);
    try {
      const files = e.target.files[0];
      const formdata = new FormData();
      formdata.append("formFile", files);
      const _result = await ProfileUpload(formdata);
      if (_result.statuscode === 200) {
        setImageProfile(_result.data);
        setImageError('');
      } else {
        setImageError(_result.message);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingForm(false);
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
        BindActiveUserList({ selectedUser: 0, selectedRole: 0, selectedPackage: 0, currentPage: currentPage });
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
          <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Active User List</h1>

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
                    {['#', 'Name', 'Company Name', 'Role', 'Parent Name', 'Package', 'Mobile No', 'Email', 'Email OTP', 'SMS OTP', 'Status', 'Wallet', 'Edit', 'KYC'].map(header => (
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
                        {Array.from({ length: 14 }).map((_, colIndex) => (
                          <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : ActiveUserList && Array.isArray(ActiveUserList.data) && ActiveUserList.data.length > 0 ? (
                    ActiveUserList.data.map((row, index) => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <a href='#' onClick={() => handleEdit(row)} ><BsPencil size={20} color='black' /></a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <a href='#' onClick={() => handleKyc(row)} ><BsEye size={20} color='black' /></a>
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

      {/* Edit User Start */}
      <Modal isOpen={IsUserEditModal} onClose={() => setIsUserEditModal(false)}>
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Edit Customer</h1>
        <form onSubmit={handleSubmitEditUser(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  type="text"
                  {...registerEditUser("firstName")}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                // value={firstname}
                // onChange={(e) => ConvetFirstCharToUpper(e, 'firstname')}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </>
            )}
          </div>
          {/*last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  type="text"
                  {...registerEditUser("lastName")}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                // value={lastname}
                // onChange={(e) => ConvetFirstCharToUpper(e, 'lastname')}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </>
            )}
          </div>

          {/*Mobile no */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile No</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  type="text"
                  {...registerEditUser("mobileNo")}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.mobileNo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                  maxLength={10} minLength={10}
                // onChange={CopyMobiletoUserId}
                />
                {errors.mobileNo && <p className="text-red-500 text-sm mt-1">{errors.mobileNo.message}</p>}
              </>
            )}
          </div>

          {/*Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  type="email"
                  {...registerEditUser("email")}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </>
            )}
          </div>

          {/* Upline Role Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Upline Role</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <select
                  {...registerEditUser("uplineroleId")}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.uplineroleId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  onChange={(e) => BindDrowndownUserList(parseInt(e.target.value))}
                >
                  <option value={0}>Select Upline Role</option>
                  {userRoleList && Array.isArray(userRoleList.data) && userRoleList.data.length > 0 ?
                    userRoleList.data.filter(x => x.id === 2 || x.id === 3).map((item) => (
                      <option key={item.id} value={item.id}>{item.roleName}</option>
                    )) : (
                      <option disabled>No Data Found</option>
                    )
                  }
                </select>
                {errors.uplineroleId && <p className="text-red-500 text-sm mt-1">{errors.uplineroleId.message}</p>}
              </>
            )}
          </div>

          {/* Upline User Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Upline User</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <select
                  {...registerEditUser("uplineuserId")}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.uplineuserId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value={0}>Select Upline User</option>
                  {EditeduserList && Array.isArray(EditeduserList.data) && EditeduserList.data.length > 0 ?
                    EditeduserList.data.map((item) => (
                      <option key={item.UserId} value={item.UserId}>{item.NameWithCompanyName}</option>
                    )) : (
                      <option disabled>No Data Found</option>
                    )
                  }
                </select>
                {errors.uplineuserId && <p className="text-red-500 text-sm mt-1">{errors.uplineuserId.message}</p>}
              </>
            )}
          </div>

          {/* Role Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Role</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <select
                  {...registerEditUser("roleId")}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.roleId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  onChange={(e) => BindPackageList(parseInt(e.target.value))}
                >
                  <option value={0}>Select Role</option>
                  {userRoleList && Array.isArray(userRoleList.data) && userRoleList.data.length > 0 ?
                    userRoleList.data.filter(x => x.id === 3 || x.id === 4).map((item) => (
                      <option key={item.id} value={item.id}>{item.roleName}</option>
                    )) : (
                      <option disabled>No Data Found</option>
                    )
                  }
                </select>
                {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId.message}</p>}
              </>
            )}
          </div>

          {/* Package Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Package</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <select
                  {...registerEditUser("packageId")}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.packageId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value={0}>Select Package</option>
                  {PackageList && Array.isArray(PackageList.data) && PackageList.data.length > 0 ?
                    PackageList.data.map((item) => (
                      <option key={item.Id} value={item.Id}>{item.Name}</option>
                    )) : (
                      <option disabled>No Data Found</option>
                    )
                  }
                </select>
                {errors.packageId && <p className="text-red-500 text-sm mt-1">{errors.packageId.message}</p>}
              </>
            )}
          </div>
          {/* Service Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Service Status</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <select
                  {...registerEditUser("serviceStatus")}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.serviceStatus ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value={0}>Select Service Status</option>
                  {UserServiceStatus && Array.isArray(UserServiceStatus.data) && UserServiceStatus.data.length > 0 ?
                    UserServiceStatus.data.map((item) => (
                      <option key={item.Id} value={item.Id}>{item.Name}</option>
                    )) : (
                      <option disabled>No Data Found</option>
                    )
                  }
                </select>
                {errors.serviceStatus && <p className="text-red-500 text-sm mt-1">{errors.serviceStatus.message}</p>}
              </>
            )}
          </div>

          {/* Message Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">OTP Service</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input type='checkbox' {...registerEditUser("emailotp")} checked={IsCheckedEmailOTP}
                  onChange={(e) => setIsCheckedEmailOTP(e.target.checked)}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.emailotp ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />Email
                {errors.emailotp && <p className="text-red-500 text-sm mt-1">{errors.emailotp.message}</p>}
                <input type='checkbox' {...registerEditUser("smsotp")} checked={IsCheckedSMSOTP}
                  onChange={(e) => setIsCheckedSMSOTP(e.target.checked)}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.smsotp ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                /> SMS
                {errors.smsotp && <p className="text-red-500 text-sm mt-1">{errors.smsotp.message}</p>}
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </Modal>
      {/* Edit User End */}

      {/* KYC User Start */}
      <Modal isOpen={IsUserKycModal} onClose={() => setIsUserKycModal(false)}>
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">User KYC</h1>
        <form onSubmit={handleSubmitKyc(onSubmitKyc)} className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Role Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Type</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("roletype")}
                  type="text"
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  readOnly
                />
              </>
            )}
          </div>
          {/* Account Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Status</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("accountstatus")}
                  type="text"
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  readOnly
                />
              </>
            )}
          </div>

          {/* Firm Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Firm Name</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("firmname")}
                  type="text"
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </>
            )}
          </div>

          {/* Contact person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Person</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("contactperson")}
                  type="text"
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </>
            )}
          </div>

          {/* Pan Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pan Number</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("panno")}
                  type="text"
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </>
            )}
          </div>

          {/* Aadhar Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aadhar Number</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("aadharno")}
                  type="text"
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("mobileno")}
                  readOnly
                  type="text"
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </>
            )}
          </div>

          {/* Email id */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Id</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("emailid")}
                  readOnly
                  type="text"
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </>
            )}
          </div>
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("address")}
                  type="text"
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </>
            )}
          </div>

          {/* PinCode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PinCode</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("pincode")}
                  type="text"
                  onChange={BindAddressByPincode}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  minLength={6} maxLength={6}
                />
              </>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("state")}
                  type="text" readOnly
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("city")}
                  type="text" readOnly
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </>
            )}
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("district")}
                  type="text" readOnly
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </>
            )}
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Number</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("accountno")}
                  type="text"
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </>
            )}
          </div>

          {/* IFSC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IFSC</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("ifsc")}
                  type="text"
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </>
            )}
          </div>

          {/* User Profile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Profile</label>
            {loadingForm ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
              <>
                <input
                  {...registerKyc("profile")}
                  type="file"
                  onChange={UploadUserProfile}
                  className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {ImageError ? <p style={{ color: 'red' }}>{ImageError}</p> : ""}
              </>
            )}
          </div>
          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="submit" disabled={loadingForm}
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
            >
              {loadingForm ? 'Loading...' : 'Update'}
            </button>
          </div>
        </form>
      </Modal>
      {/* KYC User End */}
    </div>
  )
}

export default ActiveCustomers