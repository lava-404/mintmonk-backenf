const mongoose = require("mongoose");   // 👈 ADD THIS
const Session = require("../model/Session.js");

const StoreSession = async (req, res) => {
  try {
    const { userId, task, duration, stake, breaks, boost } = req.body;

    if (!userId || !task || !duration) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // duration comes as minutes → convert to seconds
    const plannedDuration = Number(duration) * 60;

    if (isNaN(plannedDuration) || plannedDuration <= 0) {
      return res.status(400).json({ error: "Invalid duration" });
    }

    const newSession = await Session.create({
      userId: new mongoose.Types.ObjectId(userId), // ensure valid ObjectId
      topic: task,
      plannedDuration,
      stake: Number(stake) || 0,
      breaks: breaks || "No Breaks",
      boost: boost || "None",
    });

    return res.status(201).json({
      message: "Session created successfully",
      sessionId: newSession._id,
    });
  } catch (err) {
    console.error("❌ StoreSession error:", err);
    return res.status(500).json({ error: err.message });
  }
};


const getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await Session.find({ userId }).lean();

    // Format the response so frontend gets clean values
    const formatted = sessions.map((s) => {
      return {
        _id: s._id,
        topic: s.topic,
        duration: s.plannedDuration >= 3600 
          ? `${Math.floor(s.plannedDuration / 3600)} hr ${Math.floor((s.plannedDuration % 3600) / 60)} min`
          : `${Math.floor(s.plannedDuration / 60)} min`,
        stake: `${s.stake} coins`,
        rewards: `${s.rewards} coins`,
        status: s.status.charAt(0).toUpperCase() + s.status.slice(1), // e.g. "Completed"
      };
    });

    return res.json(formatted);
  } catch (err) {
    console.error("getUserSessions error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


module.exports = { StoreSession, getUserSessions };
