const mongoose = require("mongoose");

const healthQuerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    mobile: { type: String, required: true, trim: true, maxlength: 15 },
    provider: {
      type: String,
      enum: ["Star Health", "Care Insurance", "Niva Bupa", "Not Sure"],
      default: "Not Sure",
    },
    familyMembers: { type: String, trim: true, maxlength: 200 },
    query: { type: String, required: true, trim: true, maxlength: 800 },
    status: {
      type: String,
      enum: ["pending", "contacted", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("HealthQuery", healthQuerySchema);
