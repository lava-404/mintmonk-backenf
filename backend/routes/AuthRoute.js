const express = require("express")

const router = express.Router();
const { googleSignIn } = require("../controllers/googleSignIn")

router.post('/', googleSignIn)

module.exports = router;