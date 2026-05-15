import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createNotice, getNotices, updateNotice, deleteNotice } from "../controllers/noticeController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createNotice);
router.get("/", getNotices);
router.put("/:id", updateNotice);
router.delete("/:id", deleteNotice);

export default router;
