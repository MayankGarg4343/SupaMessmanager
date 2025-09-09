const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/contactFormDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// ================= Schemas =================

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model("Contact", contactSchema);

// Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now },
});
const Student = mongoose.model("Student", studentSchema);

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  rating: Number,
  feedback: String,
  createdAt: { type: Date, default: Date.now },
});
const Feedback = mongoose.model("Feedback", feedbackSchema);

// Menu Schema (NEW)
const menuSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  breakfast: { type: String, default: "Not available" },
  lunch: { type: String, default: "Not available" },
  dinner: { type: String, default: "Not available" },
});
const Menu = mongoose.model("Menu", menuSchema);

// Booking Schema (NEW)
const bookingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  date: { type: Date, required: true },
  meals: {
    type: [String],
    enum: ["Breakfast", "Lunch", "Dinner"],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});
const Booking = mongoose.model("Booking", bookingSchema);

// Complaint Schema (NEW)
const complaintSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  name: String,
  email: String,
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});
const Complaint = mongoose.model("Complaint", complaintSchema);

// ================= Routes =================

// Contact Form - Submit
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newContact = new Contact({ name, email, phone, subject, message });
    await newContact.save();
    res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to send message." });
  }
});

// Contact Form - Get All
app.get("/api/contact", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch messages." });
  }
});

// Student Register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
    });

    await newStudent.save();
    res.status(201).json({ success: true, message: "Student registered successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Registration failed." });
  }
});

// Student Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password." });
    }

    res.json({
      success: true,
      message: "Login successful!",
      student: { id: student._id, name: student.name, email: student.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Login failed." });
  }
});

// Feedback - Submit
app.post("/api/feedback", async (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;
    const newFeedback = new Feedback({ name, email, rating, feedback });
    await newFeedback.save();
    res.status(201).json({ success: true, message: "Feedback submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to submit feedback." });
  }
});

// Feedback - Get All
app.get("/api/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch feedbacks." });
  }
});

// ================= Admin Routes (NEW) =================

// Menu - Add/Update
app.post("/api/menu", async (req, res) => {
  try {
    const { date, breakfast, lunch, dinner } = req.body;
    const menuDate = new Date(date).setHours(0, 0, 0, 0);
    const existingMenu = await Menu.findOneAndUpdate(
      { date: menuDate },
      { $set: { breakfast, lunch, dinner } },
      { upsert: true, new: true }
    );
    res.status(201).json({ success: true, message: "Menu updated successfully!", menu: existingMenu });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update menu." });
  }
});

// Menu - Get for a specific date
app.get("/api/menu/:date", async (req, res) => {
  try {
    const menuDate = new Date(req.params.date).setHours(0, 0, 0, 0);
    const menu = await Menu.findOne({ date: menuDate });
    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found for this date." });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch menu." });
  }
});

// Bookings - Create
app.post("/api/bookings", async (req, res) => {
  try {
    const { studentId, date, meals } = req.body;
    const bookingDate = new Date(date).setHours(0, 0, 0, 0);

    // Find and update existing booking or create new
    const newBooking = await Booking.findOneAndUpdate(
      { studentId, date: bookingDate },
      { $set: { meals } },
      { upsert: true, new: true }
    );
    res.status(201).json({ success: true, message: "Meals booked successfully!", booking: newBooking });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to book meals." });
  }
});

// Bookings - Get by date (Admin)
app.get("/api/bookings/daily/:date", async (req, res) => {
  try {
    const bookingDate = new Date(req.params.date).setHours(0, 0, 0, 0);
    const bookings = await Booking.find({ date: bookingDate }).populate("studentId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch daily bookings." });
  }
});

// Complaints - Submit (Student)
app.post("/api/complaints", async (req, res) => {
  try {
    const { studentId, name, email, subject, message } = req.body;
    const newComplaint = new Complaint({ studentId, name, email, subject, message });
    await newComplaint.save();
    res.status(201).json({ success: true, message: "Complaint submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to submit complaint." });
  }
});

// Complaints - Get All (Admin)
app.get("/api/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch complaints." });
  }
});

// Complaints - Update Status (Admin)
app.put("/api/complaints/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }
    res.json({ success: true, message: "Complaint status updated.", complaint: updatedComplaint });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update complaint status." });
  }
});

// User Management - Get All Students (Admin)
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find({}, { name: 1, email: 1, createdAt: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch students." });
  }
});

// User Management - Delete Student (Admin)
app.delete("/api/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }
    res.json({ success: true, message: "Student deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete student." });
  }
});

// ================= Start Server =================
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
