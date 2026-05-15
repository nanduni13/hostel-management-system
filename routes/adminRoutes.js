import express from "express";
import { createAdmin, fetchAdmins, updateAdmin, deleteAdmin } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createAdmin);
router.get("/", fetchAdmins);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;
