const express = require("express");
const router = express.Router();


const { StoreSession, getUserSessions, updateSession } = require('../controllers/SessionsController')

router.post('/',  StoreSession)
router.get("/:userId", getUserSessions);
router.put('/:id', updateSession);

module.exports = router
