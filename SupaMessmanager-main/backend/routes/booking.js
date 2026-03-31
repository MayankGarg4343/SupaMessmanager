const express = require('express');
const router = express.Router();
const { createBooking, getDailyBookings, getStudentBookings } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/daily/:date', getDailyBookings);
router.get('/:studentId', getStudentBookings);

module.exports = router;
