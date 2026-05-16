import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import studentRoutes from "./routes/studentRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import studentPortalRoutes from "./routes/studentPortalRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";

dotenv.config();

if (!process.env.JWT_SECRET?.trim()) {
  console.error("❌ JWT_SECRET is missing in .env — login tokens will not work.");
  console.error("   Add: JWT_SECRET=your_secret_key_here");
  process.exit(1);
}
if (!process.env.MONGO_URI?.trim()) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "Database not connected. Start MongoDB and check MONGO_URI in .env",
    });
  }
  next();
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    database: mongoose.connection.name,
    mongoUri: process.env.MONGO_URI,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentPortalRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/notices", noticeRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const dbName = mongoose.connection.name;
    console.log(`✅ MongoDB connected — database: "${dbName}"`);
    console.log(`   (Open this exact database in MongoDB Compass)`);
    app.listen(PORT, () => {
      console.log(`✅ API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
