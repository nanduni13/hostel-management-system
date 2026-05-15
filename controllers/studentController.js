import Student from "../models/studentModel.js";
import { assignStudentToRoom, removeStudentFromRoom } from "../utils/roomAssignment.js";

export const createStudent = async (req, res) => {
  try {
    const { name, username, age, department, roomId, feesPaid, email } = req.body;
    const student = await Student.create({
      name,
      age,
      department,
      feesPaid: feesPaid ?? false,
      ...(username ? { username: username.trim().toLowerCase() } : {}),
      ...(email ? { email: email.trim().toLowerCase() } : {}),
    });

    if (roomId) {
      await assignStudentToRoom(student._id, roomId);
    }

    const result = await Student.findById(student._id)
      .select("-password")
      .populate("roomId", "roomNumber capacity");
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password").populate("roomId", "roomNumber capacity");
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .select("-password")
      .populate("roomId", "roomNumber capacity occupants");
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const existing = await Student.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Student not found" });

    const { name, username, age, department, feesPaid, email, roomId } = req.body;

    if (name !== undefined) existing.name = name;
    if (age !== undefined) existing.age = age;
    if (department !== undefined) existing.department = department;
    if (feesPaid !== undefined) existing.feesPaid = feesPaid;
    if (username !== undefined) existing.username = username?.trim().toLowerCase();
    if (email !== undefined) existing.email = email?.trim().toLowerCase();

    await existing.save();

    const oldRoomId = existing.roomId?.toString();
    const newRoomId = roomId === "" ? null : roomId ?? oldRoomId;

    if (roomId !== undefined) {
      await assignStudentToRoom(existing._id, newRoomId, oldRoomId);
    }

    const student = await Student.findById(req.params.id)
      .select("-password")
      .populate("roomId", "roomNumber capacity");
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    await removeStudentFromRoom(student._id);
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
