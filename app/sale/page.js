// app/sales/page.js
'use client';

import { useState, useRef, useEffect } from 'react';

export default function SalesPage() {
  // Sample customers data
  const customers = [
    { id: 'C001', name: 'John Smith', contact: '+1 (555) 123-4567' },
    { id: 'C002', name: 'Sarah Johnson', contact: '+1 (555) 987-6543' },
    { id: 'C003', name: 'Mike Wilson', contact: '+1 (555) 456-7890' },
    { id: 'C004', name: 'Emma Davis', contact: '+1 (555) 321-0987' }
  ];

  // Sample products data
  const products = [
    { id: 'P001', name: 'iPhone 15 Pro', price: 1099 },
    { id: 'P002', name: 'Samsung Galaxy S24', price: 849 },
    { id: 'P003', name: 'MacBook Pro 16"', price: 2499 },
    { id: 'P004', name: 'Dell XPS 13', price: 1199 },
    { id: 'P005', name: 'iPad Air', price: 749 },
    { id: 'P006', name: 'AirPods Pro', price: 299 }
  ];

  const [sales, setSales] = useState([
    {
      id: 'SAL001',
      customerId: 'C001',
      customerName: 'John Smith',
      contact: '+1 (555) 123-4567',
      saleType: 'credit',
      items: [
        {
          productId: 'P001',
          productName: 'iPhone 15 Pro',
          rate: 1099,
          quantity: 2,
          discount: 50,
          amount: 2148
        },
        {
          productId: 'P006',
          productName: 'AirPods Pro',
          rate: 299,
          quantity: 1,
          discount: 10,
          amount: 289
        }
      ],
      totalAmount: 2437,
      totalDiscount: 60,
      netAmount: 2437,
      date: '2024-01-15'
    },
    {
      id: 'SAL002',
      customerId: '',
      customerName: 'Walk-in Customer',
      contact: 'N/A',
      saleType: 'cash',
      items: [
        {
          productId: 'P003',
          productName: 'MacBook Pro 16"',
          rate: 2499,
          quantity: 1,
          discount: 100,
          amount: 2399
        }
      ],
      totalAmount: 2399,
      totalDiscount: 100,
      netAmount: 2399,
      date: '2024-01-16'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState({
    id: '',
    customerId: '',
    customerName: '',
    contact: '',
    saleType: 'cash',
    items: [],
    totalAmount: 0,
    totalDiscount: 0,
    netAmount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const [currentItem, setCurrentItem] = useState({
    productId: '',
    productName: '',
    rate: 0,
    quantity: 1,
    discount: 0,
    amount: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // New state for filtration
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    saleType: 'all' // 'all', 'cash', 'credit'
  });

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: '',
    endDate: '',
    saleType: 'all'
  });

  // Refs for click outside detection
  const customerDropdownRef = useRef(null);
  const productDropdownRef = useRef(null);
  const customerInputRef = useRef(null);
  const productInputRef = useRef(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target) && 
          customerInputRef.current && !customerInputRef.current.contains(event.target)) {
        setShowCustomerDropdown(false);
      }
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target) &&
          productInputRef.current && !productInputRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle escape key to close dropdowns
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowCustomerDropdown(false);
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentSale.items.length === 0) {
      alert('Please add at least one item to the sale');
      return;
    }

    if (currentSale.saleType === 'credit' && !currentSale.customerName) {
      alert('Please select a customer for credit sale');
      return;
    }

    if (currentSale.id) {
      // Update existing sale
      setSales(sales.map(s => s.id === currentSale.id ? currentSale : s));
    } else {
      // Add new sale
      const newSale = { 
        ...currentSale, 
        id: 'SAL' + String(sales.length + 1).padStart(3, '0')
      };
      setSales([...sales, newSale]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (sale) => {
    setCurrentSale(sale);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this sale record?')) {
      setSales(sales.filter(s => s.id !== id));
    }
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setCurrentSale({ 
      id: '',
      customerId: '',
      customerName: '',
      contact: '',
      saleType: 'cash',
      items: [],
      totalAmount: 0,
      totalDiscount: 0,
      netAmount: 0,
      date: new Date().toISOString().split('T')[0]
    });
    setCurrentItem({
      productId: '',
      productName: '',
      rate: 0,
      quantity: 1,
      discount: 0,
      amount: 0
    });
    setShowCustomerDropdown(false);
    setShowProductDropdown(false);
    setCustomerSearch('');
    setProductSearch('');
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.contact.includes(customerSearch)
  );

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleCustomerSelect = (customer) => {
    setCurrentSale({
      ...currentSale,
      customerId: customer.id,
      customerName: customer.name,
      contact: customer.contact
    });
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
  };

  const handleProductSelect = (product) => {
    const amount = calculateAmount(product.price, currentItem.quantity, currentItem.discount);
    setCurrentItem({
      ...currentItem,
      productId: product.id,
      productName: product.name,
      rate: product.price,
      amount: amount
    });
    setProductSearch(product.name);
    setShowProductDropdown(false);
  };

  const calculateAmount = (rate, quantity, discount) => {
    const total = rate * quantity;
    return total - discount;
  };

  const handleQuantityChange = (quantity) => {
    const amount = calculateAmount(currentItem.rate, quantity, currentItem.discount);
    setCurrentItem({
      ...currentItem,
      quantity: quantity,
      amount: amount
    });
  };

  const handleRateChange = (rate) => {
    const amount = calculateAmount(rate, currentItem.quantity, currentItem.discount);
    setCurrentItem({
      ...currentItem,
      rate: rate,
      amount: amount
    });
  };

  const handleDiscountChange = (discount) => {
    const amount = calculateAmount(currentItem.rate, currentItem.quantity, discount);
    setCurrentItem({
      ...currentItem,
      discount: discount,
      amount: amount
    });
  };

  const handleSaleTypeChange = (saleType) => {
    if (saleType === 'cash') {
      setCurrentSale({
        ...currentSale,
        saleType: saleType,
        customerId: '',
        customerName: 'Walk-in Customer',
        contact: 'N/A'
      });
      setCustomerSearch('');
    } else {
      setCurrentSale({
        ...currentSale,
        saleType: saleType,
        customerName: '',
        contact: ''
      });
    }
  };

  const addItemToSale = () => {
    if (!currentItem.productId || currentItem.quantity <= 0) {
      alert('Please select a product and enter valid quantity');
      return;
    }

    const existingItemIndex = currentSale.items.findIndex(
      item => item.productId === currentItem.productId
    );

    let updatedItems;
    if (existingItemIndex > -1) {
      // Update existing item
      updatedItems = [...currentSale.items];
      updatedItems[existingItemIndex] = { ...currentItem };
    } else {
      // Add new item
      updatedItems = [...currentSale.items, { ...currentItem }];
    }

    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
    const totalDiscount = updatedItems.reduce((sum, item) => sum + item.discount, 0);
    const netAmount = totalAmount - totalDiscount;
    
    setCurrentSale({
      ...currentSale,
      items: updatedItems,
      totalAmount: totalAmount,
      totalDiscount: totalDiscount,
      netAmount: netAmount
    });

    // Reset current item for next entry
    setCurrentItem({
      productId: '',
      productName: '',
      rate: 0,
      quantity: 1,
      discount: 0,
      amount: 0
    });
    setProductSearch('');
  };

  const removeItemFromSale = (productId) => {
    const updatedItems = currentSale.items.filter(item => item.productId !== productId);
    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
    const totalDiscount = updatedItems.reduce((sum, item) => sum + item.discount, 0);
    const netAmount = totalAmount - totalDiscount;
    
    setCurrentSale({
      ...currentSale,
      items: updatedItems,
      totalAmount: totalAmount,
      totalDiscount: totalDiscount,
      netAmount: netAmount
    });
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  // Clear all filters
  const clearFilters = () => {
    const resetFilters = {
      startDate: '',
      endDate: '',
      saleType: 'all'
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  // Filter sales based on search term and applied filters
  const filteredSales = sales.filter(sale => {
    // Text search filter
    const matchesSearch = sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filter
    const saleDate = new Date(sale.date);
    const startDate = appliedFilters.startDate ? new Date(appliedFilters.startDate) : null;
    const endDate = appliedFilters.endDate ? new Date(appliedFilters.endDate) : null;
    
    const matchesDate = (!startDate || saleDate >= startDate) && 
                       (!endDate || saleDate <= endDate);
    
    // Sale type filter
    const matchesType = appliedFilters.saleType === 'all' || sale.saleType === appliedFilters.saleType;
    
    return matchesSearch && matchesDate && matchesType;
  });

  // Calculate statistics based on filtered sales
  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.netAmount, 0);
  const totalItemsSold = filteredSales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );
  const uniqueCustomers = new Set(filteredSales.map(s => s.customerId)).size;
  const totalTransactions = filteredSales.length;

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
          Sales Management
        </h1>
        <p className="text-blue-600 text-lg">
          Manage your sales orders and customer transactions
        </p>
      </div>

      {/* Action Bar with Search, Filters and Add Button */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-blue-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by customer name or sale ID..."
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
            New Sale
          </button>
        </div>

        {/* Filter Section */}
        <div className="mt-6 pt-6 border-t border-blue-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h3 className="text-lg font-semibold text-blue-900">Filter Sales:</h3>
            
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-3xl">
              {/* Date Range Filters */}
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <div className="flex-1">
                  <label className="block text-sm text-blue-700 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-blue-700 font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Sale Type Filter */}
              <div className="sm:w-48">
                <label className="block text-sm text-blue-700 font-medium mb-1">Sale Type</label>
                <select
                  value={filters.saleType}
                  onChange={(e) => handleFilterChange('saleType', e.target.value)}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Types</option>
                  <option value="cash">Cash Sales</option>
                  <option value="credit">Credit Sales</option>
                </select>
              </div>

              {/* Apply Filter Button */}
              <div className="sm:w-auto flex items-end gap-2">
                <button
                  onClick={applyFilters}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
                >
                  Apply Filter
                </button>
                <button
                  onClick={clearFilters}
                  className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {(appliedFilters.startDate || appliedFilters.endDate || appliedFilters.saleType !== 'all') && (
            <div className="mt-4 flex flex-wrap gap-2">
              {appliedFilters.startDate && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  From: {appliedFilters.startDate}
                  <button
                    onClick={() => {
                      const newFilters = { ...appliedFilters, startDate: '' };
                      setAppliedFilters(newFilters);
                      setFilters(newFilters);
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {appliedFilters.endDate && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  To: {appliedFilters.endDate}
                  <button
                    onClick={() => {
                      const newFilters = { ...appliedFilters, endDate: '' };
                      setAppliedFilters(newFilters);
                      setFilters(newFilters);
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {appliedFilters.saleType !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Type: {appliedFilters.saleType === 'cash' ? 'Cash' : 'Credit'}
                  <button
                    onClick={() => {
                      const newFilters = { ...appliedFilters, saleType: 'all' };
                      setAppliedFilters(newFilters);
                      setFilters(newFilters);
                    }}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Total Sales</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${totalSales.toLocaleString()}
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
              <p className="text-blue-600 font-medium">Items Sold</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{totalItemsSold}</p>
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
              <p className="text-blue-600 font-medium">Customers</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{uniqueCustomers}</p>
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
              <p className="text-blue-600 font-medium">Transactions</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{totalTransactions}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table/Cards */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-blue-100">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Sale ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Customer Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Net Amount</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {sale.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-blue-900">{sale.customerName}</div>
                        <div className="text-sm text-blue-600">{sale.contact}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        sale.saleType === 'credit' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {sale.saleType === 'credit' ? 'Credit' : 'Cash'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-700">
                        {sale.items.length} item(s)
                        <div className="mt-1 text-xs text-blue-600">
                          {sale.items.map(item => item.productName).join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-bold text-lg">
                        ${sale.netAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-700">{sale.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(sale)}
                          className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(sale.id)}
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
            {filteredSales.map((sale) => (
              <div key={sale.id} className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg">{sale.customerName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        ID: {sale.id}
                      </span>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        sale.saleType === 'credit' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {sale.saleType === 'credit' ? 'Credit' : 'Cash'}
                      </span>
                    </div>
                  </div>
                  <span className="text-green-600 font-bold text-lg">
                    ${sale.netAmount.toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Contact:</span>
                    <span className="text-blue-700">{sale.contact}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Date:</span>
                    <span className="text-blue-700">{sale.date}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Items:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                      {sale.items.length} items
                    </span>
                  </div>

                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                    <span className="font-medium">Products: </span>
                    {sale.items.map(item => item.productName).join(', ')}
                  </div>
                </div>

                <div className="flex space-x-3 mt-4 pt-4 border-t border-blue-100">
                  <button
                    onClick={() => handleEdit(sale)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sale.id)}
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
        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
            </svg>
            <h3 className="text-lg font-medium text-blue-900 mb-2">No sales records found</h3>
            <p className="text-blue-600 mb-4">
              {searchTerm || appliedFilters.startDate || appliedFilters.endDate || appliedFilters.saleType !== 'all' 
                ? 'Try adjusting your search or filter terms' 
                : 'Get started by creating your first sale'}
            </p>
            {!searchTerm && !appliedFilters.startDate && !appliedFilters.endDate && appliedFilters.saleType === 'all' && (
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Create First Sale
              </button>
            )}
          </div>
        )}
      </div>

      {/* The rest of the modal code remains exactly the same */}
      {/* Add/Edit Sale Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-50/30 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {currentSale.id ? 'Edit Sale' : 'New Sale'}
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
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sale ID, Date, and Sale Type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-blue-700 font-medium mb-2">Sale ID *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        value={currentSale.id || `SAL${String(sales.length + 1).padStart(3, '0')}`}
                        onChange={(e) => setCurrentSale({...currentSale, id: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                        placeholder="Sale ID"
                      />
                    </div>
                  </div>

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
                        value={currentSale.date}
                        onChange={(e) => setCurrentSale({...currentSale, date: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-blue-700 font-medium mb-2">Sale Type *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <select
                        required
                        value={currentSale.saleType}
                        onChange={(e) => handleSaleTypeChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 appearance-none"
                      >
                        <option value="cash">Cash Sale</option>
                        <option value="credit">Credit Sale</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Selection - Only for Credit Sales */}
                {currentSale.saleType === 'credit' && (
                  <div>
                    <label className="block text-blue-700 font-medium mb-2">Customer *</label>
                    <div className="relative" ref={customerInputRef}>
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        value={customerSearch}
                        onChange={(e) => {
                          setCustomerSearch(e.target.value);
                          setShowCustomerDropdown(true);
                        }}
                        onFocus={() => setShowCustomerDropdown(true)}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                        placeholder="Search customer by name or contact..."
                      />
                      
                      {showCustomerDropdown && (
                        <div 
                          ref={customerDropdownRef}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto"
                        >
                          {filteredCustomers.map((customer) => (
                            <div
                              key={customer.id}
                              onClick={() => handleCustomerSelect(customer)}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-blue-100 last:border-b-0"
                            >
                              <div className="font-medium text-blue-900">{customer.name}</div>
                              <div className="text-sm text-blue-600">{customer.contact}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {currentSale.customerName && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-green-700 font-medium">Selected: {currentSale.customerName} - {currentSale.contact}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Add Items Section */}
                <div className="border-t border-blue-200 pt-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">Add Sale Items</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                    {/* Product Search */}
                    <div className="md:col-span-2">
                      <label className="block text-blue-700 font-medium mb-2">Product</label>
                      <div className="relative" ref={productInputRef}>
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => {
                            setProductSearch(e.target.value);
                            setShowProductDropdown(true);
                          }}
                          onFocus={() => setShowProductDropdown(true)}
                          className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                          placeholder="Search product..."
                        />
                        
                        {showProductDropdown && (
                          <div 
                            ref={productDropdownRef}
                            className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto"
                          >
                            {filteredProducts.map((product) => (
                              <div
                                key={product.id}
                                onClick={() => handleProductSelect(product)}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-blue-100 last:border-b-0"
                              >
                                <div className="font-medium text-blue-900">{product.name}</div>
                                <div className="text-sm text-blue-600">${product.price}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rate */}
                    <div>
                      <label className="block text-blue-700 font-medium mb-2">Rate</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentItem.rate}
                        onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                        className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                        placeholder="Rate"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-blue-700 font-medium mb-2">Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={currentItem.quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                        placeholder="Qty"
                      />
                    </div>

                    {/* Discount */}
                    <div>
                      <label className="block text-blue-700 font-medium mb-2">Discount</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentItem.discount}
                        onChange={(e) => handleDiscountChange(parseFloat(e.target.value))}
                        className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                        placeholder="Discount"
                      />
                    </div>

                    {/* Add Button */}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={addItemToSale}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200"
                      >
                        Add Item
                      </button>
                    </div>
                  </div>

                  {/* Current Item Preview */}
                  {currentItem.productName && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm text-blue-700">
                        <span className="font-medium">Selected Product:</span> {currentItem.productName} | 
                        <span className="font-medium"> Rate:</span> ${currentItem.rate} | 
                        <span className="font-medium"> Qty:</span> {currentItem.quantity} | 
                        <span className="font-medium"> Discount:</span> ${currentItem.discount} | 
                        <span className="font-medium"> Amount:</span> ${currentItem.amount}
                      </div>
                    </div>
                  )}

                  {/* Items Table */}
                  {currentSale.items.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-blue-900 mb-3">Sale Items</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-blue-200 rounded-lg">
                          <thead>
                            <tr className="bg-blue-500 text-white">
                              <th className="px-4 py-3 text-left font-semibold text-sm">Product</th>
                              <th className="px-4 py-3 text-left font-semibold text-sm">Rate</th>
                              <th className="px-4 py-3 text-left font-semibold text-sm">Qty</th>
                              <th className="px-4 py-3 text-left font-semibold text-sm">Discount</th>
                              <th className="px-4 py-3 text-left font-semibold text-sm">Amount</th>
                              <th className="px-4 py-3 text-left font-semibold text-sm">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentSale.items.map((item, index) => (
                              <tr key={index} className="border-b border-blue-100 hover:bg-blue-50">
                                <td className="px-4 py-3 text-blue-900 font-medium">{item.productName}</td>
                                <td className="px-4 py-3 text-blue-700">${item.rate}</td>
                                <td className="px-4 py-3 text-blue-700">{item.quantity}</td>
                                <td className="px-4 py-3 text-red-600">${item.discount}</td>
                                <td className="px-4 py-3 text-green-600 font-semibold">${item.amount}</td>
                                <td className="px-4 py-3">
                                  <button
                                    type="button"
                                    onClick={() => removeItemFromSale(item.productId)}
                                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-blue-50">
                              <td colSpan="3" className="px-4 py-3 text-right font-semibold text-blue-900">
                                Total Amount:
                              </td>
                              <td className="px-4 py-3 text-blue-700 font-semibold">
                                ${currentSale.totalAmount}
                              </td>
                              <td className="px-4 py-3 text-green-600 font-bold text-lg">
                                ${currentSale.totalAmount}
                              </td>
                              <td></td>
                            </tr>
                            <tr className="bg-yellow-50">
                              <td colSpan="3" className="px-4 py-3 text-right font-semibold text-blue-900">
                                Total Discount:
                              </td>
                              <td className="px-4 py-3 text-red-600 font-semibold">
                                -${currentSale.totalDiscount}
                              </td>
                              <td className="px-4 py-3 text-red-600 font-bold text-lg">
                                -${currentSale.totalDiscount}
                              </td>
                              <td></td>
                            </tr>
                            <tr className="bg-green-50">
                              <td colSpan="3" className="px-4 py-3 text-right font-semibold text-blue-900">
                                Net Amount:
                              </td>
                              <td className="px-4 py-3 text-blue-700 font-semibold">
                                ${currentSale.netAmount}
                              </td>
                              <td className="px-4 py-3 text-green-700 font-bold text-xl">
                                ${currentSale.netAmount}
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-6 border-t border-blue-200">
                  <button
                    type="submit"
                    disabled={currentSale.items.length === 0 || (currentSale.saleType === 'credit' && !currentSale.customerName)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {currentSale.id ? 'Update Sale' : 'Create Sale'}
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