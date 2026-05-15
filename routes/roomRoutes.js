import express from "express";
import { createRoom, fetchRooms, updateRoom, deleteRoom } from "../controllers/roomController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createRoom);
router.get("/", fetchRooms);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

export default router;
