// app/purchase/page.js
'use client';

import { useState, useRef, useEffect } from 'react';

export default function PurchasePage() {
  // Sample suppliers data
  const suppliers = [
    { id: 'S001', name: 'Global Tech Supplies', contact: '+1 (555) 234-5678' },
    { id: 'S002', name: 'Premium Raw Materials Ltd', contact: '+1 (555) 345-6789' },
    { id: 'S003', name: 'Quality Parts Inc', contact: '+1 (555) 456-7890' },
    { id: 'S004', name: 'Electro Components Corp', contact: '+1 (555) 567-8901' }
  ];

  // Sample products data
  const products = [
    { id: 'P001', name: 'iPhone 15 Pro', price: 899 },
    { id: 'P002', name: 'Samsung Galaxy S24', price: 699 },
    { id: 'P003', name: 'MacBook Pro 16"', price: 2399 },
    { id: 'P004', name: 'Dell XPS 13', price: 999 },
    { id: 'P005', name: 'iPad Air', price: 599 },
    { id: 'P006', name: 'AirPods Pro', price: 249 }
  ];

  const [purchases, setPurchases] = useState([
    {
      id: 'PUR001',
      supplierId: 'S001',
      supplierName: 'Global Tech Supplies',
      contact: '+1 (555) 234-5678',
      items: [
        {
          productId: 'P001',
          productName: 'iPhone 15 Pro',
          price: 899,
          quantity: 5,
          amount: 4495
        },
        {
          productId: 'P006',
          productName: 'AirPods Pro',
          price: 249,
          quantity: 10,
          amount: 2490
        }
      ],
      totalAmount: 6985,
      netAmount: 6985,
      date: '2024-01-15'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState({
    id: '',
    supplierId: '',
    supplierName: '',
    contact: '',
    items: [],
    totalAmount: 0,
    netAmount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const [currentItem, setCurrentItem] = useState({
    productId: '',
    productName: '',
    price: 0,
    quantity: 1,
    amount: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // New state for filtration
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    supplier: 'all' // 'all' or specific supplier ID
  });

  const [appliedFilters, setAppliedFilters] = useState({
    startDate: '',
    endDate: '',
    supplier: 'all'
  });

  // Refs for click outside detection
  const supplierDropdownRef = useRef(null);
  const productDropdownRef = useRef(null);
  const supplierInputRef = useRef(null);
  const productInputRef = useRef(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (supplierDropdownRef.current && !supplierDropdownRef.current.contains(event.target) && 
          supplierInputRef.current && !supplierInputRef.current.contains(event.target)) {
        setShowSupplierDropdown(false);
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
        setShowSupplierDropdown(false);
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
    if (currentPurchase.items.length === 0) {
      alert('Please add at least one item to the purchase');
      return;
    }

    if (currentPurchase.id) {
      // Update existing purchase
      setPurchases(purchases.map(p => p.id === currentPurchase.id ? currentPurchase : p));
    } else {
      // Add new purchase
      const newPurchase = { 
        ...currentPurchase, 
        id: 'PUR' + String(purchases.length + 1).padStart(3, '0')
      };
      setPurchases([...purchases, newPurchase]);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (purchase) => {
    setCurrentPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this purchase record?')) {
      setPurchases(purchases.filter(p => p.id !== id));
    }
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setCurrentPurchase({ 
      id: '',
      supplierId: '',
      supplierName: '',
      contact: '',
      items: [],
      totalAmount: 0,
      netAmount: 0,
      date: new Date().toISOString().split('T')[0]
    });
    setCurrentItem({
      productId: '',
      productName: '',
      price: 0,
      quantity: 1,
      amount: 0
    });
    setShowSupplierDropdown(false);
    setShowProductDropdown(false);
    setSupplierSearch('');
    setProductSearch('');
  };

  // Filter suppliers based on search
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    supplier.contact.includes(supplierSearch)
  );

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleSupplierSelect = (supplier) => {
    setCurrentPurchase({
      ...currentPurchase,
      supplierId: supplier.id,
      supplierName: supplier.name,
      contact: supplier.contact
    });
    setSupplierSearch(supplier.name); // Set the input field to show selected supplier
    setShowSupplierDropdown(false);
  };

  const handleProductSelect = (product) => {
    const amount = product.price * currentItem.quantity;
    setCurrentItem({
      ...currentItem,
      productId: product.id,
      productName: product.name,
      price: product.price,
      amount: amount
    });
    setProductSearch(product.name); // Set the input field to show selected product
    setShowProductDropdown(false);
  };

  const handleQuantityChange = (quantity) => {
    const amount = currentItem.price * quantity;
    setCurrentItem({
      ...currentItem,
      quantity: quantity,
      amount: amount
    });
  };

  const handlePriceChange = (price) => {
    const amount = price * currentItem.quantity;
    setCurrentItem({
      ...currentItem,
      price: price,
      amount: amount
    });
  };

  const addItemToPurchase = () => {
    if (!currentItem.productId || currentItem.quantity <= 0) {
      alert('Please select a product and enter valid quantity');
      return;
    }

    const existingItemIndex = currentPurchase.items.findIndex(
      item => item.productId === currentItem.productId
    );

    let updatedItems;
    if (existingItemIndex > -1) {
      // Update existing item
      updatedItems = [...currentPurchase.items];
      updatedItems[existingItemIndex] = { ...currentItem };
    } else {
      // Add new item
      updatedItems = [...currentPurchase.items, { ...currentItem }];
    }

    const totalAmount = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    
    setCurrentPurchase({
      ...currentPurchase,
      items: updatedItems,
      totalAmount: totalAmount,
      netAmount: totalAmount
    });

    // Reset current item for next entry
    setCurrentItem({
      productId: '',
      productName: '',
      price: 0,
      quantity: 1,
      amount: 0
    });
    setProductSearch('');
  };

  const removeItemFromPurchase = (productId) => {
    const updatedItems = currentPurchase.items.filter(item => item.productId !== productId);
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    
    setCurrentPurchase({
      ...currentPurchase,
      items: updatedItems,
      totalAmount: totalAmount,
      netAmount: totalAmount
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
      supplier: 'all'
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  // Filter purchases based on search term and applied filters
  const filteredPurchases = purchases.filter(purchase => {
    // Text search filter
    const matchesSearch = purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filter
    const purchaseDate = new Date(purchase.date);
    const startDate = appliedFilters.startDate ? new Date(appliedFilters.startDate) : null;
    const endDate = appliedFilters.endDate ? new Date(appliedFilters.endDate) : null;
    
    const matchesDate = (!startDate || purchaseDate >= startDate) && 
                       (!endDate || purchaseDate <= endDate);
    
    // Supplier filter
    const matchesSupplier = appliedFilters.supplier === 'all' || purchase.supplierId === appliedFilters.supplier;
    
    return matchesSearch && matchesDate && matchesSupplier;
  });

  // Calculate statistics based on filtered purchases
  const totalPurchases = filteredPurchases.reduce((sum, purchase) => sum + purchase.netAmount, 0);
  const totalItems = filteredPurchases.reduce((sum, purchase) => 
    sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );
  const uniqueSuppliers = new Set(filteredPurchases.map(p => p.supplierId)).size;
  const totalProducts = filteredPurchases.reduce((sum, purchase) => sum + purchase.items.length, 0);

  return (
    <div className="min-h-screen bg-blue-50 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
          Purchase Management
        </h1>
        <p className="text-blue-600 text-lg">
          Manage your purchase orders and inventory
        </p>
      </div>

      {/* Action Bar with Search, Filters and Add Button */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-blue-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by supplier name or purchase ID..."
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
            New Purchase
          </button>
        </div>

        {/* Filter Section */}
        <div className="mt-6 pt-6 border-t border-blue-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <h3 className="text-lg font-semibold text-blue-900">Filter Purchases:</h3>
            
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

              {/* Supplier Filter */}
              <div className="sm:w-48">
                <label className="block text-sm text-blue-700 font-medium mb-1">Supplier</label>
                <select
                  value={filters.supplier}
                  onChange={(e) => handleFilterChange('supplier', e.target.value)}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Suppliers</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
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
          {(appliedFilters.startDate || appliedFilters.endDate || appliedFilters.supplier !== 'all') && (
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
              {appliedFilters.supplier !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Supplier: {suppliers.find(s => s.id === appliedFilters.supplier)?.name}
                  <button
                    onClick={() => {
                      const newFilters = { ...appliedFilters, supplier: 'all' };
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
              <p className="text-blue-600 font-medium">Total Purchases</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                ${totalPurchases.toLocaleString()}
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
              <p className="text-blue-600 font-medium">Total Items</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{totalItems}</p>
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
              <p className="text-blue-600 font-medium">Suppliers</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{uniqueSuppliers}</p>
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
              <p className="text-blue-600 font-medium">Product Types</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{totalProducts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Purchases Table/Cards */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-blue-100">
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Purchase ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Supplier Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {filteredPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {purchase.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-blue-900">{purchase.supplierName}</div>
                        <div className="text-sm text-blue-600">{purchase.contact}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-700">
                        {purchase.items.length} item(s)
                        <div className="mt-1 text-xs text-blue-600">
                          {purchase.items.map(item => item.productName).join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-red-600 font-bold text-lg">
                        ${purchase.netAmount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-700">{purchase.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(purchase)}
                          className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(purchase.id)}
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
            {filteredPurchases.map((purchase) => (
              <div key={purchase.id} className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg">{purchase.supplierName}</h3>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      ID: {purchase.id}
                    </span>
                  </div>
                  <span className="text-red-600 font-bold text-lg">
                    ${purchase.netAmount.toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Contact:</span>
                    <span className="text-blue-700">{purchase.contact}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Date:</span>
                    <span className="text-blue-700">{purchase.date}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Items:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                      {purchase.items.length} items
                    </span>
                  </div>

                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                    <span className="font-medium">Products: </span>
                    {purchase.items.map(item => item.productName).join(', ')}
                  </div>
                </div>

                <div className="flex space-x-3 mt-4 pt-4 border-t border-blue-100">
                  <button
                    onClick={() => handleEdit(purchase)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(purchase.id)}
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
        {filteredPurchases.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-medium text-blue-900 mb-2">No purchase records found</h3>
            <p className="text-blue-600 mb-4">
              {searchTerm || appliedFilters.startDate || appliedFilters.endDate || appliedFilters.supplier !== 'all' 
                ? 'Try adjusting your search or filter terms' 
                : 'Get started by creating your first purchase order'}
            </p>
            {!searchTerm && !appliedFilters.startDate && !appliedFilters.endDate && appliedFilters.supplier === 'all' && (
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Create First Purchase
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Purchase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-50/30 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {currentPurchase.id ? 'Edit Purchase' : 'New Purchase'}
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
                {/* Purchase ID Field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-blue-700 font-medium mb-2">Purchase ID *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        required
                        value={currentPurchase.id || `PUR${String(purchases.length + 1).padStart(3, '0')}`}
                        onChange={(e) => setCurrentPurchase({...currentPurchase, id: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                        placeholder="Purchase ID"
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
                        value={currentPurchase.date}
                        onChange={(e) => setCurrentPurchase({...currentPurchase, date: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                      />
                    </div>
                  </div>
                </div>

                {/* Supplier Selection */}
                <div>
                  <label className="block text-blue-700 font-medium mb-2">Supplier *</label>
                  <div className="relative" ref={supplierInputRef}>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      required
                      value={supplierSearch}
                      onChange={(e) => {
                        setSupplierSearch(e.target.value);
                        setShowSupplierDropdown(true);
                      }}
                      onFocus={() => setShowSupplierDropdown(true)}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                      placeholder="Search supplier by name or contact..."
                    />
                    
                    {showSupplierDropdown && (
                      <div 
                        ref={supplierDropdownRef}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto"
                      >
                        {filteredSuppliers.map((supplier) => (
                          <div
                            key={supplier.id}
                            onClick={() => handleSupplierSelect(supplier)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-blue-100 last:border-b-0"
                          >
                            <div className="font-medium text-blue-900">{supplier.name}</div>
                            <div className="text-sm text-blue-600">{supplier.contact}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {currentPurchase.supplierName && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="text-green-700 font-medium">Selected: {currentPurchase.supplierName} - {currentPurchase.contact}</span>
                    </div>
                  )}
                </div>

                {/* Add Items Section */}
                {currentPurchase.supplierName && (
                  <div className="border-t border-blue-200 pt-6">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Add Items</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
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

                      {/* Price */}
                      <div>
                        <label className="block text-blue-700 font-medium mb-2">Price</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={currentItem.price}
                          onChange={(e) => handlePriceChange(parseFloat(e.target.value))}
                          className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                          placeholder="Price"
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

                      {/* Add Button */}
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={addItemToPurchase}
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
                          <span className="font-medium"> Price:</span> ${currentItem.price} | 
                          <span className="font-medium"> Qty:</span> {currentItem.quantity} | 
                          <span className="font-medium"> Amount:</span> ${currentItem.amount}
                        </div>
                      </div>
                    )}

                    {/* Items Table */}
                    {currentPurchase.items.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-blue-900 mb-3">Purchase Items</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border border-blue-200 rounded-lg">
                            <thead>
                              <tr className="bg-blue-500 text-white">
                                <th className="px-4 py-3 text-left font-semibold text-sm">Product</th>
                                <th className="px-4 py-3 text-left font-semibold text-sm">Price</th>
                                <th className="px-4 py-3 text-left font-semibold text-sm">Quantity</th>
                                <th className="px-4 py-3 text-left font-semibold text-sm">Amount</th>
                                <th className="px-4 py-3 text-left font-semibold text-sm">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentPurchase.items.map((item, index) => (
                                <tr key={index} className="border-b border-blue-100 hover:bg-blue-50">
                                  <td className="px-4 py-3 text-blue-900 font-medium">{item.productName}</td>
                                  <td className="px-4 py-3 text-blue-700">${item.price}</td>
                                  <td className="px-4 py-3 text-blue-700">{item.quantity}</td>
                                  <td className="px-4 py-3 text-green-600 font-semibold">${item.amount}</td>
                                  <td className="px-4 py-3">
                                    <button
                                      type="button"
                                      onClick={() => removeItemFromPurchase(item.productId)}
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
                                <td className="px-4 py-3 text-green-600 font-bold text-lg">
                                  ${currentPurchase.totalAmount}
                                </td>
                                <td></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex space-x-3 pt-6 border-t border-blue-200">
                  <button
                    type="submit"
                    disabled={currentPurchase.items.length === 0}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {currentPurchase.id ? 'Update Purchase' : 'Create Purchase'}
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