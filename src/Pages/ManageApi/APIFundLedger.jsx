import React, { useEffect, useState } from 'react'
import { DatePicker } from "antd";
import "antd/dist/reset.css"; // Ant Design styles
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { BindAPIListByServiceName } from '../../services/Commonapi';
import { GetApiFundLedger } from '../../services/ManageAPI';
import Pagination from '../../utils/Pagination';
const { RangePicker } = DatePicker;


const APIFundLedger = () => {
    const rowsPerPage = 50;
    const [dateRange, setDateRange] = useState([]);
    const [ApiMasterByServiceName, setApiMasterByServiceName] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingTable, setLoadingTable] = useState(true);
    const [ApiFundLedger, setApiFundLedger] = useState([]);
    const [selectedApi, setSelectedApi] = useState(0);
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
                setLoading(false);
            }
        })();
    }, []);

    // bind payout data
    useEffect(() => {
        (async () => {
            try {
                BindApiFundLedger({ dateRange: dateRange, selectedApi: selectedApi, currentPage: currentPage });
            }
            catch (err) {
                Swal.fire("warning!", err.message, "warning");
            } finally {
                setLoading(false);
            }
        })();
    }, [currentPage]);

    const fetchInitialData = async () => {
        try {
            const _apiresult = await BindAPIListByServiceName({ serviceName: "" });
            setApiMasterByServiceName(_apiresult);
        } catch (err) {
            Swal.fire("warning!", err.message, "warning");
        }
        finally {
            setLoading(false);
        }
    }
    const totalPages = Math.ceil(totalCount / rowsPerPage);

    const BindApiFundLedger = async ({dateRange, selectedApi, currentPage}) => {
        setLoadingTable(true);
        try {
            const _result = await GetApiFundLedger({
                startDate: dateRange?.[0]?.format("YYYY-MM-DD"), endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
                apiId: selectedApi, pageNo: currentPage, pageSize: rowsPerPage
            });
            if (_result && Array.isArray(_result.data) && _result.data.length > 0) {
                setApiFundLedger(_result);
                setTotalCount(_result.data[0].TotalRecord);
            } else {
                setApiFundLedger([]);
                setTotalCount(0);
            }
        } catch (err) {
            Swal.fire("warning!", err.message, "warning");
        }
        finally {
            setLoadingTable(false);
        }
    }


    const BindDataApiChange = (e) => {
        const apiId = parseInt(e.target.value);
        setSelectedApi(apiId);
        BindApiFundLedger({ dateRange: dateRange, selectedApi: apiId, currentPage: currentPage });
    }

    return (
        <div className="py-4 sm:py-6 md:py-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
                    <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">API Fund Ledger</h1>

                    <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <RangePicker
                            format="DD-MM-YYYY"
                            onChange={(values) => setDateRange(values)}
                            presets={[
                                { label: "Today", value: [dayjs(), dayjs()] },
                                { label: "Yesterday", value: [dayjs().subtract(1, "day"), dayjs().subtract(1, "day")] },
                                { label: "Last 7 days", value: [dayjs().subtract(7, "day"), dayjs()] },
                                { label: "Last 30 days", value: [dayjs().subtract(30, "day"), dayjs()] },
                                { label: "This month", value: [dayjs().startOf("month"), dayjs().endOf("month")] },
                                {
                                    label: "Last month", value: [
                                        dayjs().subtract(1, "month").startOf("month"),
                                        dayjs().subtract(1, "month").endOf("month")
                                    ]
                                },
                            ]}
                            // defaultValue={[dayjs(),dayjs()]}
                            className="w-[350px] h-[40px] rounded-lg"
                        />
                        <select
                            className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            onChange={BindDataApiChange}
                        >
                            <option value={0}>Select API</option>
                            {ApiMasterByServiceName && Array.isArray(ApiMasterByServiceName.data) && ApiMasterByServiceName.data.length > 0 ?
                                ApiMasterByServiceName.data.map((item) => (
                                    <option key={item.ApiId} value={item.ApiId}>{item.ApiName}</option>
                                )) : (
                                    <option disabled>No Data Found</option>
                                )}
                        </select>
                        <input type="text" placeholder='Search' className="block w-full sm:w-48 px-4 py-2 bg-gray-50 dark:bg-gray-700 border rounded-md text-gray-900 dark:text-white" />
                        <button
                            onClick={() => BindApiFundLedger({ dateRange, selectedApi, currentPage })}
                            className="py-2 px-4 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                            Search
                        </button>
                    </div>
                    <hr className="my-10 border-gray-200 dark:border-gray-700" />

                    <div>
                        {/* <h2 className="text-2xl font-semibold mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">Bank Account List</h2> */}
                        {totalPages ? <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /> : ""}
                        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        {['#', 'API Name', 'User Name', 'Company Name', 'Mobile No', 'Date & Time', 'Open', 'Amount', 'Surcharge', 'GST', 'Payable', 'Closed', 'Unique Id', 'Comment', 'Manual Comment'].map(header => (
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
                                                {Array.from({ length: 15 }).map((_, colIndex) => (
                                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : ApiFundLedger && Array.isArray(ApiFundLedger.data) && ApiFundLedger.data.length > 0 ? (
                                        ApiFundLedger.data.map((row, index) => (
                                            <tr key={index + 1}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ApiName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.UserName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CompanyName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.MobileNo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.CreatedDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.OpeningAmount)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Amount)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Surcharge)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.Gst)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.PayableAmount)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.ClosingAmount)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.SystemUniqueId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.Comments}>{row.Comments}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.Remarks}>{row.Remarks}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr key={0}>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No data found.</td>
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
    )
}

export default APIFundLedger