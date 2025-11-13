import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BindUserListByRoleId, BindUserRole } from '../../services/Commonapi';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { encryptvalue } from '../../utils/AESEncrypted';
import { CreateUser, GetPackageId, GetUserServiceStatus } from '../../services/ManageCustomer';

var validationError = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  mobileNo: Yup.string().matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number").required("Mobile No is required"),
  email: Yup.string().required("Email is required"),
  userId: Yup.string().required("User Id is required"),
  uplineroleId: Yup.number().typeError("Upline Role is required").moreThan(0, "Please select valid Role").required("Upline Role is required"),
  uplineuserId: Yup.number().typeError("Upline User is required").moreThan(0, "Please select valid User").required("Upline User is required"),
  roleId: Yup.number().typeError("Role is required").moreThan(0, "Please select valid Role").required("Role is required"),
  packageId: Yup.number().typeError("Package is required").moreThan(0, "Please select valid package").required("Package is required"),
  serviceStatus: Yup.number().typeError("Service status is required").moreThan(0, "Please select valid service status").required("Service status is required"),
  emailotp: Yup.bool().oneOf([true], "You must check email").required("Email OTP is required"),
  smsotp: Yup.bool().oneOf([true], "You must check sms").required("SMS OTP is required")
});

function CreateCustomer() {
  const [loadingForm, setLoadingForm] = useState(true);
  const [userRoleList, setUserRoleList] = useState(0);
  const [userList, setUserList] = useState(0);
  const [PackageList, setPackageList] = useState();
  const [UserServiceStatus, setUserServiceStatus] = useState();
  const [firstname, setfirstName] = useState('');
  const [lastname, setlastName] = useState('');
  const [mobileuserId, setMobileUserId] = useState('');
  const [IsCheckedEmailOTP, setIsCheckedEmailOTP] = useState(false);
  const [IsCheckedSMSOTP, setIsCheckedSMSOTP] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationError)
  });

  useEffect(() => {
    (async () => {
      fetchInitialData();
    })();
  }, []);

  //initial data
  const fetchInitialData = async () => {
    setLoadingForm(true);
    try {
      const data = await BindUserRole();
      setUserRoleList(data);


      var _result = await GetUserServiceStatus({});
      setUserServiceStatus(_result);

    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingForm(false);
    }
  };

  //user data
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
  //package list
  const BindPackageList = async (roleId) => {
    try {
      const requestdata = encryptvalue(JSON.stringify({
        roleId: roleId
      }));
      var _result = await GetPackageId({ data: requestdata });
      setPackageList(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }

  const ConvetFirstCharToUpper = async (e, column) => {
    const inputval = e.target.value;
    if (inputval.length > 0) {
      if (column === 'firstname') {
        const capitalizedVal = inputval.charAt(0).toUpperCase() + inputval.slice(1);
        setfirstName(capitalizedVal);
      } else {
        const capitalizedVal = inputval.charAt(0).toUpperCase() + inputval.slice(1);
        setlastName(capitalizedVal);
      }
    } else {
      if (column === 'firstname') {
        setfirstName('');
      }
      else {
        setlastName('');
      }
    }
  }

  const CopyMobiletoUserId = async (e) => {
    const inputval = e.target.value;
    if (inputval.length > 0) {
      setMobileUserId(inputval);
    } else {
      setMobileUserId('');
    }

  }


  const onSubmit = async (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to create user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Create it"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          var requestdata = encryptvalue(JSON.stringify({
            userId: data.userId,
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
          var _result = await CreateUser({ data: requestdata });
          if (_result.statuscode === 200) {
            Swal.fire("success!", _result.message, "success");
            resetFormAndState();
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

  const handleClear = () => {
    resetFormAndState();
  }

  const resetFormAndState = async () => {
    reset({
      firstName: "",
      lastName: "",
      mobileNo: "",
      email: "",
      userId: "",
      uplineroleId: 0,
      uplineuserId: 0,
      roleId: 0,
      packageId: 0,
      serviceStatus: 0,
      emailotp: setIsCheckedEmailOTP(false),
      smsotp: setIsCheckedSMSOTP(false),
      userId: setMobileUserId(""),
      firstname: setfirstName(""),
      lastname: setlastName("")
    })
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Create Customer</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <input
                    type="text"
                    {...register("firstName")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={firstname}
                    onChange={(e) => ConvetFirstCharToUpper(e, 'firstname')}
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
                    {...register("lastName")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={lastname}
                    onChange={(e) => ConvetFirstCharToUpper(e, 'lastname')}
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
                    {...register("mobileNo")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.mobileNo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
                    maxLength={10} minLength={10}
                    onChange={CopyMobiletoUserId}
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
                    {...register("email")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </>
              )}
            </div>


            {/*User Id */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Id</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <input
                    type="text" readOnly
                    {...register("userId")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.userId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={mobileuserId}
                  />
                  {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>}
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
                    {...register("uplineroleId")}
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
                    {...register("uplineuserId")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.uplineuserId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value={0}>Select Upline User</option>
                    {userList && Array.isArray(userList.data) && userList.data.length > 0 ?
                      userList.data.map((item) => (
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
                    {...register("roleId")}
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
                    {...register("packageId")}
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
                    {...register("serviceStatus")}
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
                  <input type='checkbox' {...register("emailotp")} checked={IsCheckedEmailOTP}
                    onChange={(e) => setIsCheckedEmailOTP(e.target.checked)}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.emailotp ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />Email
                  {errors.emailotp && <p className="text-red-500 text-sm mt-1">{errors.emailotp.message}</p>}
                  <input type='checkbox' {...register("smsotp")} checked={IsCheckedSMSOTP}
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

export default CreateCustomer