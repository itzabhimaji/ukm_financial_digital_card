const mongoose = require("mongoose");

const commercialQuerySchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true, maxlength: 120 },
    mobile: { type: String, required: true, trim: true, maxlength: 15 },
    businessType: {
      type: String,
      enum: ["Shop", "Factory", "Office", "Commercial Vehicle", "Other"],
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

module.exports = mongoose.model("CommercialQuery", commercialQuerySchema);
