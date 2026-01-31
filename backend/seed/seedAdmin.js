const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("❌ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 12);

    const admin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();

    console.log("✅ Admin created successfully");
    console.log("📧 Email: admin@gmail.com.com");
    console.log("🔑 Password: Admin@123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
