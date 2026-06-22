import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import Stripe from "stripe";

// Initialize Stripe gracefully, so it doesn't crash if omitted
const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock_key_only_for_demo";
const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" as any });

// Simulated Database / In-Memory Store
const db = {
  inventory: [
    { id: "prod_015", stock: 120, reserved: 0 },
    { id: "prod_016", stock: 50, reserved: 0 }
  ],
  orders: [] as any[],
  analytics: [] as any[],
  cmsProducts: [] as any[], // mock CMS
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust the proxy since we are running behind one (AI Studio infrastructure / Cloud Run)
  app.set("trust proxy", 1);

  // Security & Compliance
  app.use(helmet({
    contentSecurityPolicy: false, // disabled for Vite HMR and development
  }));
  app.use(cors());

  // Analytics & Tracking Log
  app.use(morgan("combined"));

  // Payload Parser
  app.use(express.json());

  // Rate Limiting
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false }, // Disable warning regarding standard proxy headers
    message: { error: "Too many requests, please try again later." }
  });

  // ==========================================
  // API ROUTES (Backend Engine)
  // ==========================================

  const apiRouter = express.Router();
  
  // Apply rate limiter to all API routes
  apiRouter.use(apiLimiter);

  // --- ANALYTICS AND TRACKING ---
  apiRouter.post("/analytics/track", (req, res) => {
    const { event, data } = req.body;
    db.analytics.push({ event, data, timestamp: new Date(), ip: req.ip });
    res.json({ status: "success" });
  });

  apiRouter.get("/analytics/dashboard", (req, res) => {
    // Return mock analytics
    res.json({
      status: "success",
      totalViews: db.analytics.filter(a => a.event === "page_view").length,
      recentEvents: db.analytics.slice(-10),
    });
  });

  // --- CMS MANAGEMENT ---
  apiRouter.get("/cms/products", (req, res) => {
    res.json({ status: "success", data: db.cmsProducts });
  });

  apiRouter.post("/cms/products", (req, res) => {
    const newProduct = { ...req.body, id: `prod_${Date.now()}` };
    db.cmsProducts.push(newProduct);
    res.status(201).json({ status: "success", data: newProduct });
  });

  // --- INVENTORY MANAGEMENT ---
  apiRouter.get("/inventory", (req, res) => {
    res.json({ status: "success", data: db.inventory });
  });

  apiRouter.get("/inventory/:productId", (req, res) => {
    const item = db.inventory.find(i => i.id === req.params.productId);
    if (!item) return res.status(404).json({ error: "Product not found in inventory" });
    res.json({ status: "success", data: item });
  });

  apiRouter.post("/inventory/reserve", (req, res) => {
    // API to reserve inventory during checkout
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid items array" });
    }
    
    // Simplistic reservation check
    let canReserve = true;
    for (const item of items) {
      const invItem = db.inventory.find(i => i.id === item.productId);
      if (!invItem || invItem.stock - invItem.reserved < item.quantity) {
        canReserve = false;
        break;
      }
    }

    if (!canReserve) {
      return res.status(400).json({ error: "Insufficient stock for some items" });
    }

    // Apply reservation
    for (const item of items) {
      const invItem = db.inventory.find(i => i.id === item.productId)!;
      invItem.reserved += item.quantity;
    }

    res.json({ status: "success", message: "Inventory reserved successfully" });
  });

  // --- ORDER PROCESSING & PAYMENT GATEWAY (STRIPE) ---
  apiRouter.post("/checkout/create-payment-intent", async (req, res) => {
    try {
      const { items } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "No items provided" });
      }

      // Calculate order total securely on server to prevent manipulation
      // For this example we just assume a generic amount, in a real app query db
      const totalAmount = items.reduce((sum: number, item: any) => sum + ((item.price || 50) * (item.quantity || 1)), 0);

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        status: "success",
      });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  apiRouter.post("/checkout/process", async (req, res) => {
    try {
      const { paymentDetails, orderItems, shippingInfo, customerInfo } = req.body;

      if (!paymentDetails || !orderItems || !shippingInfo) {
        return res.status(400).json({ error: "Incomplete order data" });
      }

      // 1. Simulate Secure Payment Gateway Processing
      // In a real app, you would use Stripe/Braintree SDK here:
      // const charge = await stripe.charges.create({ ... })
      const paymentProcessed = true; // Simulated success
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      if (!paymentProcessed) {
        throw new Error("Payment declined by gateway");
      }

      // 2. Create Order Record
      const orderId = `ORD-${Date.now()}`;
      const newOrder = {
        id: orderId,
        customerInfo,
        shippingInfo,
        items: orderItems,
        totalAmount: paymentDetails.amount,
        transactionId,
        status: "PROCESSING",
        createdAt: new Date().toISOString()
      };
      db.orders.push(newOrder);

      // 3. Update Inventory (Convert reserved to sold)
      for (const item of orderItems) {
        const invItem = db.inventory.find(i => i.id === item.productId);
        if (invItem) {
          invItem.stock -= item.quantity;
          invItem.reserved -= item.quantity;
        }
      }

      // 4. Trigger Third-Party Logistics (3PL) Webhook Simulation
      // await triggerLogisticsFulfillment(newOrder);

      res.status(201).json({ 
        status: "success", 
        message: "Order processed successfully", 
        data: {
          orderId,
          transactionId,
          status: newOrder.status
        }
      });
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  // --- LOGISTICS & THIRD-PARTY INTEGRATIONS ---
  apiRouter.post("/logistics/webhook/update-status", (req, res) => {
    // Webhook for 3PL providers (like ShipBob or ShipStation) to update order status
    const { orderId, trackingNumber, status } = req.body;
    const order = db.orders.find(o => o.id === orderId);
    
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    order.trackingNumber = trackingNumber;

    res.json({ status: "success", message: "Order status updated via 3PL webhook" });
  });

  apiRouter.get("/orders/:id", (req, res) => {
    const order = db.orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ status: "success", data: order });
  });

  // --- MARKETING & CRM TOOLS ---
  apiRouter.post("/marketing/newsletter/subscribe", (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: "Invalid email" });
    }
    
    // Simulate syncing with Mailchimp / Klaviyo
    // const klaviyoClient = new Klaviyo(...);
    // klaviyoClient.Profiles.create({ email });
    console.log(`[Marketing] Synced new subscriber to CRM: ${email}`);
    
    res.json({ status: "success", message: "Subscribed to newsletter and synced to CRM" });
  });

  // Mount API router
  app.use("/api", apiRouter);

  // ==========================================
  // VITE MIDDLEWARE (Frontend Rendering)
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
