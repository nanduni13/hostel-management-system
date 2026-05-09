import express from "express";
import { createAdmin, fetchAdmins, updateAdmin, deleteAdmin } from "../controllers/adminController.js";

const router = express.Router();

// CRUD Endpoints
router.post("/", createAdmin);            // Create admin
router.get("/", fetchAdmins);             // Get all admins
router.put("/:id", updateAdmin);          // Update admin by ID
router.delete("/:id", deleteAdmin);       // Delete admin by ID

export default router;
