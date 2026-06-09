const express = require('express');
const { body, validationResult } = require('express-validator');
const Review  = require('../models/Review');
const router  = express.Router();

// ── GET  /api/reviews  →  fetch approved reviews ──────────────
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── POST /api/reviews  →  submit a new review ─────────────────
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
    body('message').trim().notEmpty().withMessage('Review text is required').isLength({ max: 600 }),
    body('stars').isInt({ min: 1, max: 5 }).withMessage('Stars must be 1–5'),
    body('location').optional().trim().isLength({ max: 100 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, location, message, stars } = req.body;
      // approved: false by default — show in admin, approve manually
      const review = await Review.create({ name, location, message, stars });
      res.status(201).json({
        success: true,
        message: 'Review submitted! It will appear after approval.',
        review,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Could not save review' });
    }
  }
);

// ── PATCH /api/reviews/:id/approve  →  approve a review ───────
router.patch('/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── DELETE /api/reviews/:id  →  delete a review ───────────────
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
