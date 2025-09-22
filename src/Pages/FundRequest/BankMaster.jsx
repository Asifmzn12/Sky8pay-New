import React, { useEffect, useState } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import * as Yup from "yup";
import Swal from 'sweetalert2';

// Mock API functions to simulate data fetching
const mockBindUserRole = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    data: [
      { id: 3, roleName: "Manager" },
      { id: 4, roleName: "User" },
      { id: 5, roleName: "Guest" }
    ]
  };
};

const mockBindUserListByRoleId = async (payload) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const users = {
    3: [{ UserId: 101, NameWithCompanyName: "John Doe - Company A" }],
    4: [{ UserId: 102, NameWithCompanyName: "Jane Smith - Company B" }],
    5: [{ UserId: 103, NameWithCompanyName: "Guest User" }]
  };
  return {
    data: users[payload.roleId] || []
  };
};

const mockBindUserBankList = async (payload) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    data: [
      { id: 1, UserId: 101, RoleId: 3, AccountHolderName: "John Doe", BankName: "State Bank of India", AccountNo: "1234567890", IfscCode: "SBIN000123", UpiId: "johndoe@sbi" },
      { id: 2, UserId: 102, RoleId: 4, AccountHolderName: "Jane Smith", BankName: "HDFC Bank", AccountNo: "0987654321", IfscCode: "HDFC000456", UpiId: "janesmith@hdfc" },
    ]
  };
};

const mockSaveUpdateBankMaster = async (payload) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log("Saving bank master:", payload);
  const message = payload.id === 0 ? "Bank details added successfully!" : "Bank details updated successfully!";
  return { statuscode: 200, message: message };
};

const mockDeleteBankDetails = async (payload) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log("Deleting bank details:", payload);
  return { statuscode: 200, message: "Bank details deleted successfully!" };
};

// Form validation schema
const validationSchema = Yup.object().shape({
  role: Yup.number().typeError("Role is required").moreThan(0, "Please select a valid role").required("Role is required"),
  user: Yup.number().typeError("User is required").moreThan(0, "Please select a valid user").required("User is required"),
  bankName: Yup.string().required("Bank Name is required"),
  accountHolder: Yup.string().required("Account holder is required"),
  accountNo: Yup.string().required("Account No is required"),
  ifsc: Yup.string().required("IFSC code is required"),
  upi: Yup.string().required("UPI is required")
});

// Modal component for editing
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


