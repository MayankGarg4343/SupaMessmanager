const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({ name, email, password: hashedPassword });
    res.status(201).json({ success: true, message: "Student registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Registration failed." });
  }
};

const login = async (req, res) => {
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

    const token = generateToken({ id: student._id, email: student.email, name: student.name });
    res.json({
      success: true,
      message: "Login successful!",
      token,
      student: { id: student._id, name: student.name, email: student.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Login failed." });
  }
};

const getProfile = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch profile." });
  }
};

module.exports = { register, login, getProfile };
