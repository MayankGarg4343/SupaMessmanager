const Booking = require('../models/Booking');
const Student = require('../models/Student');

const toDateOnly = (value) => {
  const d = new Date(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const createBooking = async (req, res) => {
  try {
    const { studentId, date, meals } = req.body;
    const dateOnly = toDateOnly(date);

    let booking = await Booking.findOne({ studentId, date: dateOnly });
    if (booking) {
      booking.meals = meals || [];
      await booking.save();
    } else {
      booking = await Booking.create({ studentId, date: dateOnly, meals: meals || [] });
    }
    res.status(201).json({ success: true, message: "Meals booked successfully!", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to book meals." });
  }
};

const getDailyBookings = async (req, res) => {
  try {
    const dateOnly = toDateOnly(req.params.date);
    const bookings = await Booking.find({ date: dateOnly })
      .populate('studentId', 'id name email createdAt')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch daily bookings." });
  }
};

const getStudentBookings = async (req, res) => {
  try {
    const { studentId } = req.params;
    const bookings = await Booking.find({ studentId })
      .populate('studentId', 'id name email createdAt')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch student bookings." });
  }
};

module.exports = { createBooking, getDailyBookings, getStudentBookings };
