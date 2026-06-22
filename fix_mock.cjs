const fs = require('fs');
let content = fs.readFileSync('src/lib/mockData.ts', 'utf-8');

content = content.replace(
  /export const mockOrders: Order\[\] = \[\s+{\s+id: "ord_1", userId: "u_1", total: 440\.00, status: "DELIVERED",\s+createdAt: new Date\(Date\.now\(\) - 7 \* 24 \* 60 \* 60 \* 1000\)\.toISOString\(\),\s+items: \[\{ id: "oi_1", productId: "p_gen_1", quantity: 2, priceAtTime: 220\.00 \}\]\s+}\s+\];/,
  `export const mockOrders = [
  {
    id: "ord_1", userId: "u_1", total: 440.00, status: "DELIVERED",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{ id: "oi_1", productId: "p_gen_1", quantity: 2, priceAtTime: 220.00, name: "The Wooltown Standard" }],
    customerName: "Alex Johnson",
    customerEmail: "alex.johnson@example.com",
    paymentMethod: 'VISA',
    shippingAddress: {
      address: "123 Main St",
      city: "Stockholm",
      zip: "111 22",
      country: "SE"
    }
  }
];`
);

content = content.replace(
  /export interface Order {[\s\S]*?}/,
  `export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  paymentMethod?: string;
  shippingAddress?: {
    address: string;
    city: string;
    zip: string;
    country: string;
  };
}`
);

fs.writeFileSync('src/lib/mockData.ts', content);
