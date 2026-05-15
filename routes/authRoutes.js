import express from "express";
import {
  loginAdmin,
  getMe,
  getPublicRooms,
  registerStudent,
  loginStudent,
  getStudentMe,
} from "../controllers/authController.js";
import { authMiddleware, studentAuthMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin auth
router.post("/login", loginAdmin);
router.get("/me", authMiddleware, getMe);

// Student auth (public)
router.get("/rooms", getPublicRooms);
router.post("/student/register", registerStudent);
router.post("/student/login", loginStudent);
router.get("/student/me", studentAuthMiddleware, getStudentMe);

export default router;