const BankMaster = () => {
  const [loadingForm, setLoadingForm] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [userRoleList, setUserRoleList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userBankList, setUserBankList] = useState([]);
  const [editingId, setEditingId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Fetch initial data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);
  
  // This useEffect ensures the user list is populated correctly when the modal opens for an edit
  useEffect(() => {
    if(isModalOpen && editingId) {
      // Find the row being edited to get the RoleId
      const editedRow = userBankList.find(row => row.id === editingId);
      if(editedRow) {
        BindUserListByRoleId(editedRow.RoleId);
      }
    } else {
      setUserList([]);
    }
  }, [isModalOpen, editingId]);

  const fetchInitialData = async () => {
    setLoadingForm(true);
    try {
      const roleData = await mockBindUserRole();
      setUserRoleList(roleData.data || []);
      
      const bankData = await mockBindUserBankList({ id: 0 });
      setUserBankList(bankData.data || []);
    } catch (err) {
      console.error("Error fetching initial data:", err);
    } finally {
      setLoadingForm(false);
      setLoadingTable(false);
    }
  };

  const BindUserListByRoleId = async (roleId) => {
    if (roleId === 0) {
      setUserList([]);
      return;
    }
    try {
      const data = await mockBindUserListByRoleId({ roleId });
      setUserList(data.data || []);
    } catch (err) {
      console.error("Error fetching user list:", err);
      setUserList([]);
    }
  };

  const BindUserBankTable = async () => {
    setLoadingTable(true);
    try {
      const data = await mockBindUserBankList({ id: 0 });
      setUserBankList(data.data || []);
    } catch (err) {
      console.error("Error fetching bank list:", err);
      setUserBankList([]);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    reset({
      role: row.RoleId,
      user: row.UserId,
      bankName: row.BankName,
      accountHolder: row.AccountHolderName,
      accountNo: row.AccountNo,
      ifsc: row.IfscCode,
      upi: row.UpiId
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await mockDeleteBankDetails({ Id: id });
          if (res.statuscode === 200) {
            Swal.fire("Deleted!", res.message, "success");
            BindUserBankTable();
          } else {
            Swal.fire("Error!", res.message, "error");
          }
        } catch (err) {
          Swal.fire("Error!", "Failed to delete bank details.", "error");
        }
      }
    });
  };

  const onSubmit = async (data) => {
    try {
      const res = await mockSaveUpdateBankMaster({
        id: editingId,
        userId: data.user,
        accountHolderName: data.accountHolder,
        bankName: data.bankName,
        accountNo: data.accountNo,
        ifscCode: data.ifsc,
        upiId: data.upi,
        accountType: "",
      });

      if (res.statuscode === 200) {
        Swal.fire("Success!", res.message, "success");
        resetFormAndState();
        BindUserBankTable();
        if (isModalOpen) {
            setIsModalOpen(false); // Close modal if it was open
        }
      } else {
        Swal.fire("Error!", res.message, "error");
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to save bank details.", "error");
    }
  };

  const resetFormAndState = () => {
    reset({
      role: 0,
      user: 0,
      bankName: "",
      accountHolder: "",
      accountNo: "",
      ifsc: "",
      upi: ""
    });
    setEditingId(0);
    setUserList([]); // Clear the user list dropdown
  };

  const handleClear = () => {
    resetFormAndState();
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Role Select */}
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Role</label>
            {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
                <>
                    <select 
                        {...register("role")}
                        onChange={(e) => BindUserListByRoleId(parseInt(e.target.value))}
                        className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${
                            errors.role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value={0}>Select Role</option>
                        {userRoleList.map((item) => (
                            <option key={item.id} value={item.id}>{item.roleName}</option>
                        ))}
                    </select>
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                </>
            )}
        </div>

        {/* User Select */}
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select User</label>
            {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ) : (
                <>
                    <select 
                        {...register("user")}
                        className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${
                            errors.user ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <option value={0}>Select User</option>
                        {userList.map((item) => (
                            <option key={item.UserId} value={item.UserId}>{item.NameWithCompanyName}</option>
                        ))}
                    </select>
                    {errors.user && <p className="text-red-500 text-sm mt-1">{errors.user.message}</p>}
                </>
            )}
        </div>

        {/* Input Fields */}
        {['bankName', 'accountHolder', 'accountNo', 'ifsc', 'upi'].map(field => (
            <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                {loadingForm ? (
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                ) : (
                    <>
                        <input 
                            type="text" 
                            {...register(field)} 
                            className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${
                                errors[field] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
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
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
                Clear
            </button>
            <button 
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors"
            >
                {editingId ? 'Update' : 'Submit'}
            </button>
        </div>
    </form>
  );

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
            <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Bank Master</h1>

            {/* Toggle Form Section */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        handleClear();
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors"
                >
                    {showAddForm ? "Hide Form" : "Add New Bank Account"}
                </button>
            </div>

            {/* Main Form Section for Adding New Entries */}
            {showAddForm && (
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Bank Account Form</h2>
                    {renderForm()}
                </div>
            )}
            
            <hr className="my-10 border-gray-200 dark:border-gray-700" />

            {/* Table Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Bank Account List</h2>
              <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      {['Bank Name', 'Account Holder', 'Account No.', 'IFSC Code', 'UPI ID', 'Actions'].map(header => (
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
                          {Array.from({ length: 6 }).map((_, colIndex) => (
                            <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : userBankList && userBankList.length > 0 ? (
                      userBankList.map((row) => (
                        <tr key={row.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.BankName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.AccountHolderName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.AccountNo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.IfscCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.UpiId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => handleEdit(row)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 transition-colors mr-4">Edit</button>
                            <button onClick={() => handleDelete(row.id)} className="text-red-600 dark:text-red-400 hover:text-red-900 transition-colors">Delete</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No bank details found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Edit Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Edit Bank Account</h2>
          {renderForm()}
        </Modal>
    </div>
  );
};

export default BankMaster;