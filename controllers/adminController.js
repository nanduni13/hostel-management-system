import Admin from "../models/adminModel.js";
import { hashPassword } from "../utils/password.js";

export const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username?.trim() || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const hashed = await hashPassword(password);
    const admin = await Admin.create({ username: username.trim(), password: hashed });
    res.status(201).json({ _id: admin._id, username: admin.username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const fetchAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const updates = { username: req.body.username?.trim() };
    if (req.body.password) {
      updates.password = await hashPassword(req.body.password);
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
