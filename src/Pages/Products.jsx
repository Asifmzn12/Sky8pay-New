import React from 'react';

function Products() {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Management</h2>
      <p className="text-gray-700 dark:text-gray-300">Here you can manage all your products. Use this space for a table, a list of products, or a form to add new items.</p>
      <div className="mt-6 border p-4 rounded dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">Placeholder for a product table or a grid of product cards.</p>
      </div>
    </div>
  );
}

export default Products;