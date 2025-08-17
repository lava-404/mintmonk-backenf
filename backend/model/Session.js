// models/Session.js
const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    plannedDuration: { type: Number, required: true },
    actualDuration: { type: Number, default: 0 },
    stake: { type: Number, default: 0 },
    rewards: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["in-progress", "completed", "missed"],
      default: "in-progress",
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);
