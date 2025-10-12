// app/customer-balance/page.js
'use client';

import { useState, useRef } from 'react';

export default function CustomerBalancePage() {
  // Sample customer data with transactions
  const customers = [
    {
      id: 'C001',
      name: 'John Smith',
      contact: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      address: '123 Main St, New York, NY 10001',
      openingBalance: 1000,
      transactions: [
        { date: '2024-01-15', type: 'Sale', debit: 1500, credit: 0, description: 'Sale INV-001' },
        { date: '2024-01-20', type: 'Receive', debit: 0, credit: 1000, description: 'Payment Received' },
        { date: '2024-01-25', type: 'Sale', debit: 800, credit: 0, description: 'Sale INV-002' },
        { date: '2024-02-01', type: 'Receive', debit: 0, credit: 500, description: 'Partial Payment' }
      ]
    },
    {
      id: 'C002',
      name: 'Sarah Johnson',
      contact: '+1 (555) 987-6543',
      email: 'sarah.j@email.com',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      openingBalance: 2000,
      transactions: [
        { date: '2024-01-18', type: 'Sale', debit: 2500, credit: 0, description: 'Sale INV-003' },
        { date: '2024-01-22', type: 'Receive', debit: 0, credit: 2000, description: 'Payment Received' },
        { date: '2024-02-05', type: 'Sale', debit: 1200, credit: 0, description: 'Sale INV-004' }
      ]
    },
    {
      id: 'C003',
      name: 'Mike Wilson',
      contact: '+1 (555) 456-7890',
      email: 'mike.wilson@email.com',
      address: '789 Pine Rd, Chicago, IL 60601',
      openingBalance: 500,
      transactions: [
        { date: '2024-01-10', type: 'Receive', debit: 0, credit: 300, description: 'Advance Payment' },
        { date: '2024-01-28', type: 'Sale', debit: 700, credit: 0, description: 'Sale INV-005' },
        { date: '2024-02-08', type: 'Receive', debit: 0, credit: 200, description: 'Payment Received' }
      ]
    },
    {
      id: 'C004',
      name: 'Emma Davis',
      contact: '+1 (555) 321-0987',
      email: 'emma.davis@email.com',
      address: '321 Elm St, Houston, TX 77002',
      openingBalance: 0,
      transactions: [
        { date: '2024-01-30', type: 'Sale', debit: 1800, credit: 0, description: 'Sale INV-006' },
        { date: '2024-02-10', type: 'Sale', debit: 900, credit: 0, description: 'Sale INV-007' }
      ]
    }
  ];

  const [customerBalances, setCustomerBalances] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const reportRef = useRef();

  // Calculate customer balances
  const calculateBalances = () => {
    const balances = customers.map(customer => {
      const totalDebit = customer.transactions.reduce((sum, transaction) => sum + transaction.debit, 0);
      const totalCredit = customer.transactions.reduce((sum, transaction) => sum + transaction.credit, 0);
      
      // Opening balance is considered as credit (amount customer owes to business)
      const finalAmount = (customer.openingBalance + totalDebit) - totalCredit;
      const balanceType = finalAmount >= 0 ? 'Dr' : 'Cr';
      const absoluteAmount = Math.abs(finalAmount);

      return {
        ...customer,
        totalDebit,
        totalCredit,
        finalAmount: absoluteAmount,
        balanceType
      };
    });

    setCustomerBalances(balances);
  };

  // Filter customers based on search term
  const filteredBalances = customerBalances.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact.includes(searchTerm)
  );

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  const handlePrint = () => {
    const printContent = reportRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleExportPDF = () => {
    // Simple PDF export simulation
    const element = reportRef.current;
    const opt = {
      margin: 1,
      filename: 'customer_balance_report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    alert('PDF export functionality would be implemented here with a library like html2pdf.js');
  };

  // Initialize balances on component mount
  useState(() => {
    calculateBalances();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
              Customer Balance Report
            </h1>
            <p className="text-blue-600 text-lg">
              View customer balances and transaction details
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-blue-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search customers by name, ID, or contact..."
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
          <div className="flex gap-3">
            <button
              onClick={calculateBalances}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Total Customers</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{customerBalances.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Total Debit</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${customerBalances.reduce((sum, customer) => sum + customer.totalDebit, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Total Credit</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${customerBalances.reduce((sum, customer) => sum + customer.totalCredit, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Net Balance</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${customerBalances.reduce((sum, customer) => {
                  const balance = (customer.openingBalance + customer.totalDebit) - customer.totalCredit;
                  return sum + Math.abs(balance);
                }, 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Balance Report */}
      <div ref={reportRef} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-blue-100">
        {/* Report Header for Print */}
        <div className="print:block hidden p-6 border-b border-blue-200">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Customer Balance Report</h1>
            <p className="text-blue-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Customer ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Customer Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Opening Balance</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Debit</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Credit</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Final Amount</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredBalances.map((customer) => (
                  <tr key={customer.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {customer.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-blue-900">{customer.name}</div>
                      <div className="text-sm text-blue-600">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 text-blue-700">{customer.contact}</td>
                    <td className="px-6 py-4">
                      <span className="text-purple-600 font-semibold">
                        ${customer.openingBalance.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-red-600 font-semibold">
                        ${customer.totalDebit.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-semibold">
                        ${customer.totalCredit.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-2 rounded-lg font-bold text-lg ${
                        customer.balanceType === 'Dr' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        ${customer.finalAmount.toLocaleString()} {customer.balanceType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleCustomerClick(customer)}
                        className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200 text-sm font-medium"
                      >
                        View Details
                      </button>
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
            {filteredBalances.map((customer) => (
              <div key={customer.id} className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg">{customer.name}</h3>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      ID: {customer.id}
                    </span>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    customer.balanceType === 'Dr' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    ${customer.finalAmount.toLocaleString()} {customer.balanceType}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Contact:</span>
                    <span className="text-blue-700">{customer.contact}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-purple-600 font-bold">${customer.openingBalance.toLocaleString()}</div>
                      <div className="text-purple-500 text-xs">Opening</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-600 font-bold">${customer.totalDebit.toLocaleString()}</div>
                      <div className="text-red-500 text-xs">Debit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-600 font-bold">${customer.totalCredit.toLocaleString()}</div>
                      <div className="text-green-500 text-xs">Credit</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-4 pt-4 border-t border-blue-100">
                  <button
                    onClick={() => handleCustomerClick(customer)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredBalances.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-blue-900 mb-2">No customer balances found</h3>
            <p className="text-blue-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Customer balances will appear here'}
            </p>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {showDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-blue-50/30 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  Customer Details - {selectedCustomer.name}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-blue-400 hover:text-blue-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Customer ID:</span>
                      <span className="font-medium">{selectedCustomer.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Name:</span>
                      <span className="font-medium">{selectedCustomer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Contact:</span>
                      <span className="font-medium">{selectedCustomer.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Email:</span>
                      <span className="font-medium">{selectedCustomer.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-green-900 mb-3">Balance Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-600">Opening Balance:</span>
                      <span className="font-medium">${selectedCustomer.openingBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Total Debit:</span>
                      <span className="font-medium text-red-600">${selectedCustomer.totalDebit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Total Credit:</span>
                      <span className="font-medium text-green-600">${selectedCustomer.totalCredit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-green-200 pt-2">
                      <span className="text-green-600 font-semibold">Final Amount:</span>
                      <span className={`font-bold text-lg ${
                        selectedCustomer.balanceType === 'Dr' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ${selectedCustomer.finalAmount.toLocaleString()} {selectedCustomer.balanceType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-4">Transaction History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-blue-200 rounded-lg">
                    <thead>
                      <tr className="bg-blue-500 text-white">
                        <th className="px-4 py-3 text-left font-semibold text-sm">Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-sm">Type</th>
                        <th className="px-4 py-3 text-left font-semibold text-sm">Description</th>
                        <th className="px-4 py-3 text-left font-semibold text-sm">Debit</th>
                        <th className="px-4 py-3 text-left font-semibold text-sm">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCustomer.transactions.map((transaction, index) => (
                        <tr key={index} className="border-b border-blue-100 hover:bg-blue-50">
                          <td className="px-4 py-3 text-blue-700">{transaction.date}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              transaction.type === 'Sale' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-blue-700">{transaction.description}</td>
                          <td className="px-4 py-3 text-red-600 font-semibold">
                            {transaction.debit > 0 ? `$${transaction.debit.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-green-600 font-semibold">
                            {transaction.credit > 0 ? `$${transaction.credit.toLocaleString()}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}