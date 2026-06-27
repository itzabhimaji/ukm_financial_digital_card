require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const reviewRoutes = require("./routes/reviews");
const serviceRoutes = require("./routes/services");

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ── View Engine ───────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ── Database ──────────────────────────────────────────────────
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://abhinandanmaji02_db_user:ukm_financial_digital_card@portfolio.jfqjjnh.mongodb.net/?appName=PortFolio";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅  MongoDB connected"))
  .catch((err) => console.error("❌  MongoDB error:", err.message));

// ── Routes ────────────────────────────────────────────────────
app.get("/", async (req, res) => {
  try {
    const Review = require("./models/Review");
    const reviews = await Review.find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(10);
    res.render("index", { reviews });
  } catch (err) {
    console.error(err);
    res.render("index", { reviews: [] });
  }
});

app.use("/api/reviews", reviewRoutes);
app.use("/services", serviceRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀  Server running at http://localhost:${PORT}`),
);
