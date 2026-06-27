const mongoose = require("mongoose");

const bikeQuerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    mobile: { type: String, required: true, trim: true, maxlength: 15 },
    bikeNumber: { type: String, trim: true, maxlength: 20 },
    bikeModel: { type: String, trim: true, maxlength: 80 },
    planType: {
      type: String,
      enum: ["Comprehensive", "Third Party", "Not Sure"],
      default: "Not Sure",
    },
    query: { type: String, required: true, trim: true, maxlength: 800 },
    status: {
      type: String,
      enum: ["pending", "contacted", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BikeQuery", bikeQuerySchema);
