import express from "express";
import {
  deleteDoctor,
  getAllDoctor,
  getDoctorProfile,
  getSingleDoctor,
  updatedDoctor,
} from "../Controllers/doctorController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviwRouter from "./review.js";
import cors from "cors";

const router = express.Router();

const corsOptions = {
  origin: "https://react-medical-project-frontend-iota.vercel.app",
  credentials: true,
};
router.use(cors(corsOptions));
router.use("/:doctorId/reviews", reviwRouter);
router.get("/:id", getSingleDoctor);
router.get("/", getAllDoctor);
router.put("/:id", authenticate, restrict(["doctor"]), updatedDoctor);
router.delete("/:id", restrict(["doctor"]), deleteDoctor);
router.get("/profile/me", authenticate, restrict(["doctor"]), getDoctorProfile);
export default router;
