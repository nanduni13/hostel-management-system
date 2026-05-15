import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "in_progress", "resolved"],
    default: "pending",
  },
  adminReply: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);
