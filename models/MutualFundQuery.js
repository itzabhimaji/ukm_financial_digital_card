const mongoose = require("mongoose");

const mutualFundQuerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    mobile: { type: String, required: true, trim: true, maxlength: 15 },
    investmentAmount: { type: String, trim: true, maxlength: 50 },
    investmentType: {
      type: String,
      enum: ["SIP", "Lumpsum", "Both", "Not Sure"],
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

module.exports = mongoose.model("MutualFundQuery", mutualFundQuerySchema);
