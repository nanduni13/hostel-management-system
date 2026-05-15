import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getAllComplaints, updateComplaint, deleteComplaint } from "../controllers/complaintController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllComplaints);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

export default router;
