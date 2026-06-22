import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCurrencyStore } from '../store/currencyStore';
import { useProductStore } from '../store/productStore';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import { mockOrders, Order, Product, resolveProductImage } from '../lib/mockData';
import { ShoppingBag, Star, User as UserIcon, Calendar, CheckCircle, Package, Truck, Clock, MessageSquare, Edit2, Check, Printer, CreditCard, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OrderTracker } from '../components/profile/OrderTracker';

interface LocalReview {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

export function Profile() {
  const { products } = useProductStore();
  const { user, login } = useAuthStore();
  const { formatPrice } = useCurrencyStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'reviews' | 'billing'>('orders');

  // Profile fields state
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('(212) 555-0192');
  const [profileAddress, setProfileAddress] = useState('742 Broadway, New York, NY 10003');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Billing and Payment fields state
  const [billingEmail, setBillingEmail] = useState('');
  const [billingName, setBillingName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [billingCardNumber, setBillingCardNumber] = useState('');
  const [billingExp, setBillingExp] = useState('');
  const [billingCvv, setBillingCvv] = useState('');
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [billingSuccess, setBillingSuccess] = useState(false);

  // Orders and Reviews state
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<LocalReview[]>([]);

  // New review form state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductToReview, setSelectedProductToReview] = useState<Product | null>(null);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');

  // Sync tab with URL parameter
  useEffect(() => {
    const rawTab = searchParams.get('tab');
    if (rawTab === 'orders' || rawTab === 'profile' || rawTab === 'reviews' || rawTab === 'billing') {
      setActiveTab(rawTab);
    }
  }, [searchParams]);

  // Handle active tab change
  const changeTab = (tab: 'orders' | 'profile' | 'reviews' | 'billing') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setProfileName(user.name);
    setProfileEmail(user.email);

    // Load cumulative or mock orders for logged in user
    const usersOrdersKey = `wooltown_orders_${user.id}`;
    const storedOrders = localStorage.getItem(usersOrdersKey);
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      // Setup some beautiful default mock orders for rich visuals
      const defaultUserOrders: Order[] = [
        {
          id: "ord_wool_991",
          userId: user.id,
          items: [
            { id: "oi_105", productId: "p_1", quantity: 1, priceAtTime: 125.00 }
          ],
          total: 125.00,
          status: "PENDING",
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
        },
        {
          id: "ord_wool_982",
          userId: user.id,
          items: [
            { id: "oi_101", productId: "p_16", quantity: 1, priceAtTime: 295.00 },
            { id: "oi_102", productId: "p_5", quantity: 2, priceAtTime: 28.00 }
          ],
          total: 351.00,
          status: "SHIPPED",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "ord_wool_761",
          userId: user.id,
          items: [
            { id: "oi_103", productId: "p_9", quantity: 1, priceAtTime: 165.00 }
          ],
          total: 165.00,
          status: "DELIVERED",
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      localStorage.setItem(usersOrdersKey, JSON.stringify(defaultUserOrders));
      setOrders(defaultUserOrders);
    }

    // Load written reviews for this user
    const userReviewsKey = `wooltown_reviews_${user.id}`;
    const storedReviews = localStorage.getItem(userReviewsKey);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      // Set default mock reviews
      const defaultReviews: LocalReview[] = [
        {
          id: 'rev_1',
          productId: 'p_9',
          productName: 'Cashmere Turtleneck Sweater',
          productImage: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&q=80&w=800',
          rating: 5,
          title: 'Unbelievable cashmere softness',
          comment: 'Perfect tailored fit, gorgeous cream tone. Definitely the most outstanding luxury item in my collection. Wooltown delivered super fast!',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString()
        }
      ];
      localStorage.setItem(userReviewsKey, JSON.stringify(defaultReviews));
      setReviews(defaultReviews);
    }

    // Load saved billing/payment details if any
    const savedBillingStr = localStorage.getItem(`wooltown_saved_billing_${user.id}`);
    if (savedBillingStr) {
      try {
        const bd = JSON.parse(savedBillingStr);
        setBillingEmail(bd.email || user.email || '');
        setBillingName(bd.name || user.name || '');
        setBillingAddress(bd.address || '');
        setBillingCity(bd.city || '');
        setBillingZip(bd.zip || '');
        setBillingCardNumber(bd.cardNumber || '');
        setBillingExp(bd.exp || '');
        setBillingCvv(bd.cvv || '');
      } catch (e) {
        console.error("Failed to parse billing info", e);
      }
    } else {
      setBillingEmail(user.email || '');
      setBillingName(user.name || '');
    }
  }, [user, navigate]);

