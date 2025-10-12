// app/receive/page.js
'use client';

import { useState } from 'react';

export default function ReceivePage() {
  // Sample customers data
  const customers = [
    { id: 'C001', name: 'John Smith' },
    { id: 'C002', name: 'Sarah Johnson' },
    { id: 'C003', name: 'Mike Wilson' },
    { id: 'C004', name: 'Emma Davis' },
    { id: 'C005', name: 'Robert Brown' }
  ];

  const [receives, setReceives] = useState([
    {
      id: 'R001',
      customerId: 'C001',
      customerName: 'John Smith',
      referenceNumber: 'INV-2024-001',
      amount: 1500,
      remarks: 'Payment for invoice #001',
      date: '2024-01-15',
      status: 'Completed'
    },
    {
      id: 'R002',
      customerId: 'C002',
      customerName: 'Sarah Johnson',
      referenceNumber: 'INV-2024-002',
      amount: 2500,
      remarks: 'Advance payment for project',
      date: '2024-01-16',
      status: 'Completed'
    },
    {
      id: 'R003',
      customerId: 'C003',
      customerName: 'Mike Wilson',
      referenceNumber: 'INV-2024-003',
      amount: 800,
      remarks: 'Partial payment',
      date: '2024-01-17',
      status: 'Pending'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    customerId: '',
    customerName: '',
    referenceNumber: '',
    amount: 0,
    remarks: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Completed'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Update existing receive
      setReceives(receives.map(r => r.id === formData.id ? formData : r));
    } else {
      // Add new receive
      const newReceive = { 
        ...formData, 
        id: 'R' + String(receives.length + 1).padStart(3, '0')
      };
      setReceives([...receives, newReceive]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (receive) => {
    setFormData(receive);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this receive record?')) {
      setReceives(receives.filter(r => r.id !== id));
    }
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ 
      id: '',
      customerId: '',
      customerName: '',
      referenceNumber: '',
      amount: 0,
      remarks: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Completed'
    });
    setShowCustomerDropdown(false);
  };

  const handleCustomerSelect = (customer) => {
    setFormData({
      ...formData,
      customerId: customer.id,
      customerName: customer.name
    });
    setShowCustomerDropdown(false);
  };

  // Filter receives based on search term
  const filteredReceives = receives.filter(receive =>
    receive.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receive.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receive.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalReceived = receives.reduce((sum, receive) => sum + receive.amount, 0);
  const completedReceives = receives.filter(r => r.status === 'Completed').length;
  const pendingReceives = receives.filter(r => r.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
          Receive Payments
        </h1>
        <p className="text-blue-600 text-lg">
          Manage customer payments and receipts
        </p>
      </div>

      {/* Action Bar with Search and Add Button */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-blue-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by customer name, reference number, or ID..."
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
            New Receive
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Total Received</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${totalReceived.toLocaleString()}
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
              <p className="text-3xl font-bold text-blue-900 mt-2">{receives.length}</p>
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
              <p className="text-3xl font-bold text-blue-900 mt-2">{completedReceives}</p>
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
              <p className="text-3xl font-bold text-blue-900 mt-2">{pendingReceives}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Receives Table/Cards */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-blue-100">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Receive ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Customer Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Reference No.</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Remarks</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredReceives.map((receive) => (
                  <tr key={receive.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {receive.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-blue-900">{receive.customerName}</td>
                    <td className="px-6 py-4 text-blue-700 font-mono">{receive.referenceNumber}</td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-bold text-lg">
                        ${receive.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-700">{receive.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        receive.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {receive.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-700 max-w-xs">
                      <div className="truncate" title={receive.remarks}>
                        {receive.remarks}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(receive)}
                          className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(receive.id)}
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
            {filteredReceives.map((receive) => (
              <div key={receive.id} className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg">{receive.customerName}</h3>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      ID: {receive.id}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    receive.status === 'Completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {receive.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Reference:</span>
                    <span className="text-blue-700 font-mono">{receive.referenceNumber}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Amount:</span>
                    <span className="text-green-600 font-bold text-lg">
                      ${receive.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Date:</span>
                    <span className="text-blue-700">{receive.date}</span>
                  </div>

                  {receive.remarks && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                      <span className="font-medium">Remarks: </span>
                      {receive.remarks}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mt-4 pt-4 border-t border-blue-100">
                  <button
                    onClick={() => handleEdit(receive)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(receive.id)}
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
        {filteredReceives.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <h3 className="text-lg font-medium text-blue-900 mb-2">No receive records found</h3>
            <p className="text-blue-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by recording your first payment'}
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

      {/* Add/Edit Receive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-50/30 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {formData.id ? 'Edit Receive' : 'New Receive'}
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
                {/* Customer Name Combobox */}
                <div>
                  <label className="block text-blue-700 font-medium mb-2">Customer Name *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      onFocus={() => setShowCustomerDropdown(true)}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 cursor-pointer"
                      placeholder="Select customer"
                      readOnly
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {showCustomerDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                        {customers.map((customer) => (
                          <div
                            key={customer.id}
                            onClick={() => handleCustomerSelect(customer)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-blue-100 last:border-b-0"
                          >
                            <div className="font-medium text-blue-900">{customer.name}</div>
                            <div className="text-sm text-blue-600">ID: {customer.id}</div>
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
                    {formData.id ? 'Update Receive' : 'Create Receive'}
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