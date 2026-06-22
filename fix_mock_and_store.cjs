const fs = require('fs');

// 1. Update mockData.ts
let mockContent = fs.readFileSync('src/lib/mockData.ts', 'utf-8');
mockContent = mockContent.replace(
  /inStock: boolean;/,
  `inStock: boolean;
  inventory?: number;`
);

mockContent = mockContent.replace(
  /inStock: globalCounter % 20 !== 0/,
  `inStock: globalCounter % 20 !== 0,
            inventory: (globalCounter % 20 !== 0) ? Math.floor(10 + ((globalCounter * 7) % 50)) : 0`
);
fs.writeFileSync('src/lib/mockData.ts', mockContent);

// 2. Update Admin.tsx form
let adminContent = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

// Update FormData initialization
adminContent = adminContent.replace(
  /inStock: true,/,
  `inStock: true,
    inventory: 10,`
);

// Update handleEdit
adminContent = adminContent.replace(
  /inStock: prod.inStock,/,
  `inStock: prod.inStock,
      inventory: prod.inventory || 0,`
);

// Update Add New Item reset
adminContent = adminContent.replace(
  /variants: \{\}/,
  `variants: {}, inventory: 10`
);

// Add Quantity logic to Admin form
const quantityField = `
                       <div>
                         <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">Initial Quantity / Inventory</label>
                         <input required type="number" min="0" value={formData.inventory || 0} onChange={e => setFormData({...formData, inventory: parseInt(e.target.value, 10), inStock: parseInt(e.target.value, 10) > 0})} className="w-full border border-slate-200 p-2 text-sm focus:outline-none focus:border-slate-900" />
                       </div>
                       <div className="md:col-span-2">`;
adminContent = adminContent.replace(
  /<div className="md:col-span-2">\s*<label className="block text-\[10px\] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">Description<\/label>/,
  quantityField + `\n                         <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>`
);

// Also show inventory in the admin list
adminContent = adminContent.replace(
  /<th className="py-4 px-4 text-\[9px\] font-mono font-bold uppercase tracking-widest text-slate-500">Price<\/th>/,
  `<th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">Price</th>
                        <th className="py-4 px-4 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500 text-center">Stock</th>`
);

adminContent = adminContent.replace(
  /<td className="py-3 px-4 text-xs font-mono text-slate-500">\{formatPrice\(product\.price\)\}<\/td>/,
  `<td className="py-3 px-4 text-xs font-mono text-slate-500">{formatPrice(product.price)}</td>
                        <td className={"py-3 px-4 text-[10px] font-mono font-bold text-center " + (product.inventory && product.inventory > 0 ? "text-amber-700" : "text-red-500")}>
                          {product.inventory || 0}
                        </td>`
);

fs.writeFileSync('src/pages/Admin.tsx', adminContent);
console.log('Mock Data and Admin updated');
