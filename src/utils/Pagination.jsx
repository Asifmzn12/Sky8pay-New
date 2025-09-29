import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  //const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = getPaginationRange(currentPage, totalPages);
  return (
    <div className="flex justify-center mt-6">
      <nav className="inline-flex space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-lg border text-sm font-medium ${currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          Prev
        </button>

        {/* Page Numbers */}
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={idx} className="px-3 py-1 text-gray-500">...</span>
          ) : (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-lg border text-sm font-medium ${currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-lg border text-sm font-medium ${currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
        >
          Next
        </button>
      </nav>
    </div>
  );
};


const getPaginationRange = (currentPage, totalPages, delta = 2) => {
  const range = [];
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  range.push(1); // first page

  if (left > 2) {
    range.push("..."); // gap
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < totalPages - 1) {
    range.push("..."); // gap
  }

  if (totalPages > 1) {
    range.push(totalPages); // last page
  }

  return range;
};


export default Pagination;
