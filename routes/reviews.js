const express = require("express");
const { body, validationResult } = require("express-validator");
const Review = require("../models/Review");
const router = express.Router();

const KEYWORDS = [
  "Trusted",
  "Claim Support",
  "Expert Guidance",
  "Friendly Service",
  "Transparency",
];

// ── GET /api/reviews?page=1&limit=3
// Returns paginated reviews (sorted highest star first)
// + stats (avg rating, total, keyword counts)
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 3);
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ approved: true })
        .sort({ stars: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments({ approved: true }),
    ]);

    // Average rating
    const allReviews = await Review.find(
      { approved: true },
      "stars keywords",
    ).lean();
    const avgRating = allReviews.length
      ? (
          allReviews.reduce((s, r) => s + r.stars, 0) / allReviews.length
        ).toFixed(1)
      : 0;

    // Keyword counts sorted highest first
    const keywordCounts = KEYWORDS.map((kw) => ({
      label: kw,
      count: allReviews.filter((r) => r.keywords && r.keywords.includes(kw))
        .length,
    })).sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + reviews.length < total,
      remaining: Math.max(0, total - skip - reviews.length),
      stats: { avgRating, total, keywordCounts },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── POST /api/reviews  →  submit review (auto-approved)
router.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ max: 80 }),
    body("message")
      .trim()
      .notEmpty()
      .withMessage("Review is required")
      .isLength({ max: 600 }),
    body("stars").isInt({ min: 1, max: 5 }).withMessage("Stars must be 1–5"),
    body("location").optional().trim().isLength({ max: 100 }),
    body("keywords").optional().isArray(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ success: false, errors: errors.array() });

    try {
      const { name, location, message, stars, keywords = [] } = req.body;

      // Validate keywords against allowed list
      const safeKeywords = keywords.filter((k) => KEYWORDS.includes(k));

      const review = await Review.create({
        name,
        location,
        message,
        stars,
        keywords: safeKeywords,
        approved: true,
      });

      res
        .status(201)
        .json({ success: true, message: "Review submitted!", review });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Could not save review" });
    }
  },
);

// ── PATCH /api/reviews/:id/approve  (still available for manual control)
router.patch("/:id/approve", async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true },
    );
    if (!review)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── DELETE /api/reviews/:id
router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
