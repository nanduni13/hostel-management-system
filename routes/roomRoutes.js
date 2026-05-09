import express from "express";
import { createRoom, fetchRooms, updateRoom, deleteRoom } from "../controllers/roomController.js";

const router = express.Router();

// CRUD Endpoints
router.post("/", createRoom);             // Create room
router.get("/", fetchRooms);              // Get all rooms
router.put("/:id", updateRoom);           // Update room by ID
router.delete("/:id", deleteRoom);        // Delete room by ID

export default router;
