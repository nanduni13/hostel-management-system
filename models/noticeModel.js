import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  postedBy: { type: String, default: "Admin" },
}, { timestamps: true });

export default mongoose.model("Notice", noticeSchema);
