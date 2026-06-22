import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import { useCurrencyStore, CurrencyCode } from '../store/currencyStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { resolveProductImage } from '../lib/mockData';
import { PageTransition } from '../components/layout/PageTransition';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Shield, Lock, ChevronRight, Printer, Check } from 'lucide-react';

interface CountryTax {
  name: string;
  code: string;
  taxLabel: string;
  rate: number;
}

export const countryTaxRates: Record<string, CountryTax> = {
  NG: { name: 'Nigeria', code: 'NG', taxLabel: 'VAT (7.5%)', rate: 0.075 },
  SE: { name: 'Sweden', code: 'SE', taxLabel: 'Moms (25%)', rate: 0.25 },
  DE: { name: 'Germany', code: 'DE', taxLabel: 'MwSt (19%)', rate: 0.19 },
  FR: { name: 'France', code: 'FR', taxLabel: 'TVA (20%)', rate: 0.20 },
  ES: { name: 'Spain', code: 'ES', taxLabel: 'IVA (21%)', rate: 0.21 },
  IT: { name: 'Italy', code: 'IT', taxLabel: 'IVA (22%)', rate: 0.22 },
  GB: { name: 'United Kingdom', code: 'GB', taxLabel: 'VAT (20%)', rate: 0.20 },
  US: { name: 'United States', code: 'US', taxLabel: 'Sales Tax (0%)', rate: 0 },
  JP: { name: 'Japan', code: 'JP', taxLabel: 'Consumption Tax (10%)', rate: 0.10 },
  AU: { name: 'Australia', code: 'AU', taxLabel: 'GST (10%)', rate: 0.10 },
  CA: { name: 'Canada', code: 'CA', taxLabel: 'GST (5%)', rate: 0.05 },
  CH: { name: 'Switzerland', code: 'CH', taxLabel: 'VAT (8.1%)', rate: 0.081 },
  IN: { name: 'India', code: 'IN', taxLabel: 'GST (18%)', rate: 0.18 },
  ZA: { name: 'South Africa', code: 'ZA', taxLabel: 'VAT (15%)', rate: 0.15 },
  TR: { name: 'Turkey', code: 'TR', taxLabel: 'KDV (20%)', rate: 0.20 },
  NZ: { name: 'New Zealand', code: 'NZ', taxLabel: 'GST (15%)', rate: 0.15 },
  SG: { name: 'Singapore', code: 'SG', taxLabel: 'GST (9%)', rate: 0.09 },
  DEFAULT: { name: 'International (15% VAT)', code: 'INT', taxLabel: 'VAT (15%)', rate: 0.15 }
};

export const currencyToCountryCode: Record<string, string> = {
  NGN: 'NG',
  SEK: 'SE',
  EUR: 'DE',
  GBP: 'GB',
  USD: 'US',
  JPY: 'JP',
  AUD: 'AU',
  CAD: 'CA',
  CHF: 'CH',
  INR: 'IN',
  ZAR: 'ZA',
  TRY: 'TR',
  NZD: 'NZ',
  SGD: 'SG'
};

