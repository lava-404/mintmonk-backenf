// routes/sessionRoutes.js
import express from "express";
import { getUserSessions } from "../controllers/SessionsController.js";

const router = express.Router();

router.get("/:userId", getUserSessions);

export default router;
