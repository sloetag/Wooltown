import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import { useCurrencyStore } from '../store/currencyStore';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { Plus, Trash2, Edit2, Package, Tag, ListFilter, Users, BarChart, ShieldAlert, LogOut, Download, AlertTriangle } from 'lucide-react';
import { Product, mockOrders, getMatchingImageForProduct, resolveProductImage } from '../lib/mockData';

export function Admin() {
  const { products, addProduct, deleteProduct, updateProduct } = useProductStore();
  const { formatPrice } = useCurrencyStore();

  const [isAdminAuthed, setIsAdminAuthed] = useState(() => sessionStorage.getItem('wooltown_admin_auth') === 'true');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users'>('products');
  const [users, setUsers] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('wooltown_registered_users') || "[]");
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('wooltown_orders');
      if (saved) return JSON.parse(saved);
      localStorage.setItem('wooltown_orders', JSON.stringify(mockOrders));
      return mockOrders;
    } catch {
      return mockOrders;
    }
  });

  const pendingOrders = orders.filter((o: any) => o.status === 'PENDING').length;
  const totalSales = orders.reduce((sum: number, o: any) => sum + o.total, 0);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showConfirmSignOut, setShowConfirmSignOut] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    category: 'Men',
    subCategory: '',
    description: '',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
    inStock: true,
    inventory: 10,
    variants: {
      color: ['Charcoal Black'],
      size: ['M', 'L']
    }
  });

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === 'admin' && adminPass === 'admin_wooltown_2024') {
      setIsAdminAuthed(true);
      sessionStorage.setItem('wooltown_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid credentials.');
    }
  };

  const handleSignOut = () => {
    setShowConfirmSignOut(true);
  };

  const confirmSignOut = () => {
    setIsAdminAuthed(false);
    sessionStorage.removeItem('wooltown_admin_auth');
    setShowConfirmSignOut(false);
  };

  const cancelSignOut = () => {
    setShowConfirmSignOut(false);
  };

  const handleExportCSV = () => {
    // Generate CSV data from products
    const headers = ['ID', 'Name', 'Category', 'Price', 'Stock Status'];
    const rows = products.map(p => [
      p.id, 
      `"${p.name.replace(/"/g, '""')}"`, 
      p.category, 
      p.price, 
      p.inStock ? 'In Stock' : 'Out of Stock'
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wooltown_inventory_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
  const handlePrintOrder = (order: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to open the print ledger.');
      return;
    }

    const itemsHtml = (order.items || []).map((item: any) => {
      return `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 16px 0; font-family: system-ui, sans-serif; font-size: 13px; color: #1e293b;">
            <strong style="color: #0f172a; font-family: serif; font-size: 14px;">${item.name || 'Wooltown Piece'}</strong><br/>
            <span style="font-size: 11px; color: #64748b; font-family: monospace;">PRODUCT REF: ${item.productId}</span>
          </td>
          <td style="padding: 16px 0; text-align: center; font-family: monospace; font-size: 13px; color: #1e293b;">
            ${item.quantity}
          </td>
          <td style="padding: 16px 0; text-align: right; font-family: monospace; font-size: 13px; color: #1e293b;">
            ${order.total / 100} <!-- Mocking formatPrice conceptually -->
          </td>
        </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Order Ledger - ${order.id}</title>
          <style>
            @media print { body { -webkit-print-color-adjust: exact; } }
            body { font-family: system-ui, sans-serif; padding: 40px; color: #020617; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 1px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 32px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="font-family: serif; font-size: 24px; margin: 0 0 8px 0; text-transform: uppercase;">Wooltown Admin Ledger</h1>
            <p style="font-family: monospace; font-size: 12px; color: #64748b; margin: 0;">Order Reference: ${order.id} | Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 32px; font-size: 13px;">
            <div>
              <strong style="font-family: monospace; font-size: 10px; color: #64748b; text-transform: uppercase;">Customer Details</strong><br/>
              ${order.customerName || order.userId}<br/>
              ${order.customerEmail || ''}
            </div>
            <div style="text-align: right;">
              <strong style="font-family: monospace; font-size: 10px; color: #64748b; text-transform: uppercase;">Shipping & Payment</strong><br/>
              ${order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.zip}, ${order.shippingAddress.country}` : '(No Shipping Provided)'}<br/>
              ${order.paymentMethod || 'Card'}
            </div>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #0f172a;">
                <th style="text-align: left; padding: 12px 0; font-family: monospace; font-size: 10px; text-transform: uppercase;">Item</th>
                <th style="text-align: center; padding: 12px 0; font-family: monospace; font-size: 10px; text-transform: uppercase;">Qty</th>
                <th style="text-align: right; padding: 12px 0; font-family: monospace; font-size: 10px; text-transform: uppercase;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="text-align: right; padding: 24px 0 8px; font-family: monospace; font-size: 11px; color: #64748b;">Subtotal</td>
                <td style="text-align: right; padding: 24px 0 8px; font-family: monospace; font-size: 13px; font-weight: bold;">${order.subtotal || order.total}</td>
              </tr>
            </tfoot>
          </table>
          <script>window.onload = () => { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };


  const handleExportOrdersCSV = () => {
    const headers = ['Order ID', 'User ID', 'Date', 'Status', 'Total'];
    const rows = orders.map(o => [
      o.id,
      o.userId,
      new Date(o.createdAt).toLocaleDateString(),
      o.status,
      o.total
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wooltown_orders_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportUsersCSV = () => {
    const headers = ['Record ID', 'Name', 'Email', 'Status'];
    const rows = users.map(u => [
      u.id,
      `"${(u.name || '').replace(/"/g, '""')}"`,
      u.email,
      u.suspended ? 'Suspended' : 'Active'
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wooltown_users_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleUserSuspension = (userId: string) => {
    setUsers(currentUsers => {
      const updated = currentUsers.map(u => u.id === userId ? { ...u, suspended: !u.suspended } : u);
      localStorage.setItem('wooltown_registered_users', JSON.stringify(updated));
      return updated;
    });
  };

  const resetUserPassword = (userId: string) => {
    setUsers(currentUsers => {
      const updated = currentUsers.map(u => u.id === userId ? { ...u, password: 'reset123' } : u);
      localStorage.setItem('wooltown_registered_users', JSON.stringify(updated));
      return updated;
    });
    alert('User password has been reset to: reset123');
  };

  if (!isAdminAuthed) {
    return (
      <PageTransition>
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50 min-h-[90vh] pt-28 md:pt-32 pb-16 md:pb-24">
          <div className="bg-white p-8 md:p-12 border border-slate-200 max-w-md w-full shadow-lg">
            <div className="w-12 h-12 bg-slate-900 text-[#FAF9F6] flex items-center justify-center mx-auto mb-6 flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-2xl font-serif tracking-tight text-slate-950 uppercase text-center mb-2">Restricted Access</h2>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-wider text-center mb-8">Admin Gateway Authentication Required</p>
            
            <form onSubmit={handleAdminAuth} className="space-y-4">
              {authError && (
                <div className="p-3 bg-red-50 text-red-800 text-[10px] font-mono uppercase tracking-widest text-center border border-red-200">
                  {authError}
                </div>
              )}
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Gateway ID</label>
                <input 
                  type="text" 
                  value={adminUser} 
                  onChange={(e) => setAdminUser(e.target.value)}
                  className="w-full border border-slate-200 p-3 text-sm focus:outline-none focus:border-slate-900 font-mono transition-colors" 
                  placeholder="Enter ID"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">Passkey</label>
                <input 
                  type="password" 
                  value={adminPass} 
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full border border-slate-200 p-3 text-sm focus:outline-none focus:border-slate-900 font-mono transition-colors" 
                  placeholder="••••••••"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-slate-950 text-white hover:bg-slate-900 rounded-none tracking-widest uppercase text-xs py-4 flex items-center justify-center gap-2 mt-4 transition-colors"
              >
                Authenticate <ShieldAlert className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </PageTransition>
    );
  }

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate matching image if it's empty, invalid, or carries the default t-shirt placeholder
    let finalImages = formData.images;
    const defaultPlaceholder = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800';
    if (!finalImages || finalImages.length === 0 || !finalImages[0] || finalImages[0] === defaultPlaceholder) {
      finalImages = [getMatchingImageForProduct(formData.name, formData.category, formData.subCategory || '')];
    }
    
    const updatedFormData = { ...formData, images: finalImages };

    if (editingProductId) {
      updateProduct(editingProductId, updatedFormData);
    } else {
      addProduct({ ...updatedFormData, id: `p_new_${Date.now()}` });
    }
    setIsAddingProduct(false);
    setEditingProductId(null);
  };

  const handleEdit = (prod: Product) => {
    setIsAddingProduct(true);
    setEditingProductId(prod.id);
    setFormData({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice,
      category: prod.category,
      subCategory: prod.subCategory,
      description: prod.description,
      images: prod.images,
      inStock: prod.inStock,
      inventory: prod.inventory || 0,
      variants: prod.variants
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-28 md:pt-32 pb-16 md:pb-24 w-full flex-1 bg-white relative">
        
        {/* Sign Out Modal */}
        {showConfirmSignOut && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
            <div className="bg-white max-w-sm w-full p-8 shadow-2xl border border-slate-200 relative">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl tracking-tight text-slate-900 mb-2">Terminate Session?</h3>
              <p className="text-sm text-slate-500 mb-8">You are about to sign out from the administrative gateway. Any unsaved changes will be lost.</p>
              <div className="flex gap-3">
                <button 
                  onClick={confirmSignOut}
                  className="flex-1 bg-rose-600 text-white py-3 text-xs font-mono font-bold uppercase tracking-widest hover:bg-rose-700 transition-colors"
                >
                  Yes, Terminate
                </button>
                <button 
                  onClick={cancelSignOut}
                  className="flex-1 bg-slate-100 text-slate-900 py-3 text-xs font-mono font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Header */}
        <div className="border-b border-slate-100 pb-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400">ADMINISTRATIVE PANEL</span>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mt-2 tracking-tight uppercase">
              Wooltown Directory
            </h1>
          </div>
          <div className="flex gap-2 font-mono text-[10px] uppercase tracking-widest flex-wrap">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 border transition-all ${activeTab === 'products' ? 'bg-slate-950 border-slate-950 text-white font-bold' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-400'}`}
            >
              Inventory Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 border transition-all ${activeTab === 'orders' ? 'bg-slate-950 border-slate-950 text-white font-bold' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-400'}`}
            >
              Global Orders
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 border transition-all ${activeTab === 'users' ? 'bg-slate-950 border-slate-950 text-white font-bold' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-400'}`}
            >
              Registered Users
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-transparent border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all ml-4 flex items-center gap-2"
            >
              <LogOut className="w-3 h-3" /> Terminate Session
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Quick Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="border border-slate-100 p-6 bg-slate-50/40">
              <h3 className="font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-4">Core Telemetry</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center bg-white p-3 border border-slate-100">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500"><Package className="w-4 h-4 inline mr-2 text-slate-700"/> Total Products</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">{products.length}</span>
                </li>
                <li className="flex justify-between items-center bg-white p-3 border border-slate-100">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500"><ListFilter className="w-4 h-4 inline mr-2 text-slate-700"/> Orders Pending</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">{pendingOrders}</span>
                </li>
                <li className="flex justify-between items-center bg-white p-3 border border-slate-100">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500"><Users className="w-4 h-4 inline mr-2 text-slate-700"/> Users Directory</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">{users.length}</span>
                </li>
                 <li className="flex justify-between items-center bg-white p-3 border border-slate-100">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500"><BarChart className="w-4 h-4 inline mr-2 text-slate-700"/> Total Sales</span>
                  <span className="font-bold text-slate-900 font-mono text-sm">{formatPrice(totalSales)}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif text-slate-900 tracking-tight">Active Inventory</h2>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleExportCSV}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-slate-50 transition-colors"
                    >
                      Export to Sheets <Download className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => {
                        setIsAddingProduct(!isAddingProduct);
                        setEditingProductId(null);
                        setFormData({
                          name: '', price: 0, category: 'Men', subCategory: '', description: '', images: [],
                          variants: {}, inventory: 10
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-slate-800 transition-colors"
                    >
                      {isAddingProduct ? 'Cancel Edit' : 'Add New Item'} <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isAddingProduct && (
                  <form onSubmit={handleCreateOrUpdate} className="mb-12 border border-slate-200 bg-slate-50 p-6 shadow-sm">
                     <h3 className="text-sm font-mono tracking-widest uppercase font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
                       {editingProductId ? 'Modify Product Entry' : 'New Product Entry'}
                     </h3>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                       <div>
                         <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">Item Name</label>
                         <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-200 p-2 text-sm focus:outline-none focus:border-slate-900" />
                       </div>
                       <div>
                         <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">Price (USD Base)</label>
                         <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full border border-slate-200 p-2 text-sm focus:outline-none focus:border-slate-900" />
                       </div>
                       <div>
                         <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                         <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-slate-200 p-2 text-sm focus:outline-none focus:border-slate-900 bg-white">
                           <option value="Men">Men</option>
                           <option value="Women">Women</option>
                           <option value="Watches">Watches</option>
                           <option value="Footwear">Footwear</option>
                           <option value="Kids & Youth">Kids & Youth</option>
                           <option value="Accessories">Accessories</option>
                         </select>
                       </div>
                       <div>
                         <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">Sub Category</label>
                         <input type="text" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})} className="w-full border border-slate-200 p-2 text-sm focus:outline-none focus:border-slate-900" />
                       </div>
                       
                       <div>
                         <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">Initial Quantity / Inventory</label>
                         <input required type="number" min="0" value={formData.inventory || 0} onChange={e => setFormData({...formData, inventory: parseInt(e.target.value, 10), inStock: parseInt(e.target.value, 10) > 0})} className="w-full border border-slate-200 p-2 text-sm focus:outline-none focus:border-slate-900" />
                       </div>
                       <div className="md:col-span-2">
                         <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                         <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full border border-slate-200 p-2 text-sm focus:outline-none focus:border-slate-900" />
                       </div>
                       <div className="md:col-span-2">
                         <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">Image URL</label>
                         <input type="text" value={formData.images?.[0] || ''} onChange={e => setFormData({...formData, images: [e.target.value]})} className="w-full border border-slate-200 p-2 text-sm focus:outline-none focus:border-slate-900" placeholder="https://..." />
                       </div>
                     </div>
                     <button type="submit" className="w-full md:w-auto px-8 py-3 bg-emerald-700 text-white font-mono font-bold uppercase tracking-widest text-[10px] hover:bg-emerald-800 transition-colors">
                       {editingProductId ? 'Save Modifications' : 'Create & Publish'}
                     </button>
                  </form>
                )}

                <div className="border border-slate-200 overflow-x-auto bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">ID / Item</th>
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Category</th>
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Price</th>
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 text-center">Stock</th>
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map(product => (
                        <tr key={product.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={resolveProductImage(product.images[0])} alt={product.name} className="w-10 h-12 object-cover border border-slate-200" />
                              <div>
                                <h4 className="text-sm font-bold font-serif text-slate-900">{product.name}</h4>
                                <span className="text-[9px] font-mono text-slate-400">{product.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-xs font-mono uppercase text-slate-600">{product.category}</td>
                          <td className="py-3 px-4 text-[11px] font-mono font-bold text-slate-900">{formatPrice(product.price)}</td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button onClick={() => handleEdit(product)} className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-[9px] font-mono uppercase tracking-widest font-bold">
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="inline-flex items-center gap-1 px-3 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-[9px] font-mono uppercase tracking-widest font-bold">
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif text-slate-900 tracking-tight">Global Orders</h2>
                  <button 
                    onClick={handleExportOrdersCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-slate-50 transition-colors"
                  >
                    Export to Sheets <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="border border-slate-200 overflow-x-auto bg-white">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Order ID</th>
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Customer</th>
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Date</th>
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Status</th>
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-xs text-slate-500 font-mono uppercase tracking-widest">No orders found.</td>
                        </tr>
                      ) : (
                        orders.map((order: any) => {
                          const customer = users.find((u: any) => u.id === order.userId);
                          const isExpanded = expandedOrderId === order.id;
                          return (
                            <React.Fragment key={order.id}>
                              <tr onClick={() => setExpandedOrderId(isExpanded ? null : order.id)} className="hover:bg-slate-50/50 cursor-pointer">
                                <td className="py-3 px-4 text-xs font-mono font-bold text-slate-900">{order.id}</td>
                                <td className="py-3 px-4">
                                  <div className="text-xs font-bold text-slate-900">{customer ? customer.name : order.userId}</div>
                                  {customer && <div className="text-[10px] font-mono text-slate-500">{customer.email}</div>}
                                </td>
                                <td className="py-3 px-4 text-[10px] font-mono text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest ${
                                    order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                    order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                    order.status === 'CANCELLED' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                    'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-[11px] font-mono font-bold text-slate-900 text-right">{formatPrice(order.total)}</td>
                              </tr>
                              
                              {isExpanded && (
                                <tr className="bg-slate-50 border-b border-slate-100">
                                  <td colSpan={5} className="py-6 px-6 shadow-inner">
                                    <div className="flex justify-between items-start mb-6">
                                      <div>
                                        <h4 className="text-[10px] font-mono font-bold text-slate-500 mb-1 tracking-widest uppercase">Order Details</h4>
                                        <p className="text-xs text-slate-900 font-medium">{order.customerName || customer?.name}</p>
                                        <p className="text-[10px] font-mono text-slate-500">{order.customerEmail || customer?.email}</p>
                                        
                                        <h4 className="text-[10px] font-mono font-bold text-slate-500 mt-4 mb-1 tracking-widest uppercase">Shipping Address</h4>
                                        <p className="text-[10px] text-slate-600 font-mono">
                                          {order.shippingAddress ? (
                                            <>
                                              {order.shippingAddress.address}<br/>
                                              {order.shippingAddress.city}, {order.shippingAddress.zip}<br/>
                                              {order.shippingAddress.country}
                                            </>
                                          ) : (
                                            'N/A'
                                          )}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <button
                                          onClick={(e) => handlePrintOrder(order, e)}
                                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors mb-4"
                                        >
                                          Print Order
                                        </button>
                                        <h4 className="text-[10px] font-mono font-bold text-slate-500 mb-1 tracking-widest uppercase">Payment Method</h4>
                                        <p className="text-[10px] text-slate-600 font-mono">{order.paymentMethod || 'Credit/Debit Card'}</p>
                                      </div>
                                    </div>
                                    
                                    <h4 className="text-[10px] font-mono font-bold text-slate-500 mb-3 tracking-widest uppercase border-t border-slate-200 pt-4">Order Items</h4>
                                    <ul className="space-y-2">
                                      {(order.items || []).map((item: any) => {
                                        const product = products.find(p => p.id === item.productId);
                                        return (
                                          <li key={item.id} className="flex justify-between text-xs bg-white p-3 border border-slate-100">
                                            <span className="font-medium text-slate-900">
                                              {item.quantity}x {product ? product.name : (item.name || item.productId)}
                                            </span>
                                            <span className="font-mono text-slate-500">{formatPrice(item.priceAtTime * item.quantity)}</span>
                                          </li>
                                        )
                                      })}
                                    </ul>
                                  </td>
                                </tr>
                              )}

                            </React.Fragment>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif text-slate-900 tracking-tight">Registered Users</h2>
                  <button 
                    onClick={handleExportUsersCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[10px] font-mono font-bold tracking-widest uppercase hover:bg-slate-50 transition-colors"
                  >
                    Export to Sheets <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="border border-slate-200 overflow-x-auto bg-white">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Record ID</th>
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Name</th>
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Email Contact</th>
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Status</th>
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-xs text-slate-500 font-mono uppercase tracking-widest">No registered users found.</td>
                        </tr>
                      ) : (
                        users.map((u: any) => (
                          <tr key={u.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 text-[10px] font-mono uppercase text-slate-400">{u.id}</td>
                            <td className="py-3 px-4 text-sm font-bold font-serif text-slate-900">{u.name}</td>
                            <td className="py-3 px-4 text-[11px] font-mono text-slate-600">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest ${
                                u.suspended ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                                {u.suspended ? 'Suspended' : 'Active'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button 
                                onClick={() => toggleUserSuspension(u.id)}
                                className={`text-[10px] font-mono uppercase font-bold tracking-widest hover:underline ${u.suspended ? 'text-emerald-600' : 'text-rose-600'}`}
                              >
                                {u.suspended ? 'Restore' : 'Suspend'}
                              </button>
                              <button 
                                onClick={() => resetUserPassword(u.id)}
                                className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-500 hover:text-slate-900 hover:underline"
                              >
                                Reset Pass
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
