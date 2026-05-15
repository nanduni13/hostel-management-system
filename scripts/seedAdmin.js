import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "../models/adminModel.js";
import { hashPassword } from "../utils/password.js";

dotenv.config();

const username = process.argv[2] || "admin";
const password = process.argv[3] || "admin123";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log(`Admin "${username}" already exists.`);
    process.exit(0);
  }

  const hashed = await hashPassword(password);
  await Admin.create({ username, password: hashed });
  console.log(`✅ Admin created: username="${username}" password="${password}"`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
