const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true, maxlength: 80 },
    location: { type: String, trim: true, maxlength: 100, default: '' },
    message:  { type: String, required: true, trim: true, maxlength: 600 },
    stars:    { type: Number, required: true, min: 1, max: 5 },
    approved: { type: Boolean, default: false },   // admin can toggle
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
