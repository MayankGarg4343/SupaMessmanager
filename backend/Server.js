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

// ================= Routes =================

// Contact Form - Submit
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newContact = new Contact({ name, email, phone, subject, message });
    await newContact.save();
    res
      .status(201)
      .json({ success: true, message: "Message sent successfully!" });
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
      return res
        .status(400)
        .json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
    });

    await newStudent.save();
    res
      .status(201)
      .json({ success: true, message: "Student registered successfully!" });
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password." });
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

// ================= Feedback Routes =================

// Feedback - Submit
app.post("/api/feedback", async (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;
    const newFeedback = new Feedback({ name, email, rating, feedback });
    await newFeedback.save();
    res
      .status(201)
      .json({ success: true, message: "Feedback submitted successfully!" });
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

// ================= Start Server =================
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
