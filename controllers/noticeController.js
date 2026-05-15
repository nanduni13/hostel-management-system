import Notice from "../models/noticeModel.js";

export const createNotice = async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    const notice = await Notice.create({
      title: title.trim(),
      message: message.trim(),
      postedBy: req.admin?.username || "Admin",
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notice) return res.status(404).json({ error: "Notice not found" });
    res.json(notice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ error: "Notice not found" });
    res.json({ message: "Notice deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
