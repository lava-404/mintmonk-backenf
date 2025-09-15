const express = require("express");
const router = express.Router();
const { getUserSummary } = require("../controllers/UsersController");

router.get("/:id/summary", getUserSummary);

module.exports = router;
