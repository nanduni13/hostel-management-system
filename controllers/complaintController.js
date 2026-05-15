import Complaint from "../models/complaintModel.js";

export const createComplaint = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "Subject and message are required" });
    }

    const complaint = await Complaint.create({
      studentId: req.student.id,
      subject: subject.trim(),
      message: message.trim(),
    });

    const populated = await Complaint.findById(complaint._id).populate("studentId", "name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.student.id })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("studentId", "name email department")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (adminReply !== undefined) updates.adminReply = adminReply;

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate("studentId", "name email department");
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    res.json({ message: "Complaint deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
