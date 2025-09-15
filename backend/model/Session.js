// model/Session.js
const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    plannedDuration: { type: Number, required: true }, // in seconds
    stake: { type: Number, default: 0 },
    rewards: { type: Number, default: 0 },
    breaks: { type: String, default: "No Breaks" },
    boost: { type: String, default: "None" },
    status: {
      type: String,
      enum: ["in progress", "completed", "aborted"],
      default: "in progress",
    },
    focusedTime: { type: Number, default: 0 }, // store actual focus time in seconds
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);
