import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const genrateToken = (user) => {
  return Jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "3000d",
    }
  );
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;
  try {
    let user = null;

    if (role == "patient") {
      user = await User.findOne({ email });
    } else if (role == "doctor") {
      user = await Doctor.findOne({ email });
    }
    if (user) {
      return res.status(400).json({ message: "User alredy exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    if (role == "patient") {
      user = new User({
        name,
        email,
        password: hashpassword,
        photo,
        gender,
        role,
      });
    }

    if (role == "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashpassword,
        photo,
        gender,
        role,
      });
    }
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error, try again" });
  }
};

export const login = async (req, res) => {
  const { email } = req.body;
  try {
    let user = null;

    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }

    if (!user) {
      return res.status(404).json({ message: "User NOT FOUND" });
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid User credential " });
    }

    const token = genrateToken(user);
    const { password, role, appointments, ...rest } = user._doc;

    res.status(200).json({
      status: true,
      message: "successfully login",
      token,
      data: { ...rest },
      role,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to login" });
  }
};
