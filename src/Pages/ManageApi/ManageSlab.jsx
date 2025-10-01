import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import { BindAPIListByServiceName, GetServiceList } from '../../services/Commonapi';
import { GetApiDetailsById, GetSlab, SaveUpdateSlab } from '../../services/ManageAPI';
import Pagination from '../../utils/Pagination';


const validationSchema = Yup.object().shape({
  serviceId: Yup.number().typeError("Service is required").moreThan(0, "Please select service").required("Service is required"),
  apiId: Yup.number().typeError("API is required").moreThan(0, "Please select API").required("API is required"),
  SlabName: Yup.string().required("Slab name is required"),
  Minamount: Yup.number().typeError("Min amount is required").positive("Amount must be greater than zero").moreThan(0, "Enter a valid amount").required("Min amount is required"),
  Maxamount: Yup.number().typeError("Max amount is required").positive("Amount must be greater than zero").moreThan(0, "Enter a valid amount").required("Max amount is required")
});

const ManageSlab = () => {
  const rowsPerPage = 50;
  const [ApiMasterByServiceName, setApiMasterByServiceName] = useState([]);
  const [ApiMasterByServiceId, setApiMasterByServiceId] = useState([]);
  const [loadingForm, setloadingForm] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [serviceList, setServiceList] = useState([]);
  const [editingId, setEditingId] = useState(0);
  const [SlabList, setSlabList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    (async () => {
      try {
        GetSlabList({ slabId: 0, apiId: 0, pageNo: currentPage });
      } catch (err) {
        Swal.fire("warning!", err.message, "warning");
      } finally {
        setLoadingTable(false);
      }
    })();
  }, [currentPage]);



  const fetchInitialData = async () => {
    setloadingForm(true);
    try {
      const _serviceresult = await GetServiceList({});
      setServiceList(_serviceresult);


      const _apiresult = await BindAPIListByServiceName({ serviceName: "" });
      setApiMasterByServiceName(_apiresult);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    }
    finally {
      setloadingForm(false);
    }
  }

  const onChangeService = async (e) => {
    const serviceId = parseInt(e.target.value);
    BindApiOnService(serviceId);
  }

  const BindApiOnService = async (serviceId) => {
    try {
      const _result = await GetApiDetailsById({ apiId: 0, serviceId: serviceId });
      setApiMasterByServiceId(_result);
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {

    }
  }


  const onSubmit = async (data) => {
    setloadingForm(true);
    try {
      const _result = await SaveUpdateSlab({
        id: editingId, serviceId: data.serviceId, name: data.SlabName,
        operatorCode: "", minAmount: data.Minamount, maxAmount: data.Maxamount, apiId: data.apiId
      });
      if (_result.statuscode === 200) {
        Swal.fire("Success!", _result.message, "success");
        resetFormAndState();
        GetSlabList(0, 0, currentPage);
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



  const resetFormAndState = () => {
    reset({
      apiId: 0,
      serviceId:0,
      SlabName: "",
      Minamount: "",
      Maxamount: ""
    });
    setEditingId(0);
  }

  const handleEdit = async (row) => {
    setEditingId(row.Id);
    BindApiOnService(row.ServiceId);
    setTimeout(() => {
      reset({
        apiId: row.ApiId,
        SlabName: row.SlabName,
        Minamount: row.MinAmount,
        Maxamount: row.MaxAmount,
        serviceId: row.ServiceId,
      });
    }, 100);
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const GetSlabList = async ({ slabId: slabId, apiId: apiId, pageNo: pageNo }) => {
    try {
      const _result = await GetSlab({ slabId: 0, apiId: apiId, pageNo: currentPage, pageSize: rowsPerPage });
      if (_result && Array.isArray(_result.data) && _result.data.length > 0) {
        setSlabList(_result);
        setTotalCount(_result.data[0].TotalRecord);
      } else {
        setSlabList([]);
        setTotalCount(0);
      }
    } catch (err) {
      Swal.fire("warning!", err.message, "warning");
    } finally {
      setLoadingTable(false);
    }
  }


  const BindSlabonApiChange = async (e) => {
    const apiId = parseInt(e.target.value);    
    GetSlabList({ slabId: 0, apiId: apiId, currentPage: currentPage });
  }
  return (
    <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Manage Slab</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Service</label>
              {loadingForm ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
              ) : (
                <>
                  <select
                    {...register("serviceId")}
                    className={`block w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white ${errors.serviceId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    onChange={onChangeService}
                  >
                    <option key={0} value={0}>Select Service</option>
                    {serviceList && Array.isArray(serviceList.data) && serviceList.data.length > 0 ?
                      serviceList.data.map((item) => (
                        <option key={item.Id} value={item.Id}>{item.Name}</option>
                      )) : (
                        <option disabled>No Data Found</option>
                      )
                    }
                  </select>
                  {errors.serviceId && <p className="text-red-500 text-sm mt-1">{errors.serviceId.message}</p>}
                </>
              )}
            </div>

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
                  >
                    <option key={1} value={0}>Select API</option>
                    {ApiMasterByServiceId && Array.isArray(ApiMasterByServiceId.data) && ApiMasterByServiceId.data.length > 0 ?
                      ApiMasterByServiceId.data.map((item) => (
                        <option key={item.Id} value={item.Id}>{item.ApiName}</option>
                      )) : (
                        <option disabled>No Data Found</option>
                      )
                    }
                  </select>
                  {errors.apiId && <p className="text-red-500 text-sm mt-1">{errors.apiId.message}</p>}
                </>
              )}
            </div>
            {/* Input Fields */}
            {['Slab Name', 'Min amount', 'Max amount'].map(field => (
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
        <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
              <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Slab List</h1>

              <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">

                <select
                  className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  onChange={BindSlabonApiChange}
                >
                  <option value={0}>Select API</option>
                  {ApiMasterByServiceName && Array.isArray(ApiMasterByServiceName.data) && ApiMasterByServiceName.data.length > 0 ?
                    ApiMasterByServiceName.data.map((item) => (
                      <option key={item.ApiId} value={item.ApiId}>{item.ApiName}</option>
                    )) : (
                      <option disabled>No Data Found</option>
                    )}
                </select>
              </div>
              <hr className="my-10 border-gray-200 dark:border-gray-700" />

              {/* Table Section */}
              <div>
                {totalPages ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : ""}
                <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {['#', 'Service Name', 'API Name', 'Slab', 'Min Slab', 'Max Slab', 'Date& Time', 'Actions'].map(header => (
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
                            {Array.from({ length: 8 }).map((_, colIndex) => (
                              <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : SlabList && Array.isArray(SlabList.data) && SlabList.data.length > 0 ? (
                        SlabList.data.map((row, index) => (
                          <tr key={row.Id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ServiceName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ApiName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.SlabName}>{row.SlabName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.MinAmount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.MaxAmount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CreatedDate}</td>
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
        </div>
      </div>
    </div>
  )
}

export default ManageSlab