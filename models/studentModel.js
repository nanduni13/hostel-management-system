import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  age: { type: Number, required: true },
  department: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  feesPaid: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
