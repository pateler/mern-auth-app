import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });
import mongoose from "mongoose";
import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding");

    // Check if admin exists
    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (adminExists) {
      console.log("ℹ️ Admin user already exists");
    } else {
      // Create admin user
      const admin = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: "admin1234", // Changed to meet minimum 8 characters
        role: "admin",
        isActive: true,
        workspace: {
          name: "Admin Workspace",
        },
      });

      await admin.save();
      console.log("✅ Admin user created successfully:");
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: admin1234`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Workspace: ${admin.workspace.name}`);
    }

    // Create a demo user as well
    const demoUserExists = await User.findOne({ email: "demo@example.com" });
    if (!demoUserExists) {
      const demoUser = new User({
        name: "Demo User",
        email: "demo@example.com",
        password: "demo1234", // Changed to meet minimum 8 characters
        role: "user",
        isActive: true,
        workspace: {
          name: "Demo Workspace",
        },
      });

      await demoUser.save();
      console.log("✅ Demo user created successfully:");
      console.log("   Email: demo@example.com");
      console.log("   Password: demo1234");
    } else {
      console.log("ℹ️ Demo user already exists");
    }

    await mongoose.disconnect();
    console.log("✅ Seeding complete");
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    console.error("Full error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Simply call the function since this is a seed script
seedAdmin();

export default seedAdmin;
