import express from "express";
import { authenticate } from "../auth/verifyToken.js";
import { getChekoutSession } from "../Controllers/bookingController.js";

const router = express.Router();

router.post("/checkout-session/:doctorId", authenticate, getChekoutSession);

export default router;
