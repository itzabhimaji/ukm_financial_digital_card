// ── Config map: prefix → { endpoint, fields } ──────────────────
const FORMS = {
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

// ── Main submit handler ─────────────────────────────────────────
async function submitQuery(prefix) {
  const form = FORMS[prefix];
  const errorEl = document.getElementById(`${prefix}-error`);
  if (!form || !errorEl) return;

  errorEl.classList.add("d-none");

  // Collect & validate
  const payload = {};
  for (const [key, cfg] of Object.entries(form.fields)) {
    const el = document.getElementById(cfg.id);
    if (!el) continue;
    const val = el.value.trim();
    if (cfg.required && !val) {
      showError(errorEl, `${cfg.label} is required.`);
      el.focus();
      return;
    }
    payload[key] = val;
  }

  // Basic mobile check
  if (payload.mobile && !/^[6-9]\d{9}$/.test(payload.mobile)) {
    showError(errorEl, "Please enter a valid 10-digit Indian mobile number.");
    return;
  }

  // Submit
  const btn = document
    .querySelector(`#${prefix}-error`)
    .closest(".query-box")
    .querySelector(".svc-submit-btn");
  btn.textContent = "Submitting…";
  btn.disabled = true;

  try {
    const res = await fetch(form.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      resetForm(prefix, form);
      showToast("✓ Query submitted! We'll contact you shortly.");
    } else {
      const msg = data.errors
        ? data.errors.map((e) => e.msg).join(", ")
        : data.message || "Something went wrong.";
      showError(errorEl, msg);
    }
  } catch {
    showError(errorEl, "Network error. Please try again.");
  } finally {
    btn.textContent = "Submit Query";
    btn.disabled = false;
  }
}

// ── Helpers ─────────────────────────────────────────────────────
function showError(el, msg) {
  el.textContent = msg;
  el.classList.remove("d-none");
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}

function resetForm(prefix, form) {
  for (const cfg of Object.values(form.fields)) {
    const el = document.getElementById(cfg.id);
    if (el) el.value = "";
  }
}

let toastTimer;
function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.style.display = "none"), 3500);
}

(function () {
  const ROW_HEIGHT = 54; // approximate px per row — tweak if your rows are taller/shorter
  const INITIAL = 5; // rows visible on load

  const list = document.getElementById("svcRcList");
  const fade = document.getElementById("svcRcFade");
  const badge = document.getElementById("svcRcBadge");
  const hint = document.getElementById("svcRcHint");
  const collapseBtn = document.getElementById("svcRcCollapseBtn");

  const allRows = Array.from(list.querySelectorAll(".svc-rc-row"));
  const total = allRows.length;

  // ── how many rows are scrolled into view ────────
  function visibleCount() {
    // scrollTop / rowHeight gives extra rows revealed beyond the initial 5
    const extra = Math.floor(list.scrollTop / ROW_HEIGHT);
    return Math.min(INITIAL + extra, total);
  }

  // ── update badge + arrow on every scroll tick ───
  function onScroll() {
    const seen = visibleCount();
    const remaining = total - seen;

    // badge
    if (remaining > 0) {
      badge.textContent = "+" + remaining + " more";
      badge.classList.remove("svc-rc-badge--hidden");
    } else {
      badge.classList.add("svc-rc-badge--hidden");
    }

    // hint text — hide once user starts scrolling
    if (list.scrollTop > 10) {
      hint.classList.add("svc-rc-hint--hidden");
    } else {
      hint.classList.remove("svc-rc-hint--hidden");
    }

    // fade overlay — hide when at bottom
    const atBottom =
      list.scrollTop + list.clientHeight >= list.scrollHeight - 4;
    if (atBottom) {
      fade.classList.add("svc-rc-fade--hidden");
    } else {
      fade.classList.remove("svc-rc-fade--hidden");
    }

    // collapse arrow — show as soon as user scrolls even one row
    if (list.scrollTop > ROW_HEIGHT / 2) {
      collapseBtn.classList.add("svc-rc-collapse-btn--visible");
    } else {
      collapseBtn.classList.remove("svc-rc-collapse-btn--visible");
    }
  }

  // ── collapse: smooth scroll back to top ─────────
  collapseBtn.addEventListener("click", function () {
    list.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ── init ────────────────────────────────────────
  list.addEventListener("scroll", onScroll);
  onScroll(); // set initial state
})();
