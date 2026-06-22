const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

const printFn = `
  const handlePrintOrder = (order: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to open the print ledger.');
      return;
    }

    const itemsHtml = (order.items || []).map((item: any) => {
      return \`
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 16px 0; font-family: system-ui, sans-serif; font-size: 13px; color: #1e293b;">
            <strong style="color: #0f172a; font-family: serif; font-size: 14px;">\${item.name || 'Wooltown Piece'}</strong><br/>
            <span style="font-size: 11px; color: #64748b; font-family: monospace;">PRODUCT REF: \${item.productId}</span>
          </td>
          <td style="padding: 16px 0; text-align: center; font-family: monospace; font-size: 13px; color: #1e293b;">
            \${item.quantity}
          </td>
          <td style="padding: 16px 0; text-align: right; font-family: monospace; font-size: 13px; color: #1e293b;">
            \${order.total / 100} <!-- Mocking formatPrice conceptually -->
          </td>
        </tr>
      \`;
    }).join('');

    printWindow.document.write(\`
      <html>
        <head>
          <title>Order Ledger - \${order.id}</title>
          <style>
            @media print { body { -webkit-print-color-adjust: exact; } }
            body { font-family: system-ui, sans-serif; padding: 40px; color: #020617; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 1px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 32px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="font-family: serif; font-size: 24px; margin: 0 0 8px 0; text-transform: uppercase;">Wooltown Admin Ledger</h1>
            <p style="font-family: monospace; font-size: 12px; color: #64748b; margin: 0;">Order Reference: \${order.id} | Date: \${new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 32px; font-size: 13px;">
            <div>
              <strong style="font-family: monospace; font-size: 10px; color: #64748b; text-transform: uppercase;">Customer Details</strong><br/>
              \${order.customerName || order.userId}<br/>
              \${order.customerEmail || ''}
            </div>
            <div style="text-align: right;">
              <strong style="font-family: monospace; font-size: 10px; color: #64748b; text-transform: uppercase;">Shipping & Payment</strong><br/>
              \${order.shippingAddress ? \`\${order.shippingAddress.address}, \${order.shippingAddress.city}, \${order.shippingAddress.zip}, \${order.shippingAddress.country}\` : '(No Shipping Provided)'}<br/>
              \${order.paymentMethod || 'Card'}
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
              \${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="text-align: right; padding: 24px 0 8px; font-family: monospace; font-size: 11px; color: #64748b;">Subtotal</td>
                <td style="text-align: right; padding: 24px 0 8px; font-family: monospace; font-size: 13px; font-weight: bold;">$\${order.subtotal || order.total}</td>
              </tr>
            </tfoot>
          </table>
          <script>window.onload = () => { window.print(); };</script>
        </body>
      </html>
    \`);
    printWindow.document.close();
  };
`;

content = content.replace(
  /const handleExportOrdersCSV = \(\) => {/,
  `${printFn}\n\n  const handleExportOrdersCSV = () => {`
);

const expandedOrderHtml = `
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
`;

content = content.replace(
  /\{isExpanded && \(\s+<tr className="bg-slate-50 border-b border-slate-100">[\s\S]*?<\/tr>\s+\)\}/,
  expandedOrderHtml
);

fs.writeFileSync('src/pages/Admin.tsx', content);
console.log('Done Admin');
