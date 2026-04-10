import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    const MONGO_URI =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lost_and_found_db";
    await mongoose.connect(MONGO_URI);

    // Check if admin already exists
    const adminExists = await User.findOne({
      email: "lifechurchadmin@lostandfound.com",
    });
    if (adminExists) {
      console.log(
        "✅ Admin account already exists! Login with: lifechurchadmin@lostandfound.com",
      );
      process.exit();
    }

    // Creating the default admin
    const adminUser = await User.create({
      name: "Super Admin",
      email: "lifechurchadmin@lostandfound.com",
      password: "life123",
      role: "admin",
    });

    console.log(`✅ Admin account created successfully!`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: adminpassword123`);
    console.log(`Role: ${adminUser.role}`);
    process.exit();
  } catch (error) {
    console.error(`❌ Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
