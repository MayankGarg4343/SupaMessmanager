const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true
  },
  breakfast: {
    type: String,
    default: "Not available"
  },
  lunch: {
    type: String,
    default: "Not available"
  },
  dinner: {
    type: String,
    default: "Not available"
  }
});

module.exports = mongoose.model('Menu', menuSchema);
