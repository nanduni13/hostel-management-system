import Room from "../models/roomModel.js";
import Student from "../models/studentModel.js";

export async function assignStudentToRoom(studentId, newRoomId, oldRoomId = null) {
  const student = await Student.findById(studentId);
  if (!student) throw new Error("Student not found");

  const previousRoomId = oldRoomId || student.roomId?.toString() || null;
  const targetRoomId = newRoomId || null;

  if (previousRoomId === targetRoomId) {
    return student;
  }

  if (previousRoomId) {
    await Room.findByIdAndUpdate(previousRoomId, {
      $pull: { occupants: studentId },
    });
  }

  if (targetRoomId) {
    const room = await Room.findById(targetRoomId);
    if (!room) throw new Error("Room not found");
    if (room.occupants.length >= room.capacity) {
      throw new Error("Room is full");
    }
    await Room.findByIdAndUpdate(targetRoomId, {
      $addToSet: { occupants: studentId },
    });
    student.roomId = targetRoomId;
  } else {
    student.roomId = undefined;
  }

  await student.save();
  return Student.findById(studentId).populate("roomId", "roomNumber capacity");
}

export async function removeStudentFromRoom(studentId) {
  const student = await Student.findById(studentId);
  if (!student) return;

  if (student.roomId) {
    await Room.findByIdAndUpdate(student.roomId, {
      $pull: { occupants: studentId },
    });
  }
}