const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(4, "Zip is required"),
  country: z.string().min(2, "Country is required"),
  cardNumber: z.string().min(16, "Invalid card number (16 digits required)").max(19),
  exp: z.string().min(4, "Invalid expiration (MM/YY)"),
  cvv: z.string().min(3, "Invalid CVV").max(4),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function Checkout() {
  const { items, removeItem } = useCartStore();
  const { products, updateProduct } = useProductStore();
  const { user } = useAuthStore();
  const { formatPrice, currency } = useCurrencyStore();
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = total >= 1000 ? total * 0.10 : 0;
  const subtotal = total - discount;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);
  const [savePaymentDetails, setSavePaymentDetails] = useState(true);

  // Safely grab saved billing info if exists
  const savedBillingStr = user ? localStorage.getItem(`wooltown_saved_billing_${user.id}`) : null;
  const savedBilling = savedBillingStr ? JSON.parse(savedBillingStr) : null;

  const defaultCountry = savedBilling?.country || currencyToCountryCode[currency] || 'NG';

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: savedBilling?.email || user?.email || '',
      name: savedBilling?.name || user?.name || '',
      address: savedBilling?.address || '',
      city: savedBilling?.city || '',
      zip: savedBilling?.zip || '',
      country: defaultCountry,
      cardNumber: savedBilling?.cardNumber || '',
      exp: savedBilling?.exp || '',
      cvv: savedBilling?.cvv || '',
    }
  });

  const countryValue = watch('country') || defaultCountry;
  const activeTaxInfo = countryTaxRates[countryValue] || countryTaxRates.DEFAULT;
  const vatRate = activeTaxInfo.rate;
  const vatLabel = activeTaxInfo.taxLabel;
  const vat = subtotal * vatRate;
  const finalTotal = subtotal + vat;

  // Auto-respond to store currency selection changes
  useEffect(() => {
    const suggested = currencyToCountryCode[currency];
    if (suggested) {
      setValue('country', suggested);
    }
  }, [currency, setValue]);

  const cardNumberValue = watch('cardNumber') || '';
  
  const getCardType = (number: string) => {
    const raw = number.replace(/\D/g, '');
    if (raw.startsWith('4')) return 'VISA';
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[0-1]|2720)/.test(raw)) return 'MASTERCARD';
    if (/^3[47]/.test(raw)) return 'AMEX';
    if (/^6(011|5)/.test(raw)) return 'DISCOVER';
    return '';
  };
  const cardType = getCardType(cardNumberValue);

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    
    try {
      // Send physical trace order payload to backend engine
      const response = await fetch('/api/checkout/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentDetails: {
            cardNumber: data.cardNumber,
            exp: data.exp,
            cvv: data.cvv,
            amount: finalTotal
          },
          orderItems: items.map(item => ({
            productId: item.productId || item.id, // Ensure there's an ID
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          shippingInfo: {
            name: data.name,
            address: data.address,
            city: data.city,
            zip: data.zip
          },
          customerInfo: {
            email: data.email
          }
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Transaction failed");
      }

      console.log("Secure transaction complete", result);

      const newOrder = {
        id: result.data?.orderId || `ord_wool_${Math.floor(1000 + Math.random() * 9000)}`,
        items: items.map(item => ({
          id: `oi_${Math.floor(1000 + Math.random() * 9000)}`,
          productId: item.productId || item.id,
          name: item.name,
          quantity: item.quantity,
          priceAtTime: item.price
        })),
        total: finalTotal,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        vat: vat,
        vatLabel: vatLabel,
        vatRate: vatRate,
        discount: discount,
        subtotal: subtotal,
        country: countryValue,
        userId: user ? user.id : 'guest',
        customerName: data.name,
        customerEmail: data.email,
        shippingAddress: {
          address: data.address,
          city: data.city,
          zip: data.zip,
          country: countryValue
        },
        paymentMethod: cardType || 'Card'
      };

      setPlacedOrder(newOrder);

      // Save payment & billing details locally for signed in user
      if (user) {
        if (savePaymentDetails) {
          localStorage.setItem(`wooltown_saved_billing_${user.id}`, JSON.stringify(data));
        }

        // Add this new order to mock Order History so they can Cancel it
        const usersOrdersKey = `wooltown_orders_${user.id}`;
        const existingOrdersOutput = localStorage.getItem(usersOrdersKey);
        const existingOrders = existingOrdersOutput ? JSON.parse(existingOrdersOutput) : [];
        
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem(usersOrdersKey, JSON.stringify(updatedOrders));
      }

      // Add to global admin orders
      try {
        const globalOrdersKey = 'wooltown_orders';
        const globalOrdersOutput = localStorage.getItem(globalOrdersKey);
        let globalOrders = globalOrdersOutput ? JSON.parse(globalOrdersOutput) : [];
        if (!Array.isArray(globalOrders)) globalOrders = [];
        globalOrders = [newOrder, ...globalOrders];
        localStorage.setItem(globalOrdersKey, JSON.stringify(globalOrders));
      } catch (err) {}
      
      
      // Update inventory based on ordered items
      items.forEach(cartItem => {
        const prodId = cartItem.productId || cartItem.id;
        const currentProd = products.find(p => p.id === prodId);
        if (currentProd) {
            const currentStock = typeof currentProd.inventory !== 'undefined' ? currentProd.inventory : 10;
            const newStock = Math.max(0, currentStock - cartItem.quantity);
            updateProduct(prodId, { inventory: newStock, inStock: newStock > 0 });
        }
      });

      setSuccess(true);
      
      // Clear items after animation
      setTimeout(() => {
        items.forEach(i => removeItem(i.id));
      }, 1500);

    } catch (error) {
      console.error("Order processing failed", error);
      alert("Failed to process order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = (order: any) => {
    if (!order) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to open the print ledger.');
      return;
    }

    const itemsHtml = order.items.map((item: any) => {
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
            ${formatPrice(item.priceAtTime)}
          </td>
          <td style="padding: 16px 0; text-align: right; font-family: monospace; font-size: 13px; color: #010101; font-weight: bold;">
            ${formatPrice(item.quantity * item.priceAtTime)}
          </td>
        </tr>
      `;
    }).join('');

    const itemsTotal = order.items.reduce((sum: number, item: any) => sum + (item.priceAtTime * item.quantity), 0);
    const discount = order.discount || 0;
    const subtotal = order.subtotal || (itemsTotal - discount);
    const vat = order.vat || 0;
    const vatLabel = order.vatLabel || 'VAT (15%)';
    const finalTotal = order.total;

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
            .header-container {
              border-bottom: 2px solid #000000;
              padding-bottom: 30px;
              margin-bottom: 40px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .brand-logo {
              font-family: 'Playfair Display', Georgia, serif;
              font-size: 38px;
              font-weight: 700;
              letter-spacing: -0.02em;
              text-transform: uppercase;
              line-height: 1;
              color: #000000;
            }
            .brand-sub {
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              color: #705030;
              margin-top: 8px;
            }
            .receipt-title {
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              color: #64748b;
              font-weight: bold;
              text-align: right;
            }
            .metadata-grid {
              display: grid;
              grid-template-cols: repeat(4, 1fr);
              gap: 24px;
              margin-bottom: 40px;
            }
            .meta-item {
              font-family: 'JetBrains Mono', monospace;
              font-size: 10px;
              text-transform: uppercase;
            }
            .meta-label {
              color: #94a3b8;
              margin-bottom: 4px;
              display: block;
              letter-spacing: 0.1em;
            }
            .meta-value {
              font-weight: bold;
              color: #0f172a;
            }
            .ledger-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 40px;
            }
            .ledger-table th {
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              color: #94a3b8;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 12px;
            }
            .ledger-summary {
              width: 320px;
              margin-left: auto;
              margin-bottom: 40px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
            .ledger-row {
              display: flex;
              justify-content: space-between;
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              margin-bottom: 10px;
              text-transform: uppercase;
            }
            .ledger-grand {
              border-top: 2px solid #000000;
              padding-top: 14px;
              margin-top: 14px;
              font-weight: 700;
              font-size: 14px;
              color: #000000;
            }
            .footer-credit {
              text-align: center;
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              letter-spacing: 0.1em;
              color: #94a3b8;
              border-top: 1px solid #f1f5f9;
              padding-top: 40px;
              margin-top: 80px;
              text-transform: uppercase;
            }
            @media print {
              body { margin: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div>
              <div class="brand-logo">Wooltown</div>
              <div class="brand-sub">Stockholm Sizing Repository</div>
            </div>
            <div class="receipt-title">
              DISPATCH LEDGER RECEIPT<br/>
              <span style="color: #000000; font-size: 13px; font-family: monospace; display: block; margin-top: 6px;">REF ${order.id}</span>
            </div>
          </div>

          <div class="metadata-grid">
            <div class="meta-item">
              <span class="meta-label">DISPATCH CODE</span>
              <span class="meta-value">${order.id}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">CHRONO STAMP</span>
              <span class="meta-value">${new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">TRACING GATEWAY</span>
              <span class="meta-value">ARCTIC ROUTE</span>
            </div>
            <div class="meta-item" style="text-align: right;">
              <span class="meta-label">STATUS</span>
              <span class="meta-value" style="color: #10b981;">SECURE</span>
            </div>
          </div>

          <table class="ledger-table">
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
    printWindow.print();
  };

  if (success) {
    const orderToRender = placedOrder || {
      id: `ord_wool_${Math.floor(1000 + Math.random() * 9000)}`,
      items: [],
      total: finalTotal,
      vat: vat,
      vatLabel: vatLabel,
      discount: discount,
      subtotal: subtotal
    };

    return (
      <PageTransition>
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#FAF9F6] min-h-[90vh] pt-28 md:pt-32 pb-16 md:pb-24">
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="bg-white p-8 md:p-12 border border-slate-200 max-w-lg w-full shadow-lg space-y-8"
          >
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-slate-905 bg-slate-900 text-[#FAF9F6] flex items-center justify-center mx-auto mb-4 font-serif text-xl font-bold">W</div>
              <h2 className="text-2xl font-serif tracking-tight text-slate-950 uppercase">Order Confirmed</h2>
              <p className="text-slate-500 font-sans text-xs max-w-xs mx-auto">
                Thank you for sourcing from Wooltown Stockholm. The dispatch stream is now initialized.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="border border-slate-200 p-6 bg-slate-50/50 space-y-4 font-mono text-[10px] uppercase tracking-wide">
              <div className="flex justify-between text-slate-400 pb-2 border-b border-slate-150">
                <span>Receipt Reference</span>
                <span className="text-slate-900 font-bold">{orderToRender.id}</span>
              </div>

              {orderToRender.items && orderToRender.items.length > 0 && (
                <div className="space-y-2 py-2">
                  <span className="text-slate-400 text-[9px] tracking-wider block mb-1">Items Dispatched:</span>
                  {orderToRender.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-slate-700">
                      <span className="truncate max-w-[200px] text-left">{item.name || `Piece Ref: ${item.productId}`} x{item.quantity}</span>
                      <span>{formatPrice(item.priceAtTime * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-slate-150 pt-4 space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Gross Subtotal</span>
                  <span>{formatPrice(orderToRender.subtotal)}</span>
                </div>
                {orderToRender.discount > 0 && (
                  <div className="flex justify-between text-amber-800 font-bold">
                    <span>10% Promo Discount</span>
                    <span>-{formatPrice(orderToRender.discount, true)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Dispatch Rate</span>
                  <span className="text-green-600 font-bold font-sans">FREE</span>
                </div>
                <div className="flex justify-between text-slate-500 font-bold">
                  <span>{orderToRender.vatLabel || vatLabel}</span>
                  <span>{formatPrice(orderToRender.vat, true)}</span>
                </div>
                <div className="flex justify-between text-slate-950 font-bold text-xs border-t border-slate-200 pt-3 mt-2">
                  <span>Grand Total</span>
                  <span className="text-[#705030]">{formatPrice(orderToRender.total)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => handlePrintReceipt(orderToRender)}
                className="flex-1 bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-none tracking-widest uppercase text-[10px] py-4 h-12 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Statement
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                className="flex-1 bg-slate-950 text-white hover:bg-slate-900 rounded-none tracking-widest uppercase text-[10px] py-4 h-12 flex items-center justify-center"
              >
                Continue Sourcing
              </Button>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#FAF9F6] text-center min-h-[80vh]">
          <h2 className="text-2xl font-serif text-slate-950 uppercase mb-6 tracking-wide">Assembly Core Empty</h2>
          <Button 
            onClick={() => navigate('/shop')} 
            className="bg-slate-950 text-white rounded-none tracking-widest uppercase text-xs h-14 px-8"
          >
            Browse Collections
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-28 md:pt-32 pb-16 md:pb-24 w-full flex-1 bg-[#FAF9F6]">
        {/* Minimalist checkout header */}
        <div className="border-b border-slate-200 pb-10 mb-12">
          <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-[#705030] uppercase block mb-3">SECURE DISPATCH TERMINAL</span>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-slate-950 uppercase">ORDER CHECKOUT</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Transaction Form */}
          <div className="lg:col-span-7 xl:col-span-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 bg-white p-8 md:p-12 border border-slate-200">
              
              {/* Section 1: Customer Record */}
              <div>
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <span className="font-mono text-xs text-amber-800 font-bold">[01]</span>
                  <h2 className="text-[11px] font-mono font-bold text-slate-950 uppercase tracking-widest">Customer Alignment</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Email Coordinates *</label>
                    <input 
                      {...register('email')} 
                      className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all placeholder-slate-300 font-sans text-sm" 
                      placeholder="e.g. resident@domain.com" 
                    />
                    {errors.email && <p className="text-red-500 text-xs font-mono mt-1.5">{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Coordinates */}
              <div>
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <span className="font-mono text-xs text-amber-800 font-bold">[02]</span>
                  <h2 className="text-[11px] font-mono font-bold text-slate-950 uppercase tracking-widest">Delivery Coordinates</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Recipient Full Name *</label>
                    <input 
                      {...register('name')} 
                      className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-sans text-sm" 
                    />
                    {errors.name && <p className="text-red-500 text-xs font-mono mt-1.5">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Country / Region *</label>
                    <div className="relative">
                      <select 
                        {...register('country')}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-sans text-sm appearance-none cursor-pointer pr-10"
                      >
                        {Object.values(countryTaxRates).map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] font-mono text-slate-400">&darr;</div>
                    </div>
                    {errors.country && <p className="text-red-500 text-xs font-mono mt-1.5">{errors.country.message}</p>}
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Physical Address *</label>
                    <input 
                      {...register('address')} 
                      className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-sans text-sm" 
                    />
                    {errors.address && <p className="text-red-500 text-xs font-mono mt-1.5">{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">City Node *</label>
                      <input 
                        {...register('city')} 
                        className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-sans text-sm" 
                      />
                      {errors.city && <p className="text-red-500 text-xs font-mono mt-1.5">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Postal Code (ZIP) *</label>
                      <input 
                        {...register('zip')} 
                        className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-sans text-sm" 
                      />
                      {errors.zip && <p className="text-red-500 text-xs font-mono mt-1.5">{errors.zip.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Financial Tokenization */}
              <div>
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <span className="font-mono text-xs text-amber-800 font-bold">[03]</span>
                  <h2 className="text-[11px] font-mono font-bold text-slate-950 uppercase tracking-widest">Financial Tokenization</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">Card Number *</label>
                      {cardType && (
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-900 bg-slate-100 px-2 py-0.5">{cardType}</span>
                      )}
                    </div>
                    <input 
                      {...register('cardNumber', {
                        onChange: (e) => {
                          const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                          const formatted = val.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
                          setValue('cardNumber', formatted);
                        }
                      })} 
                      maxLength={19}
                      placeholder="4000 1234 5678 9010" 
                      className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-sans text-sm placeholder-slate-200" 
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs font-mono mt-1.5">{errors.cardNumber.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Expiration MM/YY *</label>
                      <input 
                        {...register('exp', {
                          onChange: (e) => {
                            let val = e.target.value.replace(/\D/g, '').substring(0, 4);
                            if (val.length >= 2) {
                              val = `${val.substring(0, 2)}/${val.substring(2)}`;
                            }
                            setValue('exp', val);
                          }
                        })} 
                        maxLength={5}
                        placeholder="11/27" 
                        className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-sans text-sm placeholder-slate-200" 
                      />
                      {errors.exp && <p className="text-red-500 text-xs font-mono mt-1.5">{errors.exp.message}</p>}
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-1">Secure CVV *</label>
                      <input 
                        {...register('cvv', {
                          onChange: (e) => {
                            setValue('cvv', e.target.value.replace(/\D/g, '').substring(0, 4));
                          }
                        })} 
                        maxLength={4}
                        placeholder="000" 
                        className="w-full px-4 py-3 bg-transparent border border-slate-200 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-sans text-sm placeholder-slate-200" 
                      />
                      {errors.cvv && <p className="text-red-500 text-xs font-mono mt-1.5">{errors.cvv.message}</p>}
                    </div>
                  </div>
                </div>
                {user && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 bg-amber-50/10 p-3 border border-amber-200/50">
                    <input 
                      type="checkbox" 
                      id="savePaymentDetails" 
                      checked={savePaymentDetails}
                      onChange={(e) => setSavePaymentDetails(e.target.checked)}
                      className="w-4 h-4 text-[#705030] border-slate-300 rounded focus:ring-[#705030] bg-transparent accent-[#705030] cursor-pointer"
                    />
                    <label htmlFor="savePaymentDetails" className="text-[9px] font-mono text-slate-600 uppercase tracking-wider select-none cursor-pointer font-bold">
                      Save credentials and shipping coordinates for future orders
                    </label>
                  </div>
                )}
              </div>

              {/* Secure transaction lock notes */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 font-mono text-[9px] tracking-wider text-slate-400">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>256-BIT HIGH SECURITY STRIPE WRAPPER ENGAGED. NO RECORD STORED LOCALLY.</span>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-slate-950 text-white hover:bg-slate-900 rounded-none tracking-widest uppercase text-xs h-14 !mt-10" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "PROCESSING TRANSACTION..." : `CONFIRM DISPATCH FOR ${formatPrice(finalTotal)}`}
              </Button>
            </form>
          </div>

          {/* Sticky Architectural Order Ledger */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-28 space-y-6">
            <div className="bg-white p-8 border border-slate-200">
              <h2 className="text-[11px] font-mono font-bold text-slate-950 uppercase tracking-widest border-b border-slate-100 pb-4 mb-6">
                Assembly Ledger
              </h2>
              
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 divide-y divide-slate-150">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 pt-4 first:pt-0">
                    <div className="w-14 h-18 bg-[#FAF9F6] border border-slate-100 overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img 
                          src={resolveProductImage(item.image)} 
                          alt={item.name} 
                          className="w-full h-full object-cover filter brightness-[98%]" 
                        />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <h3 className="text-xs font-serif font-bold text-slate-950 leading-tight mb-1 truncate">
                        {item.name}
                      </h3>
                      <div className="flex flex-col gap-0.5">
                        <p className="font-mono text-[9px] text-slate-400">QTY: {item.quantity}</p>
                        {item.maxStock !== undefined && item.maxStock <= 5 && (
                          <p className="font-mono text-[9px] text-amber-600 font-bold uppercase tracking-widest mb-1">ONLY {item.maxStock} PIECES LEFT</p>
                        )}
                        {(item.size || item.color) && (
                          <div className="font-mono text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-x-1.5 mt-0.5 select-none">
                            {item.size && <span>SZ: <strong className="text-slate-800">{item.size}</strong></span>}
                            {item.size && item.color && <span className="text-slate-300">|</span>}
                            {item.color && <span className="truncate max-w-[100px]">COL: <strong className="text-slate-800">{item.color}</strong></span>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-center">
                      <span className="font-mono text-xs text-slate-900 font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-150 pt-6 space-y-3 font-mono text-[10px]">
                <div className="flex justify-between text-slate-400 uppercase tracking-wider">
                  <span>Gross Sizing Subtotal</span>
                  <span className="text-slate-900">{formatPrice(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-amber-800 uppercase tracking-wider font-bold">
                    <span>10% PROMO DISCOUNT</span>
                    <span>-{formatPrice(discount, true)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400 uppercase tracking-wider">
                  <span>DISPATCH SYSTEM RATE</span>
                  <span className="text-green-600 font-bold">COMPLIMENTARY</span>
                </div>
                 <div className="flex justify-between text-slate-400 uppercase tracking-wider">
                  <span>{vatLabel}</span>
                  <span>{formatPrice(vat, true)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm tracking-tight pt-4 border-t border-slate-100 mt-4 uppercase">
                  <span>Aggregate Total</span>
                  <span className="font-mono font-extrabold text-[#705030]">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Certifications Box */}
            <div className="border border-slate-200 bg-[#EADED2]/10 p-6 flex items-start gap-4">
              <Shield className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
              <div className="font-mono text-[9px] tracking-wide text-[#705030] leading-relaxed uppercase">
                <span className="font-bold block mb-1 text-slate-950">ORIGIN INTEGRITY</span>
                Every container is sealed with high thermal-trace codes representing carbon-neutral sheep fields.
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
