/* ── Review Modal ──────────────────────────────── */
let selectedStars = 0;

function openModal() {
  document.getElementById('reviewModal').classList.add('open');
}

function closeModal() {
  document.getElementById('reviewModal').classList.remove('open');
  resetForm();
}

// Close modal if overlay (bg) is clicked
document.getElementById('reviewModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// Star selection
document.querySelectorAll('.modal-star').forEach(star => {
  star.addEventListener('click', () => {
    selectedStars = parseInt(star.dataset.v);
    document.querySelectorAll('.modal-star').forEach((s, i) => {
      s.classList.toggle('active', i < selectedStars);
    });
  });
});

function resetForm() {
  selectedStars = 0;
  document.querySelectorAll('.modal-star').forEach(s => s.classList.remove('active'));
  document.getElementById('rName').value  = '';
  document.getElementById('rLoc').value   = '';
  document.getElementById('rText').value  = '';
  hideError();
}

function showError(msg) {
  const el = document.getElementById('formError');
  el.textContent = msg;
  el.classList.remove('d-none');
}
function hideError() {
  document.getElementById('formError').classList.add('d-none');
}

/* ── Submit Review → POST /api/reviews ─────────── */
async function submitReview() {
  hideError();

  const name    = document.getElementById('rName').value.trim();
  const location = document.getElementById('rLoc').value.trim();
  const message = document.getElementById('rText').value.trim();

  if (!selectedStars) return showError('Please select a star rating.');
  if (!name)          return showError('Please enter your name.');
  if (!message)       return showError('Please write your review.');

  const btn = document.querySelector('.modal-submit');
  btn.textContent = 'Submitting…';
  btn.disabled = true;

  try {
    const res  = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, location, message, stars: selectedStars }),
    });
    const data = await res.json();

    if (data.success) {
      closeModal();
      showToast('✓ Review submitted! It will appear after approval.');
    } else {
      const errMsg = data.errors ? data.errors.map(e => e.msg).join(', ') : (data.message || 'Something went wrong.');
      showError(errMsg);
    }
  } catch (err) {
    showError('Network error. Please try again.');
  } finally {
    btn.textContent = 'Submit Review';
    btn.disabled = false;
  }
}

/* ── Share Card ────────────────────────────────── */
function shareCard() {
  if (navigator.share) {
    navigator.share({
      title: 'UKM Financial Hub – Uttam Kumar Maji',
      text: '25+ years of trusted financial advice. LIC, Mutual Funds, Health & Motor Insurance.',
      url: window.location.href,
    }).catch(() => {});
  } else {
    copyLink();
  }
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
    .then(() => showToast('✓ Link copied to clipboard!'))
    .catch(() => showToast('Copy the URL from your address bar.'));
}

/* ── Toast ─────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.display = 'none'; }, 3000);
}
