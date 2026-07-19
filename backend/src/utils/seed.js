require("dotenv").config({ path: "../../.env" });
const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding");

    // Check if admin exists
    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (adminExists) {
      console.log("ℹ️ Admin user already exists");
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      isActive: true,
      workspace: {
        name: "Admin Workspace",
      },
    });

    console.log("✅ Admin user created successfully:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: admin123`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Workspace: ${admin.workspace.name}`);

    // Create a demo user as well
    const demoUserExists = await User.findOne({ email: "demo@example.com" });
    if (!demoUserExists) {
      await User.create({
        name: "Demo User",
        email: "demo@example.com",
        password: "demo123",
        role: "user",
        isActive: true,
        workspace: {
          name: "Demo Workspace",
        },
      });
      console.log("✅ Demo user created successfully:");
      console.log("   Email: demo@example.com");
      console.log("   Password: demo123");
    }

    await mongoose.disconnect();
    console.log("✅ Seeding complete");
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedAdmin();
}

module.exports = seedAdmin;
