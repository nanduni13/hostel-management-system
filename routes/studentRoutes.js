import express from "express";
import { createStudent, fetchStudents, updateStudent, deleteStudent } from "../controllers/studentController.js";

const router = express.Router();

// CRUD Endpoints
router.post("/", createStudent);          // Create student
router.get("/", fetchStudents);           // Get all students
router.put("/:id", updateStudent);        // Update student by ID
router.delete("/:id", deleteStudent);     // Delete student by ID

export default router;
