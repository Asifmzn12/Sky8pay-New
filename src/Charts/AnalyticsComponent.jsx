import React, { useState, useMemo } from 'react';

// Dummy data for transactions
const ALL_TRANSACTIONS = [
  { id: 1, sender: 'John Doe', receiver: 'Jane Smith', amount: 50.00, status: 'Completed', paymentMode: 'Online Banking', date: '2025-09-18' },
  { id: 2, sender: 'Alice Johnson', receiver: 'Bob Williams', amount: 120.50, status: 'Pending', paymentMode: 'Credit Card', date: '2025-09-17' },
  { id: 3, sender: 'Michael Brown', receiver: 'Emily Davis', amount: 25.75, status: 'Failed', paymentMode: 'Mobile App', date: '2025-09-16' },
  { id: 4, sender: 'Sophia Wilson', receiver: 'Daniel Taylor', amount: 300.00, status: 'Completed', paymentMode: 'Online Banking', date: '2025-09-16' },
  { id: 5, sender: 'Olivia Lee', receiver: 'Liam Rodriguez', amount: 75.25, status: 'Completed', paymentMode: 'Debit Card', date: '2025-09-15' },
  { id: 6, sender: 'Ethan Martinez', receiver: 'Ava Garcia', amount: 15.00, status: 'Pending', paymentMode: 'Mobile App', date: '2025-09-15' },
  { id: 7, sender: 'Isabella Hernandez', receiver: 'Mason Clark', amount: 210.00, status: 'Completed', paymentMode: 'Online Banking', date: '2025-09-14' },
  { id: 8, sender: 'Noah Lewis', receiver: 'Charlotte King', amount: 45.80, status: 'Completed', paymentMode: 'Credit Card', date: '2025-09-14' },
  { id: 9, sender: 'Mia Hill', receiver: 'William Scott', amount: 99.99, status: 'Completed', paymentMode: 'Debit Card', date: '2025-09-13' },
  { id: 10, sender: 'Jacob Turner', receiver: 'Amelia Baker', amount: 5.50, status: 'Pending', paymentMode: 'Mobile App', date: '2025-09-13' },
  { id: 11, sender: 'Evelyn Wright', receiver: 'Alexander Adams', amount: 85.00, status: 'Completed', paymentMode: 'Online Banking', date: '2025-09-12' },
  { id: 12, sender: 'James White', receiver: 'Harper Nelson', amount: 17.50, status: 'Completed', paymentMode: 'Credit Card', date: '2025-09-12' },
  { id: 13, sender: 'Abigail Green', receiver: 'Benjamin Carter', amount: 250.00, status: 'Failed', paymentMode: 'Mobile App', date: '2025-09-11' },
  { id: 14, sender: 'Daniel Hughes', receiver: 'Chloe Hall', amount: 60.00, status: 'Completed', paymentMode: 'Debit Card', date: '2025-09-11' },
  { id: 15, sender: 'Ella Morris', receiver: 'Henry Cook', amount: 35.00, status: 'Completed', paymentMode: 'Online Banking', date: '2025-09-10' },
  { id: 16, sender: 'Joseph Bell', receiver: 'Grace Foster', amount: 180.00, status: 'Completed', paymentMode: 'Credit Card', date: '2025-09-10' },
  { id: 17, sender: 'Madison Rivera', receiver: 'Samuel Long', amount: 90.50, status: 'Pending', paymentMode: 'Mobile App', date: '2025-09-09' },
  { id: 18, sender: 'Sebastian Gray', receiver: 'Natalie Ward', amount: 11.11, status: 'Completed', paymentMode: 'Debit Card', date: '2025-09-09' },
  { id: 19, sender: 'Victoria Parker', receiver: 'Andrew Reed', amount: 500.00, status: 'Completed', paymentMode: 'Online Banking', date: '2025-09-08' },
  { id: 20, sender: 'Jack Cox', receiver: 'Lily Brooks', amount: 65.00, status: 'Failed', paymentMode: 'Credit Card', date: '2025-09-08' },
  { id: 21, sender: 'Luna Peterson', receiver: 'Luke Ross', amount: 20.00, status: 'Completed', paymentMode: 'Mobile App', date: '2025-09-07' },
  { id: 22, sender: 'Wyatt Butler', receiver: 'Aria Simmons', amount: 42.50, status: 'Completed', paymentMode: 'Debit Card', date: '2025-09-07' },
  { id: 23, sender: 'Zoe Cooper', receiver: 'Carter Fisher', amount: 150.00, status: 'Completed', paymentMode: 'Online Banking', date: '2025-09-06' },
  { id: 24, sender: 'Penelope Evans', receiver: 'Leo Jenkins', amount: 8.75, status: 'Pending', paymentMode: 'Credit Card', date: '2025-09-06' },
  { id: 25, sender: 'Gabriel Bell', receiver: 'Nora Foster', amount: 225.00, status: 'Completed', paymentMode: 'Mobile App', date: '2025-09-05' },
];