  const handleSaveBilling = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const billingData = {
      email: billingEmail,
      name: billingName,
      address: billingAddress,
      city: billingCity,
      zip: billingZip,
      cardNumber: billingCardNumber,
      exp: billingExp,
      cvv: billingCvv
    };

    localStorage.setItem(`wooltown_saved_billing_${user.id}`, JSON.stringify(billingData));
    setIsEditingBilling(false);
    setBillingSuccess(true);
    setTimeout(() => setBillingSuccess(false), 3000);
  };

  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelSuccessMessage, setCancelSuccessMessage] = useState<string | null>(null);

  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;
    setCancellingOrderId(orderId);
    
    // Simulate API call delay for inventory reservation reversion and status update
    await new Promise(resolve => setTimeout(resolve, 800));

    setOrders(prevOrders => {
      const updated = prevOrders.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' as const } : o);
      localStorage.setItem(`wooltown_orders_${user.id}`, JSON.stringify(updated));
      return updated;
    });

    setCancellingOrderId(null);
    setCancelSuccessMessage(`Order ${orderId} successfully cancelled. Reservations reversed.`);
    setTimeout(() => setCancelSuccessMessage(null), 4000);
  };

  const handlePrintOrder = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to open the print ledger.');
      return;
    }

    const itemsHtml = order.items.map(item => {
      const prod = getProductById(item.productId);
      return `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 16px 0; font-family: system-ui, sans-serif; font-size: 13px; color: #1e293b;">
            <strong style="color: #0f172a; font-family: serif; font-size: 14px;">${prod?.name || 'Wooltown Lifeware Piece'}</strong><br/>
            <span style="font-size: 11px; color: #64748b; font-family: monospace;">PRODUCT REF: ${item.productId}</span>
          </td>
          <td style="padding: 16px 0; text-align: center; font-family: monospace; font-size: 13px; color: #1e293b;">
            ${item.quantity}
          </td>
          <td style="padding: 16px 0; text-align: right; font-family: monospace; font-size: 13px; color: #1e293b;">
            ${formatPrice(item.priceAtTime)}
          </td>
          <td style="padding: 16px 0; text-align: right; font-family: monospace; font-size: 13px; color: #010101; font-weight: bold;">
            ${formatPrice(item.quantity * item.priceAtTime)}
          </td>
        </tr>
      `;
    }).join('');

    const itemsTotal = order.items.reduce((sum, item) => sum + (item.priceAtTime * item.quantity), 0);
    const discount = itemsTotal >= 1000 ? itemsTotal * 0.10 : 0;
    const subtotal = itemsTotal - discount;
    const vat = (order as any).vat !== undefined ? (order as any).vat : subtotal * 0.20;
    const vatLabel = (order as any).vatLabel || 'VAT (20%)';
    const finalTotal = (order as any).total || (subtotal + vat);

    printWindow.document.write(`
      <html>
        <head>
          <title>Wooltown Order Statement - ${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@700&family=JetBrains+Mono&display=swap');
            body {
              font-family: 'Inter', system-ui, sans-serif;
              color: #0f172a;
              margin: 50px;
              line-height: 1.6;
              background-color: #ffffff;
            }
            .header-layout {
              border-bottom: 2px solid #0f172a;
              padding-bottom: 24px;
              margin-bottom: 36px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .brand-name {
              font-family: 'Playfair Display', serif;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 2px;
              color: #0f172a;
            }
            .statement-tag {
              font-family: 'JetBrains Mono', monospace;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 3px;
              color: #64748b;
              margin-top: 4px;
            }
            .meta-section {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 40px;
              margin-bottom: 40px;
              font-size: 11px;
              text-transform: uppercase;
              font-family: 'JetBrains Mono', monospace;
              letter-spacing: 0.5px;
            }
            .meta-block h5 {
              margin: 0 0 8px 0;
              color: #94a3b8;
              font-size: 10px;
              tracking: 2px;
            }
            .meta-block p {
              margin: 0;
              color: #1e293b;
              font-weight: bold;
              font-size: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            th {
              border-bottom: 2px solid #0f172a;
              padding-bottom: 12px;
              text-transform: uppercase;
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              color: #64748b;
              letter-spacing: 1px;
            }
            .ledger-summary {
              width: 320px;
              margin-left: auto;
              font-family: 'JetBrains Mono', monospace;
              font-size: 12px;
              text-transform: uppercase;
            }
            .ledger-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px dashed #f1f5f9;
            }
            .ledger-grand {
              border-top: 2px solid #0f172a;
              margin-top: 12px;
              padding-top: 12px;
              font-weight: bold;
              font-size: 16px;
              color: #705030;
              border-bottom: none;
            }
            .footer-credit {
              margin-top: 100px;
              border-top: 1px solid #f1f5f9;
              padding-top: 24px;
              text-align: center;
              font-family: 'JetBrains Mono', monospace;
              font-size: 10px;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
          </style>
        </head>
        <body>
          <div class="header-layout">
            <div>
              <div class="brand-name">WOOLTOWN</div>
              <div class="statement-tag">Sovereign Transaction Registry</div>
            </div>
            <div style="text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
              <strong style="font-size: 13px; color: #010101;">TRANSACTION ID: ${order.id}</strong><br/>
              <span style="color: #64748b;">RECORDED: ${new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div class="meta-section">
            <div class="meta-block">
              <h5>Registry Merchant</h5>
              <p>Wooltown Studio Stockholm<br/>Norrmalm 111, Stockholm, Sweden</p>
            </div>
            <div class="meta-block">
              <h5>Verified Recipient</h5>
              <p>${user.name.toUpperCase()}<br/>${user.email.toUpperCase()}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="text-align: left;">Artisanal Formulation</th>
                <th style="text-align: center; width: 60px;">Qty</th>
                <th style="text-align: right; width: 100px;">Price</th>
                <th style="text-align: right; width: 120px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="ledger-summary">
            <div class="ledger-row">
              <span>Gross Sizing Subtotal</span>
              <span>${formatPrice(itemsTotal)}</span>
            </div>
            ${discount > 0 ? `
            <div class="ledger-row" style="color: #92400e; font-weight: bold;">
              <span>10% PROMO DISCOUNT</span>
              <span>-${formatPrice(discount, true)}</span>
            </div>
            ` : ''}
            <div class="ledger-row">
              <span>Dispatch Sizing Premium</span>
              <span style="color: #10b981; font-weight: bold;">Complimentary</span>
            </div>
            <div class="ledger-row">
              <span>${vatLabel}</span>
              <span>${formatPrice(vat, true)}</span>
            </div>
            <div class="ledger-row ledger-grand">
              <span>Aggregate Total</span>
              <span style="color: #705030;">${formatPrice(finalTotal)}</span>
            </div>
          </div>

          <div class="footer-credit">
            Your support fosters authentic physical craft integrity &bull; Wooltown Stockholm
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 450);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Update session state
    const updatedUser = { ...user, name: profileName, email: profileEmail };
    login(updatedUser);

    // Persist in general registered list as well
    const registeredUsersStr = localStorage.getItem('wooltown_registered_users');
    if (registeredUsersStr) {
      try {
        const users = JSON.parse(registeredUsersStr);
        const index = users.findIndex((u: any) => u.id === user.id);
        if (index !== -1) {
          users[index] = { ...users[index], name: profileName, email: profileEmail };
          localStorage.setItem('wooltown_registered_users', JSON.stringify(users));
        }
      } catch (e) {
        console.error("Failed to update register pool", e);
      }
    }

    setIsEditingProfile(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    
    // In a real application, we would check the currentPassword and update the DB
    const registeredUsersStr = localStorage.getItem('wooltown_registered_users');
    if (registeredUsersStr) {
      try {
        const users = JSON.parse(registeredUsersStr);
        const index = users.findIndex((u: any) => u.id === user?.id);
        if (index !== -1) {
          if (users[index].password && users[index].password !== currentPassword) {
            setPasswordError("Incorrect current password.");
            return;
          }
          users[index] = { ...users[index], password: newPassword };
          localStorage.setItem('wooltown_registered_users', JSON.stringify(users));
        }
      } catch (e) {
        console.error("Failed to update password", e);
      }
    }

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProductToReview) return;

    const newRev: LocalReview = {
      id: 'rev_' + Date.now(),
      productId: selectedProductToReview.id,
      productName: selectedProductToReview.name,
      productImage: resolveProductImage(selectedProductToReview?.images?.[0]),
      rating: newReviewRating,
      title: newReviewTitle,
      comment: newReviewComment,
      date: new Date().toLocaleDateString()
    };

    const updatedReviews = [newRev, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`wooltown_reviews_${user.id}`, JSON.stringify(updatedReviews));

    // Reset fields
    setNewReviewTitle('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setShowReviewModal(false);
    setSelectedProductToReview(null);
  };

  // Helper to obtain full product metadata by id
  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  if (!user) return null;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-16 md:pb-24 w-full flex-1 bg-white">
        
        {/* Profile Heading Info */}
        <div className="border-b border-slate-100 pb-8 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-amber-800">MEMBERSHIP HUB</span>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mt-2 tracking-tight uppercase">
              Welcome, {user.name}
            </h1>
            <p className="text-slate-500 text-xs mt-1 font-mono tracking-wider">
              MEMBER SINCE MAY 2026 &bull; ID: {user.id}
            </p>
          </div>

          <div className="flex gap-2 font-mono text-[10px] uppercase tracking-widest flex-wrap">
            <button
              onClick={() => changeTab('orders')}
              className={`px-4 py-2 border transition-all ${activeTab === 'orders' ? 'bg-slate-950 border-slate-950 text-white font-bold' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-400'}`}
            >
              My Orders ({orders.length})
            </button>
            <button
              onClick={() => changeTab('profile')}
              className={`px-4 py-2 border transition-all ${activeTab === 'profile' ? 'bg-slate-950 border-slate-950 text-white font-bold' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-400'}`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => changeTab('billing')}
              className={`px-4 py-2 border transition-all ${activeTab === 'billing' ? 'bg-slate-950 border-slate-950 text-white font-bold' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-400'}`}
            >
              Billing Details
            </button>
            <button
              onClick={() => changeTab('reviews')}
              className={`px-4 py-2 border transition-all ${activeTab === 'reviews' ? 'bg-slate-950 border-slate-950 text-white font-bold' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-400'}`}
            >
              My Reviews ({reviews.length})
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Dashboard Left Rail Info Card */}
          <div className="lg:col-span-1 border border-slate-100 p-6 bg-slate-50/40">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 bg-slate-900 text-white font-serif font-bold text-lg flex items-center justify-center rounded-none shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-serif font-normal text-slate-900 text-sm tracking-wide">{user.name}</h4>
                <p className="text-[10px] font-mono text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-mono tracking-wider uppercase font-medium">Cart Reserve:</span>
                <span className="font-mono text-slate-900 font-bold">Stored</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-mono tracking-wider uppercase font-medium">Tier Status:</span>
                <span className="text-amber-800 font-mono font-bold uppercase tracking-widest text-[9px] bg-amber-50 px-2 py-0.5 border border-amber-100">Wool Silver</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-mono tracking-wider uppercase font-medium">Currency Profile:</span>
                <span className="font-mono text-slate-900">USD ($)</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-2">Service Center</span>
              <p className="text-slate-500 text-xs">Need specific order customization? Our bespoke Concierge line is active to elevate your experience.</p>
              <Link to="/contact" className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-900 hover:text-amber-800 mt-3 inline-block transition-colors underline">
                Contact Concierge
              </Link>
            </div>
          </div>

          {/* Tab Core Interactive Display */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-serif tracking-tight text-slate-950 font-medium uppercase">Order History</h3>
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">{orders.length} transactions total</span>
                  </div>

                  {cancelSuccessMessage && (
                    <div className="bg-emerald-50 border border-emerald-100 p-4 text-emerald-800 text-sm mb-4">
                      {cancelSuccessMessage}
                    </div>
                  )}

                  {orders.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200">
                      <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-serif text-base tracking-wide">No transactions completed yet.</p>
                      <button onClick={() => navigate('/shop')} className="mt-4 px-6 py-2 bg-slate-900 text-white text-[10px] uppercase font-mono tracking-widest hover:bg-slate-800 transition-colors">
                        Browse the Collections
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                          {/* Order Header */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-slate-100 gap-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-mono font-bold text-slate-950 uppercase">{order.id}</span>
                                <span className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 border ${
                                  order.status === 'DELIVERED' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                    : order.status === 'SHIPPED' 
                                      ? 'bg-blue-50 text-blue-700 border-blue-100' 
                                      : order.status === 'CANCELLED'
                                        ? 'bg-rose-50 text-rose-700 border-rose-100'
                                        : 'bg-amber-50 text-amber-700 border-amber-100'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">
                                Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex flex-col md:flex-row items-end md:items-center gap-4 text-right">
                              <div className="text-right">
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Grand Total</span>
                                <p className="text-lg font-mono font-bold text-slate-950 mt-0.5">{formatPrice(order.total)}</p>
                              </div>
                              <div className="flex gap-2">
                                {order.status === 'PENDING' && (
                                  <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    disabled={cancellingOrderId === order.id}
                                    className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.2em] border border-rose-200 text-rose-700 hover:bg-rose-50 transition-all flex items-center justify-center min-w-[120px]"
                                  >
                                    {cancellingOrderId === order.id ? 'Reversing...' : 'Cancel Order'}
                                  </button>
                                )}
                                <button
                                  onClick={() => handlePrintOrder(order)}
                                  className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.2em] border border-slate-900 text-slate-900 hover:bg-slate-950 hover:text-white transition-all flex items-center gap-1.5 focus:outline-none focus:ring-0 active:scale-98"
                                >
                                  <Printer className="w-3.5 h-3.5" /> Print Statement
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Shipment Timeline & Route Map Tracker */}
                          {order.status === 'CANCELLED' ? (
                            <div className="bg-rose-50 border border-rose-100 p-6 flex flex-col items-center justify-center text-center mt-6">
                              <span className="w-8 h-8 rounded-full border border-rose-200 bg-white flex items-center justify-center text-rose-600 mb-3 drop-shadow-sm">
                                <X className="w-4 h-4" />
                              </span>
                              <h4 className="font-serif text-rose-900 font-bold mb-1 tracking-tight">Order Cancelled</h4>
                              <p className="text-xs text-rose-700 max-w-md font-mono mt-2 lowercase">This order has been cancelled. Any reserved inventory pieces have been successfully reversed and refunded.</p>
                            </div>
                          ) : (
                            <OrderTracker 
                              order={order} 
                              shippingAddress={profileAddress} 
                              shippingCity={profileAddress.split(',')[1]?.trim() || 'New York'} 
                            />
                          )}

                          {/* Shipment Timeline Visualization (Hidden) */}
                          <div className="hidden my-6 bg-slate-50/80 p-4 border border-slate-100">
                            <h5 className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-4 h-3">Shipment Progress</h5>
                            <div className="grid grid-cols-4 relative">
                              <div className="absolute top-[9px] left-[12.5%] right-[12.5%] h-[2px] bg-slate-200 z-0">
                                <div className="h-full bg-slate-900 transition-all duration-1000" style={{
                                  width: order.status === 'PENDING' ? '0%' : order.status === 'PROCESSING' ? '33%' : order.status === 'SHIPPED' ? '66%' : '100%'
                                }} />
                              </div>

                              <div className="flex flex-col items-center text-center z-10">
                                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${order.status === 'PENDING' || order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-200 text-slate-400'}`}>
                                  1
                                </span>
                                <span className="text-[9px] font-mono tracking-widest uppercase mt-2 font-bold text-slate-800">Placed</span>
                              </div>

                              <div className="flex flex-col items-center text-center z-10">
                                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${order.status === 'PROCESSING' || order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-200 text-slate-400'}`}>
                                  2
                                </span>
                                <span className="text-[9px] font-mono tracking-widest uppercase mt-2 font-bold text-slate-800">Processing</span>
                              </div>

                              <div className="flex flex-col items-center text-center z-10">
                                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-200 text-slate-400'}`}>
                                  3
                                </span>
                                <span className="text-[9px] font-mono tracking-widest uppercase mt-2 font-bold text-slate-800">En Route</span>
                              </div>

                              <div className="flex flex-col items-center text-center z-10">
                                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${order.status === 'DELIVERED' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-200 text-slate-400'}`}>
                                  4
                                </span>
                                <span className="text-[9px] font-mono tracking-widest uppercase mt-2 font-bold text-slate-800">Delivered</span>
                              </div>
                            </div>
                          </div>

                          {/* Order Products List */}
                          <div className="space-y-4">
                            {order.items.map((item) => {
                              const itemProduct = getProductById(item.productId);
                              return (
                                <div key={item.id} className="flex items-center justify-between py-2 text-xs">
                                  <div className="flex items-center gap-4">
                                    <img 
                                      src={resolveProductImage(itemProduct?.images?.[0])} 
                                      alt={itemProduct?.name} 
                                      className="w-12 h-16 object-cover border border-slate-100"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div>
                                      <h6 className="font-serif text-sm font-normal text-slate-900 hover:text-amber-800 cursor-pointer block" onClick={() => navigate(`/product/${item.productId}`)}>
                                        {itemProduct?.name || 'Wooltown Lifeware Piece'}
                                      </h6>
                                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                                        Qty {item.quantity} &bull; {formatPrice(item.priceAtTime)} each
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Review Option If Delivered */}
                                  {order.status === 'DELIVERED' && (
                                    <button 
                                      onClick={() => {
                                        if (itemProduct) {
                                          setSelectedProductToReview(itemProduct);
                                          setShowReviewModal(true);
                                        }
                                      }}
                                      className="px-3 py-1 text-[9px] font-mono uppercase tracking-widest border border-slate-900 text-slate-900 hover:bg-slate-950 hover:text-white transition-all flex items-center gap-1.5"
                                    >
                                      <Star className="w-2.5 h-2.5" /> Write Review
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-serif tracking-tight text-slate-950 font-medium uppercase">Personal Registry Settings</h3>
                    {isEditingProfile ? (
                      <button onClick={() => setIsEditingProfile(false)} className="text-[10px] font-mono tracking-widest text-slate-400 hover:text-slate-900 uppercase">Cancel</button>
                    ) : (
                      <button onClick={() => setIsEditingProfile(true)} className="text-[10px] font-mono tracking-widest text-slate-900 underline uppercase flex items-center gap-1.5 font-bold">
                        <Edit2 className="w-3 h-3" /> Edit Details
                      </button>
                    )}
                  </div>

                  {profileSuccess && (
                    <div className="p-4 bg-emerald-50 text-emerald-800 text-xs tracking-wider uppercase border border-emerald-100 font-mono flex items-center gap-2">
                      <Check className="w-4 h-4" /> Profile credentials modified successfully.
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-2 tracking-widest">Full Registered Name</label>
                        <input
                          type="text"
                          value={profileName}
                          disabled={!isEditingProfile}
                          onChange={(e) => setProfileName(e.target.value)}
                          required
                          className="w-full text-sm py-2 px-3 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 rounded-none focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-2 tracking-widest">Primary Email Address</label>
                        <input
                          type="email"
                          value={profileEmail}
                          disabled={!isEditingProfile}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          required
                          className="w-full text-sm py-2 px-3 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 rounded-none focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-2 tracking-widest">Phone Contact</label>
                        <input
                          type="text"
                          value={profilePhone}
                          disabled={!isEditingProfile}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="w-full text-sm py-2 px-3 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 rounded-none focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-2 tracking-widest">Designated Courier Delivery Address</label>
                        <input
                          type="text"
                          value={profileAddress}
                          disabled={!isEditingProfile}
                          onChange={(e) => setProfileAddress(e.target.value)}
                          className="w-full text-sm py-2 px-3 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 rounded-none focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                        />
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="pt-4">
                        <button type="submit" className="w-full md:w-auto px-8 py-3 bg-slate-900 border border-slate-900 text-white text-[11px] font-mono tracking-widest uppercase hover:bg-transparent hover:text-slate-900 transition-all">
                          Save Updated Credentials
                        </button>
                      </div>
                    )}
                  </form>

                  {/* CHANGE PASSWORD SECTION */}
                  <div className="pt-10 border-t border-slate-100 mt-10">
                    <h3 className="text-lg font-serif tracking-tight text-slate-950 font-medium uppercase mb-6">Security & Authentication</h3>
                    
                    {passwordSuccess && (
                      <div className="p-4 bg-emerald-50 text-emerald-800 text-xs tracking-wider uppercase border border-emerald-100 font-mono flex items-center gap-2 mb-6">
                        <Check className="w-4 h-4" /> Password updated successfully.
                      </div>
                    )}

                    {passwordError && (
                      <div className="p-4 bg-rose-50 text-rose-800 text-xs tracking-wider uppercase border border-rose-100 font-mono mb-6">
                        {passwordError}
                      </div>
                    )}

                    <form onSubmit={handleChangePassword} className="space-y-6 max-w-2xl">
                      <div>
                        <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-2 tracking-widest">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          className="w-full text-sm py-2 px-3 border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-2 tracking-widest">New Password</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full text-sm py-2 px-3 border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-2 tracking-widest">Confirm New Password</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full text-sm py-2 px-3 border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <button type="submit" className="w-full md:w-auto px-8 py-3 bg-slate-900 border border-slate-900 text-white text-[11px] font-mono tracking-widest uppercase hover:bg-transparent hover:text-slate-900 transition-all flex items-center justify-center gap-2">
                          <Lock className="w-3 h-3" /> Update Security Credentials
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-serif tracking-tight text-slate-950 font-medium uppercase">My Product Reviews</h3>
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">{reviews.length} written logs</span>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200">
                      <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-serif text-base tracking-wide">You haven't written any product reviews yet.</p>
                      <p className="text-[10px] font-mono text-slate-400 uppercase mt-2">Go to "My Orders", scroll to a delivered item and tap "Write Review".</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="border border-slate-100 p-6 flex flex-col md:flex-row gap-6">
                          <img 
                            src={rev.productImage} 
                            alt={rev.productName} 
                            className="w-16 h-20 object-cover border border-slate-100 self-start"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div>
                                <span className="text-[9px] font-mono text-amber-800 font-bold uppercase tracking-wider">{rev.productName}</span>
                                <h5 className="font-serif text-slate-950 text-base font-medium mt-1 uppercase tracking-tight">{rev.title}</h5>
                              </div>
                              <div className="text-right">
                                <div className="flex gap-0.5 mb-1 justify-end">
                                  {Array.from({ length: 5 }).map((_, idx) => (
                                    <Star key={idx} className={`w-3.5 h-3.5 ${idx < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                                  ))}
                                </div>
                                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{rev.date}</span>
                              </div>
                            </div>
                            <p className="text-slate-600 text-xs mt-3 leading-relaxed font-serif italic">"{rev.comment}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* BILLING TAB */}
              {activeTab === 'billing' && (
                <motion.div
                  key="billing-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-serif tracking-tight text-slate-950 font-medium uppercase">Billing &amp; Payment Ledger</h3>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-1">Manage physical dispatch settings and secure Stripe financial instruments</p>
                    </div>
                    {billingSuccess && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-3 py-1 font-mono uppercase tracking-widest font-bold">
                        Ledger Updated Successfully
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSaveBilling} className="space-y-8 bg-slate-50/30 p-6 md:p-8 border border-slate-100">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#705030]">Financial Card Instrument</h4>
                      <button 
                        type="button"
                        onClick={() => setIsEditingBilling(!isEditingBilling)}
                        className="text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-slate-900 flex items-center gap-1.5 focus:outline-none"
                      >
                        <Edit2 className="w-3 h-3" /> {isEditingBilling ? 'Cancel Adjustments' : 'Modify Credentials'}
                      </button>
                    </div>

                    {/* Visually stunning credit card mock */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                      <div className="md:col-span-5">
                        <div className="relative w-full aspect-[1.6/1] bg-slate-950 text-white p-6 flex flex-col justify-between shadow-lg overflow-hidden border border-slate-800">
                          {/* Ambient background effect */}
                          <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl animate-pulse" />
                          <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-slate-700/10 rounded-full blur-2xl" />

                          <div className="flex justify-between items-start z-10">
                            <div>
                              <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-amber-400 font-bold">WOOLTOWN CHRONICLE</span>
                              <span className="text-[7px] font-mono text-slate-500 block">SOVEREIGN CUSTOMER INSTRUMENT</span>
                            </div>
                            <span className="font-serif font-bold text-xs tracking-wider">SECURE</span>
                          </div>

                          <div className="my-4 z-10">
                            <p className="font-mono text-base tracking-[0.15em] font-medium">
                              {billingCardNumber ? billingCardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                            </p>
                          </div>

                          <div className="flex justify-between items-end z-10 font-mono text-[9px] uppercase tracking-widest">
                            <div className="min-w-0">
                              <span className="text-[7px] text-slate-500 block mb-0.5">Cardholder</span>
                              <span className="truncate max-w-[120px] block font-medium">{billingName || '---'}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[7px] text-slate-500 block mb-0.5">Expires</span>
                              <span className="font-medium">{billingExp || '--/--'}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[7px] text-slate-500 block mb-0.5">PIN</span>
                              <span className="font-medium">{billingCvv || '•••'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-[9px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-1">Financial Instrument (Card Number)</label>
                            <input 
                              type="text"
                              value={billingCardNumber}
                              disabled={!isEditingBilling}
                              maxLength={19}
                              onChange={(e) => setBillingCardNumber(e.target.value.replace(/\s?/g, ''))}
                              placeholder="4000123456789010"
                              className="w-full text-sm py-2 px-3 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 rounded-none focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[9px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-1">Expiration MM/YY</label>
                              <input 
                                type="text"
                                value={billingExp}
                                disabled={!isEditingBilling}
                                placeholder="12/28"
                                onChange={(e) => setBillingExp(e.target.value)}
                                className="w-full text-sm py-2 px-3 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 rounded-none focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-1">Security Code (CVV)</label>
                              <input 
                                type="text"
                                value={billingCvv}
                                disabled={!isEditingBilling}
                                placeholder="345"
                                onChange={(e) => setBillingCvv(e.target.value)}
                                className="w-full text-sm py-2 px-3 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 rounded-none focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#705030] pb-4 mb-4 border-b border-slate-100">Physical Coordinates</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[9px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-1">Receipt Recipient Name</label>
                          <input 
                            type="text"
                            value={billingName}
                            disabled={!isEditingBilling}
                            onChange={(e) => setBillingName(e.target.value)}
                            className="w-full text-sm py-2 px-3 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 rounded-none focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-1">Notification Email</label>
                          <input 
                            type="email"
                            value={billingEmail}
                            disabled={!isEditingBilling}
                            onChange={(e) => setBillingEmail(e.target.value)}
                            className="w-full text-sm py-2 px-3 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 rounded-none focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        <div className="md:col-span-1">
                          <label className="block text-[9px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-1">Street Location</label>
                          <input 
                            type="text"
                            value={billingAddress}
                            disabled={!isEditingBilling}
                            placeholder="e.g. 1024 Norrmalm"
                            onChange={(e) => setBillingAddress(e.target.value)}
                            className="w-full text-sm py-2 px-3 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 rounded-none focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-1">City Node</label>
                          <input 
                            type="text"
                            value={billingCity}
                            disabled={!isEditingBilling}
                            placeholder="Stockholm"
                            onChange={(e) => setBillingCity(e.target.value)}
                            className="w-full text-sm py-2 px-3 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 rounded-none focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-1">Postal Code (ZIP)</label>
                          <input 
                            type="text"
                            value={billingZip}
                            disabled={!isEditingBilling}
                            placeholder="111 22"
                            onChange={(e) => setBillingZip(e.target.value)}
                            className="w-full text-sm py-2 px-3 border border-slate-200 disabled:bg-slate-50 disabled:text-slate-500 rounded-none focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    {isEditingBilling && (
                      <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button 
                          type="submit"
                          className="px-8 py-3 bg-slate-950 text-white font-mono text-xs tracking-widest uppercase hover:bg-slate-900 transition-colors duration-300 rounded-none"
                        >
                          Save Ledger Adjustments
                        </button>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Review Dialog Modal Overlay */}
      <AnimatePresence>
        {showReviewModal && selectedProductToReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-white p-8 border border-slate-200 shadow-2xl z-10"
            >
              <h4 className="text-xl font-serif font-bold tracking-tight text-slate-950 uppercase border-b border-slate-100 pb-3 mb-6">Create Review</h4>
              
              <div className="flex gap-4 items-center mb-6">
                <img 
                  src={resolveProductImage(selectedProductToReview?.images?.[0])} 
                  alt={selectedProductToReview.name} 
                  className="w-12 h-16 object-cover border border-slate-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h5 className="font-serif text-sm font-bold text-slate-900">{selectedProductToReview.name}</h5>
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{selectedProductToReview.category} Collection</p>
                </div>
              </div>

              <form onSubmit={handleCreateReview} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-2 tracking-widest">Rate this lifeware piece</label>
                  <div className="flex gap-1.5 focus:outline-none">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <button 
                        key={idx} 
                        type="button" 
                        onClick={() => setNewReviewRating(idx + 1)}
                        className="text-slate-300 hover:text-amber-500 transition-colors focus:outline-none"
                      >
                        <Star className={`w-6 h-6 ${idx < newReviewRating ? 'text-amber-500 fill-amber-500' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-2 tracking-widest">Review Summary / Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Beyond comfortable, unparalleled craftsmanship"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    className="w-full text-sm py-2 px-3 border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors bg-white font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase font-bold text-slate-500 mb-2 tracking-widest">Detailed Feedback</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="What details support your impressions? Did you find the fit aligned with expectation?"
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full text-xs py-2 px-3 border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors bg-white font-serif text-slate-900"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowReviewModal(false)}
                    className="px-5 py-2.5 text-[10px] font-mono tracking-widest uppercase border border-slate-200 text-slate-500 hover:border-slate-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-mono tracking-widest uppercase hover:bg-slate-800 transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
