const express = require("express");
const router = express.Router();
const { getLeaderboard } = require("../controllers/LeaderboardController");

router.get("/", getLeaderboard);

module.exports = router;
