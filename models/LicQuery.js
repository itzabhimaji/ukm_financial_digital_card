const mongoose = require("mongoose");

const licQuerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    mobile: { type: String, required: true, trim: true, maxlength: 15 },
    planType: {
      type: String,
      enum: [
        "Term Plan",
        "Endowment Plan",
        "Whole Life Plan",
        "Money Back Plan",
        "Other",
      ],
      default: "Other",
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

module.exports = mongoose.model("LicQuery", licQuerySchema);
