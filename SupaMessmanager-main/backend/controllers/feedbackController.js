const Feedback = require('../models/Feedback');

const createFeedback = async (req, res) => {
  try {
    const { name, email, rating, feedback } = req.body;
    await Feedback.create({ name, email, rating, feedback });
    res.status(201).json({ success: true, message: "Feedback submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to submit feedback." });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch feedbacks." });
  }
};

module.exports = { createFeedback, getFeedbacks };
