// app/suppliers/page.js
'use client';

import { useState } from 'react';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([
    {
      id: 'S001',
      name: 'Global Tech Supplies',
      contact: '+1 (555) 234-5678',
      email: 'orders@globaltech.com',
      openingBalance: 15000,
      address: '789 Tech Park, Silicon Valley, CA 94025'
    },
    {
      id: 'S002',
      name: 'Premium Raw Materials Ltd',
      contact: '+1 (555) 345-6789',
      email: 'supply@premiummaterials.com',
      openingBalance: 25000,
      address: '456 Industrial Zone, Houston, TX 77002'
    },
    {
      id: 'S003',
      name: 'Quality Parts Inc',
      contact: '+1 (555) 456-7890',
      email: 'info@qualityparts.com',
      openingBalance: 8000,
      address: '321 Manufacturing Ave, Detroit, MI 48201'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    contact: '',
    email: '',
    openingBalance: 0,
    address: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Update existing supplier
      setSuppliers(suppliers.map(s => s.id === formData.id ? formData : s));
    } else {
      // Add new supplier
      const newSupplier = { 
        ...formData, 
        id: 'S' + String(suppliers.length + 1).padStart(3, '0')
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (supplier) => {
    setFormData(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(suppliers.filter(s => s.id !== id));
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
      contact: '', 
      email: '', 
      openingBalance: 0, 
      address: '' 
    });
  };

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.includes(searchTerm) ||
    supplier.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
          Supplier Management
        </h1>
        <p className="text-blue-600 text-lg">
          Manage your supplier information and balances
        </p>
      </div>

      {/* Action Bar with Search and Add Button */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-blue-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search suppliers by name, email, ID, or contact..."
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
            Add New Supplier
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Total Suppliers</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{suppliers.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Total Balance</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${suppliers.reduce((sum, supplier) => sum + supplier.openingBalance, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Average Balance</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${Math.round(suppliers.reduce((sum, supplier) => sum + supplier.openingBalance, 0) / suppliers.length).toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Table/Cards */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-blue-100">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Supplier ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Opening Balance</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {supplier.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-900">{supplier.name}</td>
                    <td className="px-6 py-4 text-blue-700">{supplier.contact}</td>
                    <td className="px-6 py-4 text-blue-700">{supplier.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        supplier.openingBalance >= 20000 
                          ? 'bg-green-100 text-green-800' 
                          : supplier.openingBalance >= 10000 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        ${supplier.openingBalance.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-700 max-w-xs">{supplier.address}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 hover:border-red-400 transition-colors duration-200 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          <div className="p-4 space-y-4">
            {filteredSuppliers.map((supplier) => (
              <div key={supplier.id} className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg">{supplier.name}</h3>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      ID: {supplier.id}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    supplier.openingBalance >= 20000 
                      ? 'bg-green-100 text-green-800' 
                      : supplier.openingBalance >= 10000 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    ${supplier.openingBalance.toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-blue-700">{supplier.contact}</span>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-blue-700 break-all">{supplier.email}</span>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-blue-700">{supplier.address}</span>
                  </div>
                </div>

                <div className="flex space-x-3 mt-4 pt-4 border-t border-blue-100">
                  <button
                    onClick={() => handleEdit(supplier)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-medium text-blue-900 mb-2">No suppliers found</h3>
            <p className="text-blue-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first supplier'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Add First Supplier
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Supplier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-50/30 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {formData.id ? 'Edit Supplier' : 'Add New Supplier'}
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
                {/* Name Field with Icon */}
                <div>
                  <label className="block text-blue-700 font-medium mb-2">Supplier Name *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                      placeholder="Enter supplier company name"
                    />
                  </div>
                </div>

                {/* Contact Field with Icon */}
                <div>
                  <label className="block text-blue-700 font-medium mb-2">Contact Number *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>

                {/* Email Field with Icon */}
                <div>
                  <label className="block text-blue-700 font-medium mb-2">Email Address *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Opening Balance Field with Icon */}
                <div>
                  <label className="block text-blue-700 font-medium mb-2">Opening Balance ($) *</label>
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
                      value={formData.openingBalance}
                      onChange={(e) => setFormData({...formData, openingBalance: Number(e.target.value)})}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                      placeholder="Enter opening balance"
                    />
                  </div>
                </div>

                {/* Address Field with Icon */}
                <div>
                  <label className="block text-blue-700 font-medium mb-2">Address *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white/80"
                      placeholder="Enter complete address"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {formData.id ? 'Update Supplier' : 'Create Supplier'}
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