import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import doctorRoute from "./Routes/doctors.js";
import reviewRoute from "./Routes/review.js";
import bookingRoute from "./Routes/booking.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin:
    process.env.CLIENT_SITE_URL === "production"
      ? true
      : "http://localhost:5173",
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);

// Database connection
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB database is connected");
  } catch (err) {
    console.error("MongoDB database connection failed", err);
    // Throw the error if you want to stop the server on connection failure
    // throw err;
  }
};

// Move the database connection call outside the app.listen callback
connectDB();

// API root endpoint
app.get("/", (req, res) => {
  res.send("API is working");
});

// Start the server
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
