import Admin from "../models/adminModel.js";

// Create Admin
export const createAdmin = async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch All Admins
export const fetchAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    if (admins.length === 0) {
      return res.status(404).json({ message: "No admins found" });
    }
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Admin
export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
