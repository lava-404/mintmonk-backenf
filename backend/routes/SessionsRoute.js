const express = require("express");
const router = express.Router();


const { StoreSession, getUserSessions } = require('../controllers/SessionsController')

router.post('/',  StoreSession)
router.get("/:userId", getUserSessions);

module.exports = router