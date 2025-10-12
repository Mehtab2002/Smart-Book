// app/products/page.js
'use client';

import { useState } from 'react';

export default function ProductsPage() {
  // Predefined options for comboboxes
  const categories = [
    'Electronics',
    'Grocery',
    'Clothing',
    'Furniture',
    'Books',
    'Sports',
    'Beauty',
    'Automotive',
    'Toys',
    'Jewelry'
  ];

  const units = [
    'pcs',
    'kg',
    'g',
    'lb',
    'liter',
    'ml',
    'box',
    'pack',
    'bottle',
    'carton',
    'meter',
    'cm',
    'set',
    'pair'
  ];

  const [products, setProducts] = useState([
    {
      id: 'P001',
      name: 'iPhone 15 Pro',
      purchaseRate: 899,
      saleRate: 1099,
      category: 'Electronics',
      brand: 'Apple',
      unit: 'pcs',
      description: 'Latest flagship smartphone with advanced camera system'
    },
    {
      id: 'P002',
      name: 'Samsung Galaxy S24',
      purchaseRate: 699,
      saleRate: 849,
      category: 'Electronics',
      brand: 'Samsung',
      unit: 'pcs',
      description: 'High-performance Android smartphone with AI features'
    },
    {
      id: 'P003',
      name: 'Organic Olive Oil',
      purchaseRate: 15,
      saleRate: 25,
      category: 'Grocery',
      brand: 'Nature\'s Best',
      unit: 'liter',
      description: 'Premium extra virgin organic olive oil'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    purchaseRate: 0,
    saleRate: 0,
    category: '',
    brand: '',
    unit: '',
    description: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Update existing product
      setProducts(products.map(p => p.id === formData.id ? formData : p));
    } else {
      // Add new product
      const newProduct = { 
        ...formData, 
        id: 'P' + String(products.length + 1).padStart(3, '0')
      };
      setProducts([...products, newProduct]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ 
      id: '', 
      name: '', 
      purchaseRate: 0, 
      saleRate: 0, 
      category: '', 
      brand: '', 
      unit: '', 
      description: '' 
    });
    setShowCategoryDropdown(false);
    setShowUnitDropdown(false);
  };

  const handleCategorySelect = (category) => {
    setFormData({...formData, category});
    setShowCategoryDropdown(false);
  };

  const handleUnitSelect = (unit) => {
    setFormData({...formData, unit});
    setShowUnitDropdown(false);
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate profit margin
  const calculateProfitMargin = (purchaseRate, saleRate) => {
    if (!purchaseRate || !saleRate) return 0;
    return ((saleRate - purchaseRate) / purchaseRate * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
          Product Management
        </h1>
        <p className="text-blue-600 text-lg">
          Manage your product inventory and pricing
        </p>
      </div>

      {/* Action Bar with Search and Add Button */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-blue-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name, brand, category, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <button
            onClick={handleAddNew}
            className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Total Products</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{products.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Categories</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {new Set(products.map(p => p.category)).size}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Avg Profit Margin</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {products.length > 0 
                  ? calculateProfitMargin(
                      products.reduce((sum, p) => sum + p.purchaseRate, 0) / products.length,
                      products.reduce((sum, p) => sum + p.saleRate, 0) / products.length
                    ) + '%'
                  : '0%'
                }
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Total Brands</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {new Set(products.map(p => p.brand)).size}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table/Cards */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-blue-100">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Product ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Purchase Rate</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Sale Rate</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Profit Margin</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredProducts.map((product) => {
                  const profitMargin = calculateProfitMargin(product.purchaseRate, product.saleRate);
                  return (
                    <tr key={product.id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-blue-900">{product.name}</div>
                          <div className="text-sm text-blue-600 mt-1 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-blue-700 font-medium">{product.brand}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">
                        ${product.purchaseRate}
                      </td>
                      <td className="px-6 py-4 text-blue-600 font-semibold">
                        ${product.saleRate}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          profitMargin > 30 
                            ? 'bg-green-100 text-green-800' 
                            : profitMargin > 15 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {profitMargin}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 hover:border-red-400 transition-colors duration-200 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          <div className="p-4 space-y-4">
            {filteredProducts.map((product) => {
              const profitMargin = calculateProfitMargin(product.purchaseRate, product.saleRate);
              return (
                <div key={product.id} className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-blue-900 text-lg">{product.name}</h3>
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        ID: {product.id}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profitMargin > 30 
                        ? 'bg-green-100 text-green-800' 
                        : profitMargin > 15 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {profitMargin}%
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-medium">Category:</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                        {product.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-medium">Brand:</span>
                      <span className="text-blue-700 font-medium">{product.brand}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-medium">Unit:</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                        {product.unit}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-green-600 font-bold text-lg">${product.purchaseRate}</div>
                        <div className="text-green-500 text-xs">Purchase</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-600 font-bold text-lg">${product.saleRate}</div>
                        <div className="text-blue-500 text-xs">Sale</div>
                      </div>
                    </div>

                    {product.description && (
                      <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                        {product.description}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3 mt-4 pt-4 border-t border-blue-100">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-medium text-blue-900 mb-2">No products found</h3>
            <p className="text-blue-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Add First Product
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-50/30 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {formData.id ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-blue-400 hover:text-blue-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name Field with Icon */}
                  <div className="md:col-span-2">
                    <label className="block text-blue-700 font-medium mb-2">Product Name *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                        placeholder="Enter product name"
                      />
                    </div>
                  </div>

                  {/* Category Combobox */}
                  <div>
                    <label className="block text-blue-700 font-medium mb-2">Category *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        onFocus={() => setShowCategoryDropdown(true)}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 cursor-pointer"
                        placeholder="Select category"
                        readOnly
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {showCategoryDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                          {categories.map((category) => (
                            <div
                              key={category}
                              onClick={() => handleCategorySelect(category)}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-blue-100 last:border-b-0"
                            >
                              <span className="text-blue-700">{category}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Unit Combobox */}
                  <div>
                    <label className="block text-blue-700 font-medium mb-2">Unit *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.unit}
                        onChange={(e) => setFormData({...formData, unit: e.target.value})}
                        onFocus={() => setShowUnitDropdown(true)}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 cursor-pointer"
                        placeholder="Select unit"
                        readOnly
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {showUnitDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                          {units.map((unit) => (
                            <div
                              key={unit}
                              onClick={() => handleUnitSelect(unit)}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-blue-100 last:border-b-0"
                            >
                              <span className="text-blue-700">{unit}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Brand Field */}
                  <div>
                    <label className="block text-blue-700 font-medium mb-2">Brand *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                        placeholder="Enter brand name"
                      />
                    </div>
                  </div>

                  {/* Purchase Rate Field */}
                  <div>
                    <label className="block text-blue-700 font-medium mb-2">Purchase Rate ($) *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.purchaseRate}
                        onChange={(e) => setFormData({...formData, purchaseRate: parseFloat(e.target.value)})}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                        placeholder="Enter purchase rate"
                      />
                    </div>
                  </div>

                  {/* Sale Rate Field */}
                  <div>
                    <label className="block text-blue-700 font-medium mb-2">Sale Rate ($) *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.saleRate}
                        onChange={(e) => setFormData({...formData, saleRate: parseFloat(e.target.value)})}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                        placeholder="Enter sale rate"
                      />
                    </div>
                  </div>
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-blue-700 font-medium mb-2">Description</label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </div>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white/80"
                      placeholder="Enter product description (optional)"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {formData.id ? 'Update Product' : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}