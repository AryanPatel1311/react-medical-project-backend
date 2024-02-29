// Import necessary modules
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import doctorRoute from "./Routes/doctors.js";
import reviewRoute from "./Routes/review.js";
import bookingRoute from "./Routes/booking.js";
import cors from "cors";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 5173;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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
  }
};

connectDB();

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);

// API root endpoint
app.get("/", (req, res) => {
  res.send("API is working");
});

// Start the server
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
