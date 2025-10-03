import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import { BindUserRole } from '../../services/Commonapi';
import { GetCommissionPackage, SaveUpdateCommissionPackage } from '../../services/Commission';
import Pagination from '../../utils/Pagination';

const validationSchema = Yup.object().shape({
  roleId: Yup.number().typeError("Role is required").moreThan(0, "Please select a valid role").required("Role is required"),
  packageName: Yup.string().required("Package Name is required")
});

const CreateCategory = () => {
  const rowsPerPage = 50;
  const [CateGoryList, setCateGoryList] = useState([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [userRoleList, setUserRoleList] = useState(0);
  const [editingId, setEditingId] = useState(0);
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
        setLoadingForm(false);
      }
    })();
  }, []);


  // bind data
  useEffect(() => {
    setLoadingTable(true);
    (async () => {
      try {
        BindPackageCateGory({ currentPage: currentPage });
      }
      catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setLoadingTable(false);
      }
    })();
  }, [currentPage]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })


  const onSubmit = async (data) => {
    try {
      const _result = await SaveUpdateCommissionPackage({
        id: editingId, roleId: data.roleId, name: data.packageName
      });
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
        resetFormAndState();
        BindPackageCateGory({ currentPage: currentPage });
      } else {
        Swal.fire("Error!", _result.message, "error");
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingForm(false);
    }
  }

  const handleClear = () => {
    resetFormAndState();
  }

  const handleEdit = async (row) => {
    setEditingId(row.Id);
    reset({
      roleId: row.RoleId,
      packageName: row.PackageName
    });
  }

  const resetFormAndState = () => {
    reset({
      roleId: 0,
      packageName: ""
    });
    setEditingId(0);
  }

  const fetchInitialData = async () => {
    setLoadingForm(true);
    try {
      const data = await BindUserRole();
      setUserRoleList(data);

    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingForm(false);
      setLoadingTable(false);
    }
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const BindPackageCateGory = async ({ currentPage: currentPage }) => {
    setLoadingTable(true);
    try {
      const _result = await GetCommissionPackage({ pageNo: currentPage, pageSize: rowsPerPage });
      if (_result && Array.isArray(_result.data) && _result.data.length > 0) {
        setCateGoryList(_result);
        setTotalCount(_result.data[0].TotalRecord);
      } else {
        setCateGoryList([]);
        setTotalCount();
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Manage Category details</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
                  >
                    <option key={0} value={0}>Select Role</option>
                    {userRoleList && Array.isArray(userRoleList.data) && userRoleList.data.length > 0 ?
                      userRoleList.data.filter(x => x.id !== 1 && x.id !== 7 && x.id !== 5).map((item) => (
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Package Name</label>
              <input
                type="text"
                {...register("packageName")}
                className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.packageName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.packageName && <p className="text-red-500 text-sm mt-1">{errors.packageName.message}</p>}
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition-colors">
                Submit
              </button>
              <button
                type="button" onClick={handleClear}
                className="px-6 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-colors">
                Clear
              </button>
            </div>
          </form>
        </div>

        <hr className="my-10 border-gray-200 dark:border-gray-700" />

        {/* Table Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">API Company List</h2>
          {totalPages ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : ""}
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['#', 'Role Name', 'Package Name', 'Status', 'Action'].map(header => (
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
                ) : CateGoryList && Array.isArray(CateGoryList.data) && CateGoryList.data.length > 0 ? (
                  CateGoryList.data.map((row, index) => (
                    <tr key={row.Id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.RoleName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.PackageName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button type="button" onClick={() => handleEdit(row)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 transition-colors mr-4">Edit</button> &nbsp;&nbsp;                        
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
          {totalPages ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : ""}
        </div>
      </div>
    </div>
  )
}

export default CreateCategory