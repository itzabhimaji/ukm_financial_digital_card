/*
   UKM FINANCIAL HUB — main.js (CLEAN VERSION) */

// ── State ───────────────────────────────────────
let selectedStars = 0;
let selectedKeywords = [];
let currentPage = 1;
let totalReviews = 0;
let loadedCount = 0;
const LIMIT = 3;
let toastTimer;

// ════════════════════════════════════════════════
// ON PAGE LOAD
// ════════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  loadReviews(1, true);
  initStars();
  initKeywordChips();

  // Close modal when clicking outside
  const overlay = document.getElementById("reviewModal");
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === this) closeModal();
    });
  }
});

// ════════════════════════════════════════════════
// LOAD REVIEWS FROM API
// ════════════════════════════════════════════════
async function loadReviews(page, fresh) {
  try {
    const res = await fetch("/api/reviews?page=" + page + "&limit=" + LIMIT);
    const data = await res.json();

    if (!data.success) return;

    currentPage = page;
    totalReviews = data.total;
    if (fresh) loadedCount = 0;
    loadedCount += data.reviews.length;

    if (fresh) renderStats(data.stats);
    renderReviews(data.reviews, fresh);

    const remaining = totalReviews - loadedCount;
    const wrap = document.getElementById("showMoreWrap");
    const badge = document.getElementById("remainingBadge");

    if (remaining > 0) {
      wrap.classList.remove("d-none");
      badge.textContent = "+" + remaining + " more";
    } else {
      wrap.classList.add("d-none");
    }
  } catch (err) {
    console.error("Failed to load reviews:", err);
  }
}

function loadMoreReviews() {
  loadReviews(currentPage + 1, false);
}

// ════════════════════════════════════════════════
// RENDER STATS (avg rating + keyword bars)
// ════════════════════════════════════════════════
function renderStats(stats) {
  if (!stats) return;

  var avgEl = document.getElementById("avgNumber");
  var strEl = document.getElementById("avgStars");
  var subEl = document.getElementById("avgSub");
  var box = document.getElementById("keywordsBox");

  if (!avgEl || !strEl || !subEl || !box) return;

  if (stats.total > 0) {
    avgEl.textContent = stats.avgRating;
    strEl.textContent = renderStarString(Math.round(stats.avgRating));
    subEl.textContent =
      "Based on " + stats.total + " review" + (stats.total !== 1 ? "s" : "");
  } else {
    avgEl.textContent = "–";
    strEl.textContent = "☆☆☆☆☆";
    subEl.textContent = "No reviews yet";
  }

  // Keyword bars
  var maxCount =
    stats.keywordCounts[0] && stats.keywordCounts[0].count
      ? stats.keywordCounts[0].count
      : 1;

  if (
    stats.total === 0 ||
    stats.keywordCounts.every(function (k) {
      return k.count === 0;
    })
  ) {
    box.innerHTML =
      '<div style="font-size:10px;color:var(--muted);padding:4px 0">No keywords yet</div>';
    return;
  }

  var html = "";
  stats.keywordCounts.forEach(function (kw) {
    var pct = maxCount > 0 ? Math.round((kw.count / maxCount) * 100) : 0;
    var shortLabel = kw.label;
    html +=
      '<div class="kw-row">' +
      '<span class="kw-label" title="' +
      kw.label +
      '">' +
      shortLabel +
      "</span>" +
      '<div class="kw-bar-wrap"><div class="kw-bar" style="width:' +
      pct +
      '%"></div></div>' +
      '<span class="kw-count">' +
      kw.count +
      "</span>" +
      "</div>";
  });
  box.innerHTML = html;
}

// ════════════════════════════════════════════════
// RENDER REVIEW CARDS
// ════════════════════════════════════════════════
function renderReviews(reviews, fresh) {
  var list = document.getElementById("reviewsList");
  if (!list) return;

  if (fresh) {
    if (reviews.length === 0) {
      list.innerHTML =
        '<p style="text-align:center;color:var(--muted);font-size:13px;padding:10px 0">Be the first to leave a review!</p>';
      return;
    }
    list.innerHTML = "";
  }

  reviews.forEach(function (r) {
    var card = document.createElement("div");
    card.className = "review-card";

    var stars = renderStarString(r.stars);
    var tagsHTML = "";
    if (r.keywords && r.keywords.length > 0) {
      r.keywords.forEach(function (k) {
        tagsHTML += '<span class="r-tag">' + k + "</span>";
      });
      tagsHTML = '<div class="r-tags">' + tagsHTML + "</div>";
    }
    var initial = r.name.charAt(0).toUpperCase();

    card.innerHTML =
      '<div class="r-stars">' +
      stars +
      "</div>" +
      tagsHTML +
      '<div class="r-text">"' +
      escapeHtml(r.message) +
      '"</div>' +
      '<div class="r-person">' +
      '<div class="r-av">' +
      initial +
      "</div>" +
      "<div>" +
      '<div class="r-name">' +
      escapeHtml(r.name) +
      "</div>" +
      '<div class="r-loc">' +
      escapeHtml(r.location || "India") +
      "</div>" +
      "</div></div>";

    list.appendChild(card);
  });
}

