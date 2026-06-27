const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const LicQuery = require("../models/LicQuery");
const MutualFundQuery = require("../models/MutualFundQuery");
const HealthQuery = require("../models/HealthQuery");
const MotorQuery = require("../models/MotorQuery");
const BikeQuery = require("../models/BikeQuery");
const CommercialQuery = require("../models/CommercialQuery");

// ── Helper: validation result check ───────────────────────────
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ success: false, errors: errors.array() });
    return false;
  }
  return true;
};

// ── Common validators ──────────────────────────────────────────
const nameVal = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required")
  .isLength({ max: 80 });
const mobileVal = body("mobile")
  .trim()
  .notEmpty()
  .withMessage("Mobile is required")
  .isLength({ max: 15 });
const queryVal = body("query")
  .trim()
  .notEmpty()
  .withMessage("Query is required")
  .isLength({ max: 800 });

// ════════════════════════════════════════════════════════════════
// PAGE ROUTES  (render EJS views)
// ════════════════════════════════════════════════════════════════

router.get("/lic", (req, res) => res.render("services/lic"));
router.get("/mutual-fund", (req, res) => res.render("services/mutual-fund"));
router.get("/health", (req, res) => res.render("services/health"));
router.get("/motor", (req, res) => res.render("services/motor"));
router.get("/bike", (req, res) => res.render("services/bike"));
router.get("/commercial", (req, res) => res.render("services/commercial"));
router.get("/financial-planning", (req, res) =>
  res.render("services/financial-planning"),
);

// ════════════════════════════════════════════════════════════════
// API ROUTES  (save queries to MongoDB)
// ════════════════════════════════════════════════════════════════

// ── POST /services/query/lic ───────────────────────────────────
router.post("/query/lic", [nameVal, mobileVal, queryVal], async (req, res) => {
  if (!validate(req, res)) return;
  try {
    const { name, mobile, planType, query } = req.body;
    await LicQuery.create({ name, mobile, planType, query });
    res
      .status(201)
      .json({ success: true, message: "LIC query submitted successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error, please try again." });
  }
});

// ── POST /services/query/mutual-fund ──────────────────────────
router.post(
  "/query/mutual-fund",
  [nameVal, mobileVal, queryVal],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { name, mobile, investmentAmount, investmentType, query } =
        req.body;
      await MutualFundQuery.create({
        name,
        mobile,
        investmentAmount,
        investmentType,
        query,
      });
      res
        .status(201)
        .json({
          success: true,
          message: "Mutual Fund query submitted successfully!",
        });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Server error, please try again." });
    }
  },
);

// ── POST /services/query/health ───────────────────────────────
router.post(
  "/query/health",
  [nameVal, mobileVal, queryVal],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { name, mobile, provider, familyMembers, query } = req.body;
      await HealthQuery.create({
        name,
        mobile,
        provider,
        familyMembers,
        query,
      });
      res
        .status(201)
        .json({
          success: true,
          message: "Health Insurance query submitted successfully!",
        });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Server error, please try again." });
    }
  },
);

// ── POST /services/query/motor ────────────────────────────────
router.post(
  "/query/motor",
  [nameVal, mobileVal, queryVal],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { name, mobile, vehicleNumber, vehicleType, planType, query } =
        req.body;
      await MotorQuery.create({
        name,
        mobile,
        vehicleNumber,
        vehicleType,
        planType,
        query,
      });
      res
        .status(201)
        .json({
          success: true,
          message: "Motor Insurance query submitted successfully!",
        });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Server error, please try again." });
    }
  },
);

// ── POST /services/query/bike ─────────────────────────────────
router.post("/query/bike", [nameVal, mobileVal, queryVal], async (req, res) => {
  if (!validate(req, res)) return;
  try {
    const { name, mobile, bikeNumber, bikeModel, planType, query } = req.body;
    await BikeQuery.create({
      name,
      mobile,
      bikeNumber,
      bikeModel,
      planType,
      query,
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Bike Insurance query submitted successfully!",
      });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error, please try again." });
  }
});

// ── POST /services/query/commercial ──────────────────────────
router.post(
  "/query/commercial",
  [nameVal, mobileVal, queryVal],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const { businessName, mobile, businessType, query } = req.body;
      await CommercialQuery.create({
        businessName,
        mobile,
        businessType,
        query,
      });
      res
        .status(201)
        .json({
          success: true,
          message: "Commercial Insurance query submitted successfully!",
        });
    } catch (err) {
      res
        .status(500)
        .json({ success: false, message: "Server error, please try again." });
    }
  },
);

module.exports = router;
