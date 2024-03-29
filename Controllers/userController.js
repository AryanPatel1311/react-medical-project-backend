import Booking from "../models/BookingSchema.js";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
export const updatedUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (err) {
    res.status(200).json({
      success: false,
      message: "Faield to updated",
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(200).json({
      success: false,
      message: "Faield to delete",
    });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "User Found",
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "User Not Founded",
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "User Found",
      data: users,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "User Not Founded",
    });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const { password, ...rest } = user._doc;
    res.status(200).json({
      success: true,
      message: "profile info is getting",
      data: { ...rest },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "something went wrong,cannot get" });
  }
};

export const getMyAppointment = async (req, res) => {
  try {
    const booking = await Booking.find({ user: req.userId });

    const doctorIds = booking.map((el) => el.doctor.id);

    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Appointment are getting",
      data: doctors,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "something went wrong,cannot get" });
  }
};
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Booking.find({})
      .populate({
        path: "user",
        select: "_id name email photo",
      })
      .populate("doctor");

    const modifiedAppointments = appointments.map((appointment) => {
      const { _id, user, doctor, ...rest } = appointment.toObject();
      const modifiedUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      };
      const modifiedDoctor = {
        _id: doctor._id,
        name: doctor.name,
      };
      return {
        booking_id: _id,
        ticketPrice: rest.ticketPrice,
        timeSlots: rest.timeSlot,
        status: rest.status,
        isPaid: rest.isPaid,
        createdAt: rest.createdAt,
        updatedAt: rest.updatedAt,
        __v: rest.__v,
        user: modifiedUser,
        doctor: modifiedDoctor,
      };
    });

    res.status(200).json({
      success: true,
      message: "All Appointments Found",
      data: modifiedAppointments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Appointments Not Found",
    });
  }
};
