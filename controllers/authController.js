import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Student from "../models/studentModel.js";
import Room from "../models/roomModel.js";
import { comparePassword, hashPassword } from "../utils/password.js";

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const valid = await comparePassword(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(401).json({ error: "Admin not found" });
    }
    res.json({ id: admin._id, username: admin.username, role: "admin" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublicRooms = async (req, res) => {
  try {
    const rooms = await Room.find().select("roomNumber capacity occupants");
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerStudent = async (req, res) => {
  try {
    const { name, username, email, password, age, department, roomId } = req.body;

    if (!name?.trim() || !username?.trim() || !password || !age || !department?.trim()) {
      return res.status(400).json({ error: "Name, username, password, age, and department are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const exists = await Student.findOne({ username: username.trim().toLowerCase() });
    if (exists) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    if (email?.trim()) {
      const emailExists = await Student.findOne({ email: email.trim().toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ error: "Email is already registered" });
      }
    }

    if (roomId) {
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(400).json({ error: "Selected room not found" });
      }
      if (room.occupants.length >= room.capacity) {
        return res.status(400).json({ error: "Selected room is full" });
      }
    }

    const hashed = await hashPassword(password);
    const student = await Student.create({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      ...(email?.trim() ? { email: email.trim().toLowerCase() } : {}),
      password: hashed,
      age: Number(age),
      department: department.trim(),
      ...(roomId ? { roomId } : {}),
    });

    if (roomId) {
      await Room.findByIdAndUpdate(roomId, { $addToSet: { occupants: student._id } });
    }

    const token = jwt.sign(
      { id: student._id, username: student.username, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      student: {
        id: student._id,
        name: student.name,
        username: student.username,
        department: student.department,
      },
      message: "Registration successful",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const student = await Student.findOne({ username: username.trim().toLowerCase() });
    if (!student || !student.password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const valid = await comparePassword(password, student.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: student._id, username: student.username, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      student: { id: student._id, name: student.name, username: student.username },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentMe = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id)
      .select("-password")
      .populate("roomId", "roomNumber capacity");
    if (!student) {
      return res.status(401).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
