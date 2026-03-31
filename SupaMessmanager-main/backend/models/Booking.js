const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  meals: [{
    type: String
  }]
}, {
  timestamps: true
});

bookingSchema.index({ studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
