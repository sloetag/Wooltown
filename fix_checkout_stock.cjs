const fs = require('fs');

let checkoutContent = fs.readFileSync('src/pages/Checkout.tsx', 'utf-8');

if (!checkoutContent.includes('useProductStore')) {
  checkoutContent = checkoutContent.replace(
    /import \{ useCartStore \} from '\.\.\/store\/cartStore';/,
    `import { useCartStore } from '../store/cartStore';\nimport { useProductStore } from '../store/productStore';`
  );
  
  checkoutContent = checkoutContent.replace(
    /const \{ items, removeItem, subtotal \} = useCartStore\(\);/,
    `const { items, removeItem, subtotal } = useCartStore();\n  const { products, updateProduct } = useProductStore();`
  );
}

// Inside the checkout submission, update the inventory.
const inventoryUpdateCode = `
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
`;

checkoutContent = checkoutContent.replace(
  /setSuccess\(true\);/,
  `${inventoryUpdateCode}\n      setSuccess(true);`
);

fs.writeFileSync('src/pages/Checkout.tsx', checkoutContent);
console.log('Checkout updated for inventory reduction');
