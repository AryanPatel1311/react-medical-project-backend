import express from "express";
import {
  deleteUser,
  getAllAppointments,
  getAllUser,
  getMyAppointment,
  getSingleUser,
  getUserProfile,
  updatedUser,
} from "../Controllers/userController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.get("/:id", authenticate, restrict(["patient"]), getSingleUser);
router.get("/", authenticate, restrict(["admin"]), getAllUser);
router.put("/:id", authenticate, restrict(["patient"]), updatedUser);
router.delete("/:id", authenticate, restrict(["patient"]), deleteUser);
router.get("/profile/me", authenticate, restrict(["patient"]), getUserProfile);
router.get(
  "/appoinments/my-appoinments",
  authenticate,
  restrict(["patient"]),
  getMyAppointment
);
router.get(
  "/appointments/all",
  authenticate,
  restrict(["admin"]),
  getAllAppointments
);

export default router;