const SortIcon = ({ sortConfig, sortKey }) => {
  if (sortConfig.key !== sortKey) {
    return (
      <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    );
  }
  if (sortConfig.direction === 'ascending') {
    return (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
};

const AnalyticsComponent = () => {
  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    paymentMode: 'All',
    date: '',
    amount: '',
  });

  // State for sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);

  // Memoized data that is filtered and sorted
  const filteredAndSortedData = useMemo(() => {
    let filteredData = ALL_TRANSACTIONS.filter((row) => {
      // Search filtering
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = Object.values(row).some(value =>
        value.toString().toLowerCase().includes(searchTermLower)
      );
      if (!matchesSearch) return false;

      // Status filtering
      if (filters.status !== 'All' && row.status !== filters.status) return false;

      // Parent Mode filtering
      if (filters.paymentMode !== 'All' && row.paymentMode !== filters.paymentMode) return false;

      // Date filtering
      if (filters.date && row.date !== filters.date) return false;

      // Amount filtering
      const amountLower = filters.amount.toLowerCase();
      if (filters.amount) {
        if (amountLower.includes('gt')) {
          const amountValue = parseFloat(amountLower.replace('gt', '').trim());
          if (row.amount <= amountValue) return false;
        } else if (amountLower.includes('lt')) {
          const amountValue = parseFloat(amountLower.replace('lt', '').trim());
          if (row.amount >= amountValue) return false;
        } else if (row.amount.toString() !== filters.amount) {
          return false;
        }
      }

      return true;
    });

    // Sorting logic
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  }, [searchTerm, filters, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [currentPage, pageSize, filteredAndSortedData]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      const allIds = paginatedData.map((row) => row.id);
      setSelectedRows(allIds);
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    setCurrentPage(1); 
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const headers = [
    { label: 'Sender', key: 'sender' },
    { label: 'Receiver', key: 'receiver' },
    { label: 'Amount', key: 'amount' },
    { label: 'Status', key: 'status' },
    { label: 'Payment Mode', key: 'paymentMode' },
    { label: 'Date', key: 'date' },
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen ">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-lg overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Transaction History</h2>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 space-y-3 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Search all transactions..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            <select
              name="paymentMode"
              value={filters.paymentMode}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Payment Modes</option>
              <option value="Online Banking">Online Banking</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Debit Card">Debit Card</option>
            </select>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="amount"
              placeholder="Amount (e.g., gt100)"
              value={filters.amount}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="p-4">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    onChange={handleSelectAll}
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0 && selectedRows.length > 0}
                    aria-label="Select all rows"
                  />
                </th>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => requestSort(header.key)}
                  >
                    <div className="flex items-center">
                      {header.label}
                      <span className="ml-2">
                        <SortIcon sortConfig={sortConfig} sortKey={header.key} />
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.length > 0 ? (
                paginatedData.map((row) => (
                  <tr key={row.id}>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelect(row.id)}
                        aria-label={`Select row ${row.id}`}
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{row.sender}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.receiver}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${row.amount.toFixed(2)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        row.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.paymentMode}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No transactions match your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400 space-y-2 sm:space-y-0">
          <span>
            Showing <span className="font-semibold">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-semibold">{Math.min(currentPage * pageSize, filteredAndSortedData.length)}</span> of <span className="font-semibold">{filteredAndSortedData.length}</span> results
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsComponent;
