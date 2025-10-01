import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import { BindAPIListByServiceName } from '../../services/Commonapi';
import { DeleteApiCompanyDetails, GetApiCompanyDetails, GetApiDetailsById, SaveApiCompanyDetails } from '../../services/ManageAPI';


const validationSchema = Yup.object().shape({
  apiId: Yup.number().typeError("API is required").moreThan(0, "Please select API").required("API is required"),
  MerchantName: Yup.string().required("Merchant name is required"),
  CompanyName: Yup.string().required("Company name is required"),
  GSTNo: Yup.string().matches(/^[0-9A-Z]{15}$/, "Invalid GST number (15 chars alphanumeric)").required("GST no is required"),
  Address: Yup.string().required("Address is required"),
  PanNo: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format").required("Pan no is required"),
  Email: Yup.string().email("Invalid email").required("Email is required")

});

const APICompanyDetails = () => {
  const [ApiMasterByServiceName, setApiMasterByServiceName] = useState([]);
  const [loadingForm, setloadingForm] = useState(true);
  const [merchantName, setMerchantName] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [editingId, setEditingId] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

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

  //bind table
  useEffect(() => {
    (async () => {
      try {
        BindApiCompanyList();
      } catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setLoadingTable(false);
      }
    })();
  }, [])


  const fetchInitialData = async () => {
    setloadingForm(true);
    try {
      const _apiresult = await BindAPIListByServiceName({ serviceName: "" });
      setApiMasterByServiceName(_apiresult);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setloadingForm(false);
    }
  }

  const onSubmit = async (data) => {
    setloadingForm(true);
    try {
      const _result = await SaveApiCompanyDetails({
        id: editingId, apiId: data.apiId, name: data.CompanyName, gstin: data.GSTNo,
        address: data.Address, panNo: data.PanNo, emailId: data.Email
      });
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
        resetFormAndState();
        BindApiCompanyList();
      } else {
        Swal.fire("Error!", _result.message, "error");
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setloadingForm(false);
    }
  }

  const handleClear = () => {
    resetFormAndState();
  }

  const OnChangeApi = async (e) => {
    const apiId = parseInt(e.target.value);
    try {
      const _result = await GetApiDetailsById({ apiId: apiId, serviceId: 0 });
      if (_result && Array.isArray(_result.data) && _result.data.length > 0) {
        setMerchantName(_result.data?.[0]?.MerchantName);
      } else {
        setMerchantName("");
      }
    }
    catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setloadingForm(false);
    }
  }

  const resetFormAndState = () => {
    reset({
      apiId: 0,
      MerchantName: "",
      CompanyName: "",
      GSTNo: "",
      Address: "",
      PanNo: "",
      Email: ""
    });
    setMerchantName("");
    setEditingId(0);
  }

  const BindApiCompanyList = async () => {
    setLoadingTable(true);
    try {
      const _result = await GetApiCompanyDetails({ Id: 0 });
      setCompanyList(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }

  const handleEdit = async (row) => {
    setloadingForm(true);
    try {
      setEditingId(row.Id);
      reset({
        apiId: row.ApiId,
        MerchantName: row.MerchantName,
        CompanyName: row.Name,
        GSTNo: row.GSTIN,
        Address: row.Address,
        PanNo: row.PanNo,
        Email: row.EmailId
      });
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setloadingForm(false);
    }
  };

  const handleDelete = async (Id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be also to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setloadingForm(true);
        try {
          const _result = await DeleteApiCompanyDetails({ apiId: Id });
          if (_result.statuscode === 200) {
            Swal.fire("Deleted!", _result.message, "success");
            BindApiCompanyList();
          } else {
            Swal.fire("Error!", _result.message, "error");
          }
        } catch (err) {
          Swal.fire("warning!", err.message, "warning");
        } finally {
          setloadingForm(false);
        }
      }
    })
  }

  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">API Company Details</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Role Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select API</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <select
                    {...register("apiId")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.apiId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    onChange={OnChangeApi}
                  >
                    <option key={0} value={0}>Select API</option>
                    {ApiMasterByServiceName && Array.isArray(ApiMasterByServiceName.data) && ApiMasterByServiceName.data.length > 0 ?
                      ApiMasterByServiceName.data.map((item) => (
                        <option key={item.ApiId} value={item.ApiId}>{item.ApiName}</option>
                      )) : (
                        <option disabled>No Data Found</option>
                      )
                    }
                  </select>
                  {errors.apiId && <p className="text-red-500 text-sm mt-1">{errors.apiId.message}</p>}
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Merchant Name</label>

              <input
                type="text"
                {...register("MerchantName")}
                value={merchantName}
                className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.MerchantName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.MerchantName && <p className="text-red-500 text-sm mt-1">{errors.MerchantName.message}</p>}
            </div>
            {/* Input Fields */}
            {['Company Name', 'GST No', 'Address', 'Pan No', 'Email'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                {loadingForm ? (
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                ) : (
                  <>
                    <input
                      type="text"
                      {...register(field.replace(/\s+/g, ''))}
                      className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors[field.replace(/\s+/g, '')] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors[field.replace(/\s+/g, '')] && <p className="text-red-500 text-sm mt-1">{errors[field.replace(/\s+/g, '')].message}</p>}
                  </>
                )}
              </div>
            ))}
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
          <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {['#', 'API Name', 'Company Name', 'Company GST', 'Company Address', 'Date& Time', 'Pan No', 'Email', 'Actions'].map(header => (
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
                ) : companyList && Array.isArray(companyList.data) && companyList.data.length > 0 ? (
                  companyList.data.map((row, index) => (
                    <tr key={row.Id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ApiName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.GSTIN}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.Address}>{row.Address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CreatedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.PanNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.EmailId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button type="button" onClick={() => handleEdit(row)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 transition-colors mr-4">Edit</button> &nbsp;&nbsp;
                        <button type="button" onClick={() => handleDelete(row.Id)} className="text-red-600 dark:text-red-400 hover:text-red-900 transition-colors">Delete</button>
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
  )
}

export default APICompanyDetails