const Complaint = require('../models/Complaint');

const createComplaint = async (req, res) => {
  try {
    const { studentId, name, email, subject, message } = req.body;
    await Complaint.create({ studentId, name, email, subject, message });
    res.status(201).json({ success: true, message: "Complaint submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to submit complaint." });
  }
};

const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch complaints." });
  }
};

const getStudentComplaints = async (req, res) => {
  try {
    const { studentId } = req.params;
    const complaints = await Complaint.find({ studentId })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch student complaints." });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }
    res.json({ success: true, message: "Complaint status updated.", complaint });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update complaint status." });
  }
};

module.exports = { createComplaint, getComplaints, getStudentComplaints, updateComplaintStatus };