function renderStarString(n) {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

// ════════════════════════════════════════════════
// MODAL OPEN / CLOSE
// ════════════════════════════════════════════════
function openModal() {
  var modal = document.getElementById("reviewModal");
  if (!modal) return;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  var modal = document.getElementById("reviewModal");
  if (!modal) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
  resetForm();
}

// ════════════════════════════════════════════════
// STAR SELECTION
// ════════════════════════════════════════════════
function initStars() {
  document.querySelectorAll(".modal-star").forEach(function (star) {
    star.addEventListener("click", function () {
      selectedStars = parseInt(star.dataset.v);
      document.querySelectorAll(".modal-star").forEach(function (s, i) {
        s.classList.toggle("active", i < selectedStars);
      });
    });
  });
}

// ════════════════════════════════════════════════
// KEYWORD CHIPS
// ════════════════════════════════════════════════
function initKeywordChips() {
  document.querySelectorAll(".kw-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var kw = chip.dataset.kw;
      var idx = selectedKeywords.indexOf(kw);
      if (idx > -1) {
        selectedKeywords.splice(idx, 1);
        chip.classList.remove("selected");
      } else {
        selectedKeywords.push(kw);
        chip.classList.add("selected");
      }
    });
  });
}

// ════════════════════════════════════════════════
// RESET FORM
// ════════════════════════════════════════════════
function resetForm() {
  selectedStars = 0;
  selectedKeywords = [];
  document.querySelectorAll(".modal-star").forEach(function (s) {
    s.classList.remove("active");
  });
  document.querySelectorAll(".kw-chip").forEach(function (c) {
    c.classList.remove("selected");
  });
  var n = document.getElementById("rName");
  if (n) n.value = "";
  var l = document.getElementById("rLoc");
  if (l) l.value = "";
  var t = document.getElementById("rText");
  if (t) t.value = "";
  var e = document.getElementById("formError");
  if (e) e.classList.add("d-none");
}

// ════════════════════════════════════════════════
// SUBMIT REVIEW
// ════════════════════════════════════════════════
async function submitReview() {
  var errEl = document.getElementById("formError");
  if (errEl) errEl.classList.add("d-none");

  var name = document.getElementById("rName").value.trim();
  var location = document.getElementById("rLoc").value.trim();
  var message = document.getElementById("rText").value.trim();

  if (!selectedStars) {
    showFormError(errEl, "Please select a star rating.");
    return;
  }
  if (!name) {
    showFormError(errEl, "Please enter your name.");
    return;
  }
  if (!message) {
    showFormError(errEl, "Please write your review.");
    return;
  }

  var btn = document.querySelector(".modal-submit");
  btn.textContent = "Submitting…";
  btn.disabled = true;

  try {
    var res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        location: location,
        message: message,
        stars: selectedStars,
        keywords: selectedKeywords,
      }),
    });
    var data = await res.json();

    if (data.success) {
      closeModal();
      showToast("✓ Review submitted! Thank you.");
      loadedCount = 0;
      loadReviews(1, true);
    } else {
      var msg = data.errors
        ? data.errors
            .map(function (e) {
              return e.msg;
            })
            .join(", ")
        : data.message || "Something went wrong.";
      showFormError(errEl, msg);
    }
  } catch (err) {
    showFormError(errEl, "Network error. Please try again.");
  } finally {
    btn.textContent = "Submit Review";
    btn.disabled = false;
  }
}

