// app/supplier-balance/page.js
'use client';

import { useState, useRef } from 'react';

export default function SupplierBalancePage() {
  // Sample supplier data with transactions
  const suppliers = [
    {
      id: 'S001',
      name: 'Global Tech Supplies',
      contact: '+1 (555) 234-5678',
      email: 'orders@globaltech.com',
      address: '789 Tech Park, Silicon Valley, CA 94025',
      openingBalance: 5000,
      transactions: [
        { date: '2024-01-15', type: 'Purchase', debit: 0, credit: 15000, description: 'Purchase PO-001' },
        { date: '2024-01-20', type: 'Payment', debit: 8000, credit: 0, description: 'Payment Made' },
        { date: '2024-01-25', type: 'Purchase', debit: 0, credit: 12000, description: 'Purchase PO-002' },
        { date: '2024-02-01', type: 'Payment', debit: 5000, credit: 0, description: 'Partial Payment' }
      ]
    },
    {
      id: 'S002',
      name: 'Premium Raw Materials Ltd',
      contact: '+1 (555) 345-6789',
      email: 'supply@premiummaterials.com',
      address: '456 Industrial Zone, Houston, TX 77002',
      openingBalance: 8000,
      transactions: [
        { date: '2024-01-18', type: 'Purchase', debit: 0, credit: 25000, description: 'Purchase PO-003' },
        { date: '2024-01-22', type: 'Payment', debit: 15000, credit: 0, description: 'Payment Made' },
        { date: '2024-02-05', type: 'Purchase', debit: 0, credit: 18000, description: 'Purchase PO-004' }
      ]
    },
    {
      id: 'S003',
      name: 'Quality Parts Inc',
      contact: '+1 (555) 456-7890',
      email: 'info@qualityparts.com',
      address: '321 Manufacturing Ave, Detroit, MI 48201',
      openingBalance: 2000,
      transactions: [
        { date: '2024-01-10', type: 'Payment', debit: 1000, credit: 0, description: 'Advance Payment' },
        { date: '2024-01-28', type: 'Purchase', debit: 0, credit: 15000, description: 'Purchase PO-005' },
        { date: '2024-02-08', type: 'Payment', debit: 5000, credit: 0, description: 'Payment Made' }
      ]
    },
    {
      id: 'S004',
      name: 'Electro Components Corp',
      contact: '+1 (555) 567-8901',
      email: 'sales@electrocorp.com',
      address: '654 Circuit Rd, Austin, TX 78701',
      openingBalance: 0,
      transactions: [
        { date: '2024-01-30', type: 'Purchase', debit: 0, credit: 22000, description: 'Purchase PO-006' },
        { date: '2024-02-10', type: 'Purchase', debit: 0, credit: 12000, description: 'Purchase PO-007' }
      ]
    },
    {
      id: 'S005',
      name: 'Office Solutions Co',
      contact: '+1 (555) 678-9012',
      email: 'orders@officesolutions.com',
      address: '987 Business Ave, Chicago, IL 60601',
      openingBalance: 3000,
      transactions: [
        { date: '2024-01-12', type: 'Payment', debit: 3000, credit: 0, description: 'Advance Payment' },
        { date: '2024-01-29', type: 'Purchase', debit: 0, credit: 8000, description: 'Purchase PO-008' },
        { date: '2024-02-12', type: 'Payment', debit: 4000, credit: 0, description: 'Payment Made' }
      ]
    }
  ];

  const [supplierBalances, setSupplierBalances] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const reportRef = useRef();

  // Calculate supplier balances
  const calculateBalances = () => {
    const balances = suppliers.map(supplier => {
      // For suppliers:
      // Debit = Payments made to supplier (money going out)
      // Credit = Purchases from supplier (money owed to supplier)
      const totalDebit = supplier.transactions.reduce((sum, transaction) => sum + transaction.debit, 0);
      const totalCredit = supplier.transactions.reduce((sum, transaction) => sum + transaction.credit, 0);
      
      // Opening balance is considered as credit (amount business owes to supplier)
      // Final Amount = (Opening Balance + Total Credit) - Total Debit
      const finalAmount = (supplier.openingBalance + totalCredit) - totalDebit;
      const balanceType = finalAmount >= 0 ? 'Cr' : 'Dr'; // Opposite of customer
      const absoluteAmount = Math.abs(finalAmount);

      return {
        ...supplier,
        totalDebit,
        totalCredit,
        finalAmount: absoluteAmount,
        balanceType
      };
    });

    setSupplierBalances(balances);
  };

  // Filter suppliers based on search term
  const filteredBalances = supplierBalances.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.includes(searchTerm)
  );

  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
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
              Supplier Balance Report
            </h1>
            <p className="text-blue-600 text-lg">
              View supplier balances and transaction details
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
                placeholder="Search suppliers by name, ID, or contact..."
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
              <p className="text-blue-600 font-medium">Total Suppliers</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{supplierBalances.length}</p>
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
              <p className="text-blue-600 font-medium">Total Payments</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${supplierBalances.reduce((sum, supplier) => sum + supplier.totalDebit, 0).toLocaleString()}
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
              <p className="text-blue-600 font-medium">Total Purchases</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${supplierBalances.reduce((sum, supplier) => sum + supplier.totalCredit, 0).toLocaleString()}
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
              <p className="text-blue-600 font-medium">Net Balance</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${supplierBalances.reduce((sum, supplier) => {
                  const balance = (supplier.openingBalance + supplier.totalCredit) - supplier.totalDebit;
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

      {/* Supplier Balance Report */}
      <div ref={reportRef} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-blue-100">
        {/* Report Header for Print */}
        <div className="print:block hidden p-6 border-b border-blue-200">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Supplier Balance Report</h1>
            <p className="text-blue-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Supplier ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Supplier Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Opening Balance</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Payments (Debit)</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Purchases (Credit)</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Final Amount</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredBalances.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {supplier.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-blue-900">{supplier.name}</div>
                      <div className="text-sm text-blue-600">{supplier.email}</div>
                    </td>
                    <td className="px-6 py-4 text-blue-700">{supplier.contact}</td>
                    <td className="px-6 py-4">
                      <span className="text-purple-600 font-semibold">
                        ${supplier.openingBalance.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-semibold">
                        ${supplier.totalDebit.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-red-600 font-semibold">
                        ${supplier.totalCredit.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-2 rounded-lg font-bold text-lg ${
                        supplier.balanceType === 'Cr' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        ${supplier.finalAmount.toLocaleString()} {supplier.balanceType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSupplierClick(supplier)}
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
            {filteredBalances.map((supplier) => (
              <div key={supplier.id} className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg">{supplier.name}</h3>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      ID: {supplier.id}
                    </span>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    supplier.balanceType === 'Cr' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    ${supplier.finalAmount.toLocaleString()} {supplier.balanceType}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Contact:</span>
                    <span className="text-blue-700">{supplier.contact}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-purple-600 font-bold">${supplier.openingBalance.toLocaleString()}</div>
                      <div className="text-purple-500 text-xs">Opening</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-600 font-bold">${supplier.totalDebit.toLocaleString()}</div>
                      <div className="text-green-500 text-xs">Payments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-600 font-bold">${supplier.totalCredit.toLocaleString()}</div>
                      <div className="text-red-500 text-xs">Purchases</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-4 pt-4 border-t border-blue-100">
                  <button
                    onClick={() => handleSupplierClick(supplier)}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-medium text-blue-900 mb-2">No supplier balances found</h3>
            <p className="text-blue-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Supplier balances will appear here'}
            </p>
          </div>
        )}
      </div>

      {/* Supplier Details Modal */}
      {showDetails && selectedSupplier && (
        <div className="fixed inset-0 bg-blue-50/30 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  Supplier Details - {selectedSupplier.name}
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

              {/* Supplier Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-3">Supplier Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Supplier ID:</span>
                      <span className="font-medium">{selectedSupplier.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Name:</span>
                      <span className="font-medium">{selectedSupplier.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Contact:</span>
                      <span className="font-medium">{selectedSupplier.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Email:</span>
                      <span className="font-medium">{selectedSupplier.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-green-900 mb-3">Balance Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-600">Opening Balance:</span>
                      <span className="font-medium">${selectedSupplier.openingBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Total Payments:</span>
                      <span className="font-medium text-green-600">${selectedSupplier.totalDebit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Total Purchases:</span>
                      <span className="font-medium text-red-600">${selectedSupplier.totalCredit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-green-200 pt-2">
                      <span className="text-green-600 font-semibold">Final Amount:</span>
                      <span className={`font-bold text-lg ${
                        selectedSupplier.balanceType === 'Cr' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        ${selectedSupplier.finalAmount.toLocaleString()} {selectedSupplier.balanceType}
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
                        <th className="px-4 py-3 text-left font-semibold text-sm">Payments (Debit)</th>
                        <th className="px-4 py-3 text-left font-semibold text-sm">Purchases (Credit)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSupplier.transactions.map((transaction, index) => (
                        <tr key={index} className="border-b border-blue-100 hover:bg-blue-50">
                          <td className="px-4 py-3 text-blue-700">{transaction.date}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              transaction.type === 'Purchase' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {transaction.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-blue-700">{transaction.description}</td>
                          <td className="px-4 py-3 text-green-600 font-semibold">
                            {transaction.debit > 0 ? `$${transaction.debit.toLocaleString()}` : '-'}
                          </td>
                          <td className="px-4 py-3 text-red-600 font-semibold">
                            {transaction.credit > 0 ? `$${transaction.credit.toLocaleString()}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Balance Explanation */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h4 className="font-semibold text-yellow-900 mb-2">Balance Explanation</h4>
                <div className="text-sm text-yellow-700 space-y-1">
                  <p><strong>Cr (Credit Balance):</strong> Business owes money to supplier</p>
                  <p><strong>Dr (Debit Balance):</strong> Supplier owes money to business (overpayment/advance)</p>
                  <p><strong>Calculation:</strong> Final Amount = (Opening Balance + Purchases) - Payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}