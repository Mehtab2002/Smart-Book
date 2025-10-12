// app/cashbook/page.js
'use client';

import { useState, useRef } from 'react';

export default function CashbookPage() {
  // Sample cashbook data
  const initialCashbookData = [
    {
      id: 1,
      date: '2024-01-01',
      description: 'Opening Balance',
      voucherNo: 'OB001',
      debit: 50000,
      credit: 0,
      balance: 50000
    },
    {
      id: 2,
      date: '2024-01-05',
      description: 'Cash Sale - INV-001',
      voucherNo: 'CS001',
      debit: 15000,
      credit: 0,
      balance: 65000
    },
    {
      id: 3,
      date: '2024-01-08',
      description: 'Payment to Global Tech Supplies',
      voucherNo: 'CP001',
      debit: 0,
      credit: 25000,
      balance: 40000
    },
    {
      id: 4,
      date: '2024-01-12',
      description: 'Cash Sale - INV-002',
      voucherNo: 'CS002',
      debit: 12000,
      credit: 0,
      balance: 52000
    },
    {
      id: 5,
      date: '2024-01-15',
      description: 'Office Rent Payment',
      voucherNo: 'CP002',
      debit: 0,
      credit: 15000,
      balance: 37000
    },
    {
      id: 6,
      date: '2024-01-18',
      description: 'Cash Sale - INV-003',
      voucherNo: 'CS003',
      debit: 18000,
      credit: 0,
      balance: 55000
    },
    {
      id: 7,
      date: '2024-01-22',
      description: 'Utility Bills Payment',
      voucherNo: 'CP003',
      debit: 0,
      credit: 8000,
      balance: 47000
    },
    {
      id: 8,
      date: '2024-01-25',
      description: 'Cash Sale - INV-004',
      voucherNo: 'CS004',
      debit: 22000,
      credit: 0,
      balance: 69000
    },
    {
      id: 9,
      date: '2024-01-28',
      description: 'Salary Payment',
      voucherNo: 'CP004',
      debit: 0,
      credit: 35000,
      balance: 34000
    },
    {
      id: 10,
      date: '2024-01-31',
      description: 'Cash Sale - INV-005',
      voucherNo: 'CS005',
      debit: 16000,
      credit: 0,
      balance: 50000
    }
  ];

  const [cashbookData, setCashbookData] = useState(initialCashbookData);
  const [filteredData, setFilteredData] = useState(initialCashbookData);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    voucherNo: '',
    debit: 0,
    credit: 0
  });
  const reportRef = useRef();

  // Calculate totals
  const totals = {
    totalDebit: cashbookData.reduce((sum, entry) => sum + entry.debit, 0),
    totalCredit: cashbookData.reduce((sum, entry) => sum + entry.credit, 0),
    closingBalance: cashbookData[cashbookData.length - 1]?.balance || 0
  };

  const handleSearch = () => {
    let filtered = cashbookData;

    // Filter by date range
    filtered = filtered.filter(entry => 
      entry.date >= dateRange.startDate && entry.date <= dateRange.endDate
    );

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.voucherNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    
    // Calculate new balance
    const lastEntry = cashbookData[cashbookData.length - 1];
    const newBalance = lastEntry.balance + newEntry.debit - newEntry.credit;

    const entry = {
      id: cashbookData.length + 1,
      date: newEntry.date,
      description: newEntry.description,
      voucherNo: newEntry.voucherNo,
      debit: newEntry.debit,
      credit: newEntry.credit,
      balance: newBalance
    };

    const updatedData = [...cashbookData, entry];
    setCashbookData(updatedData);
    setFilteredData(updatedData);
    setIsModalOpen(false);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      description: '',
      voucherNo: '',
      debit: 0,
      credit: 0
    });
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
    alert('PDF export functionality would be implemented here with a library like html2pdf.js');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDateRange({
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    });
    setFilteredData(cashbookData);
  };

  // Initialize filtered data
  useState(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
              Cash Book
            </h1>
            <p className="text-blue-600 text-lg">
              Track all cash transactions and maintain cash balance
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Total Transactions</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{filteredData.length}</p>
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
              <p className="text-blue-600 font-medium">Total Receipts</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${totals.totalDebit.toLocaleString()}
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
              <p className="text-blue-600 font-medium">Total Payments</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${totals.totalCredit.toLocaleString()}
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
              <p className="text-blue-600 font-medium">Closing Balance</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${totals.closingBalance.toLocaleString()}
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

      {/* Action Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-blue-100">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-blue-700 font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
              className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
              className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-blue-700 font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by description or voucher no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="flex items-end gap-3">
            <button
              onClick={handleSearch}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-blue-600">
            Showing {filteredData.length} of {cashbookData.length} transactions
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Entry
          </button>
        </div>
      </div>

      {/* Cashbook Report */}
      <div ref={reportRef} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-blue-100">
        {/* Report Header for Print */}
        <div className="print:block hidden p-6 border-b border-blue-200">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Cash Book Report</h1>
            <p className="text-blue-600">
              Period: {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
            </p>
            <p className="text-blue-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Voucher No</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-right font-semibold text-sm uppercase tracking-wider">Debit (Receipts)</th>
                  <th className="px-6 py-4 text-right font-semibold text-sm uppercase tracking-wider">Credit (Payments)</th>
                  <th className="px-6 py-4 text-right font-semibold text-sm uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredData.map((entry) => (
                  <tr key={entry.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 text-blue-700">{entry.date}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {entry.voucherNo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-900">{entry.description}</td>
                    <td className="px-6 py-4 text-right">
                      {entry.debit > 0 && (
                        <span className="text-green-600 font-semibold">
                          ${entry.debit.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {entry.credit > 0 && (
                        <span className="text-red-600 font-semibold">
                          ${entry.credit.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-blue-600 font-bold">
                        ${entry.balance.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-blue-50">
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-right font-semibold text-blue-900">
                    Totals:
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-green-600 font-bold text-lg">
                      ${filteredData.reduce((sum, entry) => sum + entry.debit, 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-red-600 font-bold text-lg">
                      ${filteredData.reduce((sum, entry) => sum + entry.credit, 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-blue-600 font-bold text-lg">
                      ${filteredData[filteredData.length - 1]?.balance.toLocaleString() || '0'}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          <div className="p-4 space-y-4">
            {filteredData.map((entry) => (
              <div key={entry.id} className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium mb-2">
                      {entry.voucherNo}
                    </span>
                    <div className="text-blue-700 text-sm">{entry.date}</div>
                  </div>
                  <span className="text-blue-600 font-bold">
                    ${entry.balance.toLocaleString()}
                  </span>
                </div>
                
                <div className="text-blue-900 font-medium mb-3">{entry.description}</div>
                
                <div className="flex justify-between items-center">
                  {entry.debit > 0 ? (
                    <span className="text-green-600 font-semibold">
                      +${entry.debit.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      -${entry.credit.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-blue-900 mb-2">No transactions found</h3>
            <p className="text-blue-600 mb-4">
              {searchTerm || dateRange.startDate !== '2024-01-01' || dateRange.endDate !== '2024-01-31' 
                ? 'Try adjusting your filters' 
                : 'Get started by adding your first cash transaction'
              }
            </p>
            {!searchTerm && dateRange.startDate === '2024-01-01' && dateRange.endDate === '2024-01-31' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Add First Transaction
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add New Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-50/30 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  Add Cash Transaction
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
              
              <form onSubmit={handleAddEntry} className="space-y-4">
                <div>
                  <label className="block text-blue-700 font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-blue-700 font-medium mb-2">Voucher No *</label>
                  <input
                    type="text"
                    required
                    value={newEntry.voucherNo}
                    onChange={(e) => setNewEntry({...newEntry, voucherNo: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter voucher number"
                  />
                </div>

                <div>
                  <label className="block text-blue-700 font-medium mb-2">Description *</label>
                  <input
                    type="text"
                    required
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter transaction description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-blue-700 font-medium mb-2">Debit (Receipt)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newEntry.debit}
                      onChange={(e) => setNewEntry({
                        ...newEntry, 
                        debit: parseFloat(e.target.value) || 0,
                        credit: 0 // Reset credit when debit is entered
                      })}
                      className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-700 font-medium mb-2">Credit (Payment)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newEntry.credit}
                      onChange={(e) => setNewEntry({
                        ...newEntry, 
                        credit: parseFloat(e.target.value) || 0,
                        debit: 0 // Reset debit when credit is entered
                      })}
                      className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Add Transaction
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