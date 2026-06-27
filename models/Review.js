const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    location: { type: String, trim: true, maxlength: 100, default: "" },
    message: { type: String, required: true, trim: true, maxlength: 600 },
    stars: { type: Number, required: true, min: 1, max: 5 },
    keywords: {
      type: [String],
      enum: [
        "Trusted",
        "Claim Support",
        "Expert Guidance",
        "Friendly Service",
        "Transparency",
      ],
      default: [],
    },
    approved: { type: Boolean, default: true }, // auto-approved
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