// ════════════════════════════════════════════════
// SERVICE QUERY FORMS
// ════════════════════════════════════════════════
var FORMS = {
  lic: {
    endpoint: "/services/query/lic",
    fields: {
      name: { id: "lic-name", required: true, label: "Name" },
      mobile: { id: "lic-mobile", required: true, label: "Mobile" },
      planType: { id: "lic-plan", required: false },
      query: { id: "lic-query", required: true, label: "Query" },
    },
  },
  mf: {
    endpoint: "/services/query/mutual-fund",
    fields: {
      name: { id: "mf-name", required: true, label: "Name" },
      mobile: { id: "mf-mobile", required: true, label: "Mobile" },
      investmentAmount: { id: "mf-amount", required: false },
      investmentType: { id: "mf-type", required: false },
      query: { id: "mf-query", required: true, label: "Query" },
    },
  },
  hi: {
    endpoint: "/services/query/health",
    fields: {
      name: { id: "hi-name", required: true, label: "Name" },
      mobile: { id: "hi-mobile", required: true, label: "Mobile" },
      provider: { id: "hi-provider", required: false },
      familyMembers: { id: "hi-family", required: false },
      query: { id: "hi-query", required: true, label: "Query" },
    },
  },
  mi: {
    endpoint: "/services/query/motor",
    fields: {
      name: { id: "mi-name", required: true, label: "Name" },
      mobile: { id: "mi-mobile", required: true, label: "Mobile" },
      vehicleNumber: { id: "mi-vehicle", required: false },
      vehicleType: { id: "mi-vtype", required: false },
      planType: { id: "mi-plan", required: false },
      query: { id: "mi-query", required: true, label: "Query" },
    },
  },
  bi: {
    endpoint: "/services/query/bike",
    fields: {
      name: { id: "bi-name", required: true, label: "Name" },
      mobile: { id: "bi-mobile", required: true, label: "Mobile" },
      bikeNumber: { id: "bi-num", required: false },
      bikeModel: { id: "bi-model", required: false },
      planType: { id: "bi-plan", required: false },
      query: { id: "bi-query", required: true, label: "Query" },
    },
  },
  ci: {
    endpoint: "/services/query/commercial",
    fields: {
      businessName: { id: "ci-bname", required: true, label: "Business Name" },
      mobile: { id: "ci-mobile", required: true, label: "Mobile" },
      businessType: { id: "ci-btype", required: false },
      query: { id: "ci-query", required: true, label: "Query" },
    },
  },
};

async function submitQuery(prefix) {
  var form = FORMS[prefix];
  var errorEl = document.getElementById(prefix + "-error");
  if (!form || !errorEl) return;

  errorEl.classList.add("d-none");

  var payload = {};
  var valid = true;

  Object.keys(form.fields).forEach(function (key) {
    var cfg = form.fields[key];
    var el = document.getElementById(cfg.id);
    if (!el) return;
    var val = el.value.trim();
    if (cfg.required && !val) {
      showServiceError(errorEl, (cfg.label || key) + " is required.");
      if (el) el.focus();
      valid = false;
    }
    payload[key] = val;
  });

  if (!valid) return;

  if (payload.mobile && !/^[6-9]\d{9}$/.test(payload.mobile)) {
    showServiceError(
      errorEl,
      "Please enter a valid 10-digit Indian mobile number.",
    );
    return;
  }

  var btn = errorEl.closest(".query-box").querySelector(".svc-submit-btn");
  btn.textContent = "Submitting…";
  btn.disabled = true;

  try {
    var res = await fetch(form.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    var data = await res.json();

    if (data.success) {
      Object.keys(form.fields).forEach(function (key) {
        var el = document.getElementById(form.fields[key].id);
        if (el) el.value = "";
      });
      showToast("✓ Query submitted! We'll contact you shortly.");
    } else {
      var msg = data.errors
        ? data.errors
            .map(function (e) {
              return e.msg;
            })
            .join(", ")
        : data.message || "Something went wrong.";
      showServiceError(errorEl, msg);
    }
  } catch (err) {
    showServiceError(errorEl, "Network error. Please try again.");
  } finally {
    btn.textContent = "Submit Query";
    btn.disabled = false;
  }
}

// ════════════════════════════════════════════════
// SHARE & COPY
// ════════════════════════════════════════════════
function shareCard() {
  if (navigator.share) {
    navigator
      .share({
        title: "UKM Financial Hub – Uttam Kumar Maji",
        text: "25+ years of trusted financial advice.",
        url: window.location.href,
      })
      .catch(function () {});
  } else {
    copyLink();
  }
}

function copyLink() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(function () {
      showToast("✓ Link copied to clipboard!");
    })
    .catch(function () {
      showToast("Copy the URL from your address bar.");
    });
}

// ════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════
function showToast(msg) {
  var el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    el.style.display = "none";
  }, 3500);
}

function showFormError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("d-none");
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}

function showServiceError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("d-none");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
