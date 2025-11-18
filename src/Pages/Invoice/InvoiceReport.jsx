import Pagination from "../../utils/Pagination";
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { BindUserListByRoleId, BindUserRole } from "../../services/Commonapi";
import { encryptvalue } from "../../utils/AESEncrypted";
import { GetInvoiceReport } from "../../services/GenerateInvoice";
const { RangePicker } = DatePicker;

function InvoiceReport() {
    const rowsPerPage = 50;
    const [dateRange, setDateRange] = useState([]);
    const [loadingForm, setLoadingForm] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingTable, setLoadingTable] = useState(true);
    const [userList, setUserListValue] = useState([]);
    const [userRoleList, setUserRoleList] = useState(0);
    const [SelectedUser, setSelectedUser] = useState();
    const [InvoiceList, setInvoiceList] = useState();
    useEffect(() => {
        (async () => {
            fetchInitialData();
        })();
    }, [])


    const fetchInitialData = async () => {
        try {
            const _roleresult = await BindUserRole({ data: {} });
            setUserRoleList(_roleresult);

        } catch (err) {
            Swal.fire("warning!", err.message, "warning");
        }
        finally {
            setLoadingForm(false);
        }
    }

    const BindUserByRole = async (e) => {
        try {
            const roleId = parseInt(e.target.value);
            if (roleId === 0) {
                setUserListValue([]);
            } else {
                var requestdata = encryptvalue(JSON.stringify({
                    roleId: parseInt(e.target.value)
                }));
                const _result = await BindUserListByRoleId({ data: requestdata });
                setUserListValue(_result);
            }
        } catch (err) {
            Swal.fire("warning!", err.message, "warning");
        } finally {
            setLoading(false);
            setLoadingForm(false);
        }
    }

    useEffect(() => {
        (async () => {
            BindInvioceReport({ SelectedUser: SelectedUser, dateRange: dateRange, currentPage: currentPage })
        })();
    }, [currentPage]);

    const totalPages = Math.ceil(totalCount / rowsPerPage);

    const BindInvioceReport = async ({ SelectedUser, dateRange, currentPage }) => {
        try {
            var requestdata = encryptvalue(JSON.stringify({
                userId: SelectedUser,
                startDate: dateRange?.[0]?.format("YYYY-MM-DD"),
                endDate: dateRange?.[1]?.format("YYYY-MM-DD"),
                financialYear: "",
                invoiceOfMonth: "",
                serviceName: "",
                pageSize: rowsPerPage,
                pageNo: currentPage
            }));
            var _result = await GetInvoiceReport({ data: requestdata });
            if (_result.statuscode === 200) {
                console.log(_result);
                setInvoiceList(_result);
                setTotalCount(_result.data[0].TotalRecord);
            } else {
                setInvoiceList([]);
                setTotalCount(0);
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
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
                    <h1 className="text-1xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Invoice Report</h1>

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
                            onChange={BindUserByRole}
                        >
                            <option value={0}>Select Role</option>
                            {userRoleList && Array.isArray(userRoleList.data) && userRoleList.data.length > 0 ?
                                userRoleList.data.filter(x => x.id === 3 || x.id === 4 || x.id === 6).map((item) => (
                                    <option key={item.id} value={item.id}>{item.roleName}</option>
                                )) : (
                                    <option disabled>No Data Found</option>
                                )
                            }
                        </select>

                        <select
                            className="w-full sm:w-48 py-2 pl-4 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            <option value={0}>Select User</option>
                            {userList && Array.isArray(userList.data) && userList.data.length > 0 ?
                                userList.data.map((item) => (
                                    <option key={item.UserId} value={item.UserId}>{item.NameWithCompanyName}</option>
                                )) : (
                                    <option disabled>No Data Found</option>
                                )
                            }
                        </select>

                        <button
                            onClick={() => BindInvioceReport({ SelectedUser, dateRange, currentPage })}
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
                                        {['#', 'User Name', 'Company Name', 'Mobile No', 'Service Name', 'Financial Year', 'Invoice Month', 'Date & Time', 'Amount', 'Payable Amount', 'Invoice Id', 'Download'].map(header => (
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
                                    ) : InvoiceList && Array.isArray(InvoiceList.data) && InvoiceList.data.length > 0 ? (
                                        InvoiceList.data.map((row, index) => (
                                            <tr key={row.Id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.UserName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-[140px] truncate" title={row.CompanyName}>{row.CompanyName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.MobileNo}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.ServiceName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.FinancialYear}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.InvoiceOfMonth}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.InvoiceDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.TotalAmount)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(row.TotalCharges)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{row.InvoiceID}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                    <a href={row.InvoiceUrl} target="_blank" className="py-2 px-4 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">Download</a>
                                                </td>
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

export default InvoiceReport;