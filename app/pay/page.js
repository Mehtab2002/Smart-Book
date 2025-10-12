// app/pay/page.js
'use client';

import { useState } from 'react';

export default function PayPage() {
  // Sample suppliers data
  const suppliers = [
    { id: 'S001', name: 'Global Tech Supplies' },
    { id: 'S002', name: 'Premium Raw Materials Ltd' },
    { id: 'S003', name: 'Quality Parts Inc' },
    { id: 'S004', name: 'Electro Components Corp' },
    { id: 'S005', name: 'Office Solutions Co' }
  ];

  const [payments, setPayments] = useState([
    {
      id: 'PY001',
      supplierId: 'S001',
      supplierName: 'Global Tech Supplies',
      referenceNumber: 'PO-2024-001',
      amount: 1500,
      remarks: 'Payment for purchase order #001',
      date: '2024-01-15',
      status: 'Completed'
    },
    {
      id: 'PY002',
      supplierId: 'S002',
      supplierName: 'Premium Raw Materials Ltd',
      referenceNumber: 'PO-2024-002',
      amount: 3200,
      remarks: 'Raw materials shipment',
      date: '2024-01-16',
      status: 'Completed'
    },
    {
      id: 'PY003',
      supplierId: 'S003',
      supplierName: 'Quality Parts Inc',
      referenceNumber: 'PO-2024-003',
      amount: 800,
      remarks: 'Partial payment pending inspection',
      date: '2024-01-17',
      status: 'Pending'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    supplierId: '',
    supplierName: '',
    referenceNumber: '',
    amount: 0,
    remarks: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Completed'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Update existing payment
      setPayments(payments.map(p => p.id === formData.id ? formData : p));
    } else {
      // Add new payment
      const newPayment = { 
        ...formData, 
        id: 'PY' + String(payments.length + 1).padStart(3, '0')
      };
      setPayments([...payments, newPayment]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (payment) => {
    setFormData(payment);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ 
      id: '',
      supplierId: '',
      supplierName: '',
      referenceNumber: '',
      amount: 0,
      remarks: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    });
    setShowSupplierDropdown(false);
  };

  const handleSupplierSelect = (supplier) => {
    setFormData({
      ...formData,
      supplierId: supplier.id,
      supplierName: supplier.name
    });
    setShowSupplierDropdown(false);
  };

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment =>
    payment.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = payments.filter(p => p.status === 'Completed').length;
  const pendingPayments = payments.filter(p => p.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
          Make Payments
        </h1>
        <p className="text-blue-600 text-lg">
          Manage supplier payments and disbursements
        </p>
      </div>

      {/* Action Bar with Search and Add Button */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-blue-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by supplier name, reference number, or ID..."
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
            New Payment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Total Paid</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${totalPaid.toLocaleString()}
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
              <p className="text-blue-600 font-medium">Total Transactions</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{payments.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Completed</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{completedPayments}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Pending</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{pendingPayments}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table/Cards */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-blue-100">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Payment ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Supplier Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Reference No.</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Remarks</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {payment.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-900">{payment.supplierName}</td>
                    <td className="px-6 py-4 text-blue-700 font-mono">{payment.referenceNumber}</td>
                    <td className="px-6 py-4">
                      <span className="text-red-600 font-bold text-lg">
                        ${payment.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-700">{payment.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        payment.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-700 max-w-xs">
                      <div className="truncate" title={payment.remarks}>
                        {payment.remarks}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(payment)}
                          className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(payment.id)}
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
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg">{payment.supplierName}</h3>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      ID: {payment.id}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    payment.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Reference:</span>
                    <span className="text-blue-700 font-mono">{payment.referenceNumber}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Amount:</span>
                    <span className="text-red-600 font-bold text-lg">
                      ${payment.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Date:</span>
                    <span className="text-blue-700">{payment.date}</span>
                  </div>

                  {payment.remarks && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                      <span className="font-medium">Remarks: </span>
                      {payment.remarks}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mt-4 pt-4 border-t border-blue-100">
                  <button
                    onClick={() => handleEdit(payment)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(payment.id)}
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
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <h3 className="text-lg font-medium text-blue-900 mb-2">No payment records found</h3>
            <p className="text-blue-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by recording your first payment to supplier'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Record First Payment
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-50/30 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {formData.id ? 'Edit Payment' : 'New Payment'}
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
                {/* Supplier Name Combobox */}
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
                      value={formData.supplierName}
                      onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                      onFocus={() => setShowSupplierDropdown(true)}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 cursor-pointer"
                      placeholder="Select supplier"
                      readOnly
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {showSupplierDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                        {suppliers.map((supplier) => (
                          <div
                            key={supplier.id}
                            onClick={() => handleSupplierSelect(supplier)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-blue-100 last:border-b-0"
                          >
                            <div className="font-medium text-blue-900">{supplier.name}</div>
                            <div className="text-sm text-blue-600">ID: {supplier.id}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reference Number Field */}
                <div>
                  <label className="block text-blue-700 font-medium mb-2">Reference Number *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.referenceNumber}
                      onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                      placeholder="Enter reference number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Amount Field */}
                  <div>
                    <label className="block text-blue-700 font-medium mb-2">Amount ($) *</label>
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
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>

                  {/* Date Field */}
                  <div>
                    <label className="block text-blue-700 font-medium mb-2">Date *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Field */}
                <div>
                  <label className="block text-blue-700 font-medium mb-2">Status *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 appearance-none"
                    >
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Remarks Field */}
                <div>
                  <label className="block text-blue-700 font-medium mb-2">Remarks</label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </div>
                    <textarea
                      value={formData.remarks}
                      onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white/80"
                      placeholder="Enter remarks (optional)"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {formData.id ? 'Update Payment' : 'Create Payment'}
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