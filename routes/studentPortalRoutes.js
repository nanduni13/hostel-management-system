import express from "express";
import { studentAuthMiddleware } from "../middleware/authMiddleware.js";
import { getStudentMe } from "../controllers/authController.js";
import { getMyRoom } from "../controllers/studentPortalController.js";
import { getNotices } from "../controllers/noticeController.js";
import { createComplaint, getMyComplaints } from "../controllers/complaintController.js";

const router = express.Router();

router.use(studentAuthMiddleware);

router.get("/profile", getStudentMe);
router.get("/room", getMyRoom);
router.get("/notices", getNotices);
router.get("/complaints", getMyComplaints);
router.post("/complaints", createComplaint);

export default router;
