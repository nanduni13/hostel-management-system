import Student from "../models/studentModel.js";
import Room from "../models/roomModel.js";

export const getMyRoom = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select("-password");
    if (!student?.roomId) {
      return res.json({ assigned: false, message: "No room assigned yet" });
    }

    const room = await Room.findById(student.roomId).populate("occupants", "name department email");
    if (!room) {
      return res.json({ assigned: false, message: "Room not found" });
    }

    res.json({
      assigned: true,
      roomNumber: room.roomNumber,
      capacity: room.capacity,
      occupants: room.occupants,
      availableBeds: room.capacity - room.occupants.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
