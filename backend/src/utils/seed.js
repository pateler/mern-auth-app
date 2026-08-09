import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

console.log("MONGO_URI loaded:", process.env.MONGO_URI ? "✅ Yes" : "❌ No");

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Chat from "../models/Chat.js";
import Integration from "../models/Integration.js";
import AuditLog from "../models/AuditLog.js";

// Helper function to generate random date within range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random order ID
const generateOrderId = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${year}${month}${day}-${random}`;
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding");

    // Clear existing data (optional - uncomment if you want fresh data)
    console.log("🗑️ Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Chat.deleteMany({});
    await Integration.deleteMany({});
    await AuditLog.deleteMany({});

    // ==================== USERS ====================
    console.log("👤 Creating users...");

    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "admin1234",
        role: "admin",
        isActive: true,
        lastLogin: new Date(),
        workspace: { name: "Admin Workspace" },
        companyDetails: {
          companyName: "EcomDash Inc.",
          contactNumber: "+1234567890",
          businessAddress: "123 Business St, New York, NY 10001",
        },
        preferences: {
          timezone: "Asia/Kolkata (IST)",
          currency: "INR - Indian Rupees",
          notifications: {
            emailNewOrders: true,
            emailRefunds: true,
            emailChat: true,
            emailFailedPayments: true,
            pushBrowser: true,
            pushMobile: false,
            smsOrderConfirmations: true,
            smsDeliveryUpdates: false,
          },
        },
      },
      {
        name: "Demo User",
        email: "demo@example.com",
        password: "demo1234",
        role: "user",
        isActive: true,
        lastLogin: new Date(),
        workspace: { name: "Demo Workspace" },
        companyDetails: {
          companyName: "Demo Company",
          contactNumber: "+9876543210",
          businessAddress: "456 Demo St, San Francisco, CA 94105",
        },
        preferences: {
          timezone: "America/New_York (EST)",
          currency: "USD - US Dollars",
          notifications: {
            emailNewOrders: true,
            emailRefunds: true,
            emailChat: true,
            emailFailedPayments: true,
            pushBrowser: true,
            pushMobile: true,
            smsOrderConfirmations: true,
            smsDeliveryUpdates: true,
          },
        },
      },
      {
        name: "Aman Shah",
        email: "aman@example.com",
        password: "aman1234",
        role: "admin",
        isActive: true,
        lastLogin: new Date(),
        workspace: { name: "Aman's Workspace" },
        companyDetails: {
          companyName: "Shah Enterprises",
          contactNumber: "+918308261669",
          businessAddress: "6565 Fannin St, Houston, TX 77030",
        },
      },
      {
        name: "Abhishek Borude",
        email: "abhishek@example.com",
        password: "abhi1234",
        role: "admin",
        isActive: true,
        lastLogin: randomDate(new Date(2026, 4, 1), new Date(2026, 4, 8)),
        workspace: { name: "Borude Solutions" },
      },
      {
        name: "Sanket Patil",
        email: "sanket@example.com",
        password: "sanket1234",
        role: "admin",
        isActive: true,
        lastLogin: new Date(),
        workspace: { name: "Patil Group" },
      },
      {
        name: "Zainab Khan",
        email: "zainab@example.com",
        password: "zainab1234",
        role: "admin",
        isActive: true,
        lastLogin: new Date(),
        workspace: { name: "Khan Enterprises" },
      },
      {
        name: "Paramveer Singh",
        email: "paramveer@example.com",
        password: "param1234",
        role: "admin",
        isActive: false,
        lastLogin: randomDate(new Date(2026, 4, 1), new Date(2026, 4, 8)),
        workspace: { name: "Singh Corp" },
      },
      {
        name: "Nizam Dalal",
        email: "nizam@example.com",
        password: "nizam1234",
        role: "admin",
        isActive: true,
        lastLogin: new Date(),
        workspace: { name: "Dalal Industries" },
      },
      {
        name: "Yasmeen Shaikh",
        email: "yasmeen@example.com",
        password: "yasmeen1234",
        role: "admin",
        isActive: true,
        lastLogin: new Date(),
        workspace: { name: "Shaikh Group" },
      },
      {
        name: "Pankaj Jangid",
        email: "pankaj@example.com",
        password: "pankaj1234",
        role: "admin",
        isActive: true,
        lastLogin: null,
        workspace: { name: "Jangid Associates" },
      },
      {
        name: "Saurabh Chaudhari",
        email: "saurabh@example.com",
        password: "saurabh1234",
        role: "admin",
        isActive: true,
        lastLogin: randomDate(new Date(2026, 4, 1), new Date(2026, 4, 8)),
        workspace: { name: "Chaudhari Corp" },
      },
    ];

    const createdUsers = [];
    for (const userData of users) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        const user = await User.create(userData);
        createdUsers.push(user);
        console.log(`   ✅ Created user: ${user.name} (${user.email})`);
      } else {
        createdUsers.push(existing);
        console.log(`   ℹ️ User already exists: ${existing.name}`);
      }
    }

    // ==================== PRODUCTS ====================
    console.log("📦 Creating products...");

    const products = [
      {
        name: "Nike Air Max 97 Running Shoes",
        sku: "NK-8821",
        category: "Footwear",
        description: "Comfortable running shoes with air cushioning technology",
        price: 12000,
        costPrice: 8000,
        stock: 12,
        minStockLevel: 15,
        soldThisMonth: 182,
        revenue: 482000,
        images: [{ url: "/images/nike-air-max-97.jpg", alt: "Nike Air Max 97" }],
      },
      {
        name: "Jordan Oversized Hoodie Apparel",
        sku: "JH-2511",
        category: "Apparel",
        description: "Oversized hoodie with premium Jordan branding",
        price: 4500,
        costPrice: 2800,
        stock: 82,
        minStockLevel: 20,
        soldThisMonth: 144,
        revenue: 211000,
        images: [{ url: "/images/jordan-hoodie.jpg", alt: "Jordan Hoodie" }],
      },
      {
        name: "iPhone 15 Transparent Case",
        sku: "IP-1120",
        category: "Accessories",
        description: "Clear transparent protective case for iPhone 15",
        price: 1200,
        costPrice: 500,
        stock: 4,
        minStockLevel: 10,
        soldThisMonth: 412,
        revenue: 102000,
        images: [{ url: "/images/iphone-case.jpg", alt: "iPhone 15 Case" }],
      },
      {
        name: "Adidas Ultraboost 97 Running Shoes",
        sku: "AD-7722",
        category: "Footwear",
        description: "Premium running shoes with responsive cushioning",
        price: 15000,
        costPrice: 10000,
        stock: 45,
        minStockLevel: 15,
        soldThisMonth: 156,
        revenue: 324000,
        images: [{ url: "/images/adidas-ultraboost.jpg", alt: "Adidas Ultraboost" }],
      },
      {
        name: "Apple Watch Band",
        sku: "AW-3341",
        category: "Accessories",
        description: "Premium silicone sport band for Apple Watch",
        price: 2500,
        costPrice: 800,
        stock: 0,
        minStockLevel: 10,
        soldThisMonth: 89,
        revenue: 67000,
        images: [{ url: "/images/apple-watch-band.jpg", alt: "Apple Watch Band" }],
      },
      {
        name: "Samsung Galaxy S24 Ultra Case",
        sku: "SG-4421",
        category: "Accessories",
        description: "Premium protective case for Samsung Galaxy S24 Ultra",
        price: 1500,
        costPrice: 600,
        stock: 15,
        minStockLevel: 10,
        soldThisMonth: 234,
        revenue: 185000,
        images: [{ url: "/images/samsung-case.jpg", alt: "Samsung Case" }],
      },
      {
        name: "Puma RS-X Sneakers",
        sku: "PU-6632",
        category: "Footwear",
        description: "Retro-inspired sneakers with modern comfort",
        price: 8999,
        costPrice: 5500,
        stock: 28,
        minStockLevel: 15,
        soldThisMonth: 98,
        revenue: 276000,
        images: [{ url: "/images/puma-rsx.jpg", alt: "Puma RS-X" }],
      },
      {
        name: "Levi's Denim Jacket",
        sku: "LV-5531",
        category: "Apparel",
        description: "Classic denim jacket with modern fit",
        price: 6999,
        costPrice: 4200,
        stock: 35,
        minStockLevel: 15,
        soldThisMonth: 67,
        revenue: 156000,
        images: [{ url: "/images/levis-jacket.jpg", alt: "Levi's Jacket" }],
      },
      {
        name: "AirPods Pro 2",
        sku: "AP-2234",
        category: "Electronics",
        description: "Premium wireless earbuds with noise cancellation",
        price: 24999,
        costPrice: 18000,
        stock: 8,
        minStockLevel: 10,
        soldThisMonth: 145,
        revenue: 356000,
        images: [{ url: "/images/airpods-pro.jpg", alt: "AirPods Pro" }],
      },
      {
        name: "Fitbit Charge 5",
        sku: "FB-3345",
        category: "Electronics",
        description: "Advanced fitness tracker with heart rate monitoring",
        price: 15999,
        costPrice: 11000,
        stock: 22,
        minStockLevel: 10,
        soldThisMonth: 78,
        revenue: 187000,
        images: [{ url: "/images/fitbit-charge.jpg", alt: "Fitbit Charge" }],
      },
    ];

    const createdProducts = [];
    for (const productData of products) {
      const existing = await Product.findOne({ sku: productData.sku });
      if (!existing) {
        const product = await Product.create(productData);
        createdProducts.push(product);
        console.log(`   ✅ Created product: ${product.name} (${product.sku})`);
      } else {
        createdProducts.push(existing);
        console.log(`   ℹ️ Product already exists: ${existing.name}`);
      }
    }

    // ==================== ORDERS ====================
    console.log("📋 Creating orders...");

    const customers = [
      { name: "Sufyan Shaikh", email: "sufyan@example.com", phone: "+919876543210" },
      { name: "Sanket Patil", email: "sanket.p@example.com", phone: "+919876543211" },
      { name: "Saurabh Chaudhari", email: "saurabh.c@example.com", phone: "+919876543212" },
      { name: "Abhishek Borude", email: "abhishek.b@example.com", phone: "+919876543213" },
      { name: "Pankaj Jangid", email: "pankaj.j@example.com", phone: "+919876543214" },
      { name: "Amit Kumar", email: "amit.k@example.com", phone: "+919876543215" },
      { name: "Rahul Sharma", email: "rahul.s@example.com", phone: "+919876543216" },
      { name: "Priya Patel", email: "priya.p@example.com", phone: "+919876543217" },
    ];

    const orderStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled', 'Refunded'];
    const paymentStatuses = ['Pending', 'Paid', 'Completed', 'Refunded', 'COD'];

    const orders = [];
    for (let i = 0; i < 25; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const totalAmount = product.price * quantity;
      const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];

      const orderData = {
        orderId: generateOrderId(),
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: {
            street: `${Math.floor(Math.random() * 1000)} Main St`,
            city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'][Math.floor(Math.random() * 5)],
            state: ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana'][Math.floor(Math.random() * 4)],
            zipCode: String(Math.floor(Math.random() * 900000) + 100000),
            country: 'India',
          },
        },
        items: [{
          productId: product._id,
          name: product.name,
          sku: product.sku,
          quantity: quantity,
          price: product.price,
          total: totalAmount,
        }],
        totalAmount: totalAmount,
        status: status,
        paymentStatus: paymentStatus,
        paymentMethod: ['Card', 'COD', 'Bank Transfer', 'UPI'][Math.floor(Math.random() * 4)],
        processedBy: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
        createdAt: randomDate(new Date(2026, 3, 1), new Date()),
      };

      // Check if order already exists (by orderId)
      const existing = await Order.findOne({ orderId: orderData.orderId });
      if (!existing) {
        const order = await Order.create(orderData);
        orders.push(order);
      }
    }
    console.log(`   ✅ Created ${orders.length} orders`);

    // ==================== CHATS ====================
    console.log("💬 Creating chats...");

    const chatCustomers = [
      { name: "Amir Kumar", email: "amir@example.com", phone: "+919876543218" },
      { name: "Sofa Martinez", email: "sofa@example.com", phone: "+919876543219" },
      { name: "Liam Johnson", email: "liam@example.com", phone: "+919876543220" },
      { name: "Emma Davis", email: "emma@example.com", phone: "+919876543221" },
      { name: "Noah Brown", email: "noah@example.com", phone: "+919876543222" },
      { name: "Olivia Wilson", email: "olivia@example.com", phone: "+919876543223" },
    ];

    const chatMessages = [
      { customer: "Hi, I placed order #ORD-1024 but haven't received any update.", support: "Hello! Your order #ORD-1024 is currently being processed. Expected delivery: May 9, 2026." },
      { customer: "Can I change my delivery address?", support: "Yes, you can update your delivery address. Please provide the new address." },
      { customer: "What is the return policy for electronics?", support: "We offer 30-day return policy for all electronics items." },
      { customer: "How can I track my shipment?", support: "You can track your shipment using the tracking link sent to your email." },
      { customer: "Why was my order canceled?", support: "Your order was canceled due to payment verification issues." },
      { customer: "Where can I find my invoice?", support: "You can download your invoice from the order details page." },
    ];

    const chatStatuses = ['open', 'in_progress', 'resolved', 'urgent'];

    for (let i = 0; i < chatCustomers.length; i++) {
      const customer = chatCustomers[i];
      const order = orders[i % orders.length];
      const messagePair = chatMessages[i % chatMessages.length];
      const status = i < 2 ? 'urgent' : chatStatuses[Math.floor(Math.random() * chatStatuses.length)];
      const isUrgent = status === 'urgent';

      const chatData = {
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
        orderId: order?.orderId || null,
        messages: [
          {
            sender: 'customer',
            message: messagePair.customer,
            time: randomDate(new Date(2026, 4, 1), new Date()),
            read: true,
          },
          {
            sender: 'support',
            message: messagePair.support,
            time: randomDate(new Date(2026, 4, 1), new Date()),
            read: true,
          },
        ],
        status: status,
        isUrgent: isUrgent,
        assignedTo: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
        lastMessageAt: new Date(),
        unreadCount: Math.floor(Math.random() * 3),
      };

      const existing = await Chat.findOne({
        'customer.email': customer.email,
        orderId: order?.orderId || null,
      });

      if (!existing) {
        await Chat.create(chatData);
      }
    }
    console.log(`   ✅ Created ${chatCustomers.length} chats`);

    // ==================== INTEGRATIONS ====================
    console.log("🔗 Creating integrations...");

    const integrations = [
      {
        name: "WooCommerce",
        status: "connected",
        lastSynced: new Date(),
        settings: {
          apiUrl: "https://woocommerce.example.com",
          storeName: "My Store",
        },
      },
      {
        name: "Shiprocket",
        status: "connected",
        lastSynced: new Date(),
        settings: {
          apiUrl: "https://shiprocket.example.com",
        },
      },
      {
        name: "Razorpay",
        status: "connected",
        lastSynced: new Date(),
        settings: {
          apiKey: "rzp_test_123456",
        },
      },
      {
        name: "WhatsApp API",
        status: "disconnected",
        lastSynced: new Date(),
        settings: {
          phoneNumber: "+1234567890",
        },
      },
      {
        name: "Meta Ads",
        status: "disconnected",
        lastSynced: new Date(),
        settings: {
          accountId: "act_123456789",
        },
      },
    ];

    for (const integrationData of integrations) {
      const existing = await Integration.findOne({ name: integrationData.name });
      if (!existing) {
        await Integration.create(integrationData);
        console.log(`   ✅ Created integration: ${integrationData.name}`);
      } else {
        console.log(`   ℹ️ Integration already exists: ${existing.name}`);
      }
    }

    // ==================== AUDIT LOGS ====================
    console.log("📝 Creating audit logs...");

    const auditActions = [
      { action: "User logged in", module: "Users" },
      { action: "Order created", module: "Orders + Inventory" },
      { action: "Order updated", module: "Orders + Inventory" },
      { action: "Product created", module: "Orders + Inventory" },
      { action: "Product updated", module: "Orders + Inventory" },
      { action: "Product stock updated", module: "Orders + Inventory" },
      { action: "Chat resolved", module: "Full" },
      { action: "Chat assigned", module: "Full" },
      { action: "Settings updated", module: "Settings" },
      { action: "Team member updated", module: "Users" }, // Changed from "Team Management" to "Users"
      { action: "Integration synced", module: "Settings" },
      { action: "User logged out", module: "Users" },
      { action: "Password changed", module: "Users" },
    ];

    const devices = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Safari on Mac'];
    const ips = ['103.45.67.89', '103.45.67.90', '103.45.67.91', '103.45.67.92', '103.45.67.93'];

    for (let i = 0; i < 20; i++) {
      const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const auditAction = auditActions[Math.floor(Math.random() * auditActions.length)];

      const auditData = {
        user: {
          name: user.name,
          email: user.email,
          userId: user._id,
        },
        action: auditAction.action,
        module: auditAction.module,
        details: {
          method: ['API', 'Web', 'Mobile'][Math.floor(Math.random() * 3)],
          timestamp: new Date().toISOString(),
        },
        device: devices[Math.floor(Math.random() * devices.length)],
        ipAddress: ips[Math.floor(Math.random() * ips.length)],
        timestamp: randomDate(new Date(2026, 4, 1), new Date()),
      };

      // Check if audit log already exists (by checking combination of user, action, timestamp)
      const existing = await AuditLog.findOne({
        'user.email': user.email,
        action: auditAction.action,
        timestamp: auditData.timestamp,
      });

      if (!existing) {
        await AuditLog.create(auditData);
      }
    }
    console.log(`   ✅ Created audit logs`);

    // ==================== SUMMARY ====================
    console.log("\n📊 Seeding Summary:");
    console.log(`   👤 Users: ${createdUsers.length}`);
    console.log(`   📦 Products: ${createdProducts.length}`);
    console.log(`   📋 Orders: ${orders.length}`);
    console.log(`   💬 Chats: ${chatCustomers.length}`);
    console.log(`   🔗 Integrations: ${integrations.length}`);
    console.log(`   📝 Audit Logs: 20+`);

    await mongoose.disconnect();
    console.log("\n✅ Seeding complete successfully!");
    console.log("\n🔑 Login Credentials:");
    console.log("   Admin: admin@example.com / admin1234");
    console.log("   Demo: demo@example.com / demo1234");
    console.log("   Admin: aman@example.com / aman1234");

  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    console.error("Full error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();

export default seedDatabase;