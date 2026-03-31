const Student = require('../models/Student');

const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select('id name email createdAt')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch students." });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }
    res.json({ success: true, message: "Student deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete student." });
  }
};

module.exports = { getStudents, deleteStudent };
