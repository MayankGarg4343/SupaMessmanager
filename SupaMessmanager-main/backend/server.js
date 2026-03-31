require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require('./config/database');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Import routes
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const menuRoutes = require('./routes/menu');
const bookingRoutes = require('./routes/booking');
const complaintRoutes = require('./routes/complaint');
const studentRoutes = require('./routes/student');

// API routes
app.use('/api/contact', contactRoutes);
app.use('/api', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/students', studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
